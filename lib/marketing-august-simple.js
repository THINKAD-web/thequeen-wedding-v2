/**
 * 8월 심플 태스크 24개 — 제목·브랜드·주차·발행일·피드만
 */

function simpleTask(key, brand, week_id, week_label, title, sort_order, publish_date) {
  return {
    task_key: key,
    brand,
    week_id,
    week_label,
    channel: "피드",
    title,
    task_name: title,
    sort_order,
    scenes: [],
    specs: { publish_date },
    caption: "",
    tags: [],
    tips: "",
  };
}

const AUGUST_SIMPLE_TASKS = [
  // THE QUEEN (12)
  simpleTask("q81-1", "queen", 5, "8-1", "드레스쇼 현장 스케치", 0, "8/1"),
  simpleTask("q81-2", "queen", 5, "8-1", "드레스 스타일 가이드", 1, "8/4"),
  simpleTask("q81-3", "queen", 5, "8-1", "디테일 클로즈업", 2, "8/6"),
  simpleTask("q82-1", "queen", 6, "8-2", "Before→After 백스테이지", 0, "8/8"),
  simpleTask("q82-2", "queen", 6, "8-2", "Q&A 드레스 가봉", 1, "8/11"),
  simpleTask("q82-3", "queen", 6, "8-2", "Queen's Table 연계", 2, "8/13"),
  simpleTask("q83-1", "queen", 7, "8-3", "Best Cut 투표", 0, "8/15"),
  simpleTask("q83-2", "queen", 7, "8-3", "드레스 × 홀 매칭", 1, "8/18"),
  simpleTask("q83-3", "queen", 7, "8-3", "드레스쇼 관객 후기", 2, "8/20"),
  simpleTask("q84-1", "queen", 8, "8-4", "숫자 인포그래픽", 0, "8/22"),
  simpleTask("q84-2", "queen", 8, "8-4", "가을 드레스 추천", 1, "8/25"),
  simpleTask("q84-3", "queen", 8, "8-4", "다음 드레스쇼 예고", 2, "8/28"),
  // Queen's Table (12)
  simpleTask("t81-1", "table", 5, "8-1", "메뉴 퀄리티", 0, "8/1"),
  simpleTask("t81-2", "table", 5, "8-1", "리뷰 이벤트", 1, "8/4"),
  simpleTask("t81-3", "table", 5, "8-1", "셰프 소개", 2, "8/7"),
  simpleTask("t82-1", "table", 6, "8-2", "가족 모임 안내", 0, "8/8"),
  simpleTask("t82-2", "table", 6, "8-2", "가족 모임 특전", 1, "8/11"),
  simpleTask("t82-3", "table", 6, "8-2", "여름 시즌 메뉴", 2, "8/14"),
  simpleTask("t83-1", "table", 7, "8-3", "혜택 총정리", 0, "8/15"),
  simpleTask("t83-2", "table", 7, "8-3", "마감 카운트다운 D-14", 1, "8/18"),
  simpleTask("t83-3", "table", 7, "8-3", "고객 후기", 2, "8/21"),
  simpleTask("t84-1", "table", 8, "8-4", "9월 신메뉴 티저", 0, "8/25"),
  simpleTask("t84-2", "table", 8, "8-4", "마감 D-3", 1, "8/28"),
  simpleTask("t84-3", "table", 8, "8-4", "9월 정규 오픈", 2, "8/29"),
];

module.exports = { AUGUST_SIMPLE_TASKS, simpleTask };
