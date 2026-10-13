/** Verified welfare agreements only (verified === true renders on /partners). */
const PARTNERS = [
  {
    id: 'widuk',
    name: '위덕대학교',
    agreementDate: '2026.4.30',
    audience: '교직원·재학생·동문·직계가족',
    benefitSummary:
      '웨딩홀 대관료·예식 패키지·식대 별도 프로모션, 퀸즈테이블 뷔페 할인',
    pressId: 'widuk-imaeil',
    verified: true,
  },
  {
    id: 'police-council',
    name: '포항 남·북부경찰서 직장협의회',
    agreementDate: '2026.7.16',
    audience: '직원·직계가족',
    benefitSummary:
      '웨딩홀 대관료·패키지·식대 할인, 뷔페 특별가, 가족행사(회갑연·돌잔치)·기업행사 할인',
    detailNote: '세부 혜택은 문의',
    pressId: 'police-kyongbuk',
    verified: true,
  },
  {
    id: 'ecopro',
    name: '에코프로',
    agreementDate: '2026.8.13',
    audience: '임직원·가족',
    benefitSummary: '복지 혜택 확대',
    detailNote: '세부 혜택은 문의',
    pressId: 'ecopro-ksm',
    verified: true,
  },
  // --- withheld (do not render until verified) ---
  {
    id: 'posco-union',
    name: '포스코노동조합',
    agreementDate: '2026.6',
    audience: null,
    benefitSummary: null,
    pressId: null,
    verified: false,
    note: 'TODO: partner_posco_union',
  },
  {
    id: 'hyundai-steel',
    name: '현대제철 포항지회·현대IMC지회',
    agreementDate: '2026.4',
    audience: null,
    benefitSummary: null,
    pressId: null,
    verified: false,
    note: 'TODO: partner_hyundai_steel',
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
