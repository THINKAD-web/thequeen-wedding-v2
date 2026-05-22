/**
 * THE QUEEN 웨딩홀 AI 챗봇
 * chatbot/embed.js — 완전 독립형 단일 파일
 * 사용법: <script src="/chatbot/embed.js" defer></script>
 */
(function () {
  "use strict";

  if (window.__tqChatbotMounted) return;
  window.__tqChatbotMounted = true;

  /* ── 시스템 프롬프트 (서버 /api/chat 에서도 동일 내용 사용) ── */
  const SYSTEM_PROMPT = `당신은 THE QUEEN 웨딩 컨벤션홀의 전문 웨딩 플래너 AI 상담사입니다.
따뜻하고 품격 있는 말투로 예비 신랑신부를 응대해 주세요.

=== THE QUEEN 기본 정보 ===
- 정식 명칭: 더 퀸 웨딩 (THE QUEEN WEDDING)
- 주소: 경상북도 포항시 북구 대이로 18
- 웨딩 상담 전화: 054-283-1111
- 퀸즈테이블 전화: 054-281-4000
- 웨딩 상담 운영시간: 평일 09:00–18:00 / 주말 상담 예약 가능
- 인스타그램: @thequeen_pohang
- 카카오톡 채널: @thequeen78
- 포항IC에서 약 5분 거리
- 주차: 1,500대 무료 주차 (포항 최대 규모)
- 리모델링: 2025년 완공

=== 홀 안내 ===
[크라운룸 · 5층]
- 자연광 + 미러 천장 연출로 드레스가 더욱 빛남
- 그린 플라워 아치 포인트, 클래식 & 모던 분위기
- 친밀하고 품격 있는 웨딩을 원하는 분께 추천

[갤럭시룸 · 6층]
- 다크톤 + 크리스탈 샹들리에
- LED 조명 + 미러 바닥의 드라마틱한 입장씬
- 럭셔리 & 화려한 웨딩을 꿈꾸는 분께 추천

두 홀 모두 단독 프라이빗 운영

=== 퀸즈테이블 (QUEEN'S TABLE) · 3층 ===
- 포항 유일 오마카세급 프리미엄 뷔페 / 100% 예약제
- 웨딩 하객, 가족모임, 기업회식, 기념일 등 가능

[가격 · 5/1~6/30 한정 특별가, VAT 포함]
- 평일 런치: 성인 42,000원 / 소인 35,000원 / 유아 20,000원
- 평일·일요일 디너: 성인 62,000원 / 소인 40,000원 / 유아 25,000원
- 토요일 디너 & 공휴일: 성인 78,000원 / 소인 49,000원 / 유아 27,000원

[운영시간]
월·화: 12:00–21:00 (5월 한정) / 수·목·금: 12:00–21:00 (브레이크 15:00–18:00)
토: 18:30–21:00 / 일: 18:00–21:00

=== 제휴 파트너 ===
드레스: 웨딩뮤 / 신랑 예복: 사토리알 비스포크 / 메이크업: 뷰티진동희
스튜디오: 포에트리 스튜디오 / 한복: 황정아 한복 / 플라워: 플라워 바이보윤 / 허니문: UA투어

=== 답변 규칙 ===
- 항상 한국어로 답변
- 웨딩 패키지 정확한 가격은 "맞춤 견적, 전화 상담 권유"로 안내
- 모르는 정보는 솔직히 말하고 054-283-1111 전화 상담 권유
- 답변은 간결하고 명확하게 (3–5문장 이내)
- 따뜻하고 격식 있는 말투 유지`;

  const QUICK = [
    "크라운룸 vs 갤럭시룸 차이",
    "퀸즈테이블 뷔페 가격",
    "웨딩 예약 방법",
    "주차 & 오시는 길",
    "스드메 제휴 업체",
    "더퀸만의 특징",
  ];

  /* ── 상태 ── */
  let isOpen = false;
  let isLoading = false;
  let isMobile = window.innerWidth <= 768;
  let messages = [
    {
      role: "assistant",
      content:
        "안녕하세요 👑 더 퀸 웨딩입니다.\n소중한 날을 위한 준비, 도와드리겠습니다.\n궁금하신 점을 편하게 물어보세요.",
    },
  ];

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth <= 768;
  });

  /* ── 스타일 주입 ── */
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Italiana&display=swap');

    #tq-fab {
      position: fixed;
      bottom: 88px;
      right: 24px;
      z-index: 10056;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a2744, #0f1829);
      border: 1px solid rgba(184,154,94,0.4);
      box-shadow: 0 6px 24px rgba(0,0,0,0.55);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      transition: transform 0.2s;
      pointer-events: auto;
      touch-action: manipulation;
    }
    #tq-fab:hover { transform: scale(1.07); }
    #tq-fab .fab-crown { font-size: 20px; color: #b89a5e; line-height: 1; pointer-events: none; }
    #tq-fab .fab-label { font-size: 9px; color: rgba(184,154,94,0.7); letter-spacing: 1px; font-family: 'Cormorant Garamond', serif; pointer-events: none; }

    #tq-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 10057;
      backdrop-filter: blur(2px);
    }

    #tq-win {
      display: none;
      position: fixed;
      z-index: 10058;
      background: #0A0506 !important;
      border: 1px solid rgba(184,154,94,0.18);
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 20px 80px rgba(0,0,0,0.7);
      font-family: 'Cormorant Garamond', Georgia, serif;
    }

    @media (min-width: 769px) {
      #tq-win {
        bottom: 24px;
        right: 24px;
        width: 380px;
        height: 600px;
        border-radius: 4px;
      }
    }

    @media (max-width: 768px) {
      #tq-win {
        bottom: 0;
        left: 0;
        right: 0;
        height: 88dvh;
        border-radius: 20px 20px 0 0;
        border-left: none;
        border-right: none;
        border-bottom: none;
      }
    }

    #tq-win.open { display: flex; animation: tqSlideUp 0.3s cubic-bezier(0.16,1,0.3,1); }

    @keyframes tqSlideUp {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes tqFadeUp {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes tqDot {
      0%,80%,100% { transform:translateY(0); opacity:.25; }
      40%          { transform:translateY(-4px); opacity:1; }
    }

    #tq-header {
      padding: 14px 16px;
      background: linear-gradient(180deg, #0d0a08, #0A0506) !important;
      border-bottom: 1px solid rgba(184,154,94,0.15);
      flex-shrink: 0;
    }
    .tq-handle {
      width: 36px; height: 4px; border-radius: 2px;
      background: rgba(255,255,255,0.15);
      margin: 0 auto 14px;
      display: none;
    }
    @media (max-width: 768px) {
      #tq-header { padding: 18px 18px 14px; }
      .tq-handle { display: block; }
    }

    .tq-header-inner {
      display: flex; align-items: center; justify-content: space-between;
    }
    .tq-header-left { display: flex; align-items: center; gap: 10px; }
    .tq-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(184,154,94,0.1);
      border: 1px solid rgba(184,154,94,0.35);
      display: flex; align-items: center; justify-content: center;
      color: #b89a5e; font-size: 15px; flex-shrink: 0;
    }
    .tq-title {
      font-family: 'Italiana', serif;
      color: #b89a5e; font-size: 14px; letter-spacing: 3px;
    }
    .tq-status {
      display: flex; align-items: center; gap: 5px; margin-top: 2px;
    }
    .tq-dot-green {
      width: 5px; height: 5px; border-radius: 50%;
      background: #5dbf7a; box-shadow: 0 0 4px #5dbf7a; flex-shrink: 0;
    }
    .tq-status-text {
      font-size: 10.5px; color: rgba(232,221,208,0.5); letter-spacing: 0.8px;
    }
    #tq-close-btn {
      width: 30px; height: 30px; border-radius: 2px;
      background: transparent; border: none;
      color: rgba(232,221,208,0.4); font-size: 17px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: color 0.15s;
    }
    #tq-close-btn:hover { color: #b89a5e; }

    #tq-messages {
      flex: 1; overflow-y: auto;
      padding: 14px;
      display: flex; flex-direction: column; gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(184,154,94,0.2) transparent;
    }
    #tq-messages::-webkit-scrollbar { width: 3px; }
    #tq-messages::-webkit-scrollbar-thumb { background: rgba(184,154,94,0.2); border-radius: 2px; }

    .tq-msg-row {
      display: flex; align-items: flex-end; gap: 8px;
      animation: tqFadeUp 0.25s ease;
    }
    .tq-msg-row.user { justify-content: flex-end; }
    .tq-msg-avatar {
      width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
      background: rgba(184,154,94,0.1);
      border: 1px solid rgba(184,154,94,0.2);
      display: flex; align-items: center; justify-content: center;
      color: #b89a5e; font-size: 11px;
    }
    .tq-bubble {
      max-width: 78%;
      padding: 11px 14px;
      font-size: 14px; line-height: 1.75; letter-spacing: 0.3px;
      font-family: 'Cormorant Garamond', serif;
    }
    .tq-bubble.ai {
      border-radius: 2px 12px 12px 12px;
      background: rgba(255,255,255,0.04) !important;
      border: 1px solid rgba(184,154,94,0.15) !important;
      color: #e8ddd0 !important;
    }
    .tq-bubble.user {
      border-radius: 12px 12px 2px 12px;
      background: rgba(26,39,68,0.7) !important;
      border: 1px solid rgba(26,39,68,0.9);
      color: #c8d4e8 !important;
    }
    @media (max-width: 768px) {
      .tq-bubble { font-size: 15px; max-width: 82%; }
    }

    .tq-dots-wrap {
      padding: 12px 16px;
      border-radius: 2px 12px 12px 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(184,154,94,0.15);
      display: flex; gap: 5px; align-items: center;
    }
    .tq-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #b89a5e; display: inline-block;
    }
    .tq-dot:nth-child(1) { animation: tqDot 1.2s infinite ease-in-out 0s; }
    .tq-dot:nth-child(2) { animation: tqDot 1.2s infinite ease-in-out 0.2s; }
    .tq-dot:nth-child(3) { animation: tqDot 1.2s infinite ease-in-out 0.4s; }

    #tq-quick-wrap {
      padding-left: 34px; margin-top: 4px;
    }
    .tq-quick-label {
      font-size: 10px; color: rgba(232,221,208,0.28);
      letter-spacing: 1.5px; margin-bottom: 8px;
      font-family: 'Cormorant Garamond', serif;
    }
    .tq-quick-grid {
      display: flex; flex-wrap: wrap; gap: 6px;
    }
    .tq-quick-btn {
      background: rgba(184,154,94,0.08) !important;
      border: 1px solid rgba(184,154,94,0.18) !important;
      border-radius: 2px;
      padding: 7px 13px;
      color: #b89a5e !important;
      font-size: 12.5px;
      font-family: 'Cormorant Garamond', serif;
      letter-spacing: 0.4px;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      white-space: nowrap;
    }
    .tq-quick-btn:hover {
      background: rgba(184,154,94,0.18);
      border-color: rgba(184,154,94,0.4);
    }

    #tq-divider { height: 1px; background: rgba(184,154,94,0.12); flex-shrink: 0; }

    #tq-input-area {
      padding: 10px 14px 12px;
      background: rgba(0,0,0,0.2);
      flex-shrink: 0;
    }
    @media (max-width: 768px) {
      #tq-input-area {
        padding: 12px 14px calc(12px + env(safe-area-inset-bottom));
      }
    }
    .tq-input-wrap {
      display: flex; align-items: center; gap: 8px;
      background: rgba(184,154,94,0.07) !important;
      border: 1px solid rgba(184,154,94,0.18) !important;
      border-radius: 2px;
      padding: 9px 10px 9px 14px;
    }
    #tq-input {
      flex: 1; background: transparent !important; border: none; outline: none;
      color: #e8ddd0 !important;
      font-family: 'Cormorant Garamond', serif;
      font-size: 15px; letter-spacing: 0.3px;
    }
    #tq-input::placeholder { color: rgba(232,221,208,0.28); }
    #tq-send {
      width: 36px; height: 36px; border-radius: 2px; border: none;
      background: linear-gradient(135deg, #c9a25b, #9a7535);
      color: #fff; font-size: 16px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: opacity 0.15s, transform 0.15s;
    }
    #tq-send:disabled {
      background: rgba(184,154,94,0.15);
      color: rgba(232,221,208,0.25);
      cursor: not-allowed; opacity: 0.5;
    }
    #tq-send:not(:disabled):hover { transform: scale(1.06); }
    .tq-input-hint {
      text-align: center; margin-top: 7px;
      font-size: 10px; color: rgba(232,221,208,0.22);
      letter-spacing: 0.4px; font-family: 'Cormorant Garamond', serif;
    }

    #tq-scroll-btn {
      position: fixed;
      bottom: 152px;
      right: 24px;
      z-index: 10055;
      width: 44px; height: 44px;
      border-radius: 2px;
      background: rgba(10,5,6,0.85);
      border: 1px solid rgba(184,154,94,0.28);
      color: rgba(184,154,94,0.65);
      font-size: 16px; cursor: pointer;
      display: none;
      align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
      transition: opacity 0.2s;
      font-family: sans-serif;
      pointer-events: auto;
      touch-action: manipulation;
    }
    #tq-scroll-btn:hover { color: #b89a5e; }
    #tq-scroll-btn.visible { display: flex; }

    /* HTML 플로팅 레일 중복 FAB 숨김 */
    #tqChatFab, .tq-float-ai { display: none !important; }
  `;
  document.head.appendChild(style);

  /* ── DOM 생성 ── */
  const overlay = document.createElement("div");
  overlay.id = "tq-overlay";
  document.body.appendChild(overlay);

  const fab = document.createElement("button");
  fab.id = "tq-fab";
  fab.setAttribute("aria-label", "더 퀸 웨딩 AI 상담");
  fab.innerHTML = `<span class="fab-crown">♛</span><span class="fab-label">상담</span>`;
  document.body.appendChild(fab);

  const win = document.createElement("div");
  win.id = "tq-win";
  win.innerHTML = `
    <div id="tq-header">
      <div class="tq-handle"></div>
      <div class="tq-header-inner">
        <div class="tq-header-left">
          <div class="tq-avatar">♛</div>
          <div>
            <div class="tq-title">THE QUEEN</div>
            <div class="tq-status">
              <span class="tq-dot-green"></span>
              <span class="tq-status-text">AI 웨딩 플래너 · 온라인</span>
            </div>
          </div>
        </div>
        <button id="tq-close-btn" aria-label="닫기">✕</button>
      </div>
    </div>
    <div id="tq-messages"></div>
    <div id="tq-divider"></div>
    <div id="tq-input-area">
      <div class="tq-input-wrap">
        <input id="tq-input" placeholder="질문을 입력하세요…" autocomplete="off" />
        <button id="tq-send" disabled>↑</button>
      </div>
      <div class="tq-input-hint">AI 답변은 참고용입니다 · 중요 사항은 054-283-1111 확인</div>
    </div>
  `;
  document.body.appendChild(win);

  const scrollBtn = document.createElement("button");
  scrollBtn.id = "tq-scroll-btn";
  scrollBtn.setAttribute("aria-label", "맨 위로");
  scrollBtn.innerHTML = "↑";
  document.body.appendChild(scrollBtn);

  const msgContainer = win.querySelector("#tq-messages");
  const inputEl = win.querySelector("#tq-input");
  const sendBtn = win.querySelector("#tq-send");
  const closeBtn = win.querySelector("#tq-close-btn");

  window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("visible", window.scrollY > 300);
  });
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function renderMessages() {
    msgContainer.innerHTML = "";

    messages.forEach((m) => {
      const row = document.createElement("div");
      row.className = `tq-msg-row ${m.role === "user" ? "user" : ""}`;

      if (m.role === "assistant") {
        row.innerHTML = `<div class="tq-msg-avatar">♛</div>`;
      }

      const bubble = document.createElement("div");
      bubble.className = `tq-bubble ${m.role === "user" ? "user" : "ai"}`;
      bubble.innerHTML = m.content.replace(/\n/g, "<br>");
      row.appendChild(bubble);
      msgContainer.appendChild(row);
    });

    if (isLoading) {
      const row = document.createElement("div");
      row.className = "tq-msg-row";
      row.innerHTML = `
        <div class="tq-msg-avatar">♛</div>
        <div class="tq-dots-wrap">
          <span class="tq-dot"></span>
          <span class="tq-dot"></span>
          <span class="tq-dot"></span>
        </div>`;
      msgContainer.appendChild(row);
    }

    if (messages.length <= 1 && !isLoading) {
      const wrap = document.createElement("div");
      wrap.id = "tq-quick-wrap";
      wrap.innerHTML = `
        <div class="tq-quick-label">자주 묻는 질문</div>
        <div class="tq-quick-grid">
          ${QUICK.map((q) => `<button class="tq-quick-btn" data-q="${q.replace(/"/g, "&quot;")}">${q}</button>`).join("")}
        </div>`;
      msgContainer.appendChild(wrap);

      wrap.querySelectorAll(".tq-quick-btn").forEach((btn) => {
        btn.addEventListener("click", () => sendMessage(btn.dataset.q));
      });
    }

    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  async function sendMessage(text) {
    const msg = (text || inputEl.value).trim();
    if (!msg || isLoading) return;

    messages.push({ role: "user", content: msg });
    inputEl.value = "";
    sendBtn.disabled = true;
    isLoading = true;
    renderMessages();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.detail || `HTTP ${res.status}`);
      }
      messages.push({
        role: "assistant",
        content: data.content || "잠시 후 다시 시도해 주세요.",
      });
    } catch (e) {
      console.error("[TQ Chatbot]", e);
      messages.push({
        role: "assistant",
        content: "연결에 문제가 발생했습니다.\n054-283-1111로 직접 문의해 주세요 🙏",
      });
    } finally {
      isLoading = false;
      renderMessages();
      if (!isMobile) inputEl.focus();
    }
  }

  function openChat() {
    isOpen = true;
    win.classList.add("open");
    fab.style.display = "none";
    if (isMobile) {
      overlay.style.display = "block";
      document.body.style.overflow = "hidden";
    }
    renderMessages();
    setTimeout(() => inputEl.focus(), 300);
  }

  function closeChat() {
    isOpen = false;
    win.classList.remove("open");
    fab.style.display = "flex";
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  fab.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);
  overlay.addEventListener("click", closeChat);

  inputEl.addEventListener("input", () => {
    sendBtn.disabled = !inputEl.value.trim() || isLoading;
  });
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });
  sendBtn.addEventListener("click", () => sendMessage());

  renderMessages();
})();
