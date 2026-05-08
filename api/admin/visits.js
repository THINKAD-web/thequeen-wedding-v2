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

  try {
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
  } catch (e) {
    const msg = e && typeof e.message === "string" ? e.message : String(e || "");
    return json(res, 502, { ok: false, error: "redis_failed", detail: msg.slice(0, 400) });
  }
};
