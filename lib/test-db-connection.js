// lib/test-db-connection.js
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const i = trimmed.indexOf("=");
  if (i < 1) return;
  envVars[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
});

const DATABASE_URL = envVars.DATABASE_URL;

console.log("🔍 DB 연결 테스트 시작...\n");
console.log(
  "📍 Connection String (처음 30글자):",
  DATABASE_URL ? DATABASE_URL.substring(0, 30) + "..." : "(없음)"
);

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL이 설정되지 않았습니다.");
  process.exit(1);
}

if (DATABASE_URL.includes("@host/") || DATABASE_URL.includes("user:pass@")) {
  console.error("❌ DATABASE_URL이 아직 예시 값입니다. Neon Connection String으로 교체하세요.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const timer = setTimeout(() => {
  console.error("\n⏱️ 연결 타임아웃 (30초)");
  process.exit(1);
}, 30000);

pool.query(
  "SELECT NOW() as current_time, version() as db_version, current_database() as db",
  (err, res) => {
    clearTimeout(timer);
    if (err) {
      console.error("\n❌ DB 연결 실패:");
      console.error("   에러:", err.message);
      console.error("   코드:", err.code);
      process.exit(1);
    }

    console.log("\n✅ DB 연결 성공!");
    console.log("   DB:", res.rows[0].db);
    console.log("   현재 시간:", res.rows[0].current_time);
    console.log("   PostgreSQL 버전:", res.rows[0].db_version?.substring(0, 50));
    pool.end();
  }
);
