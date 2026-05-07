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

export function requireBasicAuth(req) {
  const user = process.env.ANALYTICS_USER || "";
  const pass = process.env.ANALYTICS_PASS || "";

  // If creds aren't configured, fail closed.
  if (!user || !pass) {
    return {
      ok: false,
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: "Missing ANALYTICS_USER / ANALYTICS_PASS env vars."
    };
  }

  const auth = req.headers.authorization || "";
  const m = auth.match(/^Basic\s+(.+)$/i);
  if (!m) {
    return {
      ok: false,
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Analytics"',
        "Content-Type": "text/plain; charset=utf-8"
      },
      body: "Auth required."
    };
  }

  let decoded = "";
  try {
    decoded = Buffer.from(m[1], "base64").toString("utf8");
  } catch {
    decoded = "";
  }

  const idx = decoded.indexOf(":");
  const u = idx >= 0 ? decoded.slice(0, idx) : "";
  const p = idx >= 0 ? decoded.slice(idx + 1) : "";

  if (u !== user || p !== pass) {
    return {
      ok: false,
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Analytics"',
        "Content-Type": "text/plain; charset=utf-8"
      },
      body: "Invalid credentials."
    };
  }

  return { ok: true };
}

