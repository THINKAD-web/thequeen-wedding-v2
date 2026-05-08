const UAParser = require("ua-parser-js");
const { redisEnabled, lpush, ltrim, hincrby } = require("./_redis");

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (xf) return String(xf).split(",")[0].trim();
  return req.socket?.remoteAddress || "";
}

async function readBody(req) {
  let body = "";
  await new Promise((resolve) => {
    req.on("data", (c) => (body += c));
    req.on("end", resolve);
  });
  return body;
}

function parseUrlEncoded(body) {
  const params = new URLSearchParams(body);
  const out = {};
  for (const [k, v] of params.entries()) {
    if (out[k] !== undefined) {
      if (!Array.isArray(out[k])) out[k] = [out[k]];
      out[k].push(v);
    } else out[k] = v;
  }
  return out;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "method_not_allowed" });

  const ct = String(req.headers["content-type"] || "");
  const raw = await readBody(req);

  let fields = {};
  if (ct.includes("application/json")) {
    try {
      fields = raw ? JSON.parse(raw) : {};
    } catch {
      fields = {};
    }
  } else {
    fields = parseUrlEncoded(raw);
  }

  // basic bot trap support
  const gotcha = String(fields._gotcha || "").trim();
  if (gotcha) return json(res, 200, { ok: true });

  const ua = String(req.headers["user-agent"] || "");
  const parsed = new UAParser(ua).getResult();
  const deviceType = parsed.device?.type || "desktop";
  const os = parsed.os?.name ? `${parsed.os.name}${parsed.os.version ? " " + parsed.os.version : ""}` : "unknown";
  const browser = parsed.browser?.name
    ? `${parsed.browser.name}${parsed.browser.version ? " " + parsed.browser.version : ""}`
    : "unknown";

  const meta = {
    submittedAt: new Date().toISOString(),
    path: String(fields.__path || fields["문의 경로"] || fields["신청 경로"] || req.headers.referer || "").slice(0, 300),
    referer: String(req.headers.referer || "").slice(0, 300),
    ip: clientIp(req),
    ua,
    deviceType,
    os,
    browser,
  };

  const day = new Date().toISOString().slice(0, 10);
  const keyBase = `tq:v1:${day}`;

  if (redisEnabled()) {
    try {
      const event = { t: Date.now(), kind: "form", fields, meta };
      await Promise.all([
        hincrby(`${keyBase}:form:device`, deviceType, 1),
        hincrby(`${keyBase}:form:os`, os, 1),
        hincrby(`${keyBase}:form:browser`, browser, 1),
        lpush(`${keyBase}:form:events`, JSON.stringify(event)),
      ]);
      await ltrim(`${keyBase}:form:events`, 0, 199);
    } catch {
      // analytics should never block form submission
    }
  }

  // Forward to SubmitForm
  const target = "https://submit-form.com/EieKRiFZS";
  const forwardPayload = {
    ...fields,
    "__meta_path": meta.path,
    "__meta_referer": meta.referer,
    "__meta_device": meta.deviceType,
    "__meta_os": meta.os,
    "__meta_browser": meta.browser,
  };

  const forwardRes = await fetch(target, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(forwardPayload),
  });

  if (!forwardRes.ok) {
    const text = await forwardRes.text().catch(() => "");
    return json(res, 502, { ok: false, error: "forward_failed", detail: text.slice(0, 400) });
  }

  return json(res, 200, { ok: true });
};

