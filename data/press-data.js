const IMG = require('./site-images');

/** External press listings (title, outlet, link, one-line summary only — no article body). */
const PRESS_ITEMS = [
  {
    id: 'widuk-imaeil',
    imageUrl: IMG.mouWiduk,
    title: '위덕대학교와 복지·행사 협력 협약 체결',
    outlet: '매일신문',
    date: '2026-05-01',
    url: 'https://www.imaeil.com/page/view/2026050110544794979',
    summary:
      '위덕대 교직원·재학생·동문 및 가족을 대상으로 웨딩·연회 협력 혜택을 제공하는 협약을 맺었습니다.',
  },
  {
    id: 'police-kyongbuk',
    imageUrl: IMG.heroHall,
    title: '포항 남·북부경찰서 직장협의회와 직원 복지 협약 체결',
    outlet: '경북일보',
    date: '2026-07-17',
    url: 'https://www.kyongbuk.co.kr/news/articleView.html?idxno=4078525',
    summary:
      '포항 남·북부경찰서 직장협의회 직원과 가족을 위한 복지 협약을 체결했습니다.',
  },
  {
    id: 'queens-table-sisun',
    imageUrl: IMG.queensTable,
    title: "퀸즈테이블, '블루·로얄' 신규 라인업 런칭",
    outlet: '시선뉴스',
    date: '2026-06-17',
    url: 'http://www.sisunnews.co.kr/news/articleView.html?idxno=240745',
    summary: "퀸즈테이블 '블루·로얄' 라인업 런칭 소식이 보도되었습니다.",
  },
  {
    id: 'ecopro-ksm',
    imageUrl: IMG.heroHall,
    title: '에코프로와 임직원 복지·지역상생 협약 체결',
    outlet: '경상매일신문',
    date: '2026-08-13',
    url: 'https://www.ksmnews.co.kr/news/view.php?idx=617699',
    summary: '에코프로 임직원 복지와 지역 상생을 위한 협약을 체결했습니다.',
  },
];

module.exports = { PRESS_ITEMS };
