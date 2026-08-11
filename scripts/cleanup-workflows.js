import fs from 'node:fs';
import path from 'node:path';

const cicd = path.join(process.cwd(), '.github', 'workflows', 'ci-cd.yml');
if (fs.existsSync(cicd)) {
  fs.unlinkSync(cicd);
  console.log('Removed duplicate ci-cd.yml workflow file');
}

const cname = path.join(process.cwd(), 'public', 'CNAME');
if (fs.existsSync(cname)) {
  fs.unlinkSync(cname);
  console.log('Removed CNAME to enable default GitHub Pages subpath URL');
}
