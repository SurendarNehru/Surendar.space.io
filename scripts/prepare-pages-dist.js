import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const outputPublic = path.join(projectRoot, '.output', 'public');
const distClient = path.join(projectRoot, 'dist', 'client');

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

console.log('Preparing production deployment bundle in dist/ ...');

if (fs.existsSync(outputPublic)) {
  console.log('Found Nitro output in .output/public, syncing to dist/');
  copyDirSync(outputPublic, distDir);
} else if (fs.existsSync(distClient)) {
  console.log('Found client build in dist/client, syncing to dist/');
  copyDirSync(distClient, distDir);
}

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy public assets directly into dist if missing
const publicDir = path.join(projectRoot, 'public');
if (fs.existsSync(publicDir)) {
  copyDirSync(publicDir, distDir);
}

// Guarantee CNAME is present
fs.writeFileSync(path.join(distDir, 'CNAME'), 'surendar.space\n', 'utf-8');

console.log('Deployment dist directory prepared successfully.');
