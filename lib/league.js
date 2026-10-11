import crypto from "node:crypto";
import TEAMS from "./teams.js";

export { TEAMS };
export const CAP = 210;          // Season 2 cap (CoD League Charter: $200 + $10 per season)
export const ACTIVE_SPOTS = 15;  // active roster size; IR and taxi are separate
export const TAXI_SPOTS = 4;     // charter: 4 taxi spots; taxi players get no raise and $0 cap hit
// Proposed luxury tax (charter, pending vote). Shown to teams as a preview only; never enforced.
// Tax is real money: $1 per $1 over the soft cap for the first $10, then $2 per $1 beyond.
export const LUXURY_TAX = {
  softCap: CAP, hardCap: Math.round(CAP * 1.1),
  tiers: [{ upTo: 10, rate: 1 }, { upTo: null, rate: 2 }],
  draftBidLimit: 1,
};

// ---- links & auth ---------------------------------------------------------
// Each team's private link code is derived from LINK_SECRET, so no codes live in the repo.
export function tokenFor(key) {
  const s = env("LINK_SECRET");
  if (!s) throw Object.assign(new Error("LINK_SECRET is not set"), { code: "NO_SECRET" });
  return crypto.createHmac("sha256", s).update(key).digest("hex").slice(0, 20);
}
export function safeEq(a, b) {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}
export function teamFromToken(tok) {
  if (typeof tok !== "string" || !/^[a-f0-9]{20}$/.test(tok)) return null;
  return TEAMS.find(t => safeEq(tokenFor(t.key), tok)) || null;
}
// Accept either capitalization of the setting names in Vercel.
const env = name => process.env[name] ?? process.env[name.toLowerCase()];
export const adminPassword = () => env("ADMIN_PASSWORD");
export function isAdmin(req) {
  const p = adminPassword();
  return !!p && safeEq(req.headers["x-admin-password"] || "", p);
}

// ---- deadline ---------------------------------------------------------------
// Optional DEADLINE env var (ISO date-time, e.g. 2026-10-18T20:00:00-04:00) locks submissions.
export function deadline() {
  const d = env("DEADLINE") ? Date.parse(env("DEADLINE")) : NaN;
  return Number.isFinite(d) ? new Date(d).toISOString() : null;
}
export const isLocked = () => { const d = deadline(); return !!d && Date.now() > Date.parse(d); };

// ---- cap math ---------------------------------------------------------------
// Decisions: cut, taxi (kept on the taxi squad: no raise, $0 cap hit), otherwise kept in the player's slot.
// A player already on taxi who isn't listed in taxiIds is being called up to the active roster.
export const taxiSalary = p => p.y1;          // taxi players get no raise
export function slotAfter(p, taxi) {
  if (taxi.has(p.id)) return "Taxi";
  return p.slot === "Taxi" ? "Active" : p.slot;
}
export function capHitFor(p, slot) {
  if (slot === "Taxi") return 0;
  return slot === "IR" ? Math.ceil(p.s2 / 2) : p.s2;
}
export function evaluate(team, cutIds, taxiIds = []) {
  const cut = new Set(cutIds), taxi = new Set(taxiIds);
  const kept = team.players.filter(p => !cut.has(p.id));
  const cuts = team.players.filter(p => cut.has(p.id));
  const capHit = kept.reduce((s, p) => s + capHitFor(p, slotAfter(p, taxi)), 0);
  const activeKept = kept.filter(p => slotAfter(p, taxi) === "Active").length;
  const spots = Math.max(0, ACTIVE_SPOTS - activeKept);
  const onTaxi = kept.filter(p => taxi.has(p.id));
  return { kept, cuts, onTaxi, capHit, room: CAP - capHit, budget: CAP - capHit, spots };
}

export const brief = p => ({ id: p.id, name: p.name, pos: p.pos, slot: p.slot, s2: p.s2, hit: p.hit });

export function send(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}
export function fail(res, e) {
  if (e && e.code === "NO_DB") return send(res, 503, { error: "The database isn't connected yet. Ask the commissioner to finish setup." });
  if (e && e.code === "NO_SECRET") return send(res, 503, { error: "The site isn't fully set up yet (LINK_SECRET missing)." });
  console.error(e);
  return send(res, 500, { error: "Something went wrong on the server. Try again in a minute." });
}
