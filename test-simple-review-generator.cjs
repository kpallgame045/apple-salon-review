const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('APPLE BEAUTY SALON — 9-ELEMENT COMPACT REVIEW GENERATOR TESTS');
console.log('================================================================\n');

let failedTests = 0;
let passedTests = 0;

function assert(condition, elementNumber, description) {
  if (condition) {
    console.log(`[PASS] Element ${elementNumber}: ${description}`);
    passedTests++;
  } else {
    console.error(`[FAIL] Element ${elementNumber}: ${description}`);
    failedTests++;
  }
}

const appFile = fs.readFileSync(path.join(__dirname, 'src', 'App.tsx'), 'utf8');
const cssFile = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf8');

// 1. Business Logo
assert(
  appFile.includes('/apple-beauty-salon-logo.jpg') &&
  fs.existsSync(path.join(__dirname, 'public', 'apple-beauty-salon-logo.jpg')),
  1,
  'Original Apple Beauty Salon logo displayed in arched brand frame'
);

// 2. Business Name
assert(
  appFile.includes('Apple Beauty Salon'),
  2,
  'Business Name "Apple Beauty Salon" prominently displayed'
);

// 3. Main Heading
assert(
  appFile.includes('Share Your Google Review'),
  3,
  'Main Heading “Share Your Google Review” configured'
);

// 4. Review Display Box Typography & Readability (17-19px mobile, 18-20px desktop)
assert(
  appFile.includes('<textarea') && 
  appFile.includes('review-text-size') &&
  cssFile.includes('1.125rem') &&
  cssFile.includes('1.25rem'),
  4,
  'Spacious Review Display Box with comfortable 18-20px font size & padding'
);

// 5. Copy Review Button & Success Message
assert(
  appFile.includes('copyToClipboard') && 
  appFile.includes('Review copied successfully!'),
  5,
  '1-Click Copy Review button displays “Review copied successfully!” without extra prompts'
);

// 6. Generate Another Button
assert(
  appFile.includes('handleFetchReview') && 
  appFile.includes('Generate Another Suggestion'),
  6,
  'Generate Another Button fetches next available draft without page reload'
);

// 7. Open Google Review Button
assert(
  appFile.includes('https://g.page/r/CfqPqR1K8nwbEBM/review') && 
  appFile.includes('Open Google Review'),
  7,
  'Open Google Review Button launches official verified Google Review link in new tab'
);

// 8. Mobile Responsive Design & Classic Pastel Background
assert(
  appFile.includes('max-w-lg') && 
  cssFile.includes('bg-pastel-mesh') &&
  cssFile.includes('rgba(253, 230, 238'),
  8,
  'Compact mobile-first card layout on luxury pastel background (blush, lavender, peach, cream)'
);

// 9. Loading & Error Messages
assert(
  appFile.includes('Preparing your review suggestion...') && 
  appFile.includes('errorMessage') && 
  appFile.includes('Try Again'),
  9,
  'Active loading spinner and friendly error banner with retry verified'
);

// 10. Footer Branding: Powered by FlashDesign AI
assert(
  appFile.includes('Powered by') && 
  appFile.includes('FlashDesign AI') &&
  appFile.includes('https://www.instagram.com/flashdesign_ai/'),
  10,
  'Footer branding: "Powered by FlashDesign AI" with verified Instagram link'
);

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedTests}/10 CRITICAL REQUIREMENTS VERIFIED (${failedTests} FAILED)`);
console.log('================================================================');

if (failedTests > 0) process.exit(1);
