/**
 * Unified site footer — single source for visitor pages.
 * @see data/site-nav.js for primary nav items
 */

const { DESKTOP_NAV_ITEMS, FOOTER_CORPORATE_LINKS } = require('./site-nav');
const {
  INSTAGRAM_WEDDING_URL,
  INSTAGRAM_WEDDING_HANDLE,
  INSTAGRAM_QT_URL,
  INSTAGRAM_QT_HANDLE,
} = require('./site-social');
const {
  SITE_NAME_EN,
  SITE_NAME_KO_ALT,
  QUEENS_TABLE_NAME_EN,
  QUEENS_TABLE_NAME_KO_ALT,
  HALL_PHONE,
  HALL_PHONE_TEL,
  QT_PHONE,
  QT_PHONE_TEL,
} = require('./site-brand');

const FOOTER_VERSION = 'v1';
const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_rbxopG/chat';
const NAVER_WEDDING = 'https://naver.me/5xjpTXe1';
const NAVER_QT = 'https://naver.me/5xajUCDf';

const FOOTER_ADDRESS_WEDDING = '경북 포항시 남구 대이로 18';
const FOOTER_ADDRESS_QT = '경북 포항시 남구 대이로 18 3층';

/** Not rendered until verified === true and fields filled. */
const business_info = {
  verified: false,
  company_name: '',
  representative: '',
  biz_reg_no: '',
  address: '',
  phone: '',
  ecommerce_no: '',
  email: '',
};

function renderBusinessInfoLine() {
  if (!business_info.verified) return '';
  const parts = [
    business_info.company_name,
    business_info.representative ? `대표 ${business_info.representative}` : '',
    business_info.biz_reg_no ? `사업자등록번호 ${business_info.biz_reg_no}` : '',
    business_info.address,
  ].filter(Boolean);
  let line = parts.join(' | ');
  if (business_info.ecommerce_no) {
    line += line ? ` · 통신판매업 ${business_info.ecommerce_no}` : `통신판매업 ${business_info.ecommerce_no}`;
  }
  if (!line) return '';
  return `<p class="mt-4 text-xs text-white/45">${line}</p>`;
}

function footerQuickLinksStatic() {
  const main = DESKTOP_NAV_ITEMS.map(
    (i) => `<li><a href="${i.href}" class="hover:text-gold transition">${i.label}</a></li>`,
  ).join('\n          ');
  const corp = FOOTER_CORPORATE_LINKS.map(
    (l) => `<li><a href="${l.href}" class="hover:text-gold transition">${l.label}</a></li>`,
  ).join('\n          ');
  return `${main}
          <li><a href="/hall-galaxy" class="hover:text-gold transition">홀 안내</a></li>
          <li><a href="/gallery" class="hover:text-gold transition">갤러리</a></li>
          <li><a href="/directions" class="hover:text-gold transition">오시는 길</a></li>
          <li><a href="/#contact" class="hover:text-gold transition">상담 예약</a></li>
          ${corp}`;
}

function footerQuickLinksSpaHome() {
  return `<li><a href="#" data-page="home" class="nav-page hover:text-gold transition">웨딩 소개</a></li>
          <li><a href="#" data-page="home" class="nav-page hover:text-gold transition">홀 안내</a></li>
          <li><a href="#" data-page="home" class="nav-page hover:text-gold transition">갤러리</a></li>
          <li><a href="#" data-page="home" class="nav-page hover:text-gold transition">오시는 길</a></li>
          <li><a href="#" data-page="home" class="nav-page hover:text-gold transition">상담 예약</a></li>
          <li><a href="/banquet" class="hover:text-gold transition">기업·단체 연회</a></li>
          <li><a href="/partners" class="hover:text-gold transition">협약 안내</a></li>
          <li><a href="/news/press" class="hover:text-gold transition">언론보도</a></li>
          <li><a href="/dress-show" class="hover:text-gold transition">2026 S/S 드레스 쇼</a></li>`;
}

function renderPhoneBlockWedding() {
  return `<div class="space-y-3">
        <div>
          <a href="${HALL_PHONE_TEL}" class="font-serif text-xl text-white hover:text-gold">${HALL_PHONE}</a>
          <div class="mt-0.5 text-xs text-white/50">웨딩·연회</div>
        </div>
        <div>
          <a href="${QT_PHONE_TEL}" class="font-serif text-xl text-white hover:text-gold">${QT_PHONE}</a>
          <div class="mt-0.5 text-xs text-white/50">퀸즈테이블</div>
        </div>
      </div>`;
}

