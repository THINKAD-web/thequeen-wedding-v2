const { readJsonBody, setAdminCookie } = require("../_admin-cookie");

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }

  let body = {};
  try {
    body = await readJsonBody(req);
  } catch {
    return json(res, 400, { ok: false, error: "invalid_json" });
  }

  const password = String(body.password || "");
  const expected = (process.env.ADMIN_PASSWORD || "").trim();
  const secret = (process.env.ADMIN_SESSION_SECRET || "").trim();

  if (!expected || !secret) {
    return json(res, 500, { ok: false, error: "admin_not_configured" });
  }

  if (password !== expected) {
    return json(res, 401, { ok: false });
  }

  setAdminCookie(res);
  return json(res, 200, { ok: true });
};
