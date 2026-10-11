// GET /api/team?token=...  -> this team's roster and submission, plus league status.
// Other teams' picks are only included once the commissioner reveals them.
import { TEAMS, CAP, ACTIVE_SPOTS, TAXI_SPOTS, teamFromToken, deadline, isLocked, send, fail, brief } from "../lib/league.js";
import { getJSON, mgetJSON } from "../lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Use GET" });
  try {
    const team = teamFromToken(req.query.token);
    if (!team) return send(res, 404, { error: "This team link isn't valid. Check the link the commissioner sent you." });

    const [settings, subs] = await Promise.all([
      getJSON("settings"),
      mgetJSON(TEAMS.map(t => "sub:" + t.key)),
    ]);
    const revealed = !!(settings && settings.revealed);

    const league = TEAMS.map((t, i) => {
      const s = subs[i];
      const row = { team: t.team, submitted: !!s, mine: t.key === team.key };
      if (revealed && s) {
        const byId = Object.fromEntries(t.players.map(p => [p.id, p]));
        row.capHit = s.capHit;
        row.kept = s.keep.map(id => byId[id]).filter(Boolean).map(brief);
        row.cut = s.cut.map(id => byId[id]).filter(Boolean).map(brief);
        row.taxi = (s.taxi || []).map(id => byId[id]).filter(Boolean).map(brief);
      }
      return row;
    });

    send(res, 200, {
      team: { team: team.team, manager: team.manager, players: team.players },
      submission: subs[TEAMS.indexOf(team)],
      cap: CAP, activeSpots: ACTIVE_SPOTS, taxiSpots: TAXI_SPOTS,
      deadline: deadline(), locked: isLocked(),
      revealed, league,
    });
  } catch (e) { fail(res, e); }
}
