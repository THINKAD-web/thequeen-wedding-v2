/**
 * 8월 심플 태스크 16개 — 제목·브랜드·주차·발행일·피드만
 * (더퀸 8 + 퀸즈테이블 8)
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
  // THE QUEEN (8)
  simpleTask("q81-1", "queen", 5, "8-1", "Crown vs Galaxy 홀 투어", 0, "8/1"),
  simpleTask("q81-2", "queen", 5, "8-1", "Sunday Only 서비스 소개", 1, "8/4"),
  simpleTask("q82-1", "queen", 6, "8-2", "예식 당일 타임라인", 0, "8/8"),
  simpleTask("q82-2", "queen", 6, "8-2", "Small & Night 소개", 1, "8/11"),
  simpleTask("q83-1", "queen", 7, "8-3", "가을 예식 예약 안내", 0, "8/15"),
  simpleTask("q83-2", "queen", 7, "8-3", "Queen's Table 패키지", 1, "8/18"),
  simpleTask("q84-1", "queen", 8, "8-4", "예식 준비 체크리스트", 0, "8/22"),
  simpleTask("q84-2", "queen", 8, "8-4", "더퀸 방문 상담 안내", 1, "8/25"),
  // Queen's Table (8) — 프리미엄 다이닝 포지셔닝
  simpleTask("t81-1", "table", 5, "8-1", "일반 뷔페와 다릅니다", 0, "8/1"),
  simpleTask("t81-2", "table", 5, "8-1", "호텔 다이닝 같은 공간", 1, "8/4"),
  simpleTask("t82-1", "table", 6, "8-2", "웰컴 음료는 기본입니다", 0, "8/8"),
  simpleTask("t82-2", "table", 6, "8-2", "셰프의 기준", 1, "8/11"),
  simpleTask("t83-1", "table", 7, "8-3", "ROYAL 코스, 이렇게 다릅니다", 0, "8/15"),
  simpleTask("t83-2", "table", 7, "8-3", "플레이팅의 디테일", 1, "8/18"),
  simpleTask("t84-1", "table", 8, "8-4", "프랜차이즈 뷔페 vs 퀸즈테이블", 0, "8/22"),
  simpleTask("t84-2", "table", 8, "8-4", "예식과 함께 완성되는 다이닝", 1, "8/25"),
];

module.exports = { AUGUST_SIMPLE_TASKS, simpleTask };
