// POST /api/submit  { token, plan: { playerId: "active" | "ir" | "taxi" | "cut" } }
// Saves a team's Season 2 roster moves. The server re-checks the plan against the charter
// (15 active, 3 IR, 4 taxi, $230 hard cap; IR and taxi eligibility follow Sleeper and aren't checked) and refuses it if anything fails.
import { rosterFromToken, evaluateMoves, movesLocked, MOVE_STATES, send, fail } from "../lib/league.js";
import { setJSON } from "../lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const team = rosterFromToken(body.token);
    if (!team) return send(res, 404, { error: "This team link isn't valid." });
    if (movesLocked()) return send(res, 403, { error: "The deadline for roster moves has passed. Contact the commissioner." });

    const raw = body.plan && typeof body.plan === "object" && !Array.isArray(body.plan) ? body.plan : null;
    const byId = Object.fromEntries(team.players.map(p => [p.id, p]));
    if (!raw || Object.entries(raw).some(([id, st]) => !byId[id] || !MOVE_STATES.includes(st)))
      return send(res, 400, { error: "Those moves don't match your roster. Reload the page and try again." });
    const plan = Object.fromEntries(Object.entries(raw).filter(([id, st]) => byId[id].status !== st));

    const r = evaluateMoves(team, plan);
    if (r.problems.length) return send(res, 400, { error: "Your roster isn't compliant yet: " + r.problems.join(" "), problems: r.problems });

    const submission = {
      plan, payroll: r.payroll, buyInCents: r.buyInCents, active: r.active, ir: r.ir, taxi: r.taxi,
      checks: r.checks, submittedAt: new Date().toISOString(),
    };
    await setJSON("moves:" + team.key, submission);
    send(res, 200, { submission });
  } catch (e) {
    if (e instanceof SyntaxError) return send(res, 400, { error: "Bad request." });
    fail(res, e);
  }
}
