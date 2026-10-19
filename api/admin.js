// Commissioner API. Every call needs the x-admin-password header (ADMIN_PASSWORD env var).
// GET  /api/admin                         -> all teams, private links, submissions
// POST /api/admin { action: "reveal", value: true|false }   -> show/hide everyone's picks
// POST /api/admin { action: "clear", team: "<key>" }        -> delete one team's keeper submission (archive)
// POST /api/admin { action: "clearMoves", team: "<key>" }   -> delete one team's Season 2 roster moves
// GET also returns `rosters`: each team's Season 2 roster, its submitted moves and the result of those moves.
import { TEAMS, ROSTERS, AS_OF, CAP, HARD_CAP, buyInCents, evaluateMoves, tokenFor, isAdmin, adminPassword,
         deadline, isLocked, movesDeadline, movesLocked, send, fail } from "../lib/league.js";
import { getJSON, setJSON, mgetJSON, del } from "../lib/store.js";

export default async function handler(req, res) {
  if (!adminPassword()) return send(res, 503, { error: "ADMIN_PASSWORD isn't set in Vercel yet." });
  if (!isAdmin(req)) return send(res, 401, { error: "Wrong password." });
  try {
    if (req.method === "GET") {
      const [settings, subs, moves] = await Promise.all([getJSON("settings"), mgetJSON(TEAMS.map(t => "sub:" + t.key)),
                                                         mgetJSON(ROSTERS.map(t => "moves:" + t.key))]);
      return send(res, 200, {
        cap: CAP, hardCap: HARD_CAP, deadline: deadline(), locked: isLocked(),
        asOf: AS_OF, movesDeadline: movesDeadline(), movesLocked: movesLocked(),
        rosters: ROSTERS.map((t, i) => {
          const now = evaluateMoves(t);
          return { key: t.key, team: t.team, manager: t.manager, link: "/t/" + tokenFor(t.key), players: t.players,
                   official: { payroll: now.payroll, active: now.active, ir: now.ir, taxi: now.taxi, buyInCents: now.buyInCents, problems: now.problems },
                   moves: moves[i] };
        }),
        revealed: !!(settings && settings.revealed),
        teams: TEAMS.map((t, i) => ({
          key: t.key, team: t.team, manager: t.manager,
          link: "/t/" + tokenFor(t.key),
          fullHit: t.players.reduce((s, p) => s + p.hit, 0),
          fullBuyInCents: buyInCents(t.players.reduce((s, p) => s + p.hit, 0)),
          buyInCents: subs[i] ? buyInCents(subs[i].capHit) : null,
          players: t.players,
          submission: subs[i],
        })),
      });
    }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      if (body.action === "reveal") {
        const s = (await getJSON("settings")) || {};
        s.revealed = !!body.value;
        await setJSON("settings", s);
        return send(res, 200, { revealed: s.revealed });
      }
      if (body.action === "clear") {
        if (!TEAMS.some(t => t.key === body.team)) return send(res, 400, { error: "Unknown team." });
        await del("sub:" + body.team);
        return send(res, 200, { cleared: body.team });
      }
      if (body.action === "clearMoves") {
        if (!ROSTERS.some(t => t.key === body.team)) return send(res, 400, { error: "Unknown team." });
        await del("moves:" + body.team);
        return send(res, 200, { cleared: body.team });
      }
      return send(res, 400, { error: "Unknown action." });
    }
    send(res, 405, { error: "Use GET or POST" });
  } catch (e) { fail(res, e); }
}
