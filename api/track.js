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

  const event = {
    t: Date.now(),
    path,
    ref,
    ip: clientIp(req),
    ua,
    deviceType,
    os,
    browser,
  };

  if (redisEnabled()) {
    await Promise.all([
      hincrby(`${keyBase}:device`, deviceType, 1),
      hincrby(`${keyBase}:os`, os, 1),
      hincrby(`${keyBase}:browser`, browser, 1),
      hincrby(`${keyBase}:path`, path, 1),
      lpush(`${keyBase}:events`, JSON.stringify(event)),
    ]);
    // keep latest ~500 events/day
    await ltrim(`${keyBase}:events`, 0, 499);
  }

  return json(res, 200, { ok: true });
};
