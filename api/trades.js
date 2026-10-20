// GET /api/trades -> every team's current roster for the trade machine (submitted roster moves applied),
// its payroll, cap number and FAAB (room under its cap number). Public and read-only.
import { ROSTERS, AS_OF, CAP, HARD_CAP, ACTIVE_SPOTS, currentRoster, capNumber, buyInCents, isPending, send, fail } from "../lib/league.js";
import { mgetJSON } from "../lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Use GET" });
  try {
    let moves = ROSTERS.map(() => null);
    try { moves = await mgetJSON(ROSTERS.map(t => "moves:" + t.key)); } catch (e) { if (e.code !== "NO_DB") throw e; }
    send(res, 200, {
      asOf: AS_OF, rules: { cap: CAP, hardCap: HARD_CAP, active: ACTIVE_SPOTS },
      teams: ROSTERS.map((t, i) => {
        const pending = isPending(moves[i]);
        const players = currentRoster(t, pending ? moves[i].plan : {});
        const payroll = players.reduce((s, p) => s + p.hit, 0);
        const cn = capNumber(t, payroll);
        return { key: t.key, team: t.team, manager: t.manager, movesApplied: pending,
                 payroll, capNumber: cn, faab: Math.max(0, cn - payroll), buyInCents: payroll <= HARD_CAP ? buyInCents(payroll) : null,
                 players: players.map(({ id, name, status, s2, hit }) => ({ id, name, status, s2, hit })) };
      }),
    });
  } catch (e) { fail(res, e); }
}
