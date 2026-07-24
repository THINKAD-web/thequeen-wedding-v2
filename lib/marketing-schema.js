const { SEED_TASKS } = require("./marketing-tasks-seed");

const KPI_SEED = [
  { brand: "queen", metric: "instagram_posts", value: 0, target: 8 },
  { brand: "queen", metric: "instagram_likes", value: 0, target: 500 },
  { brand: "queen", metric: "instagram_views", value: 0, target: 10000 },
  { brand: "queen", metric: "weekly_tasks_done", value: 0, target: 3 },
  { brand: "table", metric: "instagram_posts", value: 0, target: 8 },
  { brand: "table", metric: "instagram_likes", value: 0, target: 500 },
  { brand: "table", metric: "instagram_views", value: 0, target: 10000 },
  { brand: "table", metric: "weekly_tasks_done", value: 0, target: 3 },
];

async function migrateTaskColumns(pool) {
  await pool.query(`
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_key TEXT;
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS week_label TEXT;
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS channel TEXT;
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS title TEXT;
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS scenes JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS caption TEXT DEFAULT '';
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tips TEXT DEFAULT '';
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_task_key ON tasks (task_key)
    WHERE task_key IS NOT NULL
  `);
  await pool.query(`
    ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
    ALTER TABLE tasks ADD CONSTRAINT tasks_status_check
      CHECK (status IN ('pending', 'in_progress', 'done'));
  `);
  await pool.query(`
    ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_brand_week_id_task_name_key;
  `);
}

async function createTables(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      task_key TEXT UNIQUE,
      brand TEXT NOT NULL CHECK (brand IN ('queen', 'table')),
      week_id INTEGER NOT NULL,
      week_label TEXT,
      channel TEXT,
      title TEXT,
      task_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
      sort_order INTEGER NOT NULL DEFAULT 0,
      scenes JSONB DEFAULT '[]'::jsonb,
      specs JSONB DEFAULT '{}'::jsonb,
      caption TEXT DEFAULT '',
      tags JSONB DEFAULT '[]'::jsonb,
      tips TEXT DEFAULT '',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_brand_week ON tasks (brand, week_id);

    CREATE TABLE IF NOT EXISTS content (
      id SERIAL PRIMARY KEY,
      brand TEXT NOT NULL CHECK (brand IN ('queen', 'table')),
      platform TEXT NOT NULL DEFAULT 'instagram',
      post_type TEXT,
      ig_media_id TEXT UNIQUE,
      title TEXT,
      caption TEXT,
      url TEXT,
      thumbnail_url TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      comments INTEGER NOT NULL DEFAULT 0,
      synced_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_content_brand_synced ON content (brand, synced_at DESC);

    CREATE TABLE IF NOT EXISTS kpi (
      id SERIAL PRIMARY KEY,
      brand TEXT NOT NULL CHECK (brand IN ('queen', 'table')),
      metric TEXT NOT NULL,
      value NUMERIC NOT NULL DEFAULT 0,
      target NUMERIC NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (brand, metric)
    );
    CREATE INDEX IF NOT EXISTS idx_kpi_brand ON kpi (brand);
  `);
  await migrateTaskColumns(pool);
}

async function seedTasks(pool, { force = false } = {}) {
  if (force) {
    await pool.query("DELETE FROM tasks");
  }

  let upserted = 0;
  for (const t of SEED_TASKS) {
    const r = await pool.query(
      `INSERT INTO tasks (
        task_key, brand, week_id, week_label, channel, title, task_name,
        sort_order, scenes, specs, caption, tags, tips, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'pending')
      ON CONFLICT (task_key) DO UPDATE SET
        brand = EXCLUDED.brand,
        week_id = EXCLUDED.week_id,
        week_label = EXCLUDED.week_label,
        channel = EXCLUDED.channel,
        title = EXCLUDED.title,
        task_name = EXCLUDED.task_name,
        sort_order = EXCLUDED.sort_order,
        scenes = EXCLUDED.scenes,
        specs = EXCLUDED.specs,
        caption = EXCLUDED.caption,
        tags = EXCLUDED.tags,
        tips = EXCLUDED.tips,
        updated_at = NOW()
      RETURNING id`,
      [
        t.task_key,
        t.brand,
        t.week_id,
        t.week_label,
        t.channel,
        t.title,
        t.task_name,
        t.sort_order,
        JSON.stringify(t.scenes),
        JSON.stringify(t.specs),
        t.caption,
        JSON.stringify(t.tags),
        t.tips,
      ]
    );
    if (r.rowCount) upserted += 1;
  }
  return upserted;
}

async function seedKpi(pool) {
  let inserted = 0;
  for (const k of KPI_SEED) {
    const r = await pool.query(
      `INSERT INTO kpi (brand, metric, value, target)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (brand, metric) DO NOTHING`,
      [k.brand, k.metric, k.value, k.target]
    );
    if (r.rowCount) inserted += 1;
  }
  return inserted;
}

async function ensureMarketingSchema(pool, options = {}) {
  await createTables(pool);
  const tasksSeeded = await seedTasks(pool, options);
  const kpiSeeded = await seedKpi(pool);
  return { tasksSeeded, kpiSeeded };
}

function formatTaskRow(row) {
  if (!row) return null;
  return {
    ...row,
    scenes: row.scenes || [],
    specs: row.specs || {},
    tags: row.tags || [],
  };
}

/** Map calendar date to program week 1–8 (7-1 … 8-4). */
function getProgramWeek(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - start) / 86400000) + 1;
  const weekOfYear = Math.ceil(dayOfYear / 7);
  return ((weekOfYear - 1) % 8) + 1;
}

module.exports = {
  SEED_TASKS,
  KPI_SEED,
  createTables,
  seedTasks,
  seedKpi,
  ensureMarketingSchema,
  formatTaskRow,
  getProgramWeek,
};
