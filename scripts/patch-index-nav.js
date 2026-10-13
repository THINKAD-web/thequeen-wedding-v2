#!/usr/bin/env node
/** Patch index.html desktop/mobile nav + footer + numeric font (large file safe). */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const indexPath = path.join(ROOT, 'index.html');

const DESKTOP_NAV = `    <nav class="hidden lg:flex items-center gap-5 xl:gap-7">
      <a href="#" data-page="home" class="nav-page nav-link text-sm font-semibold text-slate-700 hover:text-royal-900">더퀸 웨딩</a>
      <a href="#" data-page="queens-table" class="nav-page nav-link text-sm font-semibold text-slate-700 hover:text-forest-900">퀸즈 테이블</a>
      <a href="/news" class="nav-link text-sm font-semibold text-slate-700 hover:text-royal-900">스토리</a>
      <a href="/banquet" class="nav-link text-sm font-semibold text-slate-700 hover:text-royal-900">기업·단체 연회</a>
      <a href="/dress-show" class="nav-link text-sm font-semibold text-slate-700 hover:text-royal-900">2026 S/S 드레스 쇼</a>
      <a href="tel:054-283-1111" class="header-cta btn-shimmer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-royal-900 to-royal-700 px-6 py-2.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-royal-900/20 transition hover:-translate-y-0.5">
        <span class="relative">상담 예약</span>
      </a>
    </nav>`;

function patchIndexNav() {
  let html = fs.readFileSync(indexPath, 'utf8');

  html = html.replace(
    /<nav class="hidden lg:flex items-center gap-[^"]*">[\s\S]*?<\/nav>/,
    DESKTOP_NAV,
  );

  // Remove mobile entries for partners/press if present
  html = html.replace(
    /\s*<a href="\/partners" class="group flex items-center[\s\S]*?<\/a>\s*<a href="\/press" class="group flex items-center[\s\S]*?<\/a>/,
    '',
  );
  const mobileBanquet = `
    <a href="/banquet" class="group flex items-center justify-between border-b border-gold/15 py-5">
      <span><span class="block text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">Corporate</span><span class="mt-1 block font-serif text-3xl text-royal-900">기업·단체 연회</span></span>
      <svg class="h-5 w-5 text-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
    </a>`;

  if (!html.includes('href="/banquet" class="group flex items-center justify-between border-b border-gold/15 py-5"')) {
    html = html.replace(
      /(<a href="\/news" class="group flex items-center justify-between border-b border-gold\/15 py-5">[\s\S]*?<\/a>)\s*(<a href="#" data-page="queens-table")/,
      `$1\n${mobileBanquet}\n    $2`,
    );
  }

  // Footer quick links: remove legacy /press, add /news/press tab
  html = html.replace(
    /<li><a href="\/press" class="hover:text-gold transition">언론보도<\/a><\/li>\s*/g,
    '',
  );
  if (!html.includes('href="/news/press" class="hover:text-gold transition">언론보도')) {
    html = html.replace(
      '<li><a href="/partners" class="hover:text-gold transition">협약 안내</a></li>',
      '<li><a href="/partners" class="hover:text-gold transition">협약 안내</a></li>\n          <li><a href="/news/press" class="hover:text-gold transition">언론보도</a></li>',
    );
  }

  if (!html.includes('font-variant-numeric: lining-nums') && html.includes('.nav-link:hover::after')) {
    html = html.replace(
      '.nav-link:hover::after, .nav-link.active::after { width: 100%; }',
      '.nav-link:hover::after, .nav-link.active::after { width: 100%; }\n  .font-serif, .card-lift h3 { font-variant-numeric: lining-nums; font-feature-settings: "lnum" 1; }',
    );
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('  ✓ index.html (nav patch)');
}

module.exports = { patchIndexNav };

if (require.main === module) patchIndexNav();
