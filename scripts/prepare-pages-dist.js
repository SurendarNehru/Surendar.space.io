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

// Sync public assets directly into dist/
if (fs.existsSync(publicDir)) {
  copyDirSync(publicDir, distDir);
}

// Ensure index.html and 404.html exist in dist/
const targetIndexHtml = path.join(distDir, 'index.html');
const target404Html = path.join(distDir, '404.html');

if (fs.existsSync(rootIndexHtml)) {
  fs.copyFileSync(rootIndexHtml, targetIndexHtml);
  fs.copyFileSync(rootIndexHtml, target404Html);
} else if (!fs.existsSync(targetIndexHtml)) {
  const fallbackHtml = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Surendar — Personal Portfolio</title>
    <link rel="icon" type="image/png" href="/favicon.png" />
  </head>
  <body class="min-h-screen bg-[#050508] text-white">
    <div id="root"></div>
  </body>
</html>`;
  fs.writeFileSync(targetIndexHtml, fallbackHtml, 'utf-8');
  fs.writeFileSync(target404Html, fallbackHtml, 'utf-8');
}

// Guarantee CNAME is present for surendar.space
fs.writeFileSync(path.join(distDir, 'CNAME'), 'surendar.space\n', 'utf-8');

console.log('Deployment dist directory prepared successfully with index.html, 404.html, and CNAME.');
