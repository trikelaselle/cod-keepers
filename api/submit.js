// POST /api/submit  { token, cut: [playerId, ...] }
// Saves a team's keeper decisions. The server recomputes the cap and refuses
// submissions that are over the cap or after the deadline.
import { teamFromToken, evaluate, isLocked, CAP, TAXI_SPOTS, send, fail } from "../lib/league.js";
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
    const taxi = Array.isArray(body.taxi) ? [...new Set(body.taxi.map(String))] : [];
    if (!cut || cut.some(id => !ids.has(id)) || taxi.some(id => !ids.has(id) || cut.includes(id)))
      return send(res, 400, { error: "Those picks don't match your roster. Reload the page and try again." });
    const notOk = taxi.map(id => team.players.find(p => p.id === id)).filter(p => !p.taxiOk);
    if (notOk.length) return send(res, 400, { error: `${notOk.map(p => p.name).join(", ")} can't go on taxi. Only players in their first two NBA seasons are eligible.` });
    if (taxi.length > TAXI_SPOTS) return send(res, 400, { error: `You can have at most ${TAXI_SPOTS} players on your taxi squad.` });

    const r = evaluate(team, cut, taxi);
    if (r.room < 0) return send(res, 400, { error: `You're $${-r.room} over the $${CAP} cap. Cut players or move them to taxi before you submit.` });

    const submission = {
      keep: r.kept.map(p => p.id), cut: r.cuts.map(p => p.id), taxi: r.onTaxi.map(p => p.id),
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
