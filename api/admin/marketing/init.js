const { requireChatAdmin } = require("../../_admin-cookie");
const { json, withMarketingDb } = require("../../_marketing");
const { ensureMarketingSchema } = require("../../../lib/marketing-schema");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "method_not_allowed" });
  }
  if (!requireChatAdmin(req, res, json)) return;

  return withMarketingDb(req, res, async (pool) => {
    const result = await ensureMarketingSchema(pool, { force: true });
    const { rows: taskCount } = await pool.query("SELECT COUNT(*)::int AS cnt FROM tasks");

    return json(res, 200, {
      ok: true,
      message: "marketing_schema_ready",
      tasks: taskCount[0].cnt,
      seeded: result,
    });
  });
};
