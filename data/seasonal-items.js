/**
 * Seasonal menus & events — edit here, then npm run build:content.
 * Only items with published && verified render on site.
 */
const SEASONAL_ITEMS = [
  {
    id: 'fall-eel',
    type: 'menu',
    title: '가을 전어',
    period_start: null,
    period_end: null,
    summary: null,
    tier: null,
    price_note: null,
    images: [],
    instagram_url: null,
    verified: false,
    published: false,
  },
  {
    id: 'house-ham',
    type: 'menu',
    title: '수제햄',
    period_start: null,
    period_end: null,
    summary: null,
    tier: null,
    price_note: null,
    images: [],
    instagram_url: null,
    verified: false,
    published: false,
  },
  {
    id: 'king-octopus',
    type: 'menu',
    title: '왕문어숙회',
    period_start: null,
    period_end: null,
    summary: null,
    tier: null,
    price_note: null,
    images: [],
    instagram_url: null,
    verified: false,
    published: false,
  },
  {
    id: 'october-event',
    type: 'event',
    title: '10월 행사',
    period_start: null,
    period_end: null,
    summary: null,
    tier: null,
    price_note: null,
    images: [],
    instagram_url: null,
    verified: false,
    published: false,
  },
];

function getSeasonalItems() {
  return SEASONAL_ITEMS;
}

module.exports = { SEASONAL_ITEMS, getSeasonalItems };
