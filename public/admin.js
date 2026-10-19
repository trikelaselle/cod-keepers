(() => {
  const $ = id => document.getElementById(id);
  let pw = "", data = null;
  try { pw = sessionStorage.getItem("cod-admin") || ""; } catch (e) {}
  const msg = (el, text, kind) => { $(el).textContent = text; $(el).className = "msg" + (kind ? " " + kind : ""); };
  const fullLink = l => location.origin + l;
  const cash = c => "$" + (c / 100).toFixed(2).replace(/\.00$/, "");
  const fmtTime = iso => { try { return new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); } catch (e) { return iso; } };

  async function api(method, body) {
    const r = await fetch("/api/admin", {
      method, cache: "no-store",
      headers: Object.assign({ "x-admin-password": pw }, body ? { "Content-Type": "application/json" } : {}),
      body: body ? JSON.stringify(body) : undefined,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(j.error || "Request failed"), { status: r.status });
    return j;
  }

  async function load() {
    try {
      data = await api("GET");
      try { sessionStorage.setItem("cod-admin", pw); } catch (e) {}
      $("login").hidden = true; $("desk").hidden = false;
      render();
    } catch (e) {
      $("login").hidden = false; $("desk").hidden = true;
      if (pw) msg("loginMsg", e.message, "err");
    }
  }

  async function copy(text, okText) {
    try { await navigator.clipboard.writeText(text); msg("deskMsg", okText, "ok"); }
    catch (e) { window.prompt("Copy this:", text); }
  }

  const LABEL = { active: "Active", ir: "IR", taxi: "Taxi", cut: "Cut" };
  const movesList = t => Object.entries(t.moves ? t.moves.plan : {}).map(([id, st]) => {
    const p = t.players.find(x => x.id === id); return p ? (st === "cut" ? "Cut " + p.name + " ($" + p.s2 + ")" : p.name + " → " + LABEL[st]) : id; });

  function render() {
    const R = data.rosters, done = R.filter(t => t.moves).length;
    const pot = R.reduce((a, t) => a + (t.moves ? t.moves.buyInCents : (t.official.buyInCents || 0)), 0);
    $("count").textContent = done + " of " + R.length + " teams submitted moves · projected pot " + cash(pot);
    $("deadline").textContent = data.movesDeadline ? (data.movesLocked ? "Locked since " : "Deadline ") + fmtTime(data.movesDeadline) : "No deadline set for roster moves";
    $("rows").replaceChildren(...R.map(t => {
      const tr = document.createElement("tr");
      const td = (txt, cls) => { const e = document.createElement("td"); if (cls) e.className = cls; e.textContent = txt; return e; };
      const s = t.moves, o = t.official;
      const nm = document.createElement("td");
      const a = document.createElement("span"); a.className = "pname"; a.textContent = t.manager;
      const m = document.createElement("span"); m.className = "how"; m.textContent = t.team;
      nm.append(a, m);
      const st = document.createElement("td");
      const chip = document.createElement("span");
      chip.className = "chip " + (s ? "Taxi" : o.problems.length ? "IR" : "");
      chip.textContent = s ? "Submitted " + fmtTime(s.submittedAt) : o.problems.length ? "Not compliant" : "Compliant, nothing sent";
      st.append(chip);
      const mv = document.createElement("td");
      mv.textContent = s ? (movesList(t).join(", ") || "No changes") + ((s.checks || []).length ? " · Check: " + s.checks.join(" ") : "") : (o.problems.join(" ") || "—");
      const ln = document.createElement("td");
      const b = document.createElement("button"); b.type = "button"; b.className = "btn small"; b.textContent = "Copy link";
      b.onclick = () => copy(fullLink(t.link), "Copied " + t.manager + "'s link.");
      const open = document.createElement("a"); open.href = t.link; open.target = "_blank"; open.rel = "noopener"; open.textContent = "Open"; open.className = "mgr";
      ln.append(b, document.createTextNode(" "), open);
      const act = document.createElement("td");
      if (s) {
        const c = document.createElement("button"); c.type = "button"; c.className = "btn small"; c.textContent = "Clear";
        c.onclick = async () => {
          if (!confirm("Delete " + t.manager + "'s submitted moves? They'll need to submit again.")) return;
          try { await api("POST", { action: "clearMoves", team: t.key }); await load(); msg("deskMsg", "Cleared " + t.manager + "'s moves.", "ok"); }
          catch (e) { msg("deskMsg", e.message, "err"); }
        };
        act.append(c);
      }
      const pay = "$" + o.payroll + (s ? " → $" + s.payroll : "");
      const bi = s ? cash(s.buyInCents) : (o.buyInCents == null ? "over hard cap" : cash(o.buyInCents) + " now");
      tr.append(nm, st, td(pay, "n"), td(bi, "n"), mv, ln, act);
      return tr;
    }));
  }

  $("login").onsubmit = e => { e.preventDefault(); pw = $("pw").value; msg("loginMsg", "Checking…"); load(); };
  $("refresh").onclick = () => { msg("deskMsg", ""); load(); };
  $("copyLinks").onclick = () => copy(
    data.rosters.map(t => t.manager + " (" + t.team + "): " + fullLink(t.link)).join("\n"),
    "Copied all " + data.rosters.length + " links."
  );
  const download = (rows, name) => {
    const csv = rows.map(r => r.map(v => /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = name; document.body.append(a); a.click(); a.remove();
  };
  $("csvMoves").onclick = () => {
    const rows = [["Team", "Manager", "Player", "Sleeper status", "Season 1 Salary", "Season 2 Salary", "Planned status", "Cap hit after", "Submitted At"]];
    for (const t of data.rosters) {
      const plan = t.moves ? t.moves.plan : {};
      for (const p of t.players) {
        const st = plan[p.id] || p.status, hit = st === "active" ? p.s2 : st === "ir" ? Math.ceil(p.s2 / 2) : 0;
        rows.push([t.team, t.manager, p.name, LABEL[p.status], p.s1 == null ? "" : p.s1, p.s2, t.moves ? LABEL[st] : "Not submitted", t.moves ? hit : "", t.moves ? t.moves.submittedAt : ""]);
      }
    }
    download(rows, "cod-roster-moves.csv");
  };
  $("csv").onclick = () => {
    const rows = [["Team", "Manager", "Player", "Pos", "Slot (before)", "2025 Salary", "Season 2 Salary", "Cap Hit", "Decision", "Submitted At"]];
    for (const t of data.teams) {
      const s = t.submission, cut = new Set(s ? s.cut : []), taxi = new Set(s && s.taxi ? s.taxi : []);
      for (const p of t.players) {
        const dec = !s ? "Not submitted" : cut.has(p.id) ? "Cut" : taxi.has(p.id) ? "Taxi" : (p.slot === "Taxi" ? "Keep (called up)" : "Keep");
        const sal = taxi.has(p.id) ? p.y1 : p.s2, hit = !s || cut.has(p.id) ? "" : taxi.has(p.id) ? 0 : (p.slot === "Taxi" ? p.s2 : p.hit);
        rows.push([t.team, t.manager, p.name, p.pos, p.slot, p.y1, sal, hit, dec, s ? s.submittedAt : ""]);
      }
    }
    download(rows, "cod-keeper-picks.csv");
  };

  if (pw) load();
})();
