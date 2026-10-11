(() => {
  const $ = id => document.getElementById(id);
  let pw = "", data = null;
  try { pw = sessionStorage.getItem("cod-admin") || ""; } catch (e) {}
  const msg = (el, text, kind) => { $(el).textContent = text; $(el).className = "msg" + (kind ? " " + kind : ""); };
  const fullLink = l => location.origin + l;
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

  function render() {
    const done = data.teams.filter(t => t.submission).length;
    $("count").textContent = done + " of " + data.teams.length + " submitted";
    $("deadline").textContent = data.deadline ? (data.locked ? "Locked since " : "Deadline ") + fmtTime(data.deadline) : "No deadline set";
    $("reveal").textContent = data.revealed ? "Hide picks from league" : "Reveal picks to league";
    $("rows").replaceChildren(...data.teams.map(t => {
      const tr = document.createElement("tr");
      const td = (txt, cls) => { const e = document.createElement("td"); if (cls) e.className = cls; e.textContent = txt; return e; };
      const s = t.submission;
      const nm = document.createElement("td");
      const a = document.createElement("span"); a.className = "pname"; a.textContent = t.team;
      const m = document.createElement("span"); m.className = "how"; m.textContent = t.manager;
      nm.append(a, m);
      const st = document.createElement("td");
      const chip = document.createElement("span"); chip.className = "chip " + (s ? "Taxi" : "IR");
      chip.textContent = s ? "Submitted " + fmtTime(s.submittedAt) : "Waiting";
      st.append(chip);
      const byId = Object.fromEntries(t.players.map(p => [p.id, p]));
      const names = (ids, sal) => ids.map(id => byId[id] ? byId[id].name + " ($" + sal(byId[id]) + ")" : id).join(", ");
      const cuts = s ? "Cut: " + (s.cut.length ? names(s.cut, p => p.s2) : "none") +
        ((s.taxi || []).length ? " · Taxi: " + names(s.taxi, p => p.y1) : "") : "—";
      const ln = document.createElement("td");
      const b = document.createElement("button"); b.type = "button"; b.className = "btn small"; b.textContent = "Copy link";
      b.onclick = () => copy(fullLink(t.link), "Copied " + t.team + "'s link.");
      const open = document.createElement("a"); open.href = t.link; open.target = "_blank"; open.rel = "noopener"; open.textContent = "Open"; open.className = "mgr";
      ln.append(b, document.createTextNode(" "), open);
      const act = document.createElement("td");
      if (s) {
        const c = document.createElement("button"); c.type = "button"; c.className = "btn small"; c.textContent = "Clear";
        c.onclick = async () => {
          if (!confirm("Delete " + t.team + "'s submission? They'll need to submit again.")) return;
          try { await api("POST", { action: "clear", team: t.key }); await load(); msg("deskMsg", "Cleared " + t.team + ".", "ok"); }
          catch (e) { msg("deskMsg", e.message, "err"); }
        };
        act.append(c);
      }
      tr.append(nm, st, td(s ? "$" + s.capHit : "$" + t.fullHit + " now", "n"), td(cuts), ln, act);
      return tr;
    }));
  }

  $("login").onsubmit = e => { e.preventDefault(); pw = $("pw").value; msg("loginMsg", "Checking…"); load(); };
  $("refresh").onclick = () => { msg("deskMsg", ""); load(); };
  $("copyLinks").onclick = () => copy(
    data.teams.map(t => t.team + " (" + t.manager + "): " + fullLink(t.link)).join("\n"),
    "Copied all " + data.teams.length + " links."
  );
  $("reveal").onclick = async () => {
    try { const r = await api("POST", { action: "reveal", value: !data.revealed }); data.revealed = r.revealed; render();
      msg("deskMsg", r.revealed ? "Picks are now visible to every team." : "Picks are hidden again.", "ok"); }
    catch (e) { msg("deskMsg", e.message, "err"); }
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
    const csv = rows.map(r => r.map(v => /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "cod-keeper-picks.csv"; document.body.append(a); a.click(); a.remove();
  };

  if (pw) load();
})();
