import fs from 'node:fs';
import path from 'node:path';

const cicd = path.join(process.cwd(), '.github', 'workflows', 'ci-cd.yml');
if (fs.existsSync(cicd)) {
  fs.unlinkSync(cicd);
  console.log('Removed duplicate ci-cd.yml workflow file');
}
