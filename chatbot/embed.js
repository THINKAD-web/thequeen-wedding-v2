/**
 * THE QUEEN 웨딩홀 AI 챗봇 v5
 * 사이트 크림/네이비/골드 톤에 맞춘 라이트 테마
 * Shadow DOM — 사이트 CSS 완전 차단
 */
(function () {
  "use strict";

  if (window.__tqChatbotMounted) return;
  window.__tqChatbotMounted = true;

  const SYSTEM_PROMPT = `당신은 THE QUEEN 웨딩 컨벤션홀의 전문 웨딩 플래너 AI 상담사입니다.
따뜻하고 품격 있는 말투로 예비 신랑신부를 응대해 주세요.

=== THE QUEEN 기본 정보 ===
- 정식 명칭: 더 퀸 웨딩 (THE QUEEN WEDDING)
- 주소: 경상북도 포항시 북구 대이로 18
- 웨딩 상담 전화: 054-283-1111 / 퀸즈테이블: 054-281-4000
- 운영시간: 평일 09:00–18:00 / 주말 상담 예약 가능
- 인스타그램: @thequeen_pohang / 카카오톡: @thequeen78
- 포항IC 5분 거리 / 무료주차 1,500대 / 2025년 리모델링 완공

=== 홀 안내 ===
[크라운룸 · 5층] 자연광+미러천장, 그린플라워아치, 클래식&모던, 단독프라이빗
[갤럭시룸 · 6층] 다크톤+크리스탈샹들리에, LED+미러바닥, 럭셔리&드라마틱, 단독프라이빗

=== 퀸즈테이블 (3층) ===
포항 유일 오마카세급 프리미엄 뷔페 / 100% 예약제
[5/1~6/30 특별가 VAT포함]
평일런치: 성인42,000/소인35,000/유아20,000
평일·일요일디너: 성인62,000/소인40,000/유아25,000
토요일디너&공휴일: 성인78,000/소인49,000/유아27,000
운영: 월~금 12:00-21:00(브레이크15-18) / 토 18:30-21:00 / 일 18:00-21:00

=== 제휴 파트너 ===
드레스:웨딩뮤 / 신랑예복:사토리알비스포크 / 메이크업:뷰티진동희
스튜디오:포에트리스튜디오 / 한복:황정아한복 / 플라워:플라워바이보윤 / 허니문:UA투어

=== 답변 규칙 ===
항상 한국어, 3-5문장 이내, 따뜻하고 격식있게
웨딩패키지 가격은 맞춤견적 안내, 모르는 건 054-283-1111 전화상담 권유`;

  const QUICK = [
    "크라운룸 vs 갤럭시룸 차이",
    "퀸즈테이블 뷔페 가격",
    "웨딩 예약 방법",
    "주차 & 오시는 길",
    "스드메 제휴 업체",
    "더퀸만의 특징",
  ];

  const SESSION_ID = "tq_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);

  let isOpen = false;
  let isLoading = false;
  let messages = [{
    role: "assistant",
    content: "안녕하세요 👑 더 퀸 웨딩입니다.\n소중한 날을 위한 준비, 도와드리겠습니다.\n궁금하신 점을 편하게 물어보세요.",
  }];

  /* Shadow DOM */
  const host = document.createElement("div");
  host.id = "tq-chatbot-root";
  host.style.cssText = "position:fixed;bottom:0;right:0;z-index:2147483647;pointer-events:none;width:0;height:0;";
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Italiana&display=swap');

    *, *::before, *::after {
      box-sizing: border-box; margin: 0; padding: 0;
      border: none; outline: none; -webkit-tap-highlight-color: transparent;
    }

    /* ── 스크롤 버튼 ── */
    #scroll-btn {
      position: fixed; bottom: 152px; right: 24px; z-index: 9997;
      width: 42px; height: 42px; border-radius: 3px;
      background: #1a2744;
      border: 1px solid rgba(184,154,94,0.4);
      color: rgba(184,154,94,0.9);
      font-size: 16px; font-family: sans-serif;
      cursor: pointer; pointer-events: all;
      display: none; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      transition: background 0.2s;
    }
    #scroll-btn.show { display: flex; }
    #scroll-btn:hover { background: #243660; }

    /* ── FAB ── */
    #fab {
      position: fixed; bottom: 88px; right: 24px; z-index: 9998;
      width: 52px; height: 52px; border-radius: 50%;
      background: #1a2744;
      border: 1px solid rgba(184,154,94,0.5);
      box-shadow: 0 6px 24px rgba(26,39,68,0.4);
      cursor: pointer; pointer-events: all;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #fab:hover { transform: scale(1.06); box-shadow: 0 8px 28px rgba(26,39,68,0.5); }
    #fab span {
      font-family: 'Cormorant Garamond', serif;
      font-size: 13px; font-weight: 500;
      color: #c9a85c; letter-spacing: 0.5px;
    }

    /* ── 오버레이 ── */
    #overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(15,20,35,0.5); backdrop-filter: blur(4px);
      z-index: 9999; pointer-events: all;
    }
    #overlay.show { display: block; animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }

    /* ── 챗봇 윈도우 ── */
    #win {
      display: none; position: fixed;
      bottom: 24px; right: 24px;
      width: 360px; height: 580px;
      border-radius: 12px;
      background: #faf8f4;
      border: 1px solid rgba(184,154,94,0.25);
      box-shadow: 0 24px 64px rgba(26,39,68,0.18), 0 4px 16px rgba(0,0,0,0.08);
      flex-direction: column; overflow: hidden;
      z-index: 10000; pointer-events: all;
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    @media (max-width: 768px) {
      #win {
        bottom: 0; right: 0; left: 0;
        width: 100%; height: 88dvh;
        border-radius: 20px 20px 0 0;
        border-left: none; border-right: none; border-bottom: none;
      }
    }
    #win.show { display: flex; animation: slideUp 0.32s cubic-bezier(0.16,1,0.3,1); }
    @keyframes slideUp {
      from { opacity:0; transform:translateY(16px); }
      to   { opacity:1; transform:translateY(0); }
    }

    /* ── 헤더 ── */
    #header {
      padding: 14px 16px;
      background: #1a2744;
      flex-shrink: 0;
    }
    @media (max-width: 768px) { #header { padding: 20px 18px 14px; } }
    .handle {
      width: 36px; height: 4px; border-radius: 2px;
      background: rgba(255,255,255,0.2);
      margin: 0 auto 14px; display: none;
    }
    @media (max-width: 768px) { .handle { display: block; } }
    .header-row { display: flex; align-items: center; justify-content: space-between; }
    .header-left { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(184,154,94,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; flex-shrink: 0;
    }
    .h-title {
      font-family: 'Italiana', serif;
      color: #c9a85c; font-size: 15px; letter-spacing: 3px;
      display: block; line-height: 1;
    }
    .h-status { display: flex; align-items: center; gap: 5px; margin-top: 4px; }
    .green-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: #5dbf7a; box-shadow: 0 0 5px #5dbf7a; flex-shrink: 0;
    }
    .status-text {
      font-size: 10px; color: rgba(255,255,255,0.5);
      letter-spacing: 1px; font-family: 'Cormorant Garamond', serif;
    }
    #close-btn {
      width: 28px; height: 28px; border-radius: 50%;
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6); font-size: 15px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      pointer-events: all; transition: background 0.15s, color 0.15s;
      font-family: sans-serif; line-height: 1;
    }
    #close-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }

    /* ── 메시지 영역 ── */
    #messages {
      flex: 1; overflow-y: auto; overflow-x: hidden;
      padding: 16px 14px;
      display: flex; flex-direction: column; gap: 14px;
      background: #faf8f4;
      scrollbar-width: thin; scrollbar-color: rgba(184,154,94,0.2) transparent;
    }
    #messages::-webkit-scrollbar { width: 3px; }
    #messages::-webkit-scrollbar-thumb { background: rgba(184,154,94,0.25); border-radius: 2px; }

    @keyframes fadeUp {
      from { opacity:0; transform:translateY(6px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .msg-row {
      display: flex; align-items: flex-end; gap: 8px;
      animation: fadeUp 0.22s ease;
    }
    .msg-row.user { justify-content: flex-end; }

    .msg-avatar {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: #1a2744;
      border: 1px solid rgba(184,154,94,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px;
    }

    /* AI 말풍선 — 흰색 카드 */
    .bubble.ai {
      max-width: 78%;
      padding: 12px 15px;
      border-radius: 4px 16px 16px 16px;
      background: #ffffff;
      border: 1px solid rgba(26,39,68,0.08);
      box-shadow: 0 2px 8px rgba(26,39,68,0.07);
      color: #2a2018;
      font-family: 'Cormorant Garamond', serif;
      font-size: 14.5px; line-height: 1.75; letter-spacing: 0.2px;
    }
    /* 유저 말풍선 — 네이비 */
    .bubble.user {
      max-width: 78%;
      padding: 12px 15px;
      border-radius: 16px 16px 4px 16px;
      background: #1a2744;
      border: 1px solid rgba(26,39,68,0.9);
      color: #e8f0ff;
      font-family: 'Cormorant Garamond', serif;
      font-size: 14.5px; line-height: 1.75; letter-spacing: 0.2px;
    }
    @media (max-width: 768px) {
      .bubble.ai, .bubble.user { font-size: 15.5px; max-width: 82%; }
    }

    /* 로딩 점 */
    .dots-wrap {
      padding: 13px 16px;
      border-radius: 4px 16px 16px 16px;
      background: #ffffff;
      border: 1px solid rgba(26,39,68,0.08);
      box-shadow: 0 2px 8px rgba(26,39,68,0.07);
      display: flex; gap: 5px; align-items: center;
    }
    @keyframes dotBounce {
      0%,80%,100% { transform:translateY(0); opacity:.3; }
      40%          { transform:translateY(-5px); opacity:1; }
    }
    .dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #b89a5e; display: inline-block;
    }
    .dot:nth-child(1) { animation: dotBounce 1.2s infinite ease-in-out 0s; }
    .dot:nth-child(2) { animation: dotBounce 1.2s infinite ease-in-out 0.2s; }
    .dot:nth-child(3) { animation: dotBounce 1.2s infinite ease-in-out 0.4s; }

    /* 빠른 질문 */
    .quick-wrap { padding-left: 36px; }
    .quick-label {
      font-size: 10px; color: rgba(42,32,24,0.4);
      letter-spacing: 1.5px; margin-bottom: 8px;
      font-family: 'Cormorant Garamond', serif; text-transform: uppercase;
    }
    .quick-grid { display: flex; flex-wrap: wrap; gap: 6px; }
    .quick-btn {
      background: #fff;
      border: 1px solid rgba(184,154,94,0.4);
      border-radius: 20px;
      padding: 6px 13px;
      color: #1a2744;
      font-size: 12.5px;
      font-family: 'Cormorant Garamond', serif;
      letter-spacing: 0.3px;
      cursor: pointer; pointer-events: all;
      white-space: nowrap;
      transition: background 0.15s, border-color 0.15s;
      box-shadow: 0 1px 4px rgba(26,39,68,0.08);
    }
    .quick-btn:hover {
      background: #f0ebe0;
      border-color: rgba(184,154,94,0.7);
    }

    /* 구분선 */
    #divider { height: 1px; background: rgba(26,39,68,0.08); flex-shrink: 0; }

    /* 입력 영역 */
    #input-area {
      padding: 12px 14px 14px;
      background: #faf8f4;
      flex-shrink: 0;
    }
    @media (max-width: 768px) {
      #input-area { padding: 12px 14px calc(14px + env(safe-area-inset-bottom)); }
    }
    .input-wrap {
      display: flex; align-items: center; gap: 8px;
      background: #ffffff;
      border: 1px solid rgba(26,39,68,0.15);
      border-radius: 24px;
      padding: 8px 8px 8px 16px;
      box-shadow: 0 2px 8px rgba(26,39,68,0.06);
      transition: border-color 0.2s;
    }
    .input-wrap:focus-within {
      border-color: rgba(184,154,94,0.6);
    }
    #chat-input {
      flex: 1; background: transparent;
      color: #2a2018;
      font-family: 'Cormorant Garamond', serif;
      font-size: 15px; letter-spacing: 0.2px;
      caret-color: #b89a5e;
    }
    #chat-input::placeholder { color: rgba(42,32,24,0.35); }
    #send-btn {
      width: 34px; height: 34px; border-radius: 50%;
      background: #1a2744;
      color: #c9a85c; font-size: 15px;
      cursor: pointer; pointer-events: all;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.15s, transform 0.15s;
      font-family: sans-serif;
    }
    #send-btn:disabled {
      background: rgba(26,39,68,0.15);
      color: rgba(42,32,24,0.25);
      cursor: not-allowed;
    }
    #send-btn:not(:disabled):hover { background: #243660; transform: scale(1.05); }
    .input-hint {
      text-align: center; margin-top: 8px;
      font-size: 10px; color: rgba(42,32,24,0.28);
      letter-spacing: 0.3px; font-family: 'Cormorant Garamond', serif;
    }
  `;

  const HTML = `
    <style>${CSS}</style>

    <button id="scroll-btn" aria-label="맨 위로">↑</button>

    <button id="fab" aria-label="챗봇 열기">
      <span>챗봇</span>
    </button>

    <div id="overlay"></div>

    <div id="win" role="dialog" aria-label="THE QUEEN AI 챗봇">
      <div id="header">
        <div class="handle"></div>
        <div class="header-row">
          <div class="header-left">
            <div class="avatar">💬</div>
            <div>
              <span class="h-title">THE QUEEN</span>
              <div class="h-status">
                <span class="green-dot"></span>
                <span class="status-text">AI 웨딩 플래너 · 온라인</span>
              </div>
            </div>
          </div>
          <button id="close-btn" aria-label="닫기">✕</button>
        </div>
      </div>

      <div id="messages"></div>
      <div id="divider"></div>

      <div id="input-area">
        <div class="input-wrap">
          <input id="chat-input" type="text" placeholder="궁금한 점을 물어보세요…" autocomplete="off" />
          <button id="send-btn" disabled aria-label="전송">↑</button>
        </div>
        <div class="input-hint">AI 답변은 참고용 · 중요 사항은 054-283-1111 확인</div>
      </div>
    </div>
  `;

  shadow.innerHTML = HTML;

  /* DOM 참조 */
  const scrollBtn = shadow.getElementById("scroll-btn");
  const fab       = shadow.getElementById("fab");
  const overlay   = shadow.getElementById("overlay");
  const win       = shadow.getElementById("win");
  const msgBox    = shadow.getElementById("messages");
  const inputEl   = shadow.getElementById("chat-input");
  const sendBtn   = shadow.getElementById("send-btn");
  const closeBtn  = shadow.getElementById("close-btn");

  /* 스크롤 버튼 */
  window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("show", window.scrollY > 300);
  });
  scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* 렌더 */
  function render() {
    msgBox.innerHTML = "";
    messages.forEach((m) => {
      const row = document.createElement("div");
      row.className = "msg-row" + (m.role === "user" ? " user" : "");
      if (m.role === "assistant") {
        row.innerHTML = `<div class="msg-avatar">💬</div>`;
      }
      const bubble = document.createElement("div");
      bubble.className = "bubble " + (m.role === "user" ? "user" : "ai");
      bubble.innerHTML = m.content
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/\n/g, "<br>");
      row.appendChild(bubble);
      msgBox.appendChild(row);
    });

    if (isLoading) {
      const row = document.createElement("div");
      row.className = "msg-row";
      row.innerHTML = `<div class="msg-avatar">💬</div><div class="dots-wrap"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
      msgBox.appendChild(row);
    }

    if (messages.length <= 1 && !isLoading) {
      const wrap = document.createElement("div");
      wrap.className = "quick-wrap";
      wrap.innerHTML = `
        <div class="quick-label">자주 묻는 질문</div>
        <div class="quick-grid">
          ${QUICK.map(q => `<button class="quick-btn">${q}</button>`).join("")}
        </div>`;
      wrap.querySelectorAll(".quick-btn").forEach(btn => {
        btn.addEventListener("click", () => send(btn.textContent));
      });
      msgBox.appendChild(wrap);
    }

    msgBox.scrollTop = msgBox.scrollHeight;
  }

  /* 전송 */
  async function send(text) {
    const msg = (text || inputEl.value).trim();
    if (!msg || isLoading) return;
    messages.push({ role: "user", content: msg });
    inputEl.value = "";
    sendBtn.disabled = true;
    isLoading = true;
    render();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          session_id: SESSION_ID,
          page_url: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.detail || String(res.status));
      }
      messages.push({
        role: "assistant",
        content: data.content || "잠시 후 다시 시도해 주세요.",
      });
    } catch {
      messages.push({ role: "assistant", content: "연결에 문제가 발생했습니다.\n054-283-1111로 직접 문의해 주세요 🙏" });
    } finally {
      isLoading = false;
      render();
      inputEl.focus();
    }
  }

  /* 열기/닫기 */
  function openChat() {
    isOpen = true;
    win.classList.add("show");
    fab.style.display = "none";
    if (window.innerWidth <= 768) {
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }
    history.pushState({ tqChat: true }, "");
    window.addEventListener("popstate", function onPop(e) {
      if (isOpen) { closeChat(); }
      window.removeEventListener("popstate", onPop);
    });
    render();
    setTimeout(() => inputEl.focus(), 300);
  }
  function closeChat() {
    isOpen = false;
    win.classList.remove("show");
    fab.style.display = "flex";
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  fab.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);
  overlay.addEventListener("click", closeChat);
  inputEl.addEventListener("input", () => {
    sendBtn.disabled = !inputEl.value.trim() || isLoading;
  });
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!sendBtn.disabled) send(); }
  });
  sendBtn.addEventListener("click", () => send());

  render();
})();
