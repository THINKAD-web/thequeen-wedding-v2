#!/usr/bin/env node
/**
 * Seasonal menus/events: oEmbed cache, dining posts, queens-table section, detail pages.
 */

const fs = require('fs');
const path = require('path');
const { getSeasonalItems } = require('../data/seasonal-items');
const { INSTAGRAM_WEDDING_URL } = require('../data/site-social');
const {
  renderDesktopNav,
  MOBILE_MENU_STYLES,
  renderMobileHeaderActions,
  renderMobileMenuOverlayStatic,
  MOBILE_NAV_SCRIPT,
} = require('../data/site-nav');
const { renderSiteFooter } = require('../data/site-footer');
const { OG_SITE_NAME } = require('../data/site-brand');

const SITE_FOOTER_HTML = renderSiteFooter({ theme: 'royal' });

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');
const CACHE_PATH = path.join(ROOT, 'data', 'instagram-oembed-cache.json');
const SITE_URL = 'https://thequeenwedding.kr';
const LOGO_URL = 'https://i.ibb.co/kgTWvG08/2.jpg';

const TYPE_LABELS = { menu: '시즌 메뉴', event: '이벤트' };

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function writeFile(p, c) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, c, 'utf8');
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function parseDay(str) {
  if (!str) return null;
  const d = new Date(`${str}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isPublishedItem(item) {
  return item.published === true && item.verified === true;
}

function isActiveAt(item, at = new Date()) {
  if (!isPublishedItem(item)) return false;
  const now = startOfDay(at);
  const start = parseDay(item.period_start);
  const end = parseDay(item.period_end);
  if (start && now < startOfDay(start)) return false;
  if (end && now > startOfDay(end)) return false;
  return true;
}

function isEndedAt(item, at = new Date()) {
  if (!isPublishedItem(item)) return false;
  const end = parseDay(item.period_end);
  if (!end) return false;
  return startOfDay(at) > startOfDay(end);
}

function formatPeriodBadge(item) {
  if (!item.period_start && !item.period_end) return '';
  const a = item.period_start ? item.period_start.replace(/-/g, '.') : '…';
  const b = item.period_end ? item.period_end.replace(/-/g, '.') : '…';
  return `${a} – ${b}`;
}

function primaryImage(item) {
  const img = (item.images && item.images[0]) || LOGO_URL;
  return img.startsWith('http') ? img : `${SITE_URL}${img.startsWith('/') ? '' : '/'}${img}`;
}

function allowedInstagramUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url);
    if (!u.hostname.includes('instagram.com')) return null;
    if (!url.includes('thequeen_pohang') && !url.includes('queens_table.official')) return null;
    return url.split('?')[0];
  } catch {
    return null;
  }
}

async function refreshOembedCache(items) {
  let cache = {};
  try {
    cache = JSON.parse(readFile(CACHE_PATH));
  } catch {
    cache = {};
  }

  const urls = new Set();
  for (const item of items) {
    const u = allowedInstagramUrl(item.instagram_url);
    if (u) urls.add(u);
  }

  for (const url of urls) {
    if (cache[url]?.html) continue;
    const api = `https://graph.facebook.com/v25.0/instagram_oembed?url=${encodeURIComponent(url)}`;
    try {
      const res = await fetch(api, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        cache[url] = { ok: false, fetchedAt: new Date().toISOString() };
        continue;
      }
      const data = await res.json();
      cache[url] = {
        ok: true,
        html: data.html || null,
        fetchedAt: new Date().toISOString(),
      };
    } catch {
      cache[url] = { ok: false, fetchedAt: new Date().toISOString() };
    }
  }

  writeFile(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
  return cache;
}

function loadOembedCache() {
  try {
    return JSON.parse(readFile(CACHE_PATH));
  } catch {
    return {};
  }
}

function seasonalToPost(item, buildDate) {
  const slug = `seasonal-${item.id}`;
  const ended = isEndedAt(item, buildDate);
  const label = TYPE_LABELS[item.type] || item.type;
  const title =
    item.period_start && item.period_end
      ? `퀸즈테이블 ${formatPeriodBadge(item)} — ${item.title}`
      : item.title;
  const descParts = [label];
  if (item.summary) descParts.push(item.summary);
  if (item.price_note) descParts.push(item.price_note);
  const description = descParts.filter(Boolean).join(' · ') || item.title;

  return {
    seasonal: true,
    seasonalId: item.id,
    seasonalType: item.type,
    seasonalEnded: ended,
    title,
    description,
    date: item.period_start || item.period_end || buildDate.toISOString().slice(0, 10),
    category: 'dining',
    slug,
    thumbnail: primaryImage(item),
    keywords: ['seasonal', item.type],
    content: '',
    htmlContent: '',
    url: `/dining/${slug}`,
    canonical: `${SITE_URL}/dining/${slug}`,
    _item: item,
  };
}

function renderSeasonalListCard(post) {
  const item = post._item;
  const thumb = escapeHtml(post.thumbnail);
  const title = escapeHtml(post.title);
  const desc = escapeHtml(post.description);
  const label = TYPE_LABELS[item.type] || '시즌';
  const endedBadge = post.seasonalEnded
    ? '<span class="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">종료</span>'
    : '';
  const period = formatPeriodBadge(item);
  const periodHtml = period
    ? `<span class="mt-1 inline-block rounded-full border border-[#0A2A5E]/15 px-2 py-0.5 text-[10px] text-slate-600">${escapeHtml(period)}</span>`
    : '';

  return `
    <a href="${escapeHtml(post.url)}" class="card-lift group block overflow-hidden rounded-sm border border-[#0A2A5E]/10 bg-white shadow-md">
      <div class="aspect-video overflow-hidden bg-slate-100">
        <img src="${thumb}" alt="${title}" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy">
      </div>
      <div class="p-5">
        <span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A96A]">${escapeHtml(label)}${endedBadge}</span>
        ${periodHtml}
        <h3 class="mt-2 font-serif text-xl text-[#0A2A5E] line-clamp-2">${title}</h3>
        <p class="mt-3 text-sm text-slate-600 line-clamp-2">${desc}</p>
      </div>
    </a>`;
}

function renderQtSeasonalCard(item, cache) {
  const period = formatPeriodBadge(item);
  const img = escapeHtml(primaryImage(item));
  const title = escapeHtml(item.title);
  const summary = item.summary ? `<p class="mt-3 text-sm text-slate-600 line-clamp-2">${escapeHtml(item.summary)}</p>` : '';
  const tier = item.tier
    ? `<span class="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wider text-forest-700">${escapeHtml(item.tier)}</span>`
    : '';
  const price = item.price_note
    ? `<p class="mt-2 text-xs text-slate-500">${escapeHtml(item.price_note)}</p>`
    : '';
  const ig = allowedInstagramUrl(item.instagram_url);
  const igBtn = ig
    ? `<a href="${escapeHtml(ig)}" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-royal-700 hover:text-gold" aria-label="인스타그램에서 ${title} 보기">인스타그램에서 보기 →</a>`
    : '';
  const detail = `<a href="/dining/seasonal-${escapeHtml(item.id)}" class="mt-3 block text-sm font-semibold text-forest-800 hover:text-gold">자세히 보기 →</a>`;
  const endAttr = item.period_end ? ` data-seasonal-end="${escapeHtml(item.period_end)}"` : '';

  return `
    <article data-seasonal-card${endAttr} class="card-lift overflow-hidden rounded-sm border border-forest-700/15 bg-white shadow-md">
      <div class="aspect-video overflow-hidden bg-slate-100">
        <img src="${img}" alt="${title}" class="h-full w-full object-cover" loading="lazy">
      </div>
      <div class="p-5">
        <span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">${escapeHtml(TYPE_LABELS[item.type] || '')}</span>
        ${period ? `<span class="ml-2 rounded-full border border-forest-900/15 px-2 py-0.5 text-[10px] text-forest-900">${escapeHtml(period)}</span>` : ''}
        <h3 class="mt-2 font-serif text-2xl text-forest-900">${title}</h3>
        ${tier}${summary}${price}${detail}${igBtn}
      </div>
    </article>`;
}

function renderQtSeasonalSection(items, cache) {
  const active = items.filter((i) => isActiveAt(i));
  if (active.length === 0) {
    return `<!-- SEASONAL_SECTION_START -->
  <!-- (no active seasonal items) -->
<!-- SEASONAL_SECTION_END -->`;
  }

  const cards = active.map((i) => renderQtSeasonalCard(i, cache)).join('\n');

  return `<!-- SEASONAL_SECTION_START -->
  <section id="qt-seasonal" class="relative w-full overflow-hidden bg-gradient-to-b from-cream-100 to-cream-50 py-20 lg:py-28" data-seasonal-section>
    <div class="relative mx-auto max-w-7xl px-6">
      <div class="mb-12 text-center">
        <p class="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold">Seasonal</p>
        <h2 class="mt-4 font-serif text-4xl text-forest-900 sm:text-5xl">이달의 시즌 메뉴·행사</h2>
        <p class="mx-auto mt-4 max-w-xl text-sm text-slate-600">퀸즈테이블 시즌 소식입니다. 기간이 지난 메뉴는 <a href="/dining" class="font-semibold text-royal-700 underline underline-offset-2">더퀸 소식 · 퀸즈테이블</a> 탭에서 확인할 수 있습니다.</p>
        <p class="mt-3 text-sm"><a href="${INSTAGRAM_WEDDING_URL}" target="_blank" rel="noopener noreferrer" class="font-semibold text-royal-700 hover:text-gold">@thequeen_pohang</a></p>
      </div>
      <div id="seasonal-active-grid" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">${cards}
      </div>
    </div>
  </section>
  <script>
  (function(){
    var now = new Date(); now.setHours(0,0,0,0);
    document.querySelectorAll('[data-seasonal-end]').forEach(function(el){
      var end = el.getAttribute('data-seasonal-end');
      if (!end) return;
      var d = new Date(end + 'T23:59:59');
      if (d < now) el.hidden = true;
    });
    var section = document.querySelector('[data-seasonal-section]');
    var grid = document.getElementById('seasonal-active-grid');
    if (section && grid && !grid.querySelector('[data-seasonal-card]:not([hidden])')) section.hidden = true;
  })();
  </script>
<!-- SEASONAL_SECTION_END -->`;
}

function patchQueensTableSeasonal(sectionHtml) {
  const qtPath = path.join(ROOT, 'queens-table.html');
  let html = readFile(qtPath);
  const marker = /<!-- SEASONAL_SECTION_START -->[\s\S]*?<!-- SEASONAL_SECTION_END -->/;
  if (marker.test(html)) {
    html = html.replace(marker, sectionHtml.trim());
  } else {
    html = html.replace(
      '  <!-- LINEUP (Blue / Royal — 상시 운영) -->',
      `${sectionHtml.trim()}\n\n  <!-- LINEUP (Blue / Royal — 상시 운영) -->`,
    );
  }
  writeFile(qtPath, html);
}

function buildJsonLdEvent(item) {
  if (!item.period_start || !item.period_end) return '';
  const schemaType = item.type === 'menu' ? 'MenuItem' : 'Event';
  const base = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: item.title,
    description: item.summary || undefined,
    image: primaryImage(item),
  };
  if (schemaType === 'Event') {
    base.startDate = item.period_start;
    base.endDate = item.period_end;
    base.location = {
      '@type': 'Place',
      name: '퀸즈테이블',
      address: '경북 포항시 남구 대이로 18 3층',
    };
  }
  if (item.price_note) base.offers = { '@type': 'Offer', price: item.price_note, priceCurrency: 'KRW' };
  return `<script type="application/ld+json">${JSON.stringify(base)}</script>`;
}

