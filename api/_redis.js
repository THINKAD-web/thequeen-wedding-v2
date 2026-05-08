function getEnv(name) {
  const v = process.env[name];
  return v && String(v).trim() ? String(v).trim() : "";
}

function redisEnabled() {
  return Boolean(getEnv("UPSTASH_REDIS_REST_URL") && getEnv("UPSTASH_REDIS_REST_TOKEN"));
}

async function redisFetch(path, body) {
  const base = getEnv("UPSTASH_REDIS_REST_URL");
  const token = getEnv("UPSTASH_REDIS_REST_TOKEN");
  if (!base || !token) throw new Error("Upstash env not configured");

  const url = base.replace(/\/$/, "") + path;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? []),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstash error ${res.status}: ${text}`);
  }
  const json = await res.json();
  if (json?.error) throw new Error(String(json.error));
  return json?.result;
}

async function incr(key) {
  return redisFetch(`/incr/${encodeURIComponent(key)}`);
}

async function hincrby(hash, field, by) {
  return redisFetch(`/hincrby/${encodeURIComponent(hash)}/${encodeURIComponent(field)}/${by}`);
}

async function hgetall(hash) {
  return redisFetch(`/hgetall/${encodeURIComponent(hash)}`);
}

async function lpush(key, value) {
  return redisFetch(`/lpush/${encodeURIComponent(key)}`, [value]);
}

async function ltrim(key, start, stop) {
  return redisFetch(`/ltrim/${encodeURIComponent(key)}/${start}/${stop}`);
}

async function lrange(key, start, stop) {
  return redisFetch(`/lrange/${encodeURIComponent(key)}/${start}/${stop}`);
}

module.exports = {
  redisEnabled,
  incr,
  hincrby,
  hgetall,
  lpush,
  ltrim,
  lrange,
};
