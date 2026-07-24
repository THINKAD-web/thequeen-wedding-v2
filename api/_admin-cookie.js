function parseCookies(req) {
  const raw = String(req.headers.cookie || "");
  const out = {};
  raw.split(";").forEach((part) => {
    const i = part.indexOf("=");
    if (i < 1) return;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function sessionSecret() {
  return (process.env.ADMIN_SESSION_SECRET || "").trim();
}

function isChatAdmin(req) {
  const expected = sessionSecret();
  if (!expected) return false;
  return parseCookies(req).tq_admin === expected;
}

function requireChatAdmin(req, res, json) {
  if (isChatAdmin(req)) return true;
  json(res, 401, { ok: false, error: "unauthorized" });
  return false;
}

function setAdminCookie(res) {
  const secret = sessionSecret();
  if (!secret) return;
  const maxAge = 60 * 60 * 8;
  const secure =
    process.env.VERCEL_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `tq_admin=${encodeURIComponent(secret)}; Path=/; HttpOnly; Max-Age=${maxAge}; SameSite=Lax${secure}`
  );
}

async function readJsonBody(req) {
  let body = "";
  await new Promise((resolve) => {
    req.on("data", (c) => (body += c));
    req.on("end", resolve);
  });
  return body ? JSON.parse(body) : {};
}

module.exports = {
  parseCookies,
  isChatAdmin,
  requireChatAdmin,
  setAdminCookie,
  readJsonBody,
};
