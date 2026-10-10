// POST /api/submit  { token, cut: [playerId, ...] }
// Saves a team's keeper decisions. The server recomputes the cap and refuses
// submissions that are over the cap or after the deadline.
import { teamFromToken, evaluate, isLocked, CAP, send, fail } from "../lib/league.js";
import { setJSON } from "../lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const team = teamFromToken(body.token);
    if (!team) return send(res, 404, { error: "This team link isn't valid." });
    if (isLocked()) return send(res, 403, { error: "The keeper deadline has passed, so picks are locked. Contact the commissioner." });

    const ids = new Set(team.players.map(p => p.id));
    const cut = Array.isArray(body.cut) ? [...new Set(body.cut.map(String))] : null;
    if (!cut || cut.some(id => !ids.has(id))) return send(res, 400, { error: "Those picks don't match your roster. Reload the page and try again." });

    const r = evaluate(team, cut);
    if (r.room < 0) return send(res, 400, { error: `You're $${-r.room} over the $${CAP} cap. Cut more players before you submit.` });

    const submission = {
      keep: r.kept.map(p => p.id), cut: r.cuts.map(p => p.id),
      capHit: r.capHit, budget: r.budget, spots: r.spots,
      submittedAt: new Date().toISOString(),
    };
    await setJSON("sub:" + team.key, submission);
    send(res, 200, { submission });
  } catch (e) {
    if (e instanceof SyntaxError) return send(res, 400, { error: "Bad request." });
    fail(res, e);
  }
}
