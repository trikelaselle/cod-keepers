(() => {
  const $ = id => document.getElementById(id);
  const money = n => (n < 0 ? "-$" : "$") + Math.abs(n);
  const token = (location.pathname.match(/\/t\/([a-f0-9]+)/) || [])[1] || "";
  let data = null, choice = {}, dirty = false, saving = false;
  let whatIf = {}; // player id -> previewed slot ("Active" or "IR"); planning only, never submitted

  const fmtTime = iso => {
    try { return new Date(iso).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
    catch (e) { return iso; }
  };
  const banner = (text, err) => { const b = $("banner"); b.textContent = text; b.className = "banner" + (err ? " err" : ""); b.hidden = !text; };
  const setMsg = (text, kind) => { $("msg").textContent = text; $("msg").className = "msg" + (kind ? " " + kind : ""); };

  // Injured players (and anyone on IR) can be previewed on IR or active.
  const canFlip = p => p.slot !== "Taxi" && (!!p.injury || p.slot === "IR");
  const slotOf = (p, preview) => (preview && whatIf[p.id]) || p.slot;
  const hitFor = (p, slot) => slot === "Taxi" ? 0 : slot === "IR" ? Math.ceil(p.s2 / 2) : p.s2;
  const previewCount = () => Object.keys(whatIf).length;

  function totals(preview = true) {
    const kept = data.team.players.filter(p => choice[p.id] === "keep");
    const hit = kept.reduce((s, p) => s + hitFor(p, slotOf(p, preview)), 0);
    const spots = Math.max(0, data.activeSpots - kept.filter(p => slotOf(p, preview) === "Active").length);
    return { hit, room: data.cap - hit, spots };
  }
  function flip(p) {
    const next = slotOf(p, true) === "IR" ? "Active" : "IR";
    if (next === p.slot) delete whatIf[p.id]; else whatIf[p.id] = next;
    render();
  }

  function render() {
    const t = data.team, s = totals(true), off = totals(false), locked = data.locked, n = previewCount();
    $("tname").textContent = t.team;
    $("tmgr").textContent = "Manager: " + t.manager + " · " + t.players.length + " players";
    $("sHit").textContent = money(s.hit);
    $("sRoom").textContent = (s.room >= 0 ? "+" : "") + money(s.room);
    $("sRoom").className = "v " + (s.room >= 0 ? "under" : "over");
    $("sBudget").textContent = money(Math.max(0, s.room));
    $("sSpots").textContent = s.spots;
    const full = t.players.reduce((a, p) => a + hitFor(p, slotOf(p, true)), 0);
    const scale = Math.max(full, data.cap) * 1.05;
    $("mFill").style.width = (s.hit / scale * 100) + "%";
    $("mFill").className = "fill" + (s.room < 0 ? " over" : "");
    $("mCap").style.left = (data.cap / scale * 100) + "%";
    $("mCapLbl").textContent = "Cap $" + data.cap;
    $("mMax").textContent = "Full roster " + money(full);
    $("whatif").hidden = !n;
    if (n) $("whatifText").textContent = "What-if: previewing " + n + " status change" + (n > 1 ? "s" : "") +
      ". With official statuses you'd keep " + money(off.hit) + " (" + (off.room >= 0 ? money(off.room) + " under" : money(-off.room) + " over") + " the cap). Submitting always uses official statuses.";

    $("rows").replaceChildren(...t.players.map(p => {
      const tr = document.createElement("tr");
      if (choice[p.id] === "cut") tr.className = "is-cut";
      const td = (txt, cls) => { const e = document.createElement("td"); if (cls) e.className = cls; e.textContent = txt; return e; };
      const nm = document.createElement("td");
      const a = document.createElement("span"); a.className = "pname"; a.textContent = p.name;
      const h = document.createElement("span"); h.className = "how";
      const ps = document.createElement("span"); ps.className = "show-sm"; ps.textContent = p.pos + " · ";
      h.append(ps, document.createTextNode(p.how));
      if (p.injury) { const inj = document.createElement("span"); inj.className = "inj"; inj.textContent = " · " + p.injury; h.append(inj); }
      nm.append(a, h);
      const sl = document.createElement("td"); const cur = slotOf(p, true);
      let ch;
      if (canFlip(p)) {
        ch = document.createElement("button"); ch.type = "button";
        ch.className = "chip toggle " + cur + (whatIf[p.id] ? " preview" : "");
        ch.textContent = cur + " ⇄";
        ch.title = "Preview " + p.name + " as " + (cur === "IR" ? "Active" : "IR");
        ch.setAttribute("aria-label", p.name + " is " + cur + (whatIf[p.id] ? " (what-if)" : "") + ". Switch to preview him as " + (cur === "IR" ? "Active" : "IR") + ".");
        ch.onclick = () => flip(p);
      } else { ch = document.createElement("span"); ch.className = "chip " + cur; ch.textContent = cur; }
      sl.append(ch);
      const act = document.createElement("td"); act.className = "act";
      const seg = document.createElement("div"); seg.className = "seg"; seg.setAttribute("role", "group");
      seg.setAttribute("aria-label", "Decision for " + p.name);
      for (const [val, lbl, cls] of [["keep", "Keep", "k"], ["cut", "Cut", "c"]]) {
        const b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = lbl;
        b.setAttribute("aria-pressed", String(choice[p.id] === val)); b.disabled = locked;
        b.onclick = () => { choice[p.id] = val; dirty = true; render(); };
        seg.append(b);
      }
      act.append(seg);
      tr.append(nm, td(p.pos, "hide-sm"), sl, td("$" + p.y1, "n hide-sm"), td("$" + p.s2, "n"), td("$" + hitFor(p, cur), "n" + (whatIf[p.id] ? " previewed" : "")), act);
      return tr;
    }));

    $("submit").disabled = locked || saving || off.room < 0;
    $("reset").disabled = locked || saving;
    if (!saving) {
      if (locked) setMsg("The deadline has passed. Your picks are locked.", data.submission ? "ok" : "err");
      else if (off.room < 0) setMsg("With official statuses you're " + money(-off.room) + " over the cap. Cut more players before you submit.", "err");
      else if (data.submission && !dirty) setMsg("Submitted " + fmtTime(data.submission.submittedAt) + ". You can change picks and submit again.", "ok");
      else if (data.submission) setMsg("You have unsaved changes. Submit again to replace your earlier picks.");
      else setMsg("Not submitted yet.");
    }
    renderLeague();
  }

  function renderLeague() {
    $("boardSec").hidden = false;
    $("board").replaceChildren(...data.league.map(r => {
      const d = document.createElement("div"); d.className = "bcell" + (r.mine ? " mine" : "");
      const n = document.createElement("span"); n.className = "t"; n.textContent = r.team + (r.mine ? " (you)" : "");
      const s = document.createElement("span"); s.className = "s" + (r.submitted ? " done" : "");
      s.textContent = r.submitted ? "Submitted" : "Not submitted yet";
      d.append(n, s); return d;
    }));
    const shown = data.revealed ? data.league.filter(r => r.kept) : [];
    $("revealSec").hidden = !shown.length;
    $("reveal").replaceChildren(...shown.map(r => {
      const box = document.createElement("div"); box.className = "reveal-team";
      const h = document.createElement("strong"); h.textContent = r.team + " · keeps " + money(r.capHit);
      const cutP = document.createElement("div"); cutP.className = "mgr";
      cutP.textContent = r.cut.length ? "Cut: " + r.cut.map(p => p.name + " ($" + p.s2 + ")").join(", ") : "Cut: nobody";
      box.append(h, cutP); return box;
    }));
  }

  async function load() {
    if (!token) { banner("This page needs your team's private link. Ask the commissioner for it.", true); return; }
    try {
      const r = await fetch("/api/team?token=" + encodeURIComponent(token), { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) { banner(j.error || "Couldn't load your team.", true); return; }
      data = j;
      const cut = new Set(j.submission ? j.submission.cut : []);
      choice = Object.fromEntries(j.team.players.map(p => [p.id, cut.has(p.id) ? "cut" : "keep"]));
      document.title = j.team.team + " · CoD Keepers";
      if (j.deadline) $("lede").textContent += " Deadline: " + fmtTime(j.deadline) + ".";
      $("sheet").hidden = false;
      render();
    } catch (e) { banner("Couldn't reach the server. Check your connection and reload.", true); }
  }

  $("resetWhatIf").onclick = () => { whatIf = {}; render(); };
  $("reset").onclick = () => { data.team.players.forEach(p => choice[p.id] = "keep"); dirty = true; render(); };
  $("submit").onclick = async () => {
    saving = true; render(); setMsg("Saving…");
    try {
      const cut = data.team.players.filter(p => choice[p.id] === "cut").map(p => p.id);
      const r = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, cut }) });
      const j = await r.json();
      saving = false;
      if (!r.ok) { render(); setMsg(j.error || "Couldn't save your picks.", "err"); return; }
      data.submission = j.submission; dirty = false;
      const me = data.league.find(x => x.mine); if (me) me.submitted = true;
      render(); setMsg("Submitted. The commissioner has your picks.", "ok");
    } catch (e) { saving = false; render(); setMsg("Couldn't reach the server. Try again.", "err"); }
  };
  window.addEventListener("beforeunload", e => { if (dirty && data && !data.locked) { e.preventDefault(); e.returnValue = ""; } });
  load();
})();
