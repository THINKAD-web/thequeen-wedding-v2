function unauthorized(res) {
  res.statusCode = 401;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ ok: false, error: "unauthorized" }));
}

function readToken(req) {
  const h = req.headers["authorization"];
  if (h && /^bearer\s+/i.test(h)) return h.replace(/^bearer\s+/i, "").trim();
  const url = new URL(req.url || "/", "http://localhost");
  const q = url.searchParams.get("token");
  return q ? String(q).trim() : "";
}

function requireAdmin(req, res) {
  const expected = (process.env.ADMIN_TOKEN || "").trim();
  if (!expected) return true; // allow if not configured (dev)
  const token = readToken(req);
  if (token && token === expected) return true;
  unauthorized(res);
  return false;
}

module.exports = { requireAdmin };
