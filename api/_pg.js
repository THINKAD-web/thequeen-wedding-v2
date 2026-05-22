const { Pool } = require("pg");

let pool = null;

function pgEnabled() {
  return Boolean((process.env.DATABASE_URL || "").trim());
}

function getPool() {
  if (!pgEnabled()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

module.exports = { pgEnabled, getPool };
