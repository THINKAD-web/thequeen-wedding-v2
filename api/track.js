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

import { getRedis } from "./_redis.js";

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) return xff.split(",")[0].trim();
  return (
    req.headers["x-real-ip"] ||
    req.headers["x-vercel-forwarded-for"] ||
    ""
  );
}

function safeJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return safeJson(res, 405, { ok: false, error: "Method not allowed" });
  }

  let body = {};
  try {
    body = typeof req.body === "object" && req.body ? req.body : JSON.parse(req.body || "{}");
  } catch {
    body = {};
  }

  const now = Date.now();
  const ip = getClientIp(req);

  const visit = {
    id: crypto.randomUUID(),
    ts: now,
    path: String(body.path || ""),
    ref: String(body.ref || ""),
    title: String(body.title || ""),
    ua: String(body.ua || req.headers["user-agent"] || ""),
    lang: String(body.lang || ""),
    tz: String(body.tz || ""),
    vp: String(body.vp || ""),
    ip,
    country: String(req.headers["x-vercel-ip-country"] || ""),
    region: String(req.headers["x-vercel-ip-country-region"] || ""),
    city: String(req.headers["x-vercel-ip-city"] || "")
  };

  // Minimal validation to avoid junk.
  if (!visit.path || !visit.path.startsWith("/")) {
    return safeJson(res, 200, { ok: true, skipped: true });
  }

  const listKey = "analytics:visits";
  const max = Number(process.env.ANALYTICS_MAX || 1000);
  const redis = getRedis();

  try {
    await redis.lpush(listKey, JSON.stringify(visit));
    await redis.ltrim(listKey, 0, Math.max(0, max - 1));
    await redis.hincrby("analytics:path_counts", visit.path, 1);
  } catch (e) {
    return safeJson(res, 500, { ok: false, error: "KV write failed" });
  }

  return safeJson(res, 200, { ok: true });
}

