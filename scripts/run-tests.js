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
  assert(content.includes('https://github.com/SurendarNehru/Surendar.space'), 'README contains GitHub repository URL');
}

// Test 2: CNAME check
const cnamePath = path.resolve('public/CNAME');
assert(fs.existsSync(cnamePath), 'public/CNAME exists');
if (fs.existsSync(cnamePath)) {
  const cname = fs.readFileSync(cnamePath, 'utf-8').trim();
  assert(cname === 'surendar.space', 'CNAME points to surendar.space');
}

// Test 3: Favicon check
const faviconPath = path.resolve('public/favicon.png');
assert(fs.existsSync(faviconPath), 'public/favicon.png exists');

// Test 4: GitHub Actions workflow check
const deployWf = path.resolve('.github/workflows/deploy.yml');
assert(fs.existsSync(deployWf), '.github/workflows/deploy.yml exists');

console.log(`\nTest Results: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed successfully!');
  process.exit(0);
}
