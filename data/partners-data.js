const IMG = require('./site-images');

/** Verified welfare agreements only (verified === true renders on /partners). */
const PARTNERS = [
  {
    id: 'widuk',
    name: '위덕대학교',
    agreementDate: '2026.4.30',
    audience: '교직원·재학생·동문·직계가족',
    benefitSummary: '웨딩·연회·퀸즈테이블 뷔페 복지 협약(할인 혜택). 세부 혜택은 문의',
    storySlug: 'widuk-university-mou',
    storyUrl: '/news/widuk-university-mou',
    thumbnailUrl: IMG.mouWiduk,
    pressId: 'widuk-imaeil',
    verified: true,
  },
  {
    id: 'posco-union',
    name: '포스코노동조합',
    agreementDate: '2026.6.26',
    audience: '조합원·직계가족',
    benefitSummary: '더퀸 웨딩·연회·퀸즈테이블 뷔페 복지 협약(할인 혜택). 세부 혜택은 문의',
    storySlug: 'posco-union-mou',
    storyUrl: '/news/posco-union-mou',
    thumbnailUrl: IMG.mouPosco,
    pressId: null,
    verified: true,
  },
  {
    id: 'hyundai-steel',
    name: '현대제철 포항지회·현대IMC지회',
    agreementDate: '2026.4.8',
    audience: '조합원·직계가족',
    benefitSummary: '웨딩홀·패키지·식대·뷔페 복지 협약(할인 혜택). 세부 혜택은 문의',
    storySlug: 'hyundai-steel-mou',
    storyUrl: '/news/hyundai-steel-mou',
    thumbnailUrl: IMG.mouHyundai,
    pressId: null,
    verified: true,
  },
  {
    id: 'police-council',
    name: '포항 남·북부경찰서 직장협의회',
    agreementDate: '2026.7.16',
    audience: '직원·직계가족',
    benefitSummary:
      '웨딩·연회·뷔페·가족행사 복지 협약(할인 혜택). 세부 혜택은 문의',
    storySlug: null,
    storyUrl: null,
    thumbnailUrl: IMG.heroHall,
    pressId: 'police-kyongbuk',
    verified: true,
  },
  {
    id: 'ecopro',
    name: '에코프로',
    agreementDate: '2026.8.13',
    audience: '임직원·가족',
    benefitSummary: '복지 협약(할인 혜택) 확대. 세부 혜택은 문의',
    storySlug: null,
    storyUrl: null,
    thumbnailUrl: IMG.heroHall,
    pressId: 'ecopro-ksm',
    verified: true,
  },
  {
    id: 'posco-edu',
    name: '포스코교육재단',
    agreementDate: '2026',
    audience: null,
    benefitSummary: null,
    pressId: null,
    verified: false,
    note: 'TODO: partner_posco_edu',
  },
  {
    id: 'others',
    name: '경북교총, 포항해양경찰서 등',
    agreementDate: null,
    audience: null,
    benefitSummary: null,
    pressId: null,
    verified: false,
    note: 'TODO: partner_others',
  },
];

function getVerifiedPartners() {
  return PARTNERS.filter((p) => p.verified === true);
}

module.exports = { PARTNERS, getVerifiedPartners };
