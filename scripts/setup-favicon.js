import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const sourcePaths = [
  'C:\\Users\\Shalini\\.gemini\\antigravity-ide\\brain\\3a4389d6-2353-40d2-ab1d-6b71b6c98c4b\\surendar_favicon_1786288126511.png',
  'C:\\Users\\Shalini\\.gemini\\antigravity-ide\\brain\\3a4389d6-2353-40d2-ab1d-6b71b6c98c4b\\media__1786287999052.jpg',
];

let copied = false;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

for (const src of sourcePaths) {
  if (fs.existsSync(src)) {
    try {
      const targetFavicon = path.join(publicDir, 'favicon.png');
      const targetJpg = path.join(publicDir, 'surendar.jpg');
      const targetAvatar = path.join(publicDir, 'avatar.jpg');
      fs.copyFileSync(src, targetFavicon);
      fs.copyFileSync(src, targetJpg);
      fs.copyFileSync(src, targetAvatar);
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
