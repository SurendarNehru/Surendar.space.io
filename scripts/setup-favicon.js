import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const sourcePaths = [
  path.join(projectRoot, 'src', 'assets', 'favicon.png'),
  path.join(projectRoot, 'src', 'assets', 'surendar.jpg'),
];

let copied = false;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

for (const src of sourcePaths) {
  if (fs.existsSync(src)) {
    try {
      const targetFavicon = path.join(publicDir, 'favicon.png');
      fs.copyFileSync(src, targetFavicon);
      console.log(`Successfully updated favicon from ${src}`);
      copied = true;
      break;
    } catch (err) {
      console.error(`Error copying ${src}:`, err);
    }
  }
}

if (!copied) {
  console.log('Favicon already up to date or using default in public/');
}
