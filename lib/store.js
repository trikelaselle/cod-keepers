// Tiny key-value store on Upstash Redis's REST API (no dependencies).
// Vercel's Upstash integration sets KV_REST_API_URL / KV_REST_API_TOKEN;
// a direct Upstash connection sets UPSTASH_REDIS_REST_URL / _TOKEN. Either works.
// With neither set, local runs fall back to memory; on Vercel that is an error.

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const PREFIX = "cod:";
const mem = new Map();

async function cmd(args) {
  if (!URL_ || !TOKEN) {
    if (process.env.VERCEL) throw Object.assign(new Error("Database not connected"), { code: "NO_DB" });
    const [c, ...rest] = args;
    if (c === "GET") return mem.get(rest[0]) ?? null;
    if (c === "SET") { mem.set(rest[0], rest[1]); return "OK"; }
    if (c === "DEL") { mem.delete(rest[0]); return 1; }
    if (c === "MGET") return rest.map(k => mem.get(k) ?? null);
    throw new Error("Unsupported in memory mode: " + c);
  }
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error || `Database error (${r.status})`);
  return j.result;
}

const parse = v => (v ? JSON.parse(v) : null);
export const getJSON = async k => parse(await cmd(["GET", PREFIX + k]));
export const setJSON = (k, v) => cmd(["SET", PREFIX + k, JSON.stringify(v)]);
export const mgetJSON = async ks => (await cmd(["MGET", ...ks.map(k => PREFIX + k)])).map(parse);
export const del = k => cmd(["DEL", PREFIX + k]);
