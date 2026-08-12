function scene(...lines) {
  return lines.join("\n");
}

function reelSpecs(brand, extra = {}) {
  return {
    포맷: extra.포맷 || "이미지 또는 영상 (1080×1920 세로)",
    길이: extra.길이 || "이미지: 정방향 / 영상: 15~20초",
    음악: extra.음악 || (brand === "queen" ? "감성 오케스트라 or 트렌디 웨딩송" : "시즐 ASMR + 트렌디 BGM"),
    자막: extra.자막 || "화이트 세리프체, 중앙 정렬",
    컬러: extra.컬러 || (brand === "queen" ? "골드&블랙 톤 통일" : "네이비&골드 브랜드 톤"),
    편집: extra.편집 || "CapCut 시네마틱 템플릿",
    ...extra,
  };
}

function feedSpecs(brand, extra = {}) {
  return {
    포맷: extra.포맷 || "1080×1350 세로형",
    "컷 수": extra["컷 수"] || "3~4장",
    텍스트: extra.텍스트 || "첫 슬라이드 3줄 이상",
    폰트: brand === "queen" ? "골드 & 화이트 세리프" : "볼드 산세리프 + 골드 포인트",
    배경: brand === "queen" ? "블랙 or 다크 톤" : "네이비·크림 톤",
    ...extra,
  };
}

function storySpecs(brand, extra = {}) {
  return {
    포맷: "9:16 스토리 (1080×1920)",
    길이: "각 5~7초 × 3~5장",
    스티커: "투표·링크·DM 스티커",
    CTA: extra.CTA || "DM 문의 or 프로필 링크",
    ...extra,
  };
}

function promoSpecs(extra = {}) {
  return {
    채널: "카카오·인스타 DM·현장 안내",
    기간: extra.기간 || "해당 주 집중 운영",
    대상: extra.대상 || "예비부부·방문 고객",
    ...extra,
  };
}

function blogSpecs(extra = {}) {
  return {
    포맷: "네이버 블로그·플레이스",
    분량: "800~1200자 + 사진 8장 이상",
    SEO: extra.SEO || "포항 웨딩홀 / 포항 뷔페 키워드",
    ...extra,
  };
}

function adSpecs(extra = {}) {
  return {
    매체: "Instagram 유료 광고",
    타겟: extra.타겟 || "포항·경북",
    예산: extra.예산 || "주간 예산 내 A/B 테스트",
    ...extra,
  };
}

function eventSpecs(extra = {}) {
  return {
    형식: extra.형식 || "방문 인증·후기 이벤트",
    기간: extra.기간 || "해당 주",
    혜택: extra.혜택 || "소정의 사은품 or 리포스트",
    ...extra,
  };
}

function buildTask(key, brand, week_id, week_label, channel, title, detail) {
  return {
    task_key: key,
    brand,
    week_id,
    week_label,
    channel,
    title,
    task_name: title.length > 48 ? title.slice(0, 45) + "…" : title,
    sort_order: detail.sort_order ?? 0,
    scenes: detail.scenes,
    specs: detail.specs,
    caption: detail.caption,
    tags: detail.tags,
    tips: detail.tips,
  };
}

const { AUGUST_SIMPLE_TASKS } = require("./marketing-august-simple");

