#!/usr/bin/env node
/**
 * Inject unified footers from data/site-footer.js into built HTML.
 */

const fs = require('fs');
const path = require('path');
const { renderSiteFooter, renderSiteFooterCompact, FOOTER_VERSION } = require('../data/site-footer');

const ROOT = path.resolve(__dirname, '..');

function read(p) {
  return fs.readFileSync(p, 'utf8');
}

function write(p, c) {
  fs.writeFileSync(p, c, 'utf8');
}

function replaceFooterBlock(html, newFooter, classHint) {
  const re = new RegExp(
    `<footer[^>]*(?:${classHint})?[\\s\\S]*?<\\/footer>`,
    'i',
  );
  if (!re.test(html)) return null;
  return html.replace(re, newFooter);
}

function replaceAllFooters(html, newFooter) {
  return html.replace(/<footer[\s\S]*?<\/footer>/gi, newFooter);
}

function applyStaticPageFooters() {
  const standard = renderSiteFooter({ theme: 'royal' });
  const forest = renderSiteFooter({ theme: 'forest' });
  const filesRoyal = [
    'hall-galaxy.html',
    'buffet.html',
    'gallery.html',
    'directions.html',
    'reviews.html',
    'banquet.html',
    'partners/index.html',
  ];
  console.log('\nApplying unified footers:');
  for (const rel of filesRoyal) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) continue;
    let html = read(full);
    const updated = replaceAllFooters(html, standard);
    if (updated && updated !== html) {
      write(full, updated);
      console.log(`  ✓ ${rel}`);
    }
  }
  const qb = path.join(ROOT, 'queens-table/queens-box.html');
  if (fs.existsSync(qb)) {
    let html = read(qb);
    const updated = replaceAllFooters(html, forest);
    if (updated) {
      write(qb, updated);
      console.log('  ✓ queens-table/queens-box.html');
    }
  }
}

function applySpaFooters() {
  const homeFooter = renderSiteFooter({ theme: 'royal', spa: 'home' });
  const qtFooter = renderSiteFooter({ theme: 'forest', spa: 'qt' });
  for (const rel of ['index.html', 'queens-table.html']) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) continue;
    let html = read(full);
    const defRe = /<footer class="footer-default[\s\S]*?<\/footer>/;
    const qtRe = /<footer class="footer-qt[\s\S]*?<\/footer>/;
    if (!defRe.test(html) || !qtRe.test(html)) {
      console.warn(`  ⚠ SPA footer blocks not found: ${rel}`);
      continue;
    }
    html = html.replace(defRe, homeFooter);
    html = html.replace(qtRe, qtFooter);
    write(full, html);
    console.log(`  ✓ ${rel} (SPA footers)`);
  }
}

function applyDressShowCompactFooters() {
  const compact = renderSiteFooterCompact();
  // dress-show-2027.html: MUE 최종본 — 푸터·홈 링크 자동 삽입 금지 (main 수동 유지)
  for (const rel of ['dress-show.html', 'dress-show2.html']) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) continue;
    let html = read(full);
    if (html.includes(`data-site-footer="${FOOTER_VERSION}"`)) {
      console.log(`  · ${rel} (footer already patched)`);
      continue;
    }
    const marker = '<script src="/chatbot/embed.js"';
    if (!html.includes(marker)) continue;
    html = html.replace(marker, `${compact}\n${marker}`);
    write(full, html);
    console.log(`  ✓ ${rel} (compact footer)`);
  }
}

function applySiteFooters() {
  applyStaticPageFooters();
  applySpaFooters();
  applyDressShowCompactFooters();
}

module.exports = { applySiteFooters };

if (require.main === module) applySiteFooters();
