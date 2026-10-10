import { createServer } from 'node:http';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from '@playwright/test';

const root = resolve('dist');
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, `.${pathname}`, pathname.endsWith('/') ? 'index.html' : '');
    if (!file.startsWith(`${root}/`)) {
      res.writeHead(403).end();
      return;
    }
    const ext = file.split('.').pop();
    const contentTypes = { html: 'text/html', css: 'text/css', js: 'text/javascript', jpg: 'image/jpeg', webp: 'image/webp', woff: 'font/woff', woff2: 'font/woff2' };
    res.setHeader('Content-Type', contentTypes[ext] ?? 'application/octet-stream');
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const results = [];
try {
  await mkdir('screenshots', { recursive: true });
  const chromePath = process.env.CHROME_PATH || (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : chromium.executablePath());
  await access(chromePath);
  for (let i = 1; i <= 3; i += 1) {
    const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless', '--disable-dev-shm-usage'] });
    try {
      const run = await lighthouse(`http://127.0.0.1:${server.address().port}/`, {
        port: chrome.port,
        output: 'json',
        onlyCategories: ['performance', 'accessibility'],
        formFactor: 'mobile',
        disableStorageReset: true,
      });
      await writeFile(`screenshots/lighthouse-${i}.json`, run.report);
      results.push({ performance: run.lhr.categories.performance.score, accessibility: run.lhr.categories.accessibility.score, lcpMs: run.lhr.audits['largest-contentful-paint'].numericValue, bytes: run.lhr.audits['total-byte-weight'].numericValue, runtimeError: run.lhr.runtimeError ?? null });
    } finally {
      await chrome.kill();
    }
  }
} catch (error) {
  const message = error.code === 'ENOENT'
    ? 'Browser unavailable; set CHROME_PATH or install Playwright Chromium.'
    : error.message.includes('dynamic debugging port')
      ? 'Browser could not start. Check its permissions and system dependencies.'
      : error.message;
  results.push({ error: message });
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
  await writeFile('performance-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results));
}

if (results.length !== 3 || results.some((result) => result.performance === null || result.error || result.runtimeError)) process.exitCode = 1;
