#!/usr/bin/env node
// Reports the JS each CRX entry loads (static import closure) and fails
// when an entry exceeds bundle-budget.json.
// Usage: node scripts/check-bundle-size.mjs [--dist dist-crx] [--budget bundle-budget.json] [--no-budget]
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const distDir = resolve(appDir, argValue('--dist', 'dist-crx'));
const budgetPath = resolve(appDir, argValue('--budget', 'bundle-budget.json'));
const skipBudget = args.includes('--no-budget');

if (!existsSync(join(distDir, 'manifest.json'))) {
  console.error(`No CRX build found in ${distDir}. Run pnpm build:crx first.`);
  process.exit(1);
}

const STATIC_IMPORT =
  /^\s*(?:import|export)\s*(?:[\w$*{}\s,]+from\s*)?["']([^"']+)["']\s*;?/;

function staticImports(file) {
  let code = readFileSync(join(distDir, file), 'utf8');
  const deps = [];
  for (;;) {
    const match = code.match(STATIC_IMPORT);
    if (!match) break;
    deps.push(posix.normalize(posix.join(posix.dirname(file), match[1])));
    code = code.slice(match[0].length);
  }
  return deps;
}

function closure(files) {
  const seen = new Set();
  const stack = [...files];
  while (stack.length) {
    const file = stack.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    stack.push(...staticImports(file));
  }
  return [...seen];
}

function sizeOf(files) {
  return files.reduce(
    (acc, file) => {
      const buf = readFileSync(join(distDir, file));
      acc.raw += buf.length;
      acc.gzip += gzipSync(buf, { level: 9 }).length;
      return acc;
    },
    { raw: 0, gzip: 0 }
  );
}

function htmlScripts(htmlFile) {
  const html = readFileSync(join(distDir, htmlFile), 'utf8');
  const srcs = [
    ...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g),
    ...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+\.js)"/g),
  ].map((m) => m[1].replace(/^\//, ''));
  return [...new Set(srcs)];
}

const manifest = JSON.parse(
  readFileSync(join(distDir, 'manifest.json'), 'utf8')
);

function contentScriptFiles() {
  const loaders = manifest.content_scripts.flatMap((cs) => cs.js);
  const dynamic = loaders
    .flatMap((loader) => [
      ...readFileSync(join(distDir, loader), 'utf8').matchAll(
        /chrome\.runtime\.getURL\(["']([^"']+\.js)["']\)/g
      ),
    ])
    .map((m) => m[1]);
  return [...loaders, ...dynamic];
}

const entries = {
  popup: closure(htmlScripts(manifest.action.default_popup)),
  background: closure([manifest.background.service_worker]),
  contentScript: closure(contentScriptFiles()),
};
if (existsSync(join(distDir, 'e2e.html'))) {
  entries['e2e (not shipped in prod)'] = closure(htmlScripts('e2e.html'));
}

const budget =
  !skipBudget && existsSync(budgetPath)
    ? JSON.parse(readFileSync(budgetPath, 'utf8'))
    : {};

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const rows = [];
const failures = [];
for (const [name, files] of Object.entries(entries)) {
  const size = sizeOf(files);
  const limit = budget[name];
  let status = '';
  if (limit) {
    const over = ['raw', 'gzip'].filter((k) => limit[k] && size[k] > limit[k]);
    status = over.length ? `OVER (${over.join(', ')})` : 'ok';
    if (over.length) failures.push(name);
  }
  rows.push({
    entry: name,
    files: files.length,
    raw: kb(size.raw),
    gzip: kb(size.gzip),
    'budget raw': limit?.raw ? kb(limit.raw) : '-',
    'budget gzip': limit?.gzip ? kb(limit.gzip) : '-',
    status,
  });
}

console.table(rows);

if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import('node:fs');
  const header = Object.keys(rows[0]);
  const md = [
    '### CRX bundle size',
    '',
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${header.map((h) => r[h]).join(' | ')} |`),
    '',
  ].join('\n');
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
}

if (failures.length) {
  console.error(
    `Bundle budget exceeded for: ${failures.join(', ')}. See ${budgetPath}.`
  );
  process.exit(1);
}
