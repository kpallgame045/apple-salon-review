# Apple Beauty Salon — Complete Google Review Generator Platform

A complete, production-ready Google Review Generator built for **Apple Beauty Salon**, located at Radhe Signature, Kudasan, Gandhinagar, Gujarat.

Engineered with inspiration from the reference Veg ’n More architecture, tailored specifically to a luxury beauty studio with:
- **Instant Prepared Template Delivery (Zero API wait time)**
- **Atomic Template Reservation via PostgreSQL (`FOR UPDATE SKIP LOCKED`)**
- **Trilingual Support (English, Gujarati, Hindi)**
- **Server-Side Gemini AI Personalization**
- **Automatic Background Pool Refill (20–30 Templates)**
- **Exact & Trigram Near-Duplicate Protection**
- **In-Salon QR Code Standee Generator**
- **Exact Google Review Redirection to verified profile**

---

## 📍 Verified Business Information

| Item | Details |
| :--- | :--- |
| **Business Name** | Apple Beauty Salon |
| **Address** | Shop No. 8/7, Radhe Signature, Near Sahjanand City, Kudasan, Gandhinagar, Gujarat 382419, India. |
| **Official Phone** | `+91 7984654149` |
| **Hours** | 10:00 AM – 8:30 PM daily |
| **Official Website** | [https://www.applebeautysalon.in/](https://www.applebeautysalon.in/) |
| **Official Services Menu** | [https://www.applebeautysalon.in/services](https://www.applebeautysalon.in/services) |
| **Exact Google Review URL**| [https://g.page/r/CfqPqR1K8nwbEBM/review](https://g.page/r/CfqPqR1K8nwbEBM/review) |

---

## 🛠️ Complete Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti, QRCode SVG.
- **Database:** Supabase PostgreSQL with `pg_trgm` and `uuid-ossp` extensions.
- **AI Engine:** Google Gemini API (`@google/genai`) with safe fallback to curated pool.
- **Concurrency & Deduplication:** `FOR UPDATE SKIP LOCKED` atomic stored procedures, SHA-256 hash detection, and Dice Character Trigram similarity matching.

---

## 🗄️ Database Architecture & Migrations

All SQL migrations and atomic procedures are located in:
[`supabase/schema.sql`](file:///C:/Users/Keyur%20Patel/.gemini/antigravity/scratch/apple-beauty-salon-review/supabase/schema.sql)
[`supabase/seed_templates.sql`](file:///C:/Users/Keyur%20Patel/.gemini/antigravity/scratch/apple-beauty-salon-review/supabase/seed_templates.sql)

### Tables
1. `businesses`: Scoped business profiles.
2. `services`: 11 verified salon service categories.
3. `review_templates`: Pool of prepared review templates with claim tokens and language tags.
4. `review_drafts`: Saved reviews preventing reuse.
5. `generation_jobs`: Background refill tracking.

### Atomic Reservation Procedure
```sql
CREATE OR REPLACE FUNCTION public.reserve_review_template(
    target_business_slug TEXT DEFAULT 'apple-beauty-salon',
    target_language TEXT DEFAULT 'en',
    target_service_category TEXT DEFAULT NULL
)
RETURNS TABLE (...) ...
FOR UPDATE SKIP LOCKED;
```

---

## 🧪 20 Full-Stack Acceptance Tests Report

Executed via `node test-full-stack.cjs`:
```
================================================================
APPLE BEAUTY SALON — COMPLETE GOOGLE REVIEW GENERATOR TEST SUITE
================================================================

[PASS] Test 1: Production build bundle exists in dist/
[PASS] Test 2: Official uploaded Apple Beauty Salon logo integrated in public/
[PASS] Test 3: All 11 verified official salon services present in catalog
[PASS] Test 4: Exact verified Google Review URL configured
[PASS] Test 5: Supabase SQL schema migrations defined with all required tables
[PASS] Test 6: Prepared template pool contains 30 distinct templates in English, Gujarati, and Hindi
[PASS] Test 7: Atomic stored procedure reserve_review_template uses FOR UPDATE SKIP LOCKED
[PASS] Test 8: Claim token and skip-locked concurrency safety verified
[PASS] Test 9: Used-template protection prevents reuse of claimed templates
[PASS] Test 10: SHA-256 / content hash exact duplicate detection verified
[PASS] Test 11: Trigram near-duplicate text similarity mechanism verified
[PASS] Test 12: Gemini service gracefully falls back to prepared pool when API key missing or rate-limited
[PASS] Test 13: Configurable background refill pool monitoring verified
[PASS] Test 14: Zero-lag fallback pool guarantees immediate rendering on empty database
[PASS] Test 15: Trilingual review selector active for English, Gujarati, and Hindi
[PASS] Test 16: Draft editing, clipboard copy, and celebratory confetti verified
[PASS] Test 17: Mobile-first layout and prefers-reduced-motion accessibility verified
[PASS] Test 18: Strict business scoping to Apple Beauty Salon records
[PASS] Test 19: Zero hardcoded API secrets or service-role keys committed in frontend
[PASS] Test 20: .env.example includes full production configuration guidelines

================================================================
TEST SUMMARY: 20/20 TESTS PASSED (0 FAILED)
================================================================
```

---

## 🚀 Deployment Instructions

### 1. Supabase Setup
1. Create a new Supabase project: [https://supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste and run [`supabase/schema.sql`](file:///C:/Users/Keyur%20Patel/.gemini/antigravity/scratch/apple-beauty-salon-review/supabase/schema.sql).
4. Run [`supabase/seed_templates.sql`](file:///C:/Users/Keyur%20Patel/.gemini/antigravity/scratch/apple-beauty-salon-review/supabase/seed_templates.sql) to seed the initial 30 trilingual templates.
5. Copy your Project URL and Anon/Publishable Key from **Project Settings > API**.

### 2. Vercel Deployment
1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Apple Beauty Salon review generator"
   git remote add origin https://github.com/your-username/apple-beauty-salon-review.git
   git push -u origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Set the Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL` = `gemini-2.5-flash`
4. Click **Deploy**.
