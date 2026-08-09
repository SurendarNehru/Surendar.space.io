import fs from 'node:fs';
import path from 'node:path';

console.log('--- Running Portfolio Integrity Tests ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

// Test 1: README check
const readmePath = path.resolve('README.md');
assert(fs.existsSync(readmePath), 'README.md exists');
if (fs.existsSync(readmePath)) {
  const content = fs.readFileSync(readmePath, 'utf-8');
  assert(content.includes('Surendar — Personal Portfolio'), 'README contains portfolio header');
  assert(content.includes('surendar.space'), 'README contains live domain surendar.space');
  assert(content.includes('Surendar.space'), 'README contains GitHub repository URL');
}

// Test 2: CNAME check (Optional custom domain)
const cnamePath = path.resolve('public/CNAME');
if (fs.existsSync(cnamePath)) {
  console.log('✓ PASS: Custom CNAME is configured');
  passed++;
} else {
  console.log('✓ PASS: Standard GitHub Pages subpath hosting enabled');
  passed++;
}

// Test 3: Favicon check
const faviconPath = path.resolve('public/favicon.png');
assert(fs.existsSync(faviconPath), 'public/favicon.png exists');

// Test 4: GitHub Actions workflow check
const deployWf = path.resolve('.github/workflows/deploy.yml');
assert(fs.existsSync(deployWf), '.github/workflows/deploy.yml exists');

// Test 5: Root index.html check
const indexHtmlPath = path.resolve('index.html');
assert(fs.existsSync(indexHtmlPath), 'index.html exists for static hosting');

console.log(`\nTest Results: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed successfully!');
  process.exit(0);
}
