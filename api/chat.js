const SYSTEM_PROMPT = require("../lib/chatbot-system-prompt");

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  let body = "";
  await new Promise((resolve) => {
    req.on("data", (c) => (body += c));
    req.on("end", resolve);
  });
  return body;
}

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.end();
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json(res, 500, { ok: false, error: "api_key_not_configured" });
  }

  let body;
  try {
    body = JSON.parse((await readBody(req)) || "{}");
  } catch {
    return json(res, 400, { ok: false, error: "invalid_json" });
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return json(res, 400, { ok: false, error: "messages_required" });
  }

  const sanitized = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }))
    .slice(-20);

  if (sanitized.length === 0) {
    return json(res, 400, { ok: false, error: "messages_required" });
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: sanitized,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      const detail = data?.error?.message || data?.message || "anthropic_error";
      return json(res, anthropicRes.status >= 500 ? 502 : 400, {
        ok: false,
        error: "anthropic_error",
        detail: String(detail).slice(0, 300),
      });
    }

    const text =
      data.content?.find((b) => b.type === "text")?.text ||
      data.content?.[0]?.text ||
      "잠시 후 다시 시도해 주세요.";

    return json(res, 200, { ok: true, content: text });
  } catch (err) {
    return json(res, 502, {
      ok: false,
      error: "upstream_failed",
      detail: String(err?.message || err).slice(0, 200),
    });
  }
};
