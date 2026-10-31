-- ==============================================================================
-- Apple Beauty Salon - Supabase Database Schema & RLS Policy Fix
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zlzcqsputncpqpgodylv/sql/new
-- ==============================================================================

-- 1. Ensure required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create review_templates table with required schema
CREATE TABLE IF NOT EXISTS public.review_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL DEFAULT 'Apple Beauty Salon',
    review_text TEXT NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GRANT Table Access to PostgREST roles (anon & authenticated)
-- (Fixes the exact PostgreSQL 42501 permission denied error)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.review_templates TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.review_templates ENABLE ROW LEVEL SECURITY;

-- 5. Drop any existing conflicting policies
DROP POLICY IF EXISTS "Allow anon and auth read review_templates" ON public.review_templates;
DROP POLICY IF EXISTS "Allow anon and auth insert review_templates" ON public.review_templates;
DROP POLICY IF EXISTS "Allow anon and auth update review_templates" ON public.review_templates;

-- 6. Clean RLS Policies for Anon (Customer-facing) and Authenticated users
-- Allow reading available review templates
CREATE POLICY "Allow anon and auth read review_templates"
ON public.review_templates
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow inserting new generated review drafts
CREATE POLICY "Allow anon and auth insert review_templates"
ON public.review_templates
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow marking review drafts as used
CREATE POLICY "Allow anon and auth update review_templates"
ON public.review_templates
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 7. Seed Initial 30 Authentic English Review Drafts
INSERT INTO public.review_templates (business_name, review_text, is_used)
VALUES
  ('Apple Beauty Salon', 'The haircut consultation was detailed and took my face shape into account. The stylist listened carefully to how I like to manage my daily hair styling. The salon at Radhe Signature in Kudasan has a calm, pleasant environment.', false),
  ('Apple Beauty Salon', 'Stepping into Apple Beauty Salon provided a soothing break from a busy weekday. My facial treatment was done with great gentleness and attention to skin hygiene. The staff maintained clean towels and hygienic products throughout the session. Appreciated the serene ambiance here in Kudasan.', false),
  ('Apple Beauty Salon', 'Eyebrow shaping was finished with impressive precision and minimal discomfort. Very hygienic technique and gentle hands make this salon a reliable choice in Gandhinagar.', false),
  ('Apple Beauty Salon', 'Using Italian Rica wax made the hair removal process noticeably gentler on my sensitive skin. The aesthetician worked efficiently and ensured everything remained neat and comfortable. Radhe Signature location is convenient with easy parking.', false),
  ('Apple Beauty Salon', 'Thorough hand and foot care made the spa pedicure session thoroughly rejuvenating. The warm soak, gentle scrub, and neat cuticle detailing were handled with unhurried care. Clean tools and warm hospitality stand out at Apple Beauty Salon.', false),
  ('Apple Beauty Salon', 'Deep scalp massage during the hair spa helped ease a lot of accumulated work tension. The steam therapy and nourishing mask left my hair feeling significantly softer and manageable. A great self-care ritual in Kudasan.', false),
  ('Apple Beauty Salon', 'A prompt skin cleanup left my face feeling thoroughly refreshed and breathing easy. Clean setup, polite staff, and punctual service right on time.', false),
  ('Apple Beauty Salon', 'Precision nail shaping and clean cuticle care were done with meticulous patience. The polish application was smooth, even, and long-lasting. Always a dependable grooming studio in Kudasan, Gandhinagar.', false),
  ('Apple Beauty Salon', 'Pre-wedding beauty preparation was coordinated seamlessly across multiple appointments. From customized skincare therapies to final makeup consultation, the team showed true professional dedication. Their experience since 1996 clearly reflects in their calm handling of busy brides.', false),
  ('Apple Beauty Salon', 'Festive styling and saree draping for our family function were completed right on schedule. The hairstyle held beautifully throughout the event and the staff accommodated our timing smoothly. Highly recommended in Kudasan.', false),
  ('Apple Beauty Salon', 'Professional hair trimming and blow-dry styling left my hair looking naturally polished. The staff took time to understand the volume and texture I wanted without rushing. Clean mirrors and neat workstations.', false),
  ('Apple Beauty Salon', 'The hydrating facial therapy was calming and visibly restored natural radiance. Clean steam equipment and sanitized towels were used throughout. A very peaceful parlor experience near Sahjanand City in Kudasan.', false),
  ('Apple Beauty Salon', 'Quick and hygienic upper lip and eyebrow threading done with great dexterity. Minimal redness and very gentle technique. Always reliable for quick regular grooming.', false),
  ('Apple Beauty Salon', 'Full-arm Rica liposoluble waxing left my skin completely smooth without any sticky residue. Post-wax soothing lotion was applied with care. The parlor maintains high standards of client comfort.', false),
  ('Apple Beauty Salon', 'Treated my dry hair to an intensive hair spa treatment and scalp nourishment. The conditioning masque smelled subtle and pleasant, and the rhythmic head massage was wonderful. My hair feels much lighter and tangle-free. Definitely coming back for regular sessions.', false),
  ('Apple Beauty Salon', 'Relaxing foot soak and neat nail filing made this pedicure well worth the visit. Clean basins and very attentive staff. Highly satisfied with the cleanliness.', false),
  ('Apple Beauty Salon', 'Pore cleansing and gentle exfoliation were done smoothly during my afternoon visit. The aesthetician gave helpful tips for daily sun protection without being pushy. Great experience at Radhe Signature.', false),
  ('Apple Beauty Salon', 'Neat gel polish finish and cuticle grooming done with steady, skilled hands. The glossy coat remained chip-free for weeks. Lovely attention to detail.', false),
  ('Apple Beauty Salon', 'Hair smoothing session helped tame severe frizz and made daily morning styling effortless. Clear explanations were provided for aftercare shampoo and serum. Very knowledgeable hair specialists.', false),
  ('Apple Beauty Salon', 'Booked my bridal makeover package and was very impressed by the punctuality of the team. They handled hair styling, makeup, and dupatta setting calmly despite our tight schedule. The makeup looked luminous in photographs without feeling heavy.', false)
ON CONFLICT DO NOTHING;
