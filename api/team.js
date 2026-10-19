// GET /api/team?token=...  -> this team's Season 2 roster, its saved roster moves,
// and a league summary (who has submitted moves, everyone's official payroll).
import { ROSTERS, AS_OF, CAP, HARD_CAP, ACTIVE_SPOTS, IR_SPOTS, TAXI_SPOTS, BUY_IN,
         rosterFromToken, evaluateMoves, movesDeadline, movesLocked, send, fail } from "../lib/league.js";
import { mgetJSON } from "../lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Use GET" });
  try {
    const team = rosterFromToken(req.query.token);
    if (!team) return send(res, 404, { error: "This team link isn't valid. Check the link the commissioner sent you." });
    const subs = await mgetJSON(ROSTERS.map(t => "moves:" + t.key));
    const league = ROSTERS.map((t, i) => {
      const r = evaluateMoves(t);
      return { team: t.team, manager: t.manager, mine: t.key === team.key, submitted: !!subs[i],
               payroll: r.payroll, compliant: r.problems.length === 0 };
    });
    send(res, 200, {
      asOf: AS_OF, team: { key: team.key, team: team.team, manager: team.manager, emptyStarters: team.emptyStarters, players: team.players },
      submission: subs[ROSTERS.indexOf(team)],
      rules: { cap: CAP, hardCap: HARD_CAP, active: ACTIVE_SPOTS, ir: IR_SPOTS, taxi: TAXI_SPOTS, buyIn: BUY_IN },
      deadline: movesDeadline(), locked: movesLocked(), league,
    });
  } catch (e) { fail(res, e); }
}
