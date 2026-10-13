/**
 * Official English/Korean brand names, phones, and JSON-LD helpers (single source).
 */

const SITE_NAME_EN = 'THE QUEEN';
const SITE_NAME_KO_ALT = '더퀸';
const SITE_NAME_KO_FULL = '더퀸 웨딩홀';

const QUEENS_TABLE_NAME_EN = "Queen's Table";
const QUEENS_TABLE_NAME_KO_ALT = '퀸즈테이블';

const OG_SITE_NAME = 'THE QUEEN';

const HALL_PHONE = '054-283-1111';
const HALL_PHONE_TEL = 'tel:054-283-1111';
const QT_PHONE = '054-281-4000';
const QT_PHONE_TEL = 'tel:054-281-4000';

const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_rbxopG/chat';

const SITE_URL = 'https://thequeenwedding.kr';
const LOGO_URL = 'https://i.ibb.co/Ngw5GBKq/1.jpg';

/** @deprecated use SITE_NAME_KO_FULL */
const SITE_NAME = SITE_NAME_KO_FULL;

function jsonLdOrganizationTheQueen() {
  return {
    '@type': 'Organization',
    name: SITE_NAME_EN,
    alternateName: [SITE_NAME_KO_ALT, SITE_NAME_KO_FULL],
    telephone: HALL_PHONE,
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
  };
}

function jsonLdOrganizationQueensTable() {
  return {
    '@type': 'Organization',
    name: QUEENS_TABLE_NAME_EN,
    alternateName: [QUEENS_TABLE_NAME_KO_ALT],
    telephone: QT_PHONE,
    url: `${SITE_URL}/queens-table`,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
  };
}

function publisherForCategory(category) {
  if (category === 'dining') return jsonLdOrganizationQueensTable();
  return jsonLdOrganizationTheQueen();
}

module.exports = {
  SITE_NAME,
  SITE_NAME_EN,
  SITE_NAME_KO_ALT,
  SITE_NAME_KO_FULL,
  QUEENS_TABLE_NAME_EN,
  QUEENS_TABLE_NAME_KO_ALT,
  OG_SITE_NAME,
  HALL_PHONE,
  HALL_PHONE_TEL,
  QT_PHONE,
  QT_PHONE_TEL,
  KAKAO_CHANNEL_URL,
  SITE_URL,
  LOGO_URL,
  jsonLdOrganizationTheQueen,
  jsonLdOrganizationQueensTable,
  publisherForCategory,
};
