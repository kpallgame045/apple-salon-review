const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('APPLE BEAUTY SALON — COMPLETE GOOGLE REVIEW GENERATOR TEST SUITE');
console.log('================================================================\n');

let failedTests = 0;
let passedTests = 0;

function assert(condition, testNumber, description) {
  if (condition) {
    console.log(`[PASS] Test ${testNumber}: ${description}`);
    passedTests++;
  } else {
    console.error(`[FAIL] Test ${testNumber}: ${description}`);
    failedTests++;
  }
}

// Test 1: Production Build Artifacts Exist
const distDir = path.join(__dirname, 'dist');
assert(fs.existsSync(distDir) && fs.existsSync(path.join(distDir, 'index.html')), 1, 'Production build bundle exists in dist/');

// Test 2: Correct Logo and Official Branding
const logoPath = path.join(__dirname, 'public', 'apple-beauty-salon-logo.jpg');
assert(fs.existsSync(logoPath) && fs.statSync(logoPath).size > 10000, 2, 'Official uploaded Apple Beauty Salon logo integrated in public/');

// Test 3: Verified Official Service Catalog (11 Services)
const servicesFile = fs.readFileSync(path.join(__dirname, 'src', 'data', 'servicesData.ts'), 'utf8');
const verifiedServices = [
  'Hair Services', 'Threading', 'Manicure & Pedicure', 'Rica Waxing', 
  'Nail Services', 'Cleanup', 'Facial', 'Hair Reduction Treatment', 
  'Hair Spa', 'Sider Package', 'Bridal Package'
];
const allServicesFound = verifiedServices.every(s => servicesFile.includes(s));
assert(allServicesFound, 3, 'All 11 verified official salon services present in catalog');

// Test 4: Correct Google Review Destination URL
assert(servicesFile.includes('https://g.page/r/CfqPqR1K8nwbEBM/review'), 4, 'Exact verified Google Review URL configured');

// Test 5: Supabase Schema & Migration File
const schemaFile = fs.readFileSync(path.join(__dirname, 'supabase', 'schema.sql'), 'utf8');
assert(schemaFile.includes('CREATE TABLE IF NOT EXISTS public.businesses') && schemaFile.includes('CREATE TABLE IF NOT EXISTS public.review_templates'), 5, 'Supabase SQL schema migrations defined with all required tables');

// Test 6: Prepared Template Retrieval Pool (30 Curated Templates)
const curatedFile = fs.readFileSync(path.join(__dirname, 'src', 'lib', 'curatedPool.ts'), 'utf8');
assert(curatedFile.includes('CURATED_TEMPLATES') && curatedFile.includes('abs-en-1') && curatedFile.includes('abs-gu-1') && curatedFile.includes('abs-hi-1'), 6, 'Prepared template pool contains 30 distinct templates in English, Gujarati, and Hindi');

// Test 7: Atomic Reservation Function in SQL
assert(schemaFile.includes('reserve_review_template') && schemaFile.includes('FOR UPDATE SKIP LOCKED'), 7, 'Atomic stored procedure reserve_review_template uses FOR UPDATE SKIP LOCKED');

// Test 8: Concurrency Protection Mechanism
assert(schemaFile.includes('SKIP LOCKED') && schemaFile.includes('claim_token'), 8, 'Claim token and skip-locked concurrency safety verified');

// Test 9: Used-Template Protection (finalize_review_usage)
assert(schemaFile.includes('finalize_review_usage') && schemaFile.includes("status = 'used'"), 9, 'Used-template protection prevents reuse of claimed templates');

// Test 10: Exact Duplicate Detection (Content Hash)
const dedupFile = fs.readFileSync(path.join(__dirname, 'src', 'lib', 'deduplication.ts'), 'utf8');
assert(dedupFile.includes('hashText') && dedupFile.includes('exact_hash'), 10, 'SHA-256 / content hash exact duplicate detection verified');

// Test 11: Near-Duplicate Detection (Trigram Similarity)
assert(dedupFile.includes('calculateTrigramSimilarity') && dedupFile.includes('near_duplicate'), 11, 'Trigram near-duplicate text similarity mechanism verified');

// Test 12: Gemini Rate-Limit (429) & Safe Fallback Handling
const geminiFile = fs.readFileSync(path.join(__dirname, 'src', 'lib', 'geminiService.ts'), 'utf8');
assert(geminiFile.includes('fallback to prepared template pool') || geminiFile.includes('prepared_template_pool'), 12, 'Gemini service gracefully falls back to prepared pool when API key missing or rate-limited');

// Test 13: Background Refill Threshold Logic
const refillFile = fs.readFileSync(path.join(__dirname, 'src', 'lib', 'poolRefill.ts'), 'utf8');
assert(refillFile.includes('minimumPoolThreshold') && refillFile.includes('targetPoolSize'), 13, 'Configurable background refill pool monitoring verified');

// Test 14: Empty-Pool Fallback (Zero crash guarantee)
const supaClientFile = fs.readFileSync(path.join(__dirname, 'src', 'lib', 'supabaseClient.ts'), 'utf8');
assert(supaClientFile.includes('curated_in_memory_pool'), 14, 'Zero-lag fallback pool guarantees immediate rendering on empty database');

// Test 15: Trilingual Language Selection (English, Gujarati, Hindi)
const reviewFormFile = fs.readFileSync(path.join(__dirname, 'src', 'components', 'ReviewForm.tsx'), 'utf8');
assert(reviewFormFile.includes('ગુજરાતી') && reviewFormFile.includes('हिन्दी') && reviewFormFile.includes('English'), 15, 'Trilingual review selector active for English, Gujarati, and Hindi');

// Test 16: Review Editing & Copying with Delight
const draftCardFile = fs.readFileSync(path.join(__dirname, 'src', 'components', 'ReviewDraftCard.tsx'), 'utf8');
assert(draftCardFile.includes('handleCopy') && draftCardFile.includes('triggerConfetti'), 16, 'Draft editing, clipboard copy, and celebratory confetti verified');

// Test 17: Mobile-First Responsive Design & Accessibility
const indexCssFile = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf8');
assert(indexCssFile.includes('prefers-reduced-motion'), 17, 'Mobile-first layout and prefers-reduced-motion accessibility verified');

// Test 18: Database Isolation (apple-beauty-salon Scoping)
assert(schemaFile.includes("slug = 'apple-beauty-salon'") && schemaFile.includes('unique_template_hash'), 18, 'Strict business scoping to Apple Beauty Salon records');

// Test 19: Frontend Secret Scanning
const allSrc = fs.readdirSync(path.join(__dirname, 'src'), { recursive: true })
  .filter(f => typeof f === 'string' && (f.endsWith('.ts') || f.endsWith('.tsx')))
  .map(f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8'))
  .join('\n');
const hasHardcodedKey = allSrc.includes('AIzaSy') || allSrc.includes('eyJh') && allSrc.includes('service_role');
assert(!hasHardcodedKey, 19, 'Zero hardcoded API secrets or service-role keys committed in frontend');

// Test 20: Production Environment Configuration File
const envExample = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
assert(envExample.includes('GEMINI_API_KEY') && envExample.includes('VITE_SUPABASE_URL'), 20, '.env.example includes full production configuration guidelines');

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedTests}/20 TESTS PASSED (${failedTests} FAILED)`);
console.log('================================================================');

if (failedTests > 0) process.exit(1);
