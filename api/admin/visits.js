const { requireAdmin } = require("../_auth");
const { redisEnabled, hgetall, lrange } = require("../_redis");

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

module.exports = async (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (!redisEnabled()) return json(res, 200, { ok: false, error: "redis_not_configured" });

  const url = new URL(req.url || "/", "http://localhost");
  const day = (url.searchParams.get("day") || today()).slice(0, 10);
  const includeEvents = url.searchParams.get("events") === "1";

  const keyBase = `tq:v1:${day}`;

  const [device, os, browser, path, formDevice, formOs, formBrowser, events, formEvents] = await Promise.all([
    hgetall(`${keyBase}:device`),
    hgetall(`${keyBase}:os`),
    hgetall(`${keyBase}:browser`),
    hgetall(`${keyBase}:path`),
    hgetall(`${keyBase}:form:device`),
    hgetall(`${keyBase}:form:os`),
    hgetall(`${keyBase}:form:browser`),
    includeEvents ? lrange(`${keyBase}:events`, 0, 50) : null,
    includeEvents ? lrange(`${keyBase}:form:events`, 0, 50) : null,
  ]);

  return json(res, 200, {
    ok: true,
    day,
    visits: { device, os, browser, path },
    forms: { device: formDevice, os: formOs, browser: formBrowser },
    events: includeEvents ? { visits: events, forms: formEvents } : undefined,
  });
};

import { getRedis } from "../_redis.js";
import { requireBasicAuth } from "../_auth.js";

function safeJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  const auth = requireBasicAuth(req);
  if (!auth.ok) {
    res.statusCode = auth.status;
    for (const [k, v] of Object.entries(auth.headers || {})) res.setHeader(k, v);
    return res.end(auth.body || "");
  }

  const limit = Math.min(500, Math.max(1, Number(req.query?.limit || 200)));
  const offset = Math.max(0, Number(req.query?.offset || 0));
  const redis = getRedis();

  try {
    const [raw, counts] = await Promise.all([
      redis.lrange("analytics:visits", offset, offset + limit - 1),
      redis.hgetall("analytics:path_counts")
    ]);

    const visits = (raw || [])
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return safeJson(res, 200, { ok: true, visits, pathCounts: counts || {} });
  } catch (e) {
    return safeJson(res, 500, { ok: false, error: "KV read failed" });
  }
}

