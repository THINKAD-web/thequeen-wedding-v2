#!/usr/bin/env node
/** Update Queens Box preview copy on queens-table (+ index if present). */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const PREVIEW_OLD = `        <h2 class="reveal rd-1 font-serif text-4xl leading-tight text-forest-900 sm:text-5xl">QUEEN'S BOX [HOME PARTY]</h2>
        <p class="reveal rd-2 mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">퀸즈테이블의 고품격 요리를 그대로 담아, 원하는 곳에서 즐기는 프리미엄 케이터링 서비스</p>
        <p class="reveal rd-3 mt-3 text-sm text-slate-500">기업 야유회 · 사내 워크숍 · 가정 내 특별한 기념일</p>`;

const PREVIEW_NEW = `        <h2 class="reveal rd-1 font-serif text-4xl leading-tight text-forest-900 sm:text-5xl">퀸즈 박스 · 홈파티</h2>
        <p class="reveal rd-2 mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">홈파티용 프리미엄 케이터링입니다. 고기·회·반찬 등을 포장해 드리며, <strong class="font-semibold text-forest-900">픽업 또는 배달</strong>로 받으실 수 있습니다. 집에서 바로 즐기실 수 있게 준비해 드립니다.</p>
        <p class="reveal rd-3 mt-3 text-sm text-slate-500">2026년 7월 출시 · 매장 뷔페(퀸즈 블루·로얄)와 기업·단체 케이터링도 같은 건물에서 이용하실 수 있습니다.</p>`;

const CARD_BLOCK_OLD = /      <div class="reveal rd-4 card-lift mx-auto max-w-4xl[\s\S]*?      <\/div>\n    <\/div>\n  <\/section>\n\n  <!-- QT REVIEWS -->/;

const CARD_BLOCK_NEW = `      <div class="reveal rd-4 card-lift mx-auto max-w-4xl rounded-sm border border-gold/25 bg-white p-8 shadow-xl shadow-forest-900/10 sm:p-10">
        <p class="text-center text-sm text-slate-600">세트 구성·주문 방법은 전화·카카오톡으로 안내드립니다.</p>
        <div class="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href="/dining/queens-box-launch" class="inline-flex items-center gap-2 rounded-full border border-forest-900/20 px-6 py-3 text-sm font-semibold text-forest-900 hover:bg-forest-900 hover:text-white">출시 소식 보기</a>
          <a href="/queens-table/queens-box" class="btn-shimmer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-forest-900 to-forest-700 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-forest-900/20 transition hover:-translate-y-0.5">
            <span class="relative">퀸즈 박스 안내</span>
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
          <a data-qt="cta-catering" href="tel:054-281-4000" class="inline-flex items-center gap-2 rounded-full border-2 border-forest-900 bg-white px-8 py-4 text-sm font-semibold text-forest-900 transition hover:bg-forest-900 hover:text-white">
            <span class="relative">📞 054-281-4000</span>
          </a>
          <a href="https://pf.kakao.com/_rbxopG/chat" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm font-semibold text-royal-700 hover:text-gold">카카오톡 문의</a>
        </div>
      </div>
    </div>
  </section>

  <!-- QT REVIEWS -->`;

function patchFile(rel) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) return false;
  let html = fs.readFileSync(full, 'utf8');
  if (!html.includes('queens-box-preview')) return false;
  html = html.replace(PREVIEW_OLD, PREVIEW_NEW);
  if (CARD_BLOCK_OLD.test(html)) {
    html = html.replace(CARD_BLOCK_OLD, CARD_BLOCK_NEW);
  }
  fs.writeFileSync(full, html, 'utf8');
  return true;
}

function patchQueensBoxContent() {
  console.log('\nPatching Queens Box preview:');
  for (const rel of ['queens-table.html', 'index.html']) {
    if (patchFile(rel)) console.log(`  ✓ ${rel}`);
  }
  patchQueensBoxDetailPage();
}

function patchQueensBoxDetailPage() {
  const full = path.join(ROOT, 'queens-table/queens-box.html');
  if (!fs.existsSync(full)) return;
  let html = fs.readFileSync(full, 'utf8');
  html = html.replace(
    '<p class="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">퀸즈테이블의 고품격 요리를 그대로 담아, 원하는 곳에서 즐기는 프리미엄 케이터링 서비스</p>',
    '<p class="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">홈파티용 프리미엄 케이터링입니다. 포장 후 픽업하거나 배달해 드리며, 고기·회·반찬 등을 집에서 바로 즐기실 수 있게 담아 드립니다. 2026년 7월부터 이용하실 수 있습니다.</p>',
  );
  // Restore launch promo table (prices from original page — not CC post-promo swap)
  html = html.replace(
    '<span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">런칭 기념 할인 · 종료 (2026.07.01–08.31)</span>',
    '<span class="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">런칭 기념 특별 할인가 · 2026.07.01 ~ 08.31</span>',
  );
  html = html.replace(
    '<th class="px-5 py-4 text-right font-semibold text-forest-900">가격</th>',
    '<th class="px-5 py-4 text-right font-semibold text-forest-900">런칭 행사가</th>',
  );
  html = html.replace(
    '<td class="px-5 py-5 text-right align-top"><span class="font-serif text-2xl font-semibold text-forest-900">450,000<span class="text-base">원</span></span></td>',
    '<td class="px-5 py-5 text-right align-top"><span class="font-serif text-2xl font-semibold text-forest-900">380,000<span class="text-base">원</span></span></td>',
  );
  html = html.replace(
    '<td class="px-5 py-5 text-right align-top"><span class="font-serif text-2xl font-semibold text-forest-900">650,000<span class="text-base">원</span></span></td>',
    '<td class="px-5 py-5 text-right align-top"><span class="font-serif text-2xl font-semibold text-forest-900">580,000<span class="text-base">원</span></span></td>',
  );
  html = html.replace(
    '<td class="px-5 py-5 text-right align-top"><span class="font-serif text-2xl font-semibold text-forest-900">850,000<span class="text-base">원</span></span></td>',
    '<td class="px-5 py-5 text-right align-top"><span class="font-serif text-2xl font-semibold text-forest-900">780,000<span class="text-base">원</span></span></td>',
  );
  fs.writeFileSync(full, html, 'utf8');
  console.log('  ✓ queens-table/queens-box.html (detail copy)');
}

module.exports = { patchQueensBoxContent };

if (require.main === module) patchQueensBoxContent();
