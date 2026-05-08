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

  let utmSource = String(fields.__utm_source || fields.utm_source || "").slice(0, 80);
  let utmMedium = String(fields.__utm_medium || fields.utm_medium || "").slice(0, 80);
  let utmCampaign = String(fields.__utm_campaign || fields.utm_campaign || "").slice(0, 120);
  let gclid = String(fields.__gclid || fields.gclid || "").slice(0, 160);
  let fbclid = String(fields.__fbclid || fields.fbclid || "").slice(0, 160);
  let msclkid = String(fields.__msclkid || fields.msclkid || "").slice(0, 160);
  let wbraid = String(fields.__wbraid || fields.wbraid || "").slice(0, 160);
  let gbraid = String(fields.__gbraid || fields.gbraid || "").slice(0, 160);

  // Fallback: parse utm/click ids from the submitted path (includes querystring).
  if (!utmSource && !utmMedium && !utmCampaign && !gclid && !fbclid && !msclkid && !wbraid && !gbraid) {
    const p = String(meta.path || "");
    try {
      const u = new URL(p, "https://thequeenwedding.kr");
      utmSource = String(u.searchParams.get("utm_source") || "").slice(0, 80);
      utmMedium = String(u.searchParams.get("utm_medium") || "").slice(0, 80);
      utmCampaign = String(u.searchParams.get("utm_campaign") || "").slice(0, 120);
      gclid = String(u.searchParams.get("gclid") || "").slice(0, 160);
      fbclid = String(u.searchParams.get("fbclid") || "").slice(0, 160);
      msclkid = String(u.searchParams.get("msclkid") || "").slice(0, 160);
      wbraid = String(u.searchParams.get("wbraid") || "").slice(0, 160);
      gbraid = String(u.searchParams.get("gbraid") || "").slice(0, 160);
    } catch {
      // ignore
    }
  }

  let source = utmSource;
  if (!source) {
    if (gclid || wbraid || gbraid) source = "google";
    else if (fbclid) source = "facebook";
    else if (msclkid) source = "bing";
    else {
      try {
        source = meta.referer ? (new URL(meta.referer).hostname || "direct") : "direct";
      } catch {
        source = meta.referer ? "ref" : "direct";
      }
    }
  }
  const medium = utmMedium || ((gclid || wbraid || gbraid || fbclid || msclkid) ? "cpc" : "");
  const campaign = utmCampaign || "";

  if (redisEnabled()) {
    try {
      const event = { t: Date.now(), kind: "form", fields, meta };
      await Promise.all([
        hincrby(`${keyBase}:form:device`, deviceType, 1),
        hincrby(`${keyBase}:form:os`, os, 1),
        hincrby(`${keyBase}:form:browser`, browser, 1),
        hincrby(`${keyBase}:form:src`, source || "unknown", 1),
        medium ? hincrby(`${keyBase}:form:med`, medium, 1) : Promise.resolve(null),
        campaign ? hincrby(`${keyBase}:form:camp`, campaign, 1) : Promise.resolve(null),
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

