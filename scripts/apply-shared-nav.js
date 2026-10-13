#!/usr/bin/env node
/**
 * Sync desktop header nav on standalone HTML pages to data/site-nav.js
 */

const fs = require('fs');
const path = require('path');
const { renderDesktopNavInnerOnly, SHARED_NUMERIC_STYLE } = require('../data/site-nav');

const ROOT = path.resolve(__dirname, '..');

const STATIC_PAGES = [
  'hall-galaxy.html',
  'buffet.html',
  'gallery.html',
  'directions.html',
  'reviews.html',
  'queens-table.html',
  'dress-show.html',
  'dress-show-2027.html',
  'dress-show2.html',
  'marketing.html',
  'chat.html',
];

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function writeFile(p, c) {
  fs.writeFileSync(p, c, 'utf8');
}

function inferActiveKey(file) {
  if (file === 'queens-table.html') return 'queens-table';
  if (file.startsWith('dress-show')) return 'dress-show';
  return null;
}

function applyNavToFile(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return false;

  let html = readFile(full);
  const active = inferActiveKey(path.basename(relPath));
  const inner = renderDesktopNavInnerOnly(active);

  const navRegex =
    /<nav class="hidden lg:flex items-center gap-[^"]*">[\s\S]*?<\/nav>/;

  if (!navRegex.test(html)) {
    console.warn(`  ⚠ nav block not found: ${relPath}`);
    return false;
  }

  html = html.replace(
    navRegex,
    `<nav class="hidden lg:flex items-center gap-6 xl:gap-8">\n${inner}\n    </nav>`,
  );

  if (!html.includes('font-variant-numeric: lining-nums') && html.includes('</style>')) {
    html = html.replace('</style>', `${SHARED_NUMERIC_STYLE}\n</style>`);
  }

  writeFile(full, html);
  return true;
}

function applySharedNav() {
  console.log('\nSyncing shared navigation on static pages:');
  for (const rel of STATIC_PAGES) {
    if (applyNavToFile(rel)) console.log(`  ✓ ${rel}`);
  }
}

module.exports = { applySharedNav, STATIC_PAGES };

if (require.main === module) applySharedNav();
