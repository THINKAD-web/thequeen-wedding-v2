const { requireChatAdmin } = require("../../_admin-cookie");
const { getPool, pgEnabled } = require("../../_pg");

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  if (!requireChatAdmin(req, res, json)) return;
  if (!pgEnabled()) {
    return json(res, 503, { ok: false, error: "database_not_configured" });
  }

  const sessionId = String(req.query?.sessionId || "").trim();
  if (!sessionId) {
    return json(res, 400, { ok: false, error: "session_id_required" });
  }

  const pool = getPool();
  try {
    const { rows } = await pool.query(
      `SELECT role, content, created_at FROM chat_logs WHERE session_id = $1 ORDER BY created_at ASC`,
      [sessionId]
    );
    return json(res, 200, { ok: true, messages: rows });
  } catch (e) {
    return json(res, 502, {
      ok: false,
      error: "database_failed",
      detail: String(e?.message || e).slice(0, 300),
    });
  }
};
