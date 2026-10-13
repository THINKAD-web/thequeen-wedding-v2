#!/usr/bin/env node
/** Soften unverified superlatives on SPA shells (index + queens-table). */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const REPLACEMENTS = [
  ['포항 최초의 하이엔드 웨딩 컨벤션', '포항 대잠동의 하이엔드 웨딩 컨벤션'],
  ['포항 최대 규모 주차 시설', '넉넉한 주차 시설'],
  [
    '포항 유일<br>\n          <span class="bg-gradient-to-r from-cream-50 via-gold-light to-gold bg-clip-text text-transparent">오마카세급 프리미엄 뷔페</span>',
    '포항 대잠동<br>\n          <span class="bg-gradient-to-r from-cream-50 via-gold-light to-gold bg-clip-text text-transparent">오마카세급 프리미엄 뷔페</span>',
  ],
  ['전면 리모델링과 최고급 다이닝 퀸즈테이블', '전면 리모델링과 프리미엄 다이닝 퀸즈테이블'],
  ["포항 1위 웨딩홀 UA컨벤션, '더퀸'으로 재탄생하다", "포항 웨딩홀 UA컨벤션, '더퀸'으로 재탄생하다"],
];

function patchFile(rel) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) return;
  let html = fs.readFileSync(full, 'utf8');
  let changed = false;
  for (const [from, to] of REPLACEMENTS) {
    if (html.includes(from)) {
      html = html.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(full, html, 'utf8');
    console.log(`  ✓ ${rel} (copy)`);
  }
}

function patchIndexCopy() {
  console.log('\nPatching SPA marketing copy:');
  for (const rel of ['index.html', 'queens-table.html']) patchFile(rel);
}

module.exports = { patchIndexCopy };

if (require.main === module) patchIndexCopy();
