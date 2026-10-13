/**
 * Single source for primary site navigation (desktop header + footer corporate links).
 * @param {string|null} activeKey - 'home' | 'queens-table' | 'news' | 'banquet' | 'dress-show'
 */

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
      <a href="tel:054-283-1111" class="header-cta btn-shimmer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-royal-900 to-royal-700 px-6 py-2.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-royal-900/20 transition hover:-translate-y-0.5">
        <span class="relative">상담 예약</span>
      </a>
    </nav>`;
}

function renderFooterCorporateNav() {
  return FOOTER_CORPORATE_LINKS.map(
    (l) => `<a href="${l.href}" class="hover:text-gold transition">${l.label}</a>`,
  ).join('\n      ');
}

/** Regex-friendly block for replacing legacy headers in standalone HTML. */
function renderDesktopNavInnerOnly(activeKey = null) {
  const links = DESKTOP_NAV_ITEMS.map(
    (item) =>
      `      <a href="${item.href}" class="${navLinkClass(item, activeKey)}">${item.label}</a>`,
  ).join('\n');

  return `${links}
      <a href="tel:054-283-1111" class="header-cta btn-shimmer inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-royal-900 to-royal-700 px-6 py-2.5 text-xs font-semibold tracking-wide text-white shadow-lg shadow-royal-900/20 transition hover:-translate-y-0.5">
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
};
