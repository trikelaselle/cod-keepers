// Shared rendering and rule checks for the Season 2 roster pages (/rosters and private team links).
// The server re-checks every submission (lib/league.js evaluateMoves); these checks are for live feedback.
window.Roster = (() => {
  const CAP = 210, HARD = 230, ACTIVE = 15, IRMAX = 3, TAXIMAX = 4, SCALE = 240;
  const SLOTS = ["PG", "SG", "SF", "PF", "C", "UTIL", "UTIL", "UTIL"];
  const LABEL = { active: "Active", ir: "IR", taxi: "Taxi", cut: "Cut" };
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const money = n => n == null ? "—" : "$" + (Number.isInteger(n) ? n : n.toFixed(2));

  function buyin(p) {
    if (p <= CAP) return 50 - 0.25 * (CAP - p);
    if (p <= 220) return 50 + 0.5 * (p - CAP);
    if (p <= HARD) return 55 + (p - 220);
    return null;
  }
  const hitFor = (p, st) => st === "active" ? p.s2 : st === "ir" ? Math.ceil(p.s2 / 2) : 0;

  // A team's state, optionally with a plan { playerId: status } applied.
  function state(t, plan = {}) {
    const ps = t.players.map(p => { const st = plan[p.id] || p.status; return { ...p, st, hitNow: hitFor(p, st), moved: st !== p.status }; });
    const kept = ps.filter(p => p.st !== "cut");
    const payroll = kept.reduce((s, p) => s + p.hitNow, 0);
    return { ps, payroll, buyin: buyin(payroll),
      active: kept.filter(p => p.st === "active").length, ir: kept.filter(p => p.st === "ir").length, taxi: kept.filter(p => p.st === "taxi").length,
      cut: ps.filter(p => p.st === "cut"), moved: ps.filter(p => p.moved) };
  }

  function issues(t, s, planned) {
    const out = [];
    if (s.active > ACTIVE) out.push(["bad", `${s.active - ACTIVE} over the 15-man roster`, `${s.active} active players. Cut or move ${s.active - ACTIVE} more to get down to 15.`]);
    if (s.ir > IRMAX) out.push(["bad", "Too many on IR", `${s.ir} on IR. The limit is 3.`]);
    if (s.taxi > TAXIMAX) out.push(["bad", "Too many on taxi", `${s.taxi} on taxi. The limit is 4.`]);
    if (s.payroll > HARD) out.push(["bad", `$${s.payroll - HARD} over hard cap`, `Payroll is ${money(s.payroll)}, over the $230 hard cap. Clear $${s.payroll - HARD} or more.`]);
    for (const p of s.ps) {
      if (p.st === "ir" && p.status !== "ir") out.push(["warn", "Check IR", `${p.name} can only go on IR if Sleeper allows it (Out, day-to-day, suspended or DNR).`]);
      if (p.st === "taxi" && p.status !== "taxi") out.push(["warn", "Check taxi", `${p.name} can only go on taxi if Sleeper allows it.`]);
    }
    if (t.emptyStarters && !planned) out.push(["warn", `${t.emptyStarters} empty starter slots`, `${t.emptyStarters} starting slots are empty in Sleeper.`]);
    if (s.payroll > CAP && s.payroll <= HARD) out.push(["warn", "Luxury tax", `Payroll is ${money(s.payroll - CAP)} over the $210 cap, so the buy-in is ${money(s.buyin)}.`]);
    return out;
  }
  const isBad = iss => iss.some(x => x[0] === "bad");
  const level = (t, s) => { const i = issues(t, s); return isBad(i) ? "bad" : i.some(x => x[0] === "warn") ? "warn" : "ok"; };

  function meter(p) {
    const cls = p > HARD ? "over" : p > CAP ? "tax" : "";
    return `<div class="mrow"><div class="meter" role="img" aria-label="Payroll ${money(p)} against $210 cap and $230 hard cap"><span class="fill ${cls}" style="width:${Math.min(p, SCALE) / SCALE * 100}%"></span><span class="tick" style="left:${CAP / SCALE * 100}%"></span><span class="tick" style="left:${HARD / SCALE * 100}%"></span></div><span class="num">${money(p)}</span></div>`;
  }

  // League board (always the official Sleeper state). onTeamHref(t) gives a link per row, or null.
  function board(teams, { href = null, note = "" } = {}) {
    const st = teams.map(t => [t, state(t)]);
    const ok = st.filter(([t, s]) => !isBad(issues(t, s))).length;
    const rows = [...st].sort((a, b) => b[1].payroll - a[1].payroll).map(([t, s]) => {
      const iss = issues(t, s);
      const chips = (iss.length ? iss.map(([l, x]) => `<span class="chip ${l}">${esc(x)}</span>`).join("") : `<span class="chip ok">Compliant</span>`)
        + (t.submittedAt ? `<span class="chip plan">Moves submitted</span>` : "");
      const link = href ? href(t) : null;
      return `<tr${link ? ` data-href="${esc(link)}" tabindex="0"` : ""}><td class="tm"><b>${esc(t.manager)}</b>${t.team !== t.manager ? `<span>${esc(t.team)}</span>` : ""}</td>
        <td class="cnt ${s.active > ACTIVE ? "over" : ""}">${s.active} / 15</td><td class="cnt ${s.ir > IRMAX ? "over" : ""}">${s.ir} / 3</td><td class="cnt ${s.taxi > TAXIMAX ? "over" : ""}">${s.taxi} / 4</td>
        <td>${meter(s.payroll)}</td><td class="num">${money(s.buyin)}</td><td><div class="chips">${chips}</div></td></tr>`;
    }).join("");
    const pot = st.reduce((x, [, s]) => x + (s.buyin ?? 0), 0);
    return `<section><h2>Roster compliance</h2>
      ${note ? `<p class="sub" style="margin:0 0 12px">${note}</p>` : ""}
      <div class="stats" style="margin-bottom:14px">
        <div class="panel stat"><div class="k">Fully compliant</div><div class="v ${ok === teams.length ? "good" : "bad"}">${ok} / ${teams.length}</div><div class="n">teams with no rule violations</div></div>
        <div class="panel stat"><div class="k">Over the $210 cap</div><div class="v warn">${st.filter(([, s]) => s.payroll > CAP).length}</div><div class="n">teams paying luxury tax or over the hard cap</div></div>
        <div class="panel stat"><div class="k">Projected pot</div><div class="v">${money(pot)}</div><div class="n">from the ${st.filter(([, s]) => s.buyin != null).length} teams at or under $230</div></div>
      </div>
      <div class="panel scroll"><table class="board"><thead><tr><th>Team</th><th>Active</th><th>IR</th><th>Taxi</th><th>Payroll (cap hit)</th><th class="num">Buy-in</th><th>Issues</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="legend"><span><i style="background:var(--good)"></i>At or under $210</span><span><i style="background:var(--warn)"></i>$211–$230, luxury tax</span><span><i style="background:var(--bad)"></i>Over the $230 hard cap</span><span>Tick marks show $210 and $230.</span></div>
    </section>`;
  }
  function wireBoard(root) {
    root.querySelectorAll("tr[data-href]").forEach(tr => {
      const go = () => { location.href = tr.dataset.href; };
      tr.addEventListener("click", go);
      tr.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
    });
  }

  function srcLabel(p) {
    if (p.src === "auction") return `<span class="src new">Won Oct 18 auction</span>`;
    if (p.src === "kept-taxi") return `<span class="src">Kept · taxi, no raise</span>`;
    if (p.src === "faab") return `<span class="src new">FAAB pickup</span>`;
    return `<span class="src">Kept · 2nd-season raise</span>`;
  }

  // Team sheet. editable: show the Plan column. plan: current planned statuses.
  function sheet(t, plan, { editable = false, banner = "" } = {}) {
    const now = state(t), s = state(t, plan);
    const planned = s.moved.length > 0;
    const cols = editable ? 7 : 6;
    const sel = p => {
      const opts = ["active", "ir", "taxi", "cut"].map(v => `<option value="${v}"${v === p.st ? " selected" : ""}>${v === p.status ? LABEL[v] + " (now)" : LABEL[v]}</option>`).join("");
      return `<select class="act ${p.moved ? "chg " + p.st : ""}" id="a-${p.id}" data-id="${p.id}" aria-label="Plan for ${esc(p.name)}">${opts}</select>`;
    };
    const row = (slot, p, extra = "") => {
      if (!p) return `<tr><td class="slot">${slot}</td><td class="open">Open</td><td></td><td class="num"></td><td class="num"></td><td class="num"></td>${editable ? "<td></td>" : ""}</tr>`;
      const cls = [extra, p.st === "cut" ? "cutrow" : "", p.moved && p.st !== "cut" ? "moverow" : ""].join(" ").trim();
      const note = p.st === "cut" ? `<span class="mv">Cut · frees ${money(hitFor(p, p.status))}</span>` : p.moved ? `<span class="mv">Move to ${LABEL[p.st]}</span>` : "";
      const flag = "";
      return `<tr class="${cls}"><td class="slot ${extra ? "xs" : ""}">${slot}</td><td><span class="pl">${esc(p.name)}</span>${note}${flag}</td>
        <td>${srcLabel(p)}</td><td class="num">${p.s1 == null ? "—" : money(p.s1)}</td><td class="num"><b>${money(p.s2)}</b></td><td class="num">${money(p.hitNow)}</td>${editable ? `<td>${sel(p)}</td>` : ""}</tr>`;
    };
    const used = new Set();
    const startRows = SLOTS.map(sl => { const p = s.ps.find(x => x.slot === sl && x.status === "active" && !used.has(x.id)); if (p) used.add(p.id); return row(sl, p); }).join("");
    const by = st => s.ps.filter(p => p.status === st);
    const bench = by("active").filter(p => !used.has(p.id)).sort((a, b) => b.s2 - a.s2);
    const nB = ACTIVE - SLOTS.length;
    const fill = (arr, n, label) => Array.from({ length: Math.max(n, arr.length) }, (_, i) => row(i < n ? label : "Over", arr[i], i < n ? "" : "overrow")).join("");
    const ir = by("ir"), tx = by("taxi");
    const iss = issues(t, s, planned);
    const room = CAP - s.payroll;
    const was = (a, b, f = x => x) => a === b ? "" : ` <span class="was">was ${f(a)}</span>`;
    const grp = (name, n) => `<tr class="grp"><td colspan="${cols}">${name}<span class="n">${n}</span></td></tr>`;
    return `<section style="display:flex;flex-direction:column;gap:16px">
      <div><h2 style="margin:0">${esc(t.manager)}</h2>${t.team !== t.manager ? `<p class="sub" style="margin-top:2px">${esc(t.team)}</p>` : ""}</div>
      ${banner}
      <div class="stats">
        <div class="panel stat"><div class="k">Payroll (cap hit)</div><div class="v ${s.payroll > HARD ? "bad" : s.payroll > CAP ? "warn" : "good"}">${money(s.payroll)}</div><div class="n">${room >= 0 ? `${money(room)} under the $210 cap` : `${money(-room)} over the $210 cap`}${was(now.payroll, s.payroll, money)}</div></div>
        <div class="panel stat"><div class="k">Buy-in</div><div class="v">${s.buyin == null ? "—" : money(s.buyin)}</div><div class="n">${s.buyin == null ? "Over the hard cap: not allowed" : "from the payroll scale"}${now.buyin !== s.buyin && now.buyin != null ? ` <span class="was">was ${money(now.buyin)}</span>` : ""}</div></div>
        <div class="panel stat"><div class="k">Active roster</div><div class="v ${s.active > ACTIVE ? "bad" : "good"}">${s.active} / 15</div><div class="n">IR ${s.ir}/3 · Taxi ${s.taxi}/4${was(now.active, s.active)}</div></div>
        <div class="panel stat"><div class="k">${editable ? "Cuts planned" : "Won Oct 18"}</div><div class="v">${editable ? s.cut.length : money(t.players.filter(p => p.src === "auction").reduce((x, p) => x + p.s2, 0))}</div><div class="n">${editable ? (s.cut.length ? `${money(s.cut.reduce((x, p) => x + hitFor(p, p.status), 0))} of cap freed` : "none yet") : `${t.players.filter(p => p.src === "auction").length} players from the auction`}</div></div>
      </div>
      <div class="panel"><ul class="issues ${iss.length ? "" : "none"}">${iss.length ? iss.map(([l, , d]) => `<li><span class="chip ${l}" style="margin-right:6px">${l === "bad" ? "Fix" : "Note"}</span>${esc(d)}</li>`).join("") : "<li>Compliant: roster, IR, taxi and payroll all within league rules.</li>"}</ul></div>
      <div class="panel scroll"><table class="sheet${editable ? " editable" : ""}"><thead><tr><th>Slot</th><th>Player</th><th>How acquired</th><th class="num">Season 1</th><th class="num">Season 2</th><th class="num">Cap hit</th>${editable ? "<th>Plan</th>" : ""}</tr></thead><tbody>
        ${grp("Starters", "8 slots in Sleeper")}${startRows}
        ${grp("Bench", `${bench.length} of 7 slots used in Sleeper`)}${fill(bench, nB, "BN")}
        ${grp("Injured reserve", `${ir.length} of 3 in Sleeper · half salary counts`)}${fill(ir, IRMAX, "IR")}
        ${grp("Taxi squad", `${tx.length} of 4 in Sleeper · doesn't count against the cap`)}${fill(tx, TAXIMAX, "TAXI")}
      </tbody></table></div>
    </section>`;
  }

  function planText(t, plan) {
    const s = state(t, plan);
    const lines = s.moved.map(p => p.st === "cut" ? `Cut ${p.name} (${money(p.s2)})` : `Move ${p.name} to ${LABEL[p.st]}`);
    return `${t.manager} roster moves:\n- ${lines.join("\n- ")}\nResult: ${s.active} active, ${s.ir} IR, ${s.taxi} taxi. Payroll ${money(s.payroll)}, buy-in ${money(s.buyin)}.`;
  }

  return { CAP, HARD, LABEL, esc, money, state, issues, isBad, level, board, wireBoard, sheet, planText };
})();
