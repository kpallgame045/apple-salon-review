const fs = require('fs');
const path = require('path');

console.log('--- STARTING PHASE 1 ACCEPTANCE TESTS ---\n');

let failedTests = 0;
function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    failedTests++;
  }
}

// 1. Check build files
const distDir = path.join(__dirname, 'dist');
assert(fs.existsSync(distDir), 'Dist folder exists');
assert(fs.existsSync(path.join(distDir, 'index.html')), 'Dist index.html exists');
assert(fs.existsSync(path.join(distDir, 'apple-beauty-salon-logo.jpg')), 'Original uploaded logo exists in dist');

// 2. Check no Supabase or Gemini requests/imports
const srcDir = path.join(__dirname, 'src');
function scanDir(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(scanDir(fullPath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
      files.push(fullPath);
    }
  });
  return files;
}
const allSrcFiles = scanDir(srcDir);
let hasBackendCalls = false;
allSrcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('@supabase') || content.includes('@google/genai') || content.includes('gemini-') || content.includes('createClient(')) {
    hasBackendCalls = true;
    console.error(`Unwanted backend import found in ${file}`);
  }
});
assert(!hasBackendCalls, 'Zero Supabase or Gemini API dependencies or requests in frontend codebase (Phase 1)');

// 3. Check service data file
const servicesDataFile = fs.readFileSync(path.join(srcDir, 'data', 'servicesData.ts'), 'utf8');
const requiredCategories = [
  'Hair Services',
  'Threading',
  'Manicure & Pedicure',
  'Rica Waxing',
  'Nail Services',
  'Cleanup',
  'Facial',
  'Hair Reduction Treatment',
  'Hair Spa',
  'Sider Package',
  'Bridal Package'
];
requiredCategories.forEach(cat => {
  assert(servicesDataFile.includes(cat), `Official category present: "${cat}"`);
});

// 4. Check 6 showcase categories
const requiredShowcases = [
  'Hair & Styling',
  'Facial & Skincare',
  'Nails & Hand Care',
  'Threading & Waxing',
  'Hair Spa',
  'Makeup & Bridal'
];
requiredShowcases.forEach(sc => {
  assert(servicesDataFile.includes(sc), `Showcase category present: "${sc}"`);
});

// 5. Verify exact Google Review and Official links
assert(servicesDataFile.includes('https://g.page/r/CfqPqR1K8nwbEBM/review'), 'Exact Google Review URL configured');
assert(servicesDataFile.includes('https://www.applebeautysalon.in/'), 'Exact official website URL configured');
assert(servicesDataFile.includes('+91 7984654149'), 'Official phone number configured');
assert(servicesDataFile.includes('Kudasan, Gandhinagar'), 'Business location configured');

// 6. Test reduced-motion rule in CSS
const cssContent = fs.readFileSync(path.join(srcDir, 'index.css'), 'utf8');
assert(cssContent.includes('prefers-reduced-motion'), 'CSS includes prefers-reduced-motion accessibility rule');

console.log(`\n--- TEST SUMMARY: ${failedTests === 0 ? 'ALL ACCEPTANCE TESTS PASSED' : `${failedTests} TESTS FAILED`} ---`);
if (failedTests > 0) process.exit(1);
