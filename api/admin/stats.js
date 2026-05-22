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

  const pool = getPool();
  try {
    const [total, today, topQuestions, daily] = await Promise.all([
      pool.query(`SELECT COUNT(DISTINCT session_id) AS total FROM chat_logs`),
      pool.query(
        `SELECT COUNT(DISTINCT session_id) AS today FROM chat_logs WHERE created_at > NOW() - INTERVAL '24 hours'`
      ),
      pool.query(`
        SELECT content, COUNT(*)::int AS cnt
        FROM chat_logs WHERE role = 'user'
        GROUP BY content ORDER BY cnt DESC LIMIT 10
      `),
      pool.query(`
        SELECT DATE(created_at) AS date, COUNT(DISTINCT session_id)::int AS sessions
        FROM chat_logs
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at) ORDER BY date ASC
      `),
    ]);

    return json(res, 200, {
      ok: true,
      totalSessions: parseInt(total.rows[0]?.total || "0", 10),
      todaySessions: parseInt(today.rows[0]?.today || "0", 10),
      topQuestions: topQuestions.rows,
      daily: daily.rows,
    });
  } catch (e) {
    return json(res, 502, {
      ok: false,
      error: "database_failed",
      detail: String(e?.message || e).slice(0, 300),
    });
  }
};
