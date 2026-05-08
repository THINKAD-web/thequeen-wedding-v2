const UAParser = require("ua-parser-js");
const { redisEnabled, hincrby, lpush, ltrim } = require("./_redis");

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

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "method_not_allowed" });

  let body = "";
  await new Promise((resolve) => {
    req.on("data", (c) => (body += c));
    req.on("end", resolve);
  });

  let payload = {};
  try {
    payload = body ? JSON.parse(body) : {};
  } catch {
    payload = {};
  }

  const path = String(payload.path || payload.page || "").slice(0, 200) || "/";
  const ref = String(payload.ref || payload.referer || req.headers.referer || "").slice(0, 300);

  const ua = String(req.headers["user-agent"] || "");
  const parsed = new UAParser(ua).getResult();
  const deviceType = parsed.device?.type || "desktop";
  const os = parsed.os?.name ? `${parsed.os.name}${parsed.os.version ? " " + parsed.os.version : ""}` : "unknown";
  const browser = parsed.browser?.name
    ? `${parsed.browser.name}${parsed.browser.version ? " " + parsed.browser.version : ""}`
    : "unknown";

  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const keyBase = `tq:v1:${day}`;

  const utm = payload && typeof payload.utm === "object" && payload.utm ? payload.utm : {};
  const click = payload && typeof payload.click === "object" && payload.click ? payload.click : {};

  let utmSource = String(utm.source || "").slice(0, 80);
  let utmMedium = String(utm.medium || "").slice(0, 80);
  let utmCampaign = String(utm.campaign || "").slice(0, 120);
  let gclid = String(click.gclid || "").slice(0, 160);
  let fbclid = String(click.fbclid || "").slice(0, 160);
  let msclkid = String(click.msclkid || "").slice(0, 160);
  let wbraid = String(click.wbraid || "").slice(0, 160);
  let gbraid = String(click.gbraid || "").slice(0, 160);

  // Fallback: parse utm/click ids directly from the URL in `path` (we include querystring).
  if (!utmSource && !utmMedium && !utmCampaign && !gclid && !fbclid && !msclkid && !wbraid && !gbraid) {
    try {
      const u = new URL(path, "https://thequeenwedding.kr");
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
        source = ref ? (new URL(ref).hostname || "direct") : "direct";
      } catch {
        source = ref ? "ref" : "direct";
      }
    }
  }
  const medium = utmMedium || ((gclid || wbraid || gbraid || fbclid || msclkid) ? "cpc" : "");
  const campaign = utmCampaign || "";

  const event = {
    t: Date.now(),
    path,
    ref,
    ip: clientIp(req),
    ua,
    deviceType,
    os,
    browser,
    src: source || "",
    med: medium || "",
    camp: campaign || "",
  };

  if (redisEnabled()) {
    try {
      await Promise.all([
        hincrby(`${keyBase}:device`, deviceType, 1),
        hincrby(`${keyBase}:os`, os, 1),
        hincrby(`${keyBase}:browser`, browser, 1),
        hincrby(`${keyBase}:path`, path, 1),
        hincrby(`${keyBase}:src`, source || "unknown", 1),
        medium ? hincrby(`${keyBase}:med`, medium, 1) : Promise.resolve(null),
        campaign ? hincrby(`${keyBase}:camp`, campaign, 1) : Promise.resolve(null),
        lpush(`${keyBase}:events`, JSON.stringify(event)),
      ]);
      // keep latest ~500 events/day
      await ltrim(`${keyBase}:events`, 0, 499);
    } catch {
      // analytics should never break the page
    }
  }

  return json(res, 200, { ok: true });
};