const BASE_SEED_TASKS = [
  // ─── 7-1주: 더퀸 드레스쇼 / 퀸즈테이블 라인업 런칭 ───
  buildTask("q71-1", "queen", 1, "7-1", "릴스", "런웨이 클립 슬로우모션 — Galaxy Hall 크리스탈·실크 장면", {
    sort_order: 0,
    scenes: [
      "씬1: 후킹 — Galaxy Hall 크리스탈 천장·드레스 실크 (첫 1~2초)",
      "씬2: 핵심 메시지 — THE QUEEN × WEDDING MUE 런웨이 하이라이트",
      "씬3: 가격/혜택 — 드레스쇼·가을 웨딩 상담 안내",
      "씬4: CTA — '이 감동, 당신의 결혼식으로' + 프로필 링크",
    ],
    specs: reelSpecs("queen", {
      음악: "감성 오케스트라 or 트렌디 웨딩송",
      편집: "CapCut 시네마틱 템플릿",
    }),
    caption: "포항에서 이런 드레스쇼가 열렸습니다 🤍\n\nTHE QUEEN × WEDDING MUE 2026 S/S\n런웨이 위에서 빛났던 그 순간들 —\n이제 당신의 결혼식으로 이어드립니다.\n\n✦ 가을 웨딩 상담 → 프로필 링크",
    tags: ["드레스쇼", "Galaxy Hall", "웨딩 감성", "포항웨딩홀", "BeTheQueenPohang"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q71-2", "queen", 1, "7-1", "피드", "드레스쇼 베스트컷 캐러셀 '그 순간, 포항에서'", {
    sort_order: 1,
    scenes: [
      "1장: 메인 사진 + '그 순간, 포항에서' 제목",
      "2장: 핵심 정보 — 드레스쇼 베스트컷·Galaxy Hall",
      "3장: CTA — '상담 예약하기' + 프로필 링크",
    ],
    specs: feedSpecs("queen"),
    caption: "드레스쇼의 모든 순간이 담겨있습니다.\n\n포항 더퀸 웨딩홀 × Wedding Mue\n2026 S/S 드레스쇼 베스트컷 모음\n\n런웨이 위의 그 감동을 당신의 결혼식으로.",
    tags: ["드레스쇼", "포항웨딩홀", "웨딩드레스"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q71-3", "queen", 1, "7-1", "스토리", "드레스쇼 참석 100팀 카톡 nurturing 발송", {
    sort_order: 2,
    scenes: [
      scene("스토리1", "드레스쇼 하이라이트 + 100팀 감사"),
      scene("스토리2", "카톡 채널 추가·다음 시즌 티저"),
      scene("스토리3", "DM·카톡 문의 스티커"),
    ],
    specs: storySpecs("queen", { CTA: "카카오 채널·DM 문의" }),
    caption: "드레스쇼에 함께해 주신 100팀 예비부부님께 감사드립니다.\n\n카카오 채널 추가 시 다음 시즌 소식을 가장 먼저 받아보실 수 있습니다.",
    tags: ["드레스쇼", "카톡", "nurturing"],
    tips: "참석자 DB 기준 카톡·스토리 동시 운영. 개인정보 동의 확인.",
  }),
  buildTask("t71-1", "table", 1, "7-1", "릴스", "BLUE·ROYAL 라인업 공개 릴스 + 스테이크 시즐", {
    sort_order: 3,
    scenes: [
      "씬1: 후킹 — 스테이크 굽는 시즐·'얼마일 것 같나요?' (첫 1~2초)",
      "씬2: 핵심 메시지 — BLUE·ROYAL 라인업·뷔페 전경",
      "씬3: 가격/혜택 — 런치 29,900원·3+1·무제한 음료",
      "씬4: CTA — 퀸즈테이블 예약 + 프로필 링크",
    ],
    specs: reelSpecs("table", {
      음악: "시즐 ASMR + 트렌디 BGM 믹스",
      자막: "볼드 산세리프, 가격 대형 강조",
      편집: "CapCut 푸드 템플릿",
    }),
    caption: "포항에 이런 뷔페는 없었습니다 🥩\n\n퀸즈테이블 BLUE — 평일 수·목·금\n런치 29,900원, 전 좌석 스테이크 기본.\n디너엔 백맥주·병소주까지 무제한.\n\n✦ 런칭 혜택 3+1 · 8월 31일까지\n✦ 예약 → 프로필 링크\n\n#퀸즈테이블 #포항뷔페 #포항맛집 #포항스테이크 #포항런치",
    tags: ["스테이크", "뷔페", "런칭", "BLUE"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t71-2", "table", 1, "7-1", "피드", "신규 라인업 공지 카드뉴스 — 가격표 + 3대 혜택", {
    sort_order: 4,
    scenes: [
      "1장: 음식 메인 사진 + BLUE/ROYAL 가격",
      "2장: 3대 혜택 — 3+1·무제한 음료·스테이크 기본",
      "3장: CTA — '예약하기' + 프로필 링크",
    ],
    specs: feedSpecs("table", { 구성: "BLUE/ROYAL 가격표 + 3대 혜택" }),
    caption: "포항 프리미엄 뷔페 #퀸즈테이블 OPEN!\n\n🍖 BLUE (평일) 런치 29,900\n🍴 ROYAL (주말) 토 68,000\n💚 3+1 · 무제한 음료 · 스테이크 기본\n\n7월 말까지 런칭 특가 진행 중.\n프로필 링크에서 예약하세요!",
    tags: ["퀸즈테이블", "런칭", "BLUE", "ROYAL"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t71-3", "table", 1, "7-1", "프로모션", "런칭 프로모션 오픈 (3+1 · 백맥주·병소주 무제한 · 스테이크 기본)", {
    sort_order: 5,
    scenes: [
      scene("안내1", "3+1·무제한 음료·스테이크 기본"),
      scene("안내2", "8/31 마감"),
      scene("안내3", "예약 채널"),
    ],
    specs: promoSpecs({ 기간: "7월 말 ~ 8월 31일", 대상: "신규 예약 고객" }),
    caption: "퀸즈테이블 런칭 프로모션 오픈!\n\n✓ 3+1 혜택\n✓ 디너 백맥주·병소주 무제한\n✓ 전 좌석 스테이크 기본\n\n8월 31일까지. 전화·프로필 링크 예약.",
    tags: ["런칭", "프로모션", "3+1"],
    tips: "현장·전화·인스타 DM 동일 혜택 문구 사용.",
  }),

  // ─── 7-2주: Two Halls One Queen / BLUE 평일 ───
  buildTask("q72-1", "queen", 2, "7-2", "릴스", "Crown Hall(자연광) vs Galaxy Hall(크리스탈·LED) 비교 영상", {
    sort_order: 0,
    scenes: [
      "씬1: 후킹 — Crown vs Galaxy 분할 화면 (첫 1~2초)",
      "씬2: 핵심 메시지 — 두 홀 무드·조명 비교",
      "씬3: 가격/혜택 — 홀 투어·상담 안내",
      "씬4: CTA — 'Where is yours?' + 상담 예약",
    ],
    specs: reelSpecs("queen", {
      컬러: "Crown=따뜻톤, Galaxy=차가운톤 대비",
      트랜지션: "부드러운 페이드 (비교 느낌)",
      음악: "감성적인 배경음악",
    }),
    caption: "당신이 꿈꾸는 분위기는 어느 홀인가요?\n\nCrown Hall: 자연광의 따뜻함, 로맨틱한 미러 천장\nGalaxy Hall: 크리스탈의 화려함, 드라마틱한 LED 조명\n\n더퀸의 두 홀을 비교해 보세요.\n당신의 신부 순간이 더욱 특별해질 거예요.",
    tags: ["두 홀 비교", "포항웨딩홀", "CrownHall", "GalaxyHall"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q72-2", "queen", 2, "7-2", "피드", "홀 무드 비교 카드뉴스 '당신의 비전은 어느 홀인가요?'", {
    sort_order: 1,
    scenes: [
      "1장: 메인 사진 + '당신의 비전은?' 제목",
      "2장: 핵심 정보 — Crown Hall vs Galaxy Hall 비교",
      "3장: CTA — '상담 예약하기' + 프로필 링크",
    ],
    specs: feedSpecs("queen", { 구성: "Crown Hall vs Galaxy Hall 비교" }),
    caption: "Crown Hall의 따뜻함? 아니면 Galaxy Hall의 화려함?\n당신의 신부의 순간은 어느 분위기로 채우고 싶으신가요?\n\n더퀸 상담예약 링크 in 프로필",
    tags: ["홀비교", "포항웨딩홀", "더퀸"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q72-3", "queen", 2, "7-2", "스토리", "스토리 투표 'Crown vs Galaxy'", {
    sort_order: 2,
    scenes: [
      scene("스토리1", "Crown vs Galaxy 3초 비교"),
      scene("스토리2", "투표 스티커 + 결과 공유 예고"),
      scene("스토리3", "DM 투어 예약"),
    ],
    specs: storySpecs("queen", { CTA: "투표 + DM 투어 예약" }),
    caption: "Crown vs Galaxy — 당신의 선택은?\n투표 참여 후 DM으로 '투어' 남겨주시면 일정 안내드립니다.",
    tags: ["투표", "CrownHall", "GalaxyHall"],
    tips: "투표 종료 후 결과 스토리로 재방문 유도.",
  }),
  buildTask("t72-1", "table", 2, "7-2", "릴스", "'29,900원의 실화' 런치 영상 — 스테이크 굽는 장면", {
    sort_order: 3,
    scenes: [
      "씬1: 후킹 — '얼마일 것 같나요?' + 스테이크 굽는 장면",
      "씬2: 핵심 메시지 — 뷔페 전경·플레이팅 완성",
      "씬3: 가격/혜택 — 29,900원·3+1·스테이크 기본",
      "씬4: CTA — 퀸즈테이블 BLUE 예약",
    ],
    specs: reelSpecs("table", {
      스타일: "문제→반전 느낌",
      음악: "시즐 ASMR + 팝 비트",
      텍스트: "큰 숫자로 임팩트",
    }),
    caption: "이 가격에 이 퀄리티?\n\n29,900원 런치\n✓ 전 좌석 스테이크 기본\n✓ 시그니처 메뉴 무제한\n✓ 3+1 프로모션까지\n\n포항 퀸즈테이블 BLUE\n평일은 퀸즈테이블 🥩",
    tags: ["가성비", "스테이크", "BLUE"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t72-2", "table", 2, "7-2", "피드", "직장인 런치 카드뉴스 '평일의 작은 사치'", {
    sort_order: 4,
    scenes: [
      "1장: 음식 메인 사진 + '평일의 작은 사치'·29,900원",
      "2장: 3대 혜택 — 스테이크 기본·런치 타임·3+1",
      "3장: CTA — '예약하기' + 프로필 링크",
    ],
    specs: feedSpecs("table"),
    caption: "평일 런치 29,900원.\n다른 곳과는 달라.\n\n스테이크가 기본인 곳은\n퀸즈테이블뿐입니다.\n\n평일의 작은 사치,\n퀸즈테이블 BLUE에서.",
    tags: ["직장인런치", "BLUE", "포항맛집"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t72-3", "table", 2, "7-2", "스토리", "평일 런치 방문 인증 스토리 이벤트", {
    sort_order: 5,
    scenes: [
      scene("안내", "방문 인증 이벤트 + 태그 방법"),
      scene("혜택", "웰컴 드링크·이번 주 한정"),
      scene("CTA", "위치 스티커 + @queens_table.official"),
    ],
    specs: storySpecs("table", { CTA: "방문 인증 + 태그" }),
    caption: "평일 런치 방문 후 스토리에 @queens_table.official 태그!\n이번 주 인증 고객님께 웰컴 드링크를 드립니다.",
    tags: ["이벤트", "런치", "인증"],
    tips: "인증 스토리 리포스트로 UGC 확산.",
  }),

  // ─── 7-3주: 드레스 스타일 / ROYAL 주말 ───
  buildTask("q73-1", "queen", 3, "7-3", "릴스", "드레스별 클로즈업 슬라이드쇼 (Royal / Lace / Crystal&Modern)", {
    sort_order: 0,
    scenes: [
      "씬1: 후킹 — Royal·Lace·Crystal 3종 빠른 전환 (첫 1~2초)",
      "씬2: 핵심 메시지 — 드레스별 클로즈업·디테일",
      "씬3: 가격/혜택 — '어떤 신부?' 스타일 선택 안내",
      "씬4: CTA — 상담 예약 + 프로필 링크",
    ],
    specs: reelSpecs("queen", {
      스타일: "슬라이드쇼 (각 2~3초)",
      효과: "부드러운 줌 in/out",
      음악: "우아한 배경음악",
    }),
    caption: "당신은 어떤 신부를 꿈꾸시나요?\n\n👑 Royal Collection - 우아함의 정석, 트레인의 라인\n🤍 Ethereal Lace - 부드러운 시폰, 섬세한 레이스\n✨ Crystal & Modern - 빛나는 비즈, 세련된 모던함\n\n더퀸의 세 가지 드레스로 당신의 신부를 찾아보세요.",
    tags: ["드레스", "스타일", "선택"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q73-2", "queen", 3, "7-3", "피드", "스타일 비교 카드뉴스 '어떤 신부를 꿈꾸시나요?'", {
    sort_order: 1,
    scenes: [
      "1장: 메인 사진 + '어떤 신부?' 제목",
      "2장: 핵심 정보 — Royal·Lace·Crystal&Modern 비교",
      "3장: CTA — '상담 예약하기' + 프로필 링크",
    ],
    specs: feedSpecs("queen"),
    caption: "로열, 레이스, 크리스탈&모던.\n세 가지 신부 스타일 중 당신은 어느 쪽?\n\n각 스타일을 슬라이드로 보고 선택해보세요.",
    tags: ["드레스스타일", "웨딩드레스"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q73-3", "queen", 3, "7-3", "스토리", "스토리 Q&A '어떤 드레스 스타일?' 투표", {
    sort_order: 2,
    scenes: [
      scene("질문", "어떤 드레스 스타일?"),
      scene("옵션", "Royal·Lace·Crystal&Modern"),
      scene("투표", "스티커 + 결과 공유 예고"),
    ],
    specs: storySpecs("queen"),
    caption: "당신의 드레스 스타일은? 투표해 주세요 👑",
    tags: ["Q&A", "투표", "드레스"],
    tips: "투표 결과를 다음 주 피드에서 공유.",
  }),
  buildTask("t73-1", "table", 3, "7-3", "릴스", "주말 시그니처 다이닝 무드 — 와인·랍스터·플레이팅", {
    sort_order: 3,
    scenes: [
      "씬1: 후킹 — ROYAL 입장·와인 포어링 (첫 1~2초)",
      "씬2: 핵심 메시지 — 랍스터·플레이팅·프리미엄 무드",
      "씬3: 가격/혜택 — ROYAL 주말 요금·가족 모임",
      "씬4: CTA — '예약하기' + 프로필 링크",
    ],
    specs: reelSpecs("table", {
      톤: "고급스러움, 우아함",
      음악: "클래식 배경음악",
    }),
    caption: "특별한 날은 특별하게.\n\n주말의 가족 모임, 상견례, 기념일...\n퀸즈테이블 ROYAL에서.\n\n호텔급 프리미엄 다이닝,\n뷔페의 상식을 바꾸다.\n\n예약은 프로필 링크에서",
    tags: ["ROYAL", "가족모임", "프리미엄"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t73-2", "table", 3, "7-3", "피드", "'주말 가족 모임은 퀸즈테이블' 상견례·기념일 소구", {
    sort_order: 4,
    scenes: [
      "1장: 음식 메인 사진 + '주말 가족 모임'·ROYAL 가격",
      "2장: 3대 혜택 — 상견례·기념일·오마카세급 메뉴",
      "3장: CTA — '예약하기' + 프로필 링크",
      "4장: (선택) BLUE/ROYAL 구분 안내",
    ],
    specs: feedSpecs("table"),
    caption: "가족 모임은 특별해야 합니다.\n\n상견례, 생일, 기념일...\n포항 호텔급 프리미엄 다이닝\n\n🍽️ ROYAL (주말)\n토요일 68,000 / 일요일 58,000\n\n오마카세급 메뉴 + 특별한 공간\n예약은 프로필 링크에서",
    tags: ["ROYAL", "상견례", "가족모임"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t73-3", "table", 3, "7-3", "프로모션", "주말 예약 고객 웰컴 드링크 제공", {
    sort_order: 5,
    scenes: [
      scene("혜택", "웰컴 드링크 1잔"),
      scene("대상", "주말 ROYAL 예약 고객"),
      scene("안내", "예약 시 '인스타 이벤트' 말씀"),
    ],
    specs: promoSpecs({ 대상: "주말 ROYAL 예약 고객", 혜택: "웰컴 드링크 1잔" }),
    caption: "이번 주말 ROYAL 예약 고객님께 웰컴 드링크를 드립니다.\n예약 시 '인스타 이벤트' 말씀해 주세요.",
    tags: ["ROYAL", "웰컴드링크", "프로모션"],
    tips: "예약 메모에 이벤트 참여 여부 기록.",
  }),

  // ─── 7-4주: Queen's Table 연계 / 디너 무제한 ───
  buildTask("q74-1", "queen", 4, "7-4", "릴스", "Queen's Table 감성 영상 '식사도 영화처럼'", {
    sort_order: 0,
    scenes: [
      "씬1: 후킹 — Queen's Table 입장·테이블 셋팅 (첫 1~2초)",
      "씬2: 핵심 메시지 — 플레이팅·와인·식사 무드",
      "씬3: 가격/혜택 — 더퀸 × Queen's Table 연계",
      "씬4: CTA — '상담 예약하기' + 프로필 링크",
    ],
    specs: reelSpecs("queen", {
      음악: "우아한 클래식 BGM",
      톤: "골드&화이트 프리미엄",
    }),
    caption: "결혼식 후, 로열한 라이프스타일.\n\n당신의 결혼식이 더 완성되는 경험.\nQueen's Table에서 식사도 영화처럼.\n\n더퀸 웨딩홀 × Queen's Table\n결혼, 그 이후도 특별하게.",
    tags: ["QueensTable", "결혼식", "피로연"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q74-2", "queen", 4, "7-4", "피드", "Royal Membership 혜택 카드 — 결혼 이후 라이프스타일", {
    sort_order: 1,
    scenes: [
      "1장: 메인 사진 + 'Royal Membership' 제목",
      "2장: 핵심 정보 — Queen's Table·재촬영·기념일 혜택",
      "3장: CTA — '상담 예약하기' + 프로필 링크",
    ],
    specs: feedSpecs("queen"),
    caption: "결혼식 이후 특별해지는 순간들.\n\nRoyal Membership으로 더퀸 고객만의 특별한 혜택을 받으세요.\n👑 Queen's Table 우대 요금\n👑 웨딩 후 재촬영 공간 제공\n👑 기념일 프리미엄 서비스\n\n상담예약 링크 in 프로필",
    tags: ["RoyalMembership", "혜택"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q74-3", "queen", 4, "7-4", "프로모션", "가을 얼리버드 상담 혜택 사전 예고", {
    sort_order: 2,
    scenes: [
      scene("티저", "가을 얼리버드 예고"),
      scene("혜택", "Prada 핸드로션 등"),
      scene("CTA", "DM '가을' 사전 관심 등록"),
    ],
    specs: promoSpecs({ 기간: "7-4주 사전 예고", 대상: "가을 예식 예비부부" }),
    caption: "가을 얼리버드 상담 혜택, 곧 공개됩니다.\n관심 있으신 분은 DM으로 '가을' 남겨주세요.",
    tags: ["얼리버드", "가을웨딩"],
    tips: "8-1주 본 공개 전 기대감 조성.",
  }),
  buildTask("t74-1", "table", 4, "7-4", "릴스", "'디너엔 백맥주·병소주가 무제한' 회식 무드", {
    sort_order: 3,
    scenes: [
      "씬1: 후킹 — 회식 건배·음료 무제한 (첫 1~2초)",
      "씬2: 핵심 메시지 — 스테이크·뷔페·회식 분위기",
      "씬3: 가격/혜택 — 4인 이상 25% 할인",
      "씬4: CTA — '단체 예약' + 프로필 링크",
    ],
    specs: reelSpecs("table", {
      톤: "친근함, 즐거움",
      음악: "경쾌한 BGM",
    }),
    caption: "회식은 즐거워야 합니다.\n\n디너엔 백맥주·병소주가 무제한.\n스테이크는 기본.\n\n직장인의 특별한 밤,\n퀸즈테이블 BLUE에서.\n\n단체 예약 할인 25%\n프로필 링크에서 예약",
    tags: ["회식", "무제한", "직장인"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t74-2", "table", 4, "7-4", "피드", "직장인 회식 카드뉴스 + 단체 예약 안내", {
    sort_order: 4,
    scenes: [
      "1장: 음식 메인 사진 + '회식은 질로'·무제한 음료",
      "2장: 3대 혜택 — 스테이크+뷔페·무제한·4인 25% 할인",
      "3장: CTA — '단체 예약' + 프로필 링크",
    ],
    specs: feedSpecs("table"),
    caption: "직장인의 마지막 위로.\n\n회식은 질료로 하세요.\n백맥주·병소주 무제한,\n스테이크 기본인 곳은\n퀸즈테이블뿐입니다.\n\n4인 이상 단체 예약 25% 할인\n프로필 링크 또는 전화로 예약",
    tags: ["회식", "단체예약", "BLUE"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t74-3", "table", 4, "7-4", "프로모션", "4인 이상 단체 예약 혜택 안내", {
    sort_order: 5,
    scenes: [
      scene("조건", "4인 이상 단체"),
      scene("혜택", "25% 할인"),
      scene("예약", "전화·DM"),
    ],
    specs: promoSpecs({ 대상: "4인 이상 단체", 혜택: "25% 할인" }),
    caption: "4인 이상 단체 예약 시 25% 할인.\n회식·팀 회식 문의 환영합니다. 054-283-1111",
    tags: ["단체할인", "회식"],
    tips: "단체 예약은 최소 3일 전 안내.",
  }),

  // ─── 8-1주: 가을 조기 예약 / 미식 퀄리티 ───
  buildTask("q81-1", "queen", 5, "8-1", "릴스", "런웨이 영상 + '가을 웨딩 D-90' 텍스트 오버레이", {
    sort_order: 0,
    scenes: [
      "씬1: 후킹 — 런웨이 드레스·Galaxy Hall 조명 (첫 1~2초)",
      "씬2: 핵심 메시지 — '가을 웨딩 D-90' 오버레이",
      "씬3: 하이라이트 — 드레스쇼 런웨이·가을 웨딩 무드",
      "씬4: CTA — '상담 예약' + 프로필 링크",
    ],
    specs: reelSpecs("queen", {
      스타일: "기존 런웨이 영상 + 타이포 오버레이",
      텍스트: "화이트 세리프 대형, '가을 웨딩 D-90'",
      음악: "웨딩 감성 BGM",
    }),
    caption: "가을 예식, 지금부터가 골든타임입니다.\n\n10–11월 예식일 기준, 준비 기간은 딱 3개월.\n드레스쇼에서 만난 12벌의 드레스,\n당신의 가을 웨딩을 더퀸에서 설계해 보세요.\n\n📞 상담 예약: 프로필 링크",
    tags: ["가을웨딩", "드레스쇼", "상담예약"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q81-2", "queen", 5, "8-1", "피드", "얼리버드 혜택 공개 카드뉴스 + 가을 결혼식 무드 사진", {
    sort_order: 1,
    scenes: [
      "1장: 메인 사진 + '가을 얼리버드' 제목",
      "2장: 핵심 정보 — Prada 핸드로션·촬영 우대·10% 할인",
      "3장: CTA — '상담 예약하기' + 프로필 링크",
      "4장: (선택) 가을 웨딩 무드 사진",
    ],
    specs: feedSpecs("queen"),
    caption: "포항에서 가장 영화 같은 가을 웨딩.\n\n지금 상담하는 신부에게 특별한 혜택:\n✦ Prada 핸드로션 증정\n✦ 촬영 우대 시간대 선택\n✦ 신청 시 10% 추가 할인\n\n더퀸에서 당신의 가을을 특별하게.",
    tags: ["얼리버드", "가을웨딩", "혜택"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q81-3", "queen", 5, "8-1", "프로모션", "상담 예약 시 Prada 핸드로션 증정 오퍼 운영", {
    sort_order: 2,
    scenes: [
      scene("오퍼", "Prada 핸드로션 증정"),
      scene("조건", "상담 예약 완료·선착순"),
      scene("CTA", "프로필 링크 예약"),
    ],
    specs: promoSpecs({ 혜택: "Prada 핸드로션 증정", 대상: "상담 예약 고객" }),
    caption: "이번 주 상담 예약 시 Prada 핸드로션 증정 (선착순)\n프로필 링크에서 예약해 주세요.",
    tags: ["프로모션", "얼리버드", "증정"],
    tips: "상담 확정 시 증정 — 재고 관리 필수.",
  }),
  buildTask("t81-1", "table", 5, "8-1", "릴스", "'뷔페의 상식을 바꾸다' 조리 과정·셰프 손길", {
    sort_order: 3,
    scenes: [
      "씬1: 후킹 — 셰프 즉석 조리·불의 예술 (첫 1~2초)",
      "씬2: 핵심 메시지 — 플레이팅·셰프 손길 클로즈업",
      "씬3: 가격/혜택 — 오마카세급 퀄리티·ROYAL·BLUE",
      "씬4: CTA — '예약하기' + 프로필 링크",
    ],
    specs: reelSpecs("table", {
      톤: "전문성, 신뢰",
      음악: "세련된 배경음악",
    }),
    caption: "뷔페의 상식을 바꾸다.\n\n오마카세급 조리 과정,\n셰프의 손길이 닿는 매순간.\n\n가격이 아닌 맛으로 비교하세요.\n퀸즈테이블 ROYAL·BLUE\n\n예약 링크 in 프로필",
    tags: ["미식", "셰프", "퀄리티"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t81-2", "table", 5, "8-1", "피드", "메뉴 퀄리티 카드뉴스 — 식재료·조리 철학", {
    sort_order: 4,
    scenes: [
      "1장: 음식 메인 사진 + '뷔페의 상식을 바꾸다'",
      "2장: 3대 혜택 — 제철 식재료·라이브 스테이션·셰프 전문성",
      "3장: CTA — '예약하기' + 프로필 링크",
    ],
    specs: feedSpecs("table"),
    caption: "뷔페지만, 비교가 안 됩니다.\n\n신선한 제철 재료.\n매일 새로 준비되는 시그니처.\n셰프의 손길이 닿는 매 순간.\n\n뷔페의 '상식'을 \n퀸즈테이블이 바꿨습니다.\n\n예약: 프로필 링크",
    tags: ["미식", "오마카세급", "퀄리티"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t81-3", "table", 5, "8-1", "이벤트", "방문 후기 리뷰 이벤트 시작", {
    sort_order: 5,
    scenes: [
      scene("안내", "방문 후기 이벤트"),
      scene("참여", "네이버·인스타 후기 작성"),
      scene("혜택", "추첨 사은품·8월 한 달"),
    ],
    specs: eventSpecs({ 형식: "방문 후기 리뷰", 혜택: "추첨 사은품" }),
    caption: "퀸즈테이블 방문 후기를 남겨주세요!\n네이버·인스타 후기 작성 시 추첨을 통해 사은품을 드립니다.",
    tags: ["후기이벤트", "리뷰"],
    tips: "후기 URL 수집용 DM 자동 응답 설정 권장.",
  }),

  // ─── 8-2주: Wedding Mue / 가족 모임 ───
  buildTask("q82-1", "queen", 6, "8-2", "릴스", "드레스쇼 영상으로 Wedding Mue 컬래버 스토리텔링", {
    sort_order: 0,
    scenes: [
      "씬1: 후킹 — Wedding Mue 드레스 클로즈업 (첫 1~2초)",
      "씬2: 핵심 메시지 — 런웨이·Galaxy Hall·협업 크레딧",
      "씬3: 가격/혜택 — Wedding Mue × THE QUEEN",
      "씬4: CTA — '상담 예약' + 프로필 링크",
    ],
    specs: reelSpecs("queen", {
      톤: "럭셔리 협업 느낌",
      음악: "감성 웨딩송",
    }),
    caption: "프리미엄 드레스와 프리미엄 홀의 만남.\n\nWedding Mue × THE QUEEN\n2026 S/S 드레스쇼의 기록.\n\n더퀸에서 만드는 당신만의 특별한 순간.",
    tags: ["WeddingMue", "드레스", "협업"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q82-2", "queen", 6, "8-2", "피드", "드레스 × 브랜드 스토리 '더퀸이 선택한 이유'", {
    sort_order: 1,
    scenes: [
      "1장: 메인 사진 + '더퀸이 선택한 이유' 제목",
      "2장: 핵심 정보 — Wedding Mue·드레스·Galaxy Hall",
      "3장: CTA — '블로그·상담' + 프로필 링크",
    ],
    specs: feedSpecs("queen"),
    caption: "왜 더퀸은 Wedding Mue를 선택했을까?\n\n시네마틱 감성 × 프리미엄 드레스\n런웨이의 순간을 당신의 결혼식으로.\n\n블로그에서 더 자세한 스토리를 만나보세요.",
    tags: ["WeddingMue", "브랜드스토리"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q82-3", "queen", 6, "8-2", "블로그", "블로그 포스팅 배포 — 드레스쇼 현장 후기", {
    sort_order: 2,
    scenes: [
      scene("도입", "드레스쇼 현장·런웨이 하이라이트"),
      scene("본문", "드레스 컬렉션·Galaxy Hall"),
      scene("CTA", "상담 예약"),
    ],
    specs: blogSpecs({ SEO: "포항 드레스쇼, 더퀸 웨딩홀, Wedding Mue" }),
    caption: "[블로그] THE QUEEN × Wedding Mue 드레스쇼 현장 후기\n\n런웨이, 드레스, 홀 투어까지 — 현장 스케치 full ver.\n\n#포항웨딩홀 #드레스쇼 #더퀸",
    tags: ["블로그", "드레스쇼", "후기"],
    tips: "네이버 블로그 발행 후 피드·스토리 교차 홍보.",
  }),
  buildTask("t82-1", "table", 6, "8-2", "릴스", "'여름 가족 모임의 정답' 3대 가족 다이닝 무드", {
    sort_order: 3,
    scenes: [
      "씬1: 후킹 — 온 가족 식탁·웃음 (첫 1~2초)",
      "씬2: 핵심 메시지 — 어린이·부모님·메뉴 모둠",
      "씬3: 가격/혜택 — ROYAL 가족 모임·여름 특별",
      "씬4: CTA — '예약하기' + 프로필 링크",
    ],
    specs: reelSpecs("table", {
      톤: "따뜻함, 유대감",
      음악: "감성 가족 BGM",
    }),
    caption: "가족 모임은 장소가 중요합니다.\n\n아이들도 즐거운 뷔페.\n부모님도 만족하는 프리미엄.\n모두가 행복한 식탁.\n\n여름 가족 모임,\n퀸즈테이블 ROYAL에서\n특별하게 마무리하세요.\n\n예약: 프로필 링크",
    tags: ["가족모임", "돌잔치", "기념일"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t82-2", "table", 6, "8-2", "피드", "돌잔치·상견례·칠순연 단체 행사 안내", {
    sort_order: 4,
    scenes: [
      "1장: 음식 메인 사진 + '특별한 날'·행사 유형",
      "2장: 3대 혜택 — 돌잔치·상견례·칠순연 대응",
      "3장: CTA — '단체 예약' + 프로필 링크",
    ],
    specs: feedSpecs("table"),
    caption: "돌잔치도, 상견례도,\n칠순연도 퀸즈테이블에서.\n\n어른들은 호텔 같은 음식으로,\n아이들은 뷔페의 즐거움으로.\n\n특별한 날은 더 특별하게\n만드는 공간.\n\n단체 예약 문의: 프로필 링크",
    tags: ["돌잔치", "상견례", "단체행사"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t82-3", "table", 6, "8-2", "프로모션", "8월 가족 모임 예약 특전 안내", {
    sort_order: 5,
    scenes: [
      scene("대상", "8월 가족 모임·행사"),
      scene("특전", "웰컴 드링크·케이크"),
      scene("예약", "프로필 링크 문의"),
    ],
    specs: promoSpecs({ 대상: "8월 가족 모임 예약", 혜택: "특전 패키지" }),
    caption: "8월 가족 모임 예약 고객님께 특별한 특전을 준비했습니다.\n단체 예약 문의: 프로필 링크",
    tags: ["가족모임", "8월특전"],
    tips: "돌잔치·상견례 키워드 타겟 광고 연동.",
  }),

  // ─── 8-3주: #BeTheQueen UGC / 프로모션 막바지 ───
  buildTask("q83-1", "queen", 7, "8-3", "릴스", "드레스쇼 하이라이트 재편집 + #BeTheQueenPohang 자막", {
    sort_order: 0,
    scenes: [
      "씬1: 후킹 — 드레스쇼 하이라이트·#BeTheQueenPohang (첫 1~2초)",
      "씬2: 핵심 메시지 — Galaxy Hall·참석자 UGC",
      "씬3: 가격/혜택 — 해시태그 캠페인·리포스트",
      "씬4: CTA — '참여하기' + 프로필 링크",
    ],
    specs: reelSpecs("queen", {
      자막: "#BeTheQueenPohang 강조",
      음악: "긍정적 웨딩 BGM",
    }),
    caption: "포항에서 신부가 되는 순간,\n#BeTheQueenPohang으로 함께하세요.\n\n더퀸 드레스쇼 참석자분들의 이야기를\n공유해주세요. 선정된 계정은\n더퀸 공식 계정에서 리포스트됩니다.\n\n✦ #BeTheQueenPohang #포항웨딩",
    tags: ["UGC", "BeTheQueenPohang", "캠페인"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q83-2", "queen", 7, "8-3", "피드", "UGC 해시태그 캠페인 공지 + 참여 안내 카드", {
    sort_order: 1,
    scenes: [
      "1장: 메인 사진 + '#BeTheQueenPohang' 제목",
      "2장: 핵심 정보 — 참여 방법 3단계·리포스트 혜택",
      "3장: CTA — '참여하기' + 프로필 링크",
    ],
    specs: feedSpecs("queen"),
    caption: "당신의 더퀸 순간을 #BeTheQueenPohang으로 공유해주세요.\n\n더퀸 드레스쇼 참석자 또는 웨딩 진행 중이신\n신부분들의 예쁜 순간을 기다립니다.\n\n매주 선정된 사진은 더퀸 공식 계정에서\n리포스트됩니다!",
    tags: ["UGC", "해시태그캠페인"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q83-3", "queen", 7, "8-3", "광고", "인스타 유료광고 집행 (포항·경북·대구 25~35 여성 타겟)", {
    sort_order: 2,
    scenes: [
      scene("소재", "드레스쇼 하이라이트"),
      scene("타겟", "포항·경북·대구 25~35 여성"),
      scene("CTA", "상담 예약·A/B 테스트"),
    ],
    specs: adSpecs({ 타겟: "포항·경북·대구 25~35 여성" }),
    caption: "[광고 집행] 드레스쇼 하이라이트 영상 + #BeTheQueenPohang 랜딩\n목표: 프로필 방문·DM 문의",
    tags: ["유료광고", "인스타광고"],
    tips: "릴스·피드 광고 2종 A/B. 전환은 DM·랜딩.",
  }),
  buildTask("t83-1", "table", 7, "8-3", "릴스", "'런칭 혜택, 이제 2주 남았습니다' 혜택 요약 + 긴박감", {
    sort_order: 3,
    scenes: [
      "씬1: 후킹 — D-14 카운트다운·긴박감 (첫 1~2초)",
      "씬2: 핵심 메시지 — BLUE·ROYAL 가격·3+1",
      "씬3: 가격/혜택 — 무제한 음료·스테이크 기본",
      "씬4: CTA — '지금 예약' + 프로필 링크",
    ],
    specs: reelSpecs("table", {
      톤: "긴박감, 한정성",
      음악: "업템포 BGM",
    }),
    caption: "런칭 혜택, 이제 2주만 남았습니다.\n\n29,900원 BLUE\n68,000→58,000 ROYAL\n3+1 · 무제한 음료\n\n8월 31일 자정 종료.\n후회 없이 지금 예약하세요.\n\n프로필 링크에서",
    tags: ["프로모션", "마감", "한정"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t83-2", "table", 7, "8-3", "피드", "프로모션 D-14 카운트다운 + 혜택 총정리", {
    sort_order: 4,
    scenes: [
      "1장: 음식 메인 사진 + 'D-14 마감'·29,900원",
      "2장: 3대 혜택 — 3+1·무제한 음료·스테이크 기본",
      "3장: CTA — '지금 예약' + 프로필 링크",
    ],
    specs: feedSpecs("table"),
    caption: "마지막 2주!\n\n7월 시작한 런칭 특가\n이제 정말 끝이 납니다.\n\n✓ 29,900원 런치\n✓ 3+1 프로모션\n✓ 무제한 음료\n✓ 전 좌석 스테이크\n\n8월 31일까지만.\n지금 예약하세요.",
    tags: ["D-14", "런칭마감"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t83-3", "table", 7, "8-3", "광고", "인스타 유료광고 집행 (포항·경주·영덕 전연령 타겟)", {
    sort_order: 5,
    scenes: [
      scene("소재", "스테이크 시즐 or 가족"),
      scene("타겟", "포항·경주·영덕 전연령"),
      scene("CTA", "예약 전환"),
    ],
    specs: adSpecs({ 타겟: "포항·경주·영덕 전연령" }),
    caption: "[광고] 런칭 마감 D-14 — 스테이크 뷔페 프로모션\n목표: 예약 전환",
    tags: ["유료광고", "마감캠페인"],
    tips: "가족·회식 소재 2종 타겟 분리 테스트.",
  }),

  // ─── 8-4주: Royal 마감 / 정규 전환 ───
  buildTask("q84-1", "queen", 8, "8-4", "릴스", "7~8월 총정리 '더퀸의 여름' 하이라이트", {
    sort_order: 0,
    scenes: [
      "씬1: 후킹 — 7-8월 하이라이트 몽타주 (첫 1~2초)",
      "씬2: 핵심 메시지 — 드레스쇼·두 홀·UGC 순간",
      "씬3: 가격/혜택 — 여름 캠페인·9월 예고",
      "씬4: CTA — '상담 예약' + 프로필 링크",
    ],
    specs: reelSpecs("queen", {
      스타일: "하이라이트 콜라주",
      음악: "웨딩 감성 클라이막스",
    }),
    caption: "2개월의 드레스쇼, 2개월의 감동.\n\n포항 더퀸에서 만난 예비신부분들과\n함께한 7-8월의 특별한 순간들.\n\n당신의 신부 순간이 더욱 빛나도록,\n더퀸은 여기 있습니다.\n\n9월도 함께하세요.",
    tags: ["더퀸", "포항웨딩홀", "감성"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q84-2", "queen", 8, "8-4", "피드", "캠페인 마감 D-3 긴장감 + 상담 CTA", {
    sort_order: 1,
    scenes: [
      "1장: 메인 사진 + 'D-3 마감 임박' 제목",
      "2장: 핵심 정보 — 얼리버드 혜택·여름 하이라이트",
      "3장: CTA — '상담 예약하기' + 프로필 링크",
    ],
    specs: feedSpecs("queen"),
    caption: "Runtime 혜택은 7월 말까지!\n마지막 주에 상담하시는 분들을 위해\n특별한 혜택을 준비했습니다.\n\n당신의 가을을 더퀸에서 설계해보세요.\n예약은 프로필 링크에서!",
    tags: ["마감", "상담CTA", "얼리버드"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("q84-3", "queen", 8, "8-4", "프로모션", "Royal Membership 즉시 발급 이벤트 (8월 내 조기 계약)", {
    sort_order: 2,
    scenes: [
      scene("이벤트", "Royal Membership 즉시 발급"),
      scene("조건", "8월 내 조기 계약"),
      scene("CTA", "상담 예약"),
    ],
    specs: promoSpecs({ 대상: "8월 내 조기 계약", 혜택: "Royal Membership 즉시 발급" }),
    caption: "8월 내 조기 계약 시 Royal Membership 즉시 발급.\n마지막 주, 상담 예약을 서두르세요.",
    tags: ["RoyalMembership", "조기계약"],
    tips: "계약 조건·혜택은 상담팀과 문구 통일.",
  }),
  buildTask("t84-1", "table", 8, "8-4", "릴스", "'2개월의 기록' 하이라이트 + 방문 고객 스토리", {
    sort_order: 3,
    scenes: [
      "씬1: 후킹 — 7-8월 런칭·고객 만족 (첫 1~2초)",
      "씬2: 핵심 메시지 — 메뉴·후기·감사 메시지",
      "씬3: 가격/혜택 — 프로모션 종료·9월 정규 예고",
      "씬4: CTA — '예약하기' + 프로필 링크",
    ],
    specs: reelSpecs("table", {
      톤: "감사, 기대",
      음악: "웨딩 감성 클라이막스",
    }),
    caption: "2개월간 함께해주신\n모든 분들께 감사합니다.\n\n런칭 프로모션은 종료되지만\n퀸즈테이블의 프리미엄 경험은\n계속됩니다.\n\n9월에도 함께하세요.\n더욱 특별한 맛으로\n인사드리겠습니다.\n\n예약: 프로필 링크",
    tags: ["감사", "퀸즈테이블", "프리미엄"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t84-2", "table", 8, "8-4", "피드", "프로모션 마감 D-3 + 9월 정규 운영 안내", {
    sort_order: 4,
    scenes: [
      "1장: 음식 메인 사진 + 'D-3 마감'·런칭 혜택",
      "2장: 3대 혜택 — 마지막 정리·9월 정가 전환",
      "3장: CTA — '지금 예약' + 프로필 링크",
    ],
    specs: feedSpecs("table"),
    caption: "런칭 혜택은 정말 마지막입니다.\n\n다시는 이 가격으로\n이 프리미엄을 만날 수 없습니다.\n\n마지막 선택지를 놓치지 마세요.\n9월부터는 정가 운영됩니다.\n\n8월 31일까지만.\n지금 예약 → 프로필 링크",
    tags: ["마감", "9월정규"],
    tips: "이미지 또는 영상 선택 가능. 3~4장으로 핵심만 전달하세요.",
  }),
  buildTask("t84-3", "table", 8, "8-4", "프로모션", "마지막 주 혜택 극대화 + 9월 예약 오픈", {
    sort_order: 5,
    scenes: [
      scene("마지막주", "혜택 극대화·8/31 종료"),
      scene("9월", "예약 오픈"),
      scene("CTA", "프로필 링크 예약"),
    ],
    specs: promoSpecs({ 기간: "8-4주 마지막", 혜택: "런칭 혜택 최종 + 9월 예약 오픈" }),
    caption: "마지막 주 혜택 극대화!\n8월 31일 런칭 프로모션 종료.\n9월 예약은 지금 오픈 — 프로필 링크",
    tags: ["마감", "9월예약"],
    tips: "9월 예약 오픈일을 스토리·피드 동시 공지.",
  }),
];

const JULY_TASKS = BASE_SEED_TASKS.filter((t) => t.week_id <= 4);

const SEED_TASKS = [...JULY_TASKS, ...AUGUST_SIMPLE_TASKS];

module.exports = { SEED_TASKS, buildTask };
