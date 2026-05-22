const { requireChatAdmin } = require("../_admin-cookie");
const { getPool, pgEnabled } = require("../_pg");

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

  const url = new URL(req.url || "/", "http://localhost");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = 20;
  const offset = (page - 1) * limit;

  const pool = getPool();
  try {
    const { rows: sessions } = await pool.query(
      `
      SELECT
        session_id,
        MIN(created_at) AS started_at,
        MAX(created_at) AS last_at,
        COUNT(*) FILTER (WHERE role = 'user')::int AS user_msgs,
        STRING_AGG(content, ' | ') FILTER (WHERE role = 'user') AS preview,
        MAX(page_url) AS page_url,
        MAX(user_agent) AS user_agent
      FROM chat_logs
      GROUP BY session_id
      ORDER BY MIN(created_at) DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(DISTINCT session_id)::int AS count FROM chat_logs`
    );
    const total = countRows[0]?.count || 0;

    return json(res, 200, { ok: true, sessions, total, page, limit });
  } catch (e) {
    return json(res, 502, {
      ok: false,
      error: "database_failed",
      detail: String(e?.message || e).slice(0, 300),
    });
  }
};
