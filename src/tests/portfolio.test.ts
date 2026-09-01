import { test, expect, describe } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Surendar Portfolio Site Integrity Tests', () => {
  test('README file exists and contains correct title and live URL', () => {
    const readmePath = path.join(process.cwd(), 'README.md');
    expect(fs.existsSync(readmePath)).toBe(true);
    const content = fs.readFileSync(readmePath, 'utf-8');
    expect(content).toContain('Surendar — Personal Portfolio');
    expect(content).toContain('surendar.space');
    expect(content).toContain('https://github.com/SurendarNehru/Surendar.space');
  });

  test('Public assets and favicon exist', () => {
    const faviconPngPath = path.join(process.cwd(), 'public', 'favicon.png');
    const cnamePath = path.join(process.cwd(), 'public', 'CNAME');
    expect(fs.existsSync(faviconPngPath) || fs.existsSync(cnamePath)).toBe(true);
  });

  test('CNAME is configured for surendar.space domain', () => {
    const cnamePath = path.join(process.cwd(), 'public', 'CNAME');
    if (fs.existsSync(cnamePath)) {
      const content = fs.readFileSync(cnamePath, 'utf-8').trim();
      expect(content).toBe('surendar.space');
    }
  });

  test('GitHub Actions deployment workflow is defined', () => {
    const workflowPath = path.join(process.cwd(), '.github', 'workflows', 'deploy.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);
    const content = fs.readFileSync(workflowPath, 'utf-8');
    expect(content).toContain('actions/deploy-pages@v4');
  });
});
