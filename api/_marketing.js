const { getPool, pgEnabled } = require("./_pg");
const { ensureMarketingSchema } = require("../lib/marketing-schema");

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

async function readJsonBody(req) {
  let body = "";
  await new Promise((resolve) => {
    req.on("data", (c) => (body += c));
    req.on("end", resolve);
  });
  return body ? JSON.parse(body) : {};
}

async function withMarketingDb(req, res, handler) {
  if (!pgEnabled()) {
    return json(res, 503, { ok: false, error: "database_not_configured" });
  }
  const pool = getPool();
  try {
    await ensureMarketingSchema(pool);
    return await handler(pool);
  } catch (e) {
    return json(res, 502, {
      ok: false,
      error: "database_failed",
      detail: String(e?.message || e).slice(0, 300),
    });
  }
}

module.exports = { json, readJsonBody, withMarketingDb };
