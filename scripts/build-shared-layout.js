#!/usr/bin/env node
/**
 * Wrap legacy minimal pages with shared header/footer from data/site-nav.js
 */

const fs = require('fs');
const path = require('path');
const {
  renderDesktopNav,
  SHARED_NUMERIC_STYLE,
  MOBILE_MENU_STYLES,
  renderMobileHeaderActions,
  renderMobileMenuOverlayStatic,
  MOBILE_NAV_SCRIPT,
} = require('../data/site-nav');
const { renderSiteFooter } = require('../data/site-footer');

const ROOT = path.resolve(__dirname, '..');

const TAILWIND_HEAD = `
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Noto+Serif+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" rel="stylesheet">
<script>
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Noto Serif KR"', 'serif'],
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        royal: { 900: '#0A2A5E', 700: '#1E4A8C' },
        forest: { 900: '#1A3F2E', 700: '#2E6B4E' },
        gold: { DEFAULT: '#C9A96A', light: '#E0C896', deep: '#A8884A' },
        cream: { 50: '#FFFDF9', 100: '#FAF6EC', 200: '#F5EFE0' },
      },
    },
  },
};
</script>
<style>
  html { scroll-behavior: smooth; }
  body { font-family: Pretendard, Inter, system-ui, sans-serif; background: #FFFDF9; color: #475569; }
  .font-serif { font-family: 'Cormorant Garamond', 'Noto Serif KR', serif; }
  .header-glass { backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); background: rgba(255,253,249,.92); border-bottom: 1px solid rgba(201,169,106,.18); }
  .nav-link { position: relative; }
  .nav-link::after { content: ''; position: absolute; left: 0; bottom: -6px; height: 1px; width: 0; background: #C9A96A; transition: width .35s ease; }
  .nav-link:hover::after, .nav-link.active::after { width: 100%; }
  .card-lift { transition: transform .5s ease, box-shadow .5s ease; }
  .btn-shimmer { position: relative; overflow: hidden; }
${SHARED_NUMERIC_STYLE}
${MOBILE_MENU_STYLES}
</style>`;

const FOOTER_SCRIPTS = `
<script>(function(){try{fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:location.pathname,ref:document.referrer||'',title:document.title||'',ua:navigator.userAgent||''}),keepalive:true}).catch(function(){});}catch(e){}})();</script>
${MOBILE_NAV_SCRIPT}
<script src="/chatbot/embed.js" defer></script>
<a href="https://pf.kakao.com/_rbxopG/chat" target="_blank" rel="noopener noreferrer" aria-label="카카오톡 상담" style="position:fixed;bottom:24px;right:24px;z-index:9990;width:52px;height:52px;border-radius:50%;background:#FEE500;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.2);text-decoration:none;">
  <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13 0C5.82 0 0 4.7 0 10.5c0 3.73 2.33 7.01 5.84 8.93L4.42 24l6.1-3.24c.81.12 1.64.19 2.48.19 7.18 0 13-4.7 13-10.5S20.18 0 13 0z" fill="#3A1D1D"/></svg>
</a>`;

function extractHeadMeta(html) {
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '더퀸 웨딩홀';
  const desc =
    (html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || '';
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/i) || [])[1] || '';
  const jsonLd = (html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i) || [])[1];
  const ogBlock = html.match(/<meta property="og:[^"]+"[^>]+>/gi);
  const twitterBlock = html.match(/<meta name="twitter:[^"]+"[^>]+>/gi);
  const verification = html.match(/<meta name="(?:naver|google)-site-verification"[^>]+>/gi);
  return { title, desc, canonical, jsonLd, ogBlock, twitterBlock, verification };
}

function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return null;
  let inner = m[1].trim();
  if (!inner.includes('pt-24') && !inner.includes('pt-28')) {
    inner = inner.replace(/^<div/, '<div class="mx-auto max-w-3xl px-6 py-8 lg:py-12"');
    if (!inner.startsWith('<div class="mx-auto')) {
      inner = `<div class="mx-auto max-w-3xl px-6 py-8 lg:py-12">${inner}</div>`;
    }
  }
  return inner;
}

function renderFooter() {
  return renderSiteFooter({ theme: 'royal' });
}

