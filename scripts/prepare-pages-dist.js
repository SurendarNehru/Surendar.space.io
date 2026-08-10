import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const outputPublic = path.join(projectRoot, '.output', 'public');
const distClient = path.join(projectRoot, 'dist', 'client');
const publicDir = path.join(projectRoot, 'public');
const rootIndexHtml = path.join(projectRoot, 'index.html');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Preparing production bundle for GitHub Pages...');

// Step 1: Copy built assets
if (fs.existsSync(outputPublic)) {
  console.log('Syncing .output/public -> dist/');
  copyDirSync(outputPublic, distDir);
} else if (fs.existsSync(distClient)) {
  console.log('Syncing dist/client -> dist/');
  copyDirSync(distClient, distDir);
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Step 2: Sync public folder assets into dist/
if (fs.existsSync(publicDir)) {
  copyDirSync(publicDir, distDir);
}

// Step 3: Create .nojekyll to prevent GitHub Pages Jekyll processing
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf-8');
console.log('Created dist/.nojekyll');

// Step 4: Check for compiled index.html
const targetIndexHtml = path.join(distDir, 'index.html');
const target404Html = path.join(distDir, '404.html');

if (fs.existsSync(targetIndexHtml)) {
  let html = fs.readFileSync(targetIndexHtml, 'utf-8');
  // Replace only root-relative paths like /assets/ while preserving http:// and https:// external URLs
  html = html.replace(/(href|src)=["']\/(?!\/|http)([^"']+)["']/g, '$1="./$2"');
  fs.writeFileSync(targetIndexHtml, html, 'utf-8');
  fs.writeFileSync(target404Html, html, 'utf-8');
  console.log('Successfully processed compiled dist/index.html and created dist/404.html.');
} else if (fs.existsSync(rootIndexHtml)) {
  console.log('Copying root index.html to dist/');
  let html = fs.readFileSync(rootIndexHtml, 'utf-8');
  fs.writeFileSync(targetIndexHtml, html, 'utf-8');
  fs.writeFileSync(target404Html, html, 'utf-8');
}

console.log('Deployment dist directory prepared successfully.');
