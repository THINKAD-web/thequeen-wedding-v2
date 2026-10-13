/**
 * Single source for primary site navigation (desktop header + footer corporate links).
 * @param {string|null} activeKey - 'home' | 'queens-table' | 'news' | 'banquet' | 'dress-show'
 */

const {
  HALL_PHONE,
  HALL_PHONE_TEL,
  SITE_NAME_EN,
} = require('./site-brand');

const DESKTOP_NAV_ITEMS = [
  { href: '/', label: '더퀸 웨딩', key: 'home', hover: 'royal' },
  { href: '/queens-table', label: '퀸즈 테이블', key: 'queens-table', hover: 'forest' },
  { href: '/news', label: '스토리', key: 'news', hover: 'royal' },
  { href: '/banquet', label: '기업·단체 연회', key: 'banquet', hover: 'royal' },
  { href: '/dress-show', label: '2026 S/S 드레스 쇼', key: 'dress-show', hover: 'royal' },
];

const FOOTER_CORPORATE_LINKS = [
  { href: '/banquet', label: '기업·단체 연회' },
  { href: '/partners', label: '협약 안내' },
  { href: '/news/press', label: '언론보도' },
];

function navLinkClass(item, activeKey) {
  const active = item.key === activeKey ? ' active' : '';
  const hover =
    item.hover === 'forest'
      ? 'text-slate-700 hover:text-forest-900'
      : 'text-slate-700 hover:text-royal-900';
  return `nav-link text-sm font-semibold ${hover}${active}`;
}

function renderDesktopNav(activeKey = null) {
  const links = DESKTOP_NAV_ITEMS.map(
    (item) =>
      `      <a href="${item.href}" class="${navLinkClass(item, activeKey)}">${item.label}</a>`,
  ).join('\n');

  return `<nav class="hidden lg:flex items-center gap-6 xl:gap-8">
${links}
      <a href="${HALL_PHONE_TEL}" class="header-cta btn-shimmer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-royal-900 to-royal-700 px-6 py-2.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-royal-900/20 transition hover:-translate-y-0.5">
        <span class="relative">상담 예약</span>
      </a>
    </nav>`;
}

const MOBILE_MENU_STYLES = `
  .menu-overlay { transform: translateX(100%); transition: transform .55s cubic-bezier(.7,0,.3,1); }
  .menu-overlay.open { transform: translateX(0); }`;

const MENU_BTN_SVG =
  '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>';
const MENU_CLOSE_SVG =
  '<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>';
const MENU_ARROW_SVG =
  '<svg class="h-5 w-5 text-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>';

function renderMobileMenuButton() {
  return `<button type="button" id="menuBtn" class="menu-btn lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-royal-900" aria-label="메뉴 열기" aria-expanded="false" aria-controls="menuOverlay">${MENU_BTN_SVG}</button>`;
}

function renderMobileHeaderActions() {
  return `<div class="flex items-center gap-2 lg:hidden">
    ${renderMobileMenuButton()}
    <a href="${HALL_PHONE_TEL}" class="shrink-0 rounded-full bg-royal-900 px-3 py-2 text-xs font-semibold text-white">상담</a>
  </div>`;
}

function mobileMenuLinkRow(opts) {
  const { href, labelEn, labelKo, labelClass = 'text-royal-900', extraClass = '' } = opts;
  return `<a href="${href}" class="group flex items-center justify-between border-b border-gold/15 py-5 ${extraClass}">
      <span><span class="block text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">${labelEn}</span><span class="mt-1 block font-serif text-3xl ${labelClass}">${labelKo}</span></span>
      ${MENU_ARROW_SVG}
    </a>`;
}

/** Static pages: real hrefs (matches home SPA mobile menu items). */
function renderMobileMenuOverlayStatic() {
  const rows = [
    mobileMenuLinkRow({ href: '/', labelEn: 'Wedding Hall', labelKo: '더퀸 웨딩' }),
    mobileMenuLinkRow({ href: '/news', labelEn: 'The Queen Stories', labelKo: '스토리' }),
    mobileMenuLinkRow({ href: '/banquet', labelEn: 'Corporate', labelKo: '기업·단체 연회' }),
    mobileMenuLinkRow({
      href: '/queens-table',
      labelEn: '3F Premium Dining',
      labelKo: '퀸즈 테이블',
      labelClass: 'text-forest-900',
    }),
    mobileMenuLinkRow({ href: '/dress-show', labelEn: '2026 S/S', labelKo: '드레스 쇼' }),
  ].join('\n    ');

  return `<!-- MOBILE MENU -->
<div id="menuOverlay" class="menu-overlay fixed inset-0 z-[60] bg-cream-50 lg:hidden" role="dialog" aria-modal="true" aria-label="사이트 메뉴" tabindex="-1">
  <div class="flex items-center justify-between border-b border-gold/20 px-6 py-4">
    <span class="font-serif text-2xl text-royal-900">${SITE_NAME_EN}</span>
    <button type="button" id="menuClose" class="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-royal-900" aria-label="메뉴 닫기">${MENU_CLOSE_SVG}</button>
  </div>
  <nav class="flex flex-col gap-2 px-6 py-8">
    ${rows}
    <a href="${HALL_PHONE_TEL}" class="mt-6 btn-shimmer inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-royal-900 to-royal-700 px-8 py-4 text-sm font-semibold text-white shadow-lg">
      📞 ${HALL_PHONE} 상담 예약
    </a>
  </nav>
</div>`;
}

const MOBILE_NAV_SCRIPT = '<script src="/site-mobile-nav.js" defer></script>';

function renderFooterCorporateNav() {
  return require('./site-footer').renderFooterCorporateNav();
}

/** Regex-friendly block for replacing legacy headers in standalone HTML. */
function renderDesktopNavInnerOnly(activeKey = null) {
  const links = DESKTOP_NAV_ITEMS.map(
    (item) =>
      `      <a href="${item.href}" class="${navLinkClass(item, activeKey)}">${item.label}</a>`,
  ).join('\n');

  return `${links}
      <a href="${HALL_PHONE_TEL}" class="header-cta btn-shimmer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-royal-900 to-royal-700 px-6 py-2.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-royal-900/20 transition hover:-translate-y-0.5">
        <span class="relative">상담 예약</span>
      </a>`;
}

const SHARED_NUMERIC_STYLE = `
  .font-serif, .card-lift h3, h1.font-serif, h2.font-serif, h3.font-serif {
    font-variant-numeric: lining-nums;
    font-feature-settings: "lnum" 1;
  }`;

module.exports = {
  DESKTOP_NAV_ITEMS,
  FOOTER_CORPORATE_LINKS,
  renderDesktopNav,
  renderFooterCorporateNav,
  renderDesktopNavInnerOnly,
  SHARED_NUMERIC_STYLE,
  MOBILE_MENU_STYLES,
  renderMobileHeaderActions,
  renderMobileMenuOverlayStatic,
  MOBILE_NAV_SCRIPT,
};