/** Standard 4-column footer (static pages + queens-box). */
function renderSiteFooter(options = {}) {
  const theme = options.theme === 'forest' ? 'forest' : 'royal';
  const spa = options.spa || null;
  const bg = theme === 'forest' ? 'bg-forest-900' : 'bg-royal-900';
  const extraClass = spa === 'home' ? 'footer-default relative' : spa === 'qt' ? 'footer-qt relative' : '';
  const quickLinks = spa === 'home' ? footerQuickLinksSpaHome() : footerQuickLinksStatic();
  const bizLine = renderBusinessInfoLine();

  const brandCol =
    theme === 'forest'
      ? `<div class="lg:col-span-1">
        <div class="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">${QUEENS_TABLE_NAME_EN.toUpperCase()}</div>
        <div class="mt-2 font-serif text-2xl">${QUEENS_TABLE_NAME_KO_ALT}</div>
        <p class="mt-6 text-sm leading-relaxed text-white/70">
          프리미엄 뷔페 · 퀸즈 블루/로얄<br>
          ${SITE_NAME_KO_ALT} 웨딩 3층 · 100% 예약제
        </p>
        <a href="${NAVER_QT}" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-[11px] font-semibold text-gold hover:bg-gold hover:text-forest-900 transition">
          <span class="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-gold text-forest-900 text-[9px] font-bold">N</span> 네이버 플레이스
        </a>
        <a href="${INSTAGRAM_QT_URL}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-2 text-sm text-white/75 hover:text-gold transition" aria-label="Instagram · ${INSTAGRAM_QT_HANDLE}">
          <span aria-hidden="true">📷</span> Instagram <span class="font-medium">${INSTAGRAM_QT_HANDLE}</span>
        </a>
      </div>`
      : `<div class="lg:col-span-1">
        <div class="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">${SITE_NAME_EN}</div>
        <div class="mt-2 font-serif text-2xl">${SITE_NAME_KO_ALT} 웨딩</div>
        <p class="mt-6 text-sm leading-relaxed text-white/70">
          갤럭시홀 &amp; 크라운홀 단독 운영.<br>
          2025 리모델링 완공.
        </p>
        <a href="${NAVER_WEDDING}" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-[11px] font-semibold text-gold hover:bg-gold hover:text-royal-900 transition">
          <span class="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-gold text-royal-900 text-[9px] font-bold">N</span> 네이버 플레이스
        </a>
        <a href="${INSTAGRAM_WEDDING_URL}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-2 text-sm text-white/75 hover:text-gold transition" aria-label="Instagram · ${INSTAGRAM_WEDDING_HANDLE}">
          <span aria-hidden="true">📷</span> Instagram <span class="font-medium">${INSTAGRAM_WEDDING_HANDLE}</span>
        </a>
      </div>`;

  const contactCol =
    theme === 'forest'
      ? `<div>
        <div class="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold mb-4">Reservation</div>
        <a href="${QT_PHONE_TEL}" class="font-serif text-2xl text-white hover:text-gold">${QT_PHONE}</a>
        <div class="mt-1 text-xs text-white/50">퀸즈테이블 · 퀸즈 박스 · 케이터링</div>
        <div class="mt-6 text-sm text-white/80">${FOOTER_ADDRESS_QT}</div>
        <a href="${KAKAO_CHANNEL_URL}" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex text-sm text-gold hover:text-white">카카오톡 채널</a>
      </div>`
      : `<div>
        <div class="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold mb-4">Contact</div>
        ${renderPhoneBlockWedding()}
        <div class="mt-6 text-sm text-white/80">${FOOTER_ADDRESS_WEDDING}</div>
        <div class="mt-4 text-xs text-white/60">평일 09:00 – 18:00 · 주말 상담 예약 가능</div>
        <a href="${KAKAO_CHANNEL_URL}" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex text-sm text-gold hover:text-white">카카오톡 채널</a>
      </div>`;

  const crossCol =
    theme === 'forest'
      ? `<div>
        <div class="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold mb-4">${SITE_NAME_EN}</div>
        <div class="font-serif text-xl text-white">${SITE_NAME_KO_ALT} 웨딩</div>
        <p class="mt-3 text-sm text-white/70">크라운홀 · 갤럭시홀 · 기업·단체 연회</p>
        <a href="${HALL_PHONE_TEL}" class="mt-5 block font-serif text-lg text-gold hover:text-white">${HALL_PHONE}</a>
        <div class="text-xs text-white/50">웨딩·연회</div>
        <a href="/" class="mt-2 inline-flex text-xs text-white/70 hover:text-gold">${SITE_NAME_EN} 메인 →</a>
      </div>`
      : `<div>
        <div class="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold mb-4">${QUEENS_TABLE_NAME_EN}</div>
        <div class="font-serif text-xl text-white">${QUEENS_TABLE_NAME_KO_ALT} · 퀸즈 박스</div>
        <p class="mt-3 text-sm text-white/70">매장 뷔페 · 홈파티 케이터링</p>
        <a href="${QT_PHONE_TEL}" class="mt-5 block font-serif text-lg text-gold hover:text-white">${QT_PHONE}</a>
        <div class="text-xs text-white/50">퀸즈테이블</div>
        <a href="/queens-table" class="mt-2 inline-flex text-xs text-white/70 hover:text-gold">${QUEENS_TABLE_NAME_EN} 페이지 →</a>
      </div>`;

  const bottomLine =
    theme === 'forest'
      ? `${FOOTER_ADDRESS_QT} · ${QT_PHONE}`
      : `${FOOTER_ADDRESS_WEDDING} · 웨딩·연회 ${HALL_PHONE} · 퀸즈테이블 ${QT_PHONE}`;
  const copyright =
    theme === 'forest'
      ? `© 2026 ${QUEENS_TABLE_NAME_EN}. All rights reserved.`
      : `© 2026 ${SITE_NAME_EN}. All rights reserved.`;

  return `<footer class="${extraClass} ${bg} text-white mt-auto" data-site-footer="${FOOTER_VERSION}" data-site-footer-layout="standard" data-site-footer-theme="${theme}">
  <div class="mx-auto max-w-7xl px-6 py-16">
    <div class="grid gap-12 lg:grid-cols-4">
      ${brandCol}
      ${contactCol}
      <div>
        <div class="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold mb-4">Quick Links</div>
        <ul class="space-y-3 text-sm text-white/80">
          ${quickLinks}
        </ul>
      </div>
      ${crossCol}
    </div>
    <div class="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-white/50">
      <div>${bottomLine}${bizLine ? '' : ''}</div>
      <div>${copyright}</div>
    </div>
    ${bizLine}
  </div>
</footer>`;
}

