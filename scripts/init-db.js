const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function init() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL 환경변수가 필요합니다.");
    process.exit(1);
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chat_logs (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      user_agent TEXT,
      page_url TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_session ON chat_logs(session_id);
    CREATE INDEX IF NOT EXISTS idx_created ON chat_logs(created_at DESC);
  `);
  console.log("DB 초기화 완료");
  await pool.end();
  process.exit(0);
}

init().catch((e) => {
  console.error(e);
  process.exit(1);
});
