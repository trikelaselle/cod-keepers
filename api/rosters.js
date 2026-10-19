// GET /api/rosters -> every team's official Season 2 roster (as pulled from Sleeper)
// and whether each team has submitted roster moves. Public and read-only: no links, no picks.
import { ROSTERS, AS_OF, send, fail } from "../lib/league.js";
import { mgetJSON } from "../lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Use GET" });
  try {
    let subs = ROSTERS.map(() => null);
    try { subs = await mgetJSON(ROSTERS.map(t => "moves:" + t.key)); } catch (e) { if (e.code !== "NO_DB") throw e; }
    send(res, 200, {
      asOf: AS_OF,
      teams: ROSTERS.map((t, i) => ({ key: t.key, team: t.team, manager: t.manager, emptyStarters: t.emptyStarters,
        players: t.players, submittedAt: subs[i] ? subs[i].submittedAt : null })),
    });
  } catch (e) { fail(res, e); }
}