/** Dress-show campaign pages — same data, compact layout. */
function renderSiteFooterCompact() {
  const bizLine = renderBusinessInfoLine();
  return `<footer class="relative border-t border-white/10 bg-[#0A0506] px-6 py-6 text-center text-xs text-white/60" data-site-footer="${FOOTER_VERSION}" data-site-footer-layout="compact" data-site-footer-theme="royal">
  <p>${FOOTER_ADDRESS_WEDDING}</p>
  <p class="mt-2">웨딩·연회 <a href="${HALL_PHONE_TEL}" class="text-gold hover:text-white">${HALL_PHONE}</a> · 퀸즈테이블 <a href="${QT_PHONE_TEL}" class="text-gold hover:text-white">${QT_PHONE}</a></p>
  <p class="mt-2"><a href="${INSTAGRAM_WEDDING_URL}" target="_blank" rel="noopener noreferrer" class="text-gold hover:text-white">${INSTAGRAM_WEDDING_HANDLE}</a> · <a href="${KAKAO_CHANNEL_URL}" target="_blank" rel="noopener noreferrer" class="hover:text-white">카카오톡</a> · <a href="/" class="hover:text-white">홈</a></p>
  <p class="mt-3 text-white/40">© 2026 ${SITE_NAME_EN}. All rights reserved.</p>
  ${bizLine}
</footer>`;
}

/** Back-compat alias for corporate nav row (deprecated — use full footer). */
function renderFooterCorporateNav() {
  return FOOTER_CORPORATE_LINKS.map(
    (l) => `<a href="${l.href}" class="hover:text-gold transition">${l.label}</a>`,
  ).join('\n      ');
}

module.exports = {
  FOOTER_VERSION,
  business_info,
  renderSiteFooter,
  renderSiteFooterCompact,
  renderFooterCorporateNav,
};