function wrapLegacyPage(html, activeKey) {
  const meta = extractHeadMeta(html);
  const mainInner = extractMain(html);
  if (!mainInner) return null;

  const headExtra = [
    ...(meta.verification || []),
    meta.canonical ? `<link rel="canonical" href="${meta.canonical}">` : '',
    '<link rel="alternate" type="application/rss+xml" title="더퀸 웨딩홀 스토리" href="/rss.xml">',
    ...(meta.ogBlock || []),
    ...(meta.twitterBlock || []),
    meta.jsonLd ? `<script type="application/ld+json">${meta.jsonLd}</script>` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${meta.title}</title>
<meta name="description" content="${meta.desc.replace(/"/g, '&quot;')}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
${headExtra}
${TAILWIND_HEAD}
</head>
<body class="min-h-screen flex flex-col">
<header class="fixed top-0 left-0 right-0 z-50 header-glass">
  <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:py-5">
    <a href="/" class="flex flex-col items-start leading-none">
      <span class="text-[9px] font-semibold uppercase tracking-[0.32em] text-gold">The Queen's Legacy</span>
      <span class="font-serif text-2xl text-royal-900 tracking-wide">THE QUEEN</span>
    </a>
    ${renderDesktopNav(activeKey)}
    ${renderMobileHeaderActions()}
  </div>
</header>
${renderMobileMenuOverlayStatic()}
<main class="flex-1 pt-24 lg:pt-28">
${mainInner}
</main>
${renderFooter()}
${FOOTER_SCRIPTS}
</body>
</html>`;
}

const LEGACY_PAGES = [
  { file: 'buffet.html', activeKey: 'queens-table' },
  { file: 'gallery.html', activeKey: null },
  { file: 'directions.html', activeKey: null },
  { file: 'reviews.html', activeKey: null },
];

function applyLegacyLayout() {
  console.log('\nApplying shared layout to legacy pages:');
  for (const { file, activeKey } of LEGACY_PAGES) {
    const full = path.join(ROOT, file);
    const html = fs.readFileSync(full, 'utf8');
    if (html.includes('header-glass')) {
      console.log(`  · ${file} (already shared layout)`);
      continue;
    }
    const wrapped = wrapLegacyPage(html, activeKey);
    if (!wrapped) {
      console.warn(`  ⚠ could not wrap ${file}`);
      continue;
    }
    fs.writeFileSync(full, wrapped, 'utf8');
    console.log(`  ✓ ${file}`);
  }
}

function ensureMicroHomeLinks() {
  const patches = [
    {
      file: 'dress-show-2027.html',
      test: /href="\/"\s*class="[^"]*홈/,
      insertBefore: '<a href="#apply"',
      snippet:
        '    <a href="/" class="mr-4 text-xs font-semibold tracking-wide text-gold-light/90 hover:text-gold hidden sm:inline">홈으로</a>\n    ',
    },
    {
      file: 'dress-show2.html',
      test: /href="\/".*홈으로/,
      insertAfter: '<body',
      snippet: '', // handled below
    },
  ];

  for (const p of patches) {
    const full = path.join(ROOT, p.file);
    if (!fs.existsSync(full)) continue;
    let html = fs.readFileSync(full, 'utf8');
    if (p.file === 'dress-show-2027.html' && !p.test.test(html)) {
      html = html.replace(p.insertBefore, p.snippet + p.insertBefore);
      fs.writeFileSync(full, html, 'utf8');
      console.log(`  ✓ ${p.file} (home link)`);
    }
  }

  for (const file of ['dress-show2.html']) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) continue;
    let html = fs.readFileSync(full, 'utf8');
    if (!/href="\/"[^>]*>[^<]*홈/.test(html) && html.includes('<body')) {
      html = html.replace(
        /<body([^>]*)>/,
        `<body$1>\n<a href="/" class="fixed top-3 left-3 z-[9999] rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur hover:bg-black/80" rel="home">← 홈으로</a>`,
      );
      fs.writeFileSync(full, html, 'utf8');
      console.log(`  ✓ ${file} (home link)`);
    }
  }
}

module.exports = { applyLegacyLayout, ensureMicroHomeLinks, LEGACY_PAGES };

if (require.main === module) {
  applyLegacyLayout();
  ensureMicroHomeLinks();
}
