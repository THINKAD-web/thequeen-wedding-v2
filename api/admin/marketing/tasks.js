const { requireChatAdmin } = require("../../_admin-cookie");
const { json, readJsonBody, withMarketingDb } = require("../../_marketing");
const { formatTaskRow, getProgramWeek } = require("../../../lib/marketing-schema");

const TASK_LIST_FIELDS = `
  id, task_key, brand, week_id, week_label, channel, title, task_name,
  status, sort_order, updated_at
`;

function mapWeekLabel(weekId) {
  const map = {
    1: "7-1", 2: "7-2", 3: "7-3", 4: "7-4",
    5: "8-1", 6: "8-2", 7: "8-3", 8: "8-4",
  };
  return map[weekId] || String(weekId);
}

function buildProgress(rows, brandFilter) {
  const progress = {};
  for (const b of ["queen", "table"]) {
    const brandTasks = rows.filter((t) => t.brand === b);
    const done = brandTasks.filter((t) => t.status === "done").length;
    progress[b] = {
      total: brandTasks.length,
      done,
      percent: brandTasks.length ? Math.round((done / brandTasks.length) * 100) : 0,
    };
  }
  if (brandFilter) {
    const b = brandFilter;
    const brandTasks = rows.filter((t) => t.brand === b);
    const done = brandTasks.filter((t) => t.status === "done").length;
    return {
      [b]: {
        total: brandTasks.length,
        done,
        percent: brandTasks.length ? Math.round((done / brandTasks.length) * 100) : 0,
      },
    };
  }
  return progress;
}

function buildStatusCounts(rows) {
  return {
    total: rows.length,
    pending: rows.filter((t) => t.status === "pending").length,
    in_progress: rows.filter((t) => t.status === "in_progress").length,
    done: rows.filter((t) => t.status === "done").length,
  };
}

async function fetchWeekSummary(pool) {
  const allWeeks = await pool.query(
    `SELECT week_id,
      MAX(week_label) AS week_label,
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'done')::int AS done
     FROM tasks GROUP BY week_id ORDER BY week_id`
  );
  return allWeeks.rows.map((w) => ({
    ...w,
    week_label: w.week_label || mapWeekLabel(w.week_id),
  }));
}

module.exports = async (req, res) => {
  if (req.method === "GET") {
    if (!requireChatAdmin(req, res, json)) return;
    return withMarketingDb(req, res, async (pool) => {
      const url = new URL(req.url || "/", "http://localhost");
      const taskId = url.searchParams.get("taskId");

      if (taskId) {
        const id = parseInt(taskId, 10);
        if (!id) {
          return json(res, 400, { ok: false, error: "invalid_task_id" });
        }
        const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
        if (!rows.length) {
          return json(res, 404, { ok: false, error: "not_found" });
        }
        return json(res, 200, { ok: true, task: formatTaskRow(rows[0]) });
      }

      const all = url.searchParams.get("all") === "1";
      const week = parseInt(url.searchParams.get("week") || String(getProgramWeek()), 10);
      const brand = url.searchParams.get("brand");

      if (all) {
        const { rows } = await pool.query(
          `SELECT ${TASK_LIST_FIELDS} FROM tasks ORDER BY week_id, brand, sort_order, id`
        );
        const formatted = rows.map(formatTaskRow);
        const weeks = await fetchWeekSummary(pool);
        const currentWeek = getProgramWeek();
        const priority = formatted
          .filter((t) => t.week_id === currentWeek)
          .sort((a, b) => {
            const order = { pending: 0, in_progress: 1, done: 2 };
            return (order[a.status] ?? 9) - (order[b.status] ?? 9) || a.sort_order - b.sort_order;
          })
          .slice(0, 6);

        return json(res, 200, {
          ok: true,
          week: currentWeek,
          week_label: mapWeekLabel(currentWeek),
          tasks: formatted,
          progress: buildProgress(formatted),
          statusCounts: buildStatusCounts(formatted),
          weeks,
          priority,
        });
      }

      let query = `SELECT ${TASK_LIST_FIELDS} FROM tasks WHERE week_id = $1`;
      const params = [week];
      if (brand) {
        query += " AND brand = $2";
        params.push(brand);
      }
      query += " ORDER BY brand, sort_order, id";

      const { rows } = await pool.query(query, params);
      const weeks = await fetchWeekSummary(pool);

      return json(res, 200, {
        ok: true,
        week,
        week_label: mapWeekLabel(week),
        tasks: rows.map(formatTaskRow),
        progress: buildProgress(rows, brand),
        statusCounts: buildStatusCounts(rows),
        weeks,
      });
    });
  }

  if (req.method === "PATCH") {
    if (!requireChatAdmin(req, res, json)) return;
    return withMarketingDb(req, res, async (pool) => {
      let body = {};
      try {
        body = await readJsonBody(req);
      } catch {
        return json(res, 400, { ok: false, error: "invalid_json" });
      }

      const id = parseInt(body.id, 10);
      const status = body.status;
      if (!id || !["pending", "in_progress", "done"].includes(status)) {
        return json(res, 400, { ok: false, error: "invalid_payload" });
      }

      const { rows } = await pool.query(
        `UPDATE tasks SET status = $1, updated_at = NOW()
         WHERE id = $2 RETURNING *`,
        [status, id]
      );
      if (!rows.length) {
        return json(res, 404, { ok: false, error: "not_found" });
      }
      return json(res, 200, { ok: true, task: formatTaskRow(rows[0]) });
    });
  }

  return json(res, 405, { ok: false, error: "method_not_allowed" });
};
