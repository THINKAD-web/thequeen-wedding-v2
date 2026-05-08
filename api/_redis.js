function getEnv(name) {
  const v = process.env[name];
  return v && String(v).trim() ? String(v).trim() : "";
}

function redisEnabled() {
  return Boolean(getEnv("UPSTASH_REDIS_REST_URL") && getEnv("UPSTASH_REDIS_REST_TOKEN"));
}

let _redis = null;

function getRedis() {
  if (_redis) return _redis;
  // Lazy-load so local/static use doesn’t require the dependency.
  // eslint-disable-next-line global-require
  const { Redis } = require("@upstash/redis");
  _redis = Redis.fromEnv();
  return _redis;
}

async function incr(key) {
  return getRedis().incr(key);
}

async function hincrby(hash, field, by) {
  return getRedis().hincrby(hash, field, by);
}

async function hgetall(hash) {
  return getRedis().hgetall(hash);
}

async function lpush(key, value) {
  return getRedis().lpush(key, value);
}

async function ltrim(key, start, stop) {
  return getRedis().ltrim(key, start, stop);
}

async function lrange(key, start, stop) {
  return getRedis().lrange(key, start, stop);
}

module.exports = {
  redisEnabled,
  getRedis,
  incr,
  hincrby,
  hgetall,
  lpush,
  ltrim,
  lrange,
};