function generateSeasonalDetailPages(items, cache) {
  const template = readFile(path.join(TEMPLATES, 'seasonal-detail.html'));
  const published = items.filter(isPublishedItem);

  for (const item of published) {
    const slug = `seasonal-${item.id}`;
    const ig = allowedInstagramUrl(item.instagram_url);
    const oembed = ig && cache[ig]?.html ? cache[ig].html : '';
    const label = TYPE_LABELS[item.type] || '';
    const period = formatPeriodBadge(item);
    const ended = isEndedAt(item) ? 'true' : 'false';

    let body = '';
    if (item.summary) body += `<p class="text-lg text-slate-700">${escapeHtml(item.summary)}</p>`;
    if (item.tier) body += `<p class="mt-4 text-sm font-semibold text-forest-800">${escapeHtml(item.tier)}</p>`;
    if (item.price_note) body += `<p class="mt-2 text-sm text-slate-600">${escapeHtml(item.price_note)}</p>`;
    if (period) body += `<p class="mt-4 text-sm text-slate-500">기간: ${escapeHtml(period)}</p>`;

    const igLink = ig
      ? `<a href="${escapeHtml(ig)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center rounded-full border border-royal-900/20 px-6 py-2.5 text-sm font-semibold text-royal-900 hover:bg-royal-900 hover:text-white">인스타그램에서 보기</a>`
      : '';

    const embedBlock = oembed
      ? `<div class="mt-8 not-prose"><button type="button" id="ig-embed-open" class="rounded-full bg-gradient-to-r from-royal-900 to-royal-700 px-6 py-2.5 text-sm font-semibold text-white" aria-label="인스타그램 게시물 미리보기 열기">인스타그램 미리보기 열기</button><script type="application/json" id="ig-oembed-data">${JSON.stringify({ html: oembed })}</script><div id="ig-embed-host" class="mt-4 hidden"></div></div>`
      : '';

    const jsonLd = buildJsonLdEvent(item);

    const html = template
      .split('{{DESKTOP_NAV}}')
      .join(renderDesktopNav('queens-table'))
      .split('{{MOBILE_MENU_STYLES}}')
      .join(MOBILE_MENU_STYLES)
      .split('{{MOBILE_HEADER_ACTIONS}}')
      .join(renderMobileHeaderActions())
      .split('{{MOBILE_MENU_OVERLAY}}')
      .join(renderMobileMenuOverlayStatic())
      .split('{{MOBILE_NAV_SCRIPT}}')
      .join(MOBILE_NAV_SCRIPT)
      .split('{{OG_SITE_NAME}}')
      .join(OG_SITE_NAME)
      .split('{{SITE_FOOTER}}')
      .join(SITE_FOOTER_HTML)
      .split('{{TITLE}}')
      .join(escapeHtml(item.title))
      .split('{{DESCRIPTION}}')
      .join(escapeHtml(item.summary || item.title))
      .split('{{CANONICAL}}')
      .join(`${SITE_URL}/dining/${slug}`)
      .split('{{OG_IMAGE}}')
      .join(escapeHtml(primaryImage(item)))
      .split('{{TYPE_LABEL}}')
      .join(escapeHtml(label))
      .split('{{PERIOD}}')
      .join(escapeHtml(period))
      .split('{{ENDED_BADGE}}')
      .join(
        ended === 'true'
          ? '<span class="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">종료</span>'
          : '',
      )
      .split('{{HERO_IMAGE}}')
      .join(
        item.images?.length
          ? `<img src="${escapeHtml(primaryImage(item))}" alt="${escapeHtml(item.title)}" class="w-full rounded-sm object-cover max-h-[420px]" loading="eager">`
          : '',
      )
      .split('{{BODY}}')
      .join(body)
      .split('{{IG_ACTIONS}}')
      .join(`${igLink}${embedBlock}`)
      .split('{{JSON_LD_EXTRA}}')
      .join(jsonLd);

    writeFile(path.join(ROOT, 'dining', `${slug}.html`), html);
    console.log(`  ✓ dining/${slug}.html`);
  }
}

