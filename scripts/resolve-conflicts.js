import fs from 'node:fs';
import path from 'node:path';

function resolveConflictsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('<<<<<<< HEAD')) return;

  const lines = content.split('\n');
  const result = [];
  let state = 'NORMAL'; // 'NORMAL', 'HEAD', 'THEIRS'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('<<<<<<< HEAD')) {
      state = 'HEAD';
    } else if (line.startsWith('=======')) {
      if (state === 'HEAD') {
        state = 'THEIRS';
      } else {
        result.push(line);
      }
    } else if (line.startsWith('>>>>>>> ')) {
      state = 'NORMAL';
    } else {
      if (state === 'NORMAL' || state === 'HEAD') {
        result.push(line);
      }
    }
  }

  fs.writeFileSync(filePath, result.join('\n'), 'utf-8');
  console.log(`Resolved conflicts in ${path.relative(process.cwd(), filePath)}`);
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        walkDir(fullPath);
      }
    } else if (entry.isFile()) {
      resolveConflictsInFile(fullPath);
    }
  }
}

console.log('Resolving merge conflict markers across project files...');
walkDir(process.cwd());
console.log('Merge conflicts resolved successfully!');
