-- ==============================================================================
-- Apple Beauty Salon - Kudasan, Gandhinagar
-- Complete Review Generator Database Schema & Atomic Reservation Functions
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Create Businesses Table
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    website_url TEXT NOT NULL,
    google_review_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    service_category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_business_service UNIQUE (business_id, service_name)
);

-- 4. Create Review Templates Table (Configurable Pool 20-30 templates)
CREATE TABLE IF NOT EXISTS public.review_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi', 'gu')),
    template_text TEXT NOT NULL,
    opening_sentence TEXT,
    content_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'used')),
    claim_token TEXT,
    claimed_at TIMESTAMPTZ,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_template_hash UNIQUE (business_id, content_hash)
);

-- 5. Create Review Drafts Table (Customer-Confirmed Reviews)
CREATE TABLE IF NOT EXISTS public.review_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    language TEXT NOT NULL DEFAULT 'en',
    review_text TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN ('generated', 'claimed', 'saved', 'posted')),
    claim_token TEXT,
    claimed_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Generation Jobs Table (Background Pool Refill & Monitoring)
CREATE TABLE IF NOT EXISTS public.generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    attempts INT DEFAULT 0,
    next_retry_at TIMESTAMPTZ,
    last_error_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_templates_lookup 
    ON public.review_templates (business_id, language, status, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_templates_content_hash 
    ON public.review_templates (content_hash);

CREATE INDEX IF NOT EXISTS idx_drafts_content_hash 
    ON public.review_drafts (content_hash);

-- Trigram index for near-duplicate text similarity detection
CREATE INDEX IF NOT EXISTS idx_templates_trgm 
    ON public.review_templates USING gin (template_text gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_drafts_trgm 
    ON public.review_drafts USING gin (review_text gin_trgm_ops);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;

-- 9. Row Level Security Policies
-- Public Read Access for Businesses & Active Services
DROP POLICY IF EXISTS "Public read businesses" ON public.businesses;
CREATE POLICY "Public read businesses" ON public.businesses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read services" ON public.services;
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (is_active = true);

-- Public Read & Claim for Available Review Templates
DROP POLICY IF EXISTS "Public read available templates" ON public.review_templates;
CREATE POLICY "Public read available templates" ON public.review_templates FOR SELECT 
    USING (status = 'available' OR status = 'reserved');

DROP POLICY IF EXISTS "Public update template reservation" ON public.review_templates;
CREATE POLICY "Public update template reservation" ON public.review_templates FOR UPDATE 
    USING (true) WITH CHECK (true);

-- Public Insert Access for Confirmed Review Drafts
DROP POLICY IF EXISTS "Public insert review drafts" ON public.review_drafts;
CREATE POLICY "Public insert review drafts" ON public.review_drafts FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public read review drafts" ON public.review_drafts;
CREATE POLICY "Public read review drafts" ON public.review_drafts FOR SELECT 
    USING (true);

-- Service Role Full Access for Generation Jobs
DROP POLICY IF EXISTS "Service role full access jobs" ON public.generation_jobs;
CREATE POLICY "Service role full access jobs" ON public.generation_jobs FOR ALL 
    USING (true);

-- ==============================================================================
-- 10. Atomic Stored Procedure: reserve_review_template
-- Uses FOR UPDATE SKIP LOCKED to prevent concurrency race conditions
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.reserve_review_template(
    target_business_slug TEXT DEFAULT 'apple-beauty-salon',
    target_language TEXT DEFAULT 'en',
    target_service_category TEXT DEFAULT NULL
)
RETURNS TABLE (
    template_id UUID,
    business_id UUID,
    template_text TEXT,
    language TEXT,
    claim_token TEXT,
    status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_business_id UUID;
    v_template_id UUID;
    v_token TEXT;
BEGIN
    -- 1. Resolve business ID securely
    SELECT id INTO v_business_id 
    FROM public.businesses 
    WHERE slug = target_business_slug;

    IF v_business_id IS NULL THEN
        RAISE EXCEPTION 'Business not found for slug: %', target_business_slug;
    END IF;

    -- 2. Release expired reservations older than 15 minutes
    UPDATE public.review_templates
    SET status = 'available', claim_token = NULL, claimed_at = NULL
    WHERE business_id = v_business_id 
      AND status = 'reserved' 
      AND claimed_at < NOW() - INTERVAL '15 minutes';

    -- 3. Generate a cryptographically unique claim token
    v_token := encode(gen_random_bytes(16), 'hex');

    -- 4. Atomically lock and pick the oldest available template
    SELECT t.id INTO v_template_id
    FROM public.review_templates t
    WHERE t.business_id = v_business_id
      AND t.status = 'available'
      AND (target_language IS NULL OR t.language = target_language)
    ORDER BY t.created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    -- If no template matched the exact language, fall back to English
    IF v_template_id IS NULL AND target_language <> 'en' THEN
        SELECT t.id INTO v_template_id
        FROM public.review_templates t
        WHERE t.business_id = v_business_id
          AND t.status = 'available'
          AND t.language = 'en'
        ORDER BY t.created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED;
    END IF;

    -- 5. Mark as reserved
    IF v_template_id IS NOT NULL THEN
        UPDATE public.review_templates
        SET status = 'reserved',
            claim_token = v_token,
            claimed_at = NOW()
        WHERE id = v_template_id;

        RETURN QUERY
        SELECT 
            t.id AS template_id,
            t.business_id,
            t.template_text,
            t.language,
            t.claim_token,
            t.status
        FROM public.review_templates t
        WHERE t.id = v_template_id;
    END IF;
END;
$$;

-- ==============================================================================
-- 11. Stored Procedure: finalize_review_usage
-- Marks a reserved template as used and prevents future reuse
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.finalize_review_usage(
    p_template_id UUID,
    p_claim_token TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.review_templates
    SET status = 'used',
        used_at = NOW()
    WHERE id = p_template_id 
      AND claim_token = p_claim_token 
      AND status = 'reserved';

    RETURN FOUND;
END;
$$;

-- ==============================================================================
-- 12. Seed Data: Business & Verified Official Services
-- ==============================================================================
INSERT INTO public.businesses (slug, business_name, address, phone, website_url, google_review_url)
VALUES (
    'apple-beauty-salon',
    'Apple Beauty Salon',
    'Shop No. 8/7, Radhe Signature, Near Sahjanand City, Kudasan, Gandhinagar, Gujarat 382419, India.',
    '+91 7984654149',
    'https://www.applebeautysalon.in/',
    'https://g.page/r/CfqPqR1K8nwbEBM/review'
)
ON CONFLICT (slug) DO UPDATE 
SET business_name = EXCLUDED.business_name,
    address = EXCLUDED.address,
    google_review_url = EXCLUDED.google_review_url;

-- Seed Official Services
WITH salon_biz AS (SELECT id FROM public.businesses WHERE slug = 'apple-beauty-salon')
INSERT INTO public.services (business_id, service_name, service_category)
SELECT salon_biz.id, s.name, s.cat
FROM salon_biz,
(VALUES 
    ('Hair Services', 'Hair & Styling'),
    ('Threading', 'Threading & Waxing'),
    ('Manicure & Pedicure', 'Nails & Hand Care'),
    ('Rica Waxing', 'Threading & Waxing'),
    ('Nail Services', 'Nails & Hand Care'),
    ('Cleanup', 'Facial & Skincare'),
    ('Facial', 'Facial & Skincare'),
    ('Hair Reduction Treatment', 'Hair & Styling'),
    ('Hair Spa', 'Hair Spa'),
    ('Sider Package', 'Makeup & Bridal'),
    ('Bridal Package', 'Makeup & Bridal')
) AS s(name, cat)
ON CONFLICT (business_id, service_name) DO NOTHING;