function renderStoriesInstagramBar() {
  return `<p class="mx-auto mt-6 max-w-xl text-center text-sm text-slate-600">
      소식은 이 페이지가 기준이며, 인스타그램 <a href="${INSTAGRAM_WEDDING_URL}" target="_blank" rel="noopener noreferrer" class="font-semibold text-royal-700 hover:text-gold">@thequeen_pohang</a>에서도 만나보실 수 있습니다.
    </p>`;
}

async function buildSeasonal(options = {}) {
  const items = getSeasonalItems();
  const buildDate = options.buildDate ? new Date(options.buildDate) : new Date();

  console.log('\nSeasonal / Instagram build:');
  await refreshOembedCache(items);
  const cache = loadOembedCache();

  const section = renderQtSeasonalSection(items, cache);
  patchQueensTableSeasonal(section);

  generateSeasonalDetailPages(items, cache);

  const posts = items.filter(isPublishedItem).map((i) => seasonalToPost(i, buildDate));
  console.log(`  ✓ queens-table seasonal section (${items.filter(isActiveAt).length} active)`);
  return { seasonalPosts: posts, renderSeasonalListCard, storiesInstagramBar: renderStoriesInstagramBar() };
}

module.exports = {
  buildSeasonal,
  isPublishedItem,
  isActiveAt,
  isEndedAt,
  seasonalToPost,
  renderSeasonalListCard,
  renderStoriesInstagramBar,
};

if (require.main === module) {
  buildSeasonal().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
