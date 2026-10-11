(() => {
  const $ = id => document.getElementById(id);
  const money = n => (n < 0 ? "-$" : "$") + Math.abs(n);
  const token = (location.pathname.match(/\/t\/([a-f0-9]+)/) || [])[1] || "";
  let data = null, choice = {}, dirty = false, saving = false;
  let whatIf = {}; // player id -> previewed slot ("Active" or "IR"); planning only, never submitted
  let luxOn = false;
  try { luxOn = localStorage.getItem("cod-lux") === "1"; } catch (e) {}
  // Proposed luxury tax in real money: $1 per $1 over for the first $10, then $2 per $1 beyond.
  function luxTax(over, tiers) {
    let left = Math.max(0, over), tax = 0, prev = 0;
    for (const t of tiers) {
      const band = t.upTo == null ? left : Math.min(left, t.upTo - prev);
      tax += band * t.rate; left -= band; prev = t.upTo ?? prev;
      if (left <= 0) break;
    }
    return tax;
  }

  const fmtTime = iso => {
    try { return new Date(iso).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
    catch (e) { return iso; }
  };
  const banner = (text, err) => { const b = $("banner"); b.textContent = text; b.className = "banner" + (err ? " err" : ""); b.hidden = !text; };
  const setMsg = (text, kind) => { $("msg").textContent = text; $("msg").className = "msg" + (kind ? " " + kind : ""); };

  // Slots: a player marked Taxi is on the taxi squad (no raise, $0 cap hit). A player who was
  // on taxi and is now marked Keep is being called up to the active roster.
  const baseSlot = p => (p.slot === "Taxi" ? "Active" : p.slot);
  const canFlip = p => choice[p.id] !== "taxi" && (!!p.injury || p.slot === "IR");
  const slotOf = (p, preview) => {
    if (choice[p.id] === "taxi") return "Taxi";
    return (preview && whatIf[p.id]) || baseSlot(p);
  };
  const salaryOf = (p, slot) => (slot === "Taxi" ? p.y1 : p.s2);
  const hitFor = (p, slot) => (slot === "Taxi" ? 0 : slot === "IR" ? Math.ceil(p.s2 / 2) : p.s2);
  const taxiCount = () => data.team.players.filter(p => choice[p.id] === "taxi").length;
  const previewCount = () => Object.keys(whatIf).filter(id => choice[id] !== "taxi").length;

  function totals(preview = true) {
    const kept = data.team.players.filter(p => choice[p.id] !== "cut");
    const hit = kept.reduce((s, p) => s + hitFor(p, slotOf(p, preview)), 0);
    const spots = Math.max(0, data.activeSpots - kept.filter(p => slotOf(p, preview) === "Active").length);
    return { hit, room: data.cap - hit, spots };
  }
  function flip(p) {
    const next = slotOf(p, true) === "IR" ? "Active" : "IR";
    if (next === baseSlot(p)) delete whatIf[p.id]; else whatIf[p.id] = next;
    render();
  }
  function startingChoices(sub) {
    const cut = new Set(sub ? sub.cut : []);
    const taxi = new Set(sub && sub.taxi ? sub.taxi : data.team.players.filter(p => p.slot === "Taxi" && !cut.has(p.id)).map(p => p.id));
    return Object.fromEntries(data.team.players.map(p => [p.id, cut.has(p.id) ? "cut" : taxi.has(p.id) ? "taxi" : "keep"]));
  }

  function render() {
    const t = data.team, s = totals(true), off = totals(false), locked = data.locked, n = previewCount();
    const taxiUsed = taxiCount(), taxiFull = taxiUsed >= data.taxiSpots;
    $("tname").textContent = t.team;
    $("tmgr").textContent = "Manager: " + t.manager + " · " + t.players.length + " players";
    $("sHit").textContent = money(s.hit);
    $("sRoom").textContent = (s.room >= 0 ? "+" : "") + money(s.room);
    $("sRoom").className = "v " + (s.room >= 0 ? "under" : "over");
    $("sBudget").textContent = money(Math.max(0, s.room));
    $("sSpots").textContent = s.spots;
    $("sTaxi").textContent = taxiUsed + " of " + data.taxiSpots;
    const full = t.players.reduce((a, p) => a + hitFor(p, slotOf(p, true)), 0);
    const L = data.luxuryTax, showLux = luxOn && !!L;
    const scale = Math.max(full, data.cap, showLux ? L.hardCap : 0) * 1.05;
    $("mFill").style.width = (s.hit / scale * 100) + "%";
    $("mFill").className = "fill" + (s.room < 0 ? " over" : "");
    $("mCap").style.left = (data.cap / scale * 100) + "%";
    $("mCapLbl").textContent = "Cap $" + data.cap;
    $("mMax").textContent = "Whole roster " + money(full);
    $("luxOn").checked = showLux;
    $("mHard").hidden = $("mBand").hidden = $("lux").hidden = !showLux;
    if (showLux) {
      $("mHard").style.left = (L.hardCap / scale * 100) + "%";
      $("mBand").style.left = (L.softCap / scale * 100) + "%";
      $("mBand").style.width = ((L.hardCap - L.softCap) / scale * 100) + "%";
      $("mCapLbl").textContent = "Soft cap $" + L.softCap + " · hard cap $" + L.hardCap;
      const over = s.hit - L.softCap, tax = luxTax(over, L.tiers), hardRoom = L.hardCap - s.hit;
      $("lPay").textContent = money(s.hit);
      $("lOver").textContent = over > 0 ? money(over) : "—";
      $("lTax").textContent = over > 0 ? money(tax) : "$0";
      $("lTax").className = "v" + (over > 0 ? " over" : " under");
      $("lHard").textContent = (hardRoom >= 0 ? "+" : "") + money(hardRoom);
      $("lHard").className = "v " + (hardRoom >= 0 ? "under" : "over");
      let note;
      if (over <= 0) note = "You're under the soft cap, so you'd owe no tax and could bid normally in the free agent draft.";
      else if (hardRoom < 0) note = "You'd be " + money(-hardRoom) + " over the $" + L.hardCap + " hard cap, which isn't allowed even with the tax. You'd still need to cut players or move them to taxi.";
      else {
        const first = Math.min(over, L.tiers[0].upTo), rest = over - first;
        note = "You'd pay " + money(tax) + " into the pot (" + money(first) + " × $1" + (rest > 0 ? " + " + money(rest) + " × $2" : "") +
          ") and could only bid $" + L.draftBidLimit + " per player in the free agent draft. Tax is checked after the draft and at the trade deadline, so this can change.";
      }
      $("lNote").textContent = note + (n ? " Includes your what-if statuses." : "");
    }
    $("whatif").hidden = !n;
    if (n) $("whatifText").textContent = "What-if: previewing " + n + " status change" + (n > 1 ? "s" : "") +
      ". With official statuses you'd keep " + money(off.hit) + " (" + (off.room >= 0 ? money(off.room) + " under" : money(-off.room) + " over") + " the cap). Submitting always uses official statuses.";

    $("rows").replaceChildren(...t.players.map(p => {
      const tr = document.createElement("tr");
      const c = choice[p.id];
      if (c === "cut") tr.className = "is-cut";
      const td = (txt, cls) => { const e = document.createElement("td"); if (cls) e.className = cls; e.textContent = txt; return e; };
      const nm = document.createElement("td");
      const a = document.createElement("span"); a.className = "pname"; a.textContent = p.name;
      const h = document.createElement("span"); h.className = "how";
      const ps = document.createElement("span"); ps.className = "show-sm"; ps.textContent = p.pos + " · ";
      h.append(ps, document.createTextNode(p.how));
      if (p.injury) { const inj = document.createElement("span"); inj.className = "inj"; inj.textContent = " · " + p.injury; h.append(inj); }
      if (p.taxiOk && p.slot !== "Taxi") { const te = document.createElement("span"); te.className = "taxiok"; te.textContent = " · Taxi-eligible"; h.append(te); }
      if (p.slot === "Taxi" && c === "keep") { const up = document.createElement("span"); up.className = "callup"; up.textContent = " · Called up from taxi"; h.append(up); }
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
      for (const [val, lbl, cls] of [["keep", "Keep", "k"], ["taxi", "Taxi", "x"], ["cut", "Cut", "c"]]) {
        const b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = lbl;
        b.setAttribute("aria-pressed", String(c === val));
        const ineligible = val === "taxi" && !p.taxiOk;
        const blocked = val === "taxi" && c !== "taxi" && taxiFull;
        b.disabled = locked || blocked || ineligible;
        if (ineligible) b.title = "Only players in their first two NBA seasons can go on taxi.";
        else if (blocked) b.title = "Your taxi squad is full (" + data.taxiSpots + " players).";
        b.onclick = () => { choice[p.id] = val; if (val === "taxi") delete whatIf[p.id]; dirty = true; render(); };
        seg.append(b);
      }
      act.append(seg);
      const sal = salaryOf(p, cur);
      tr.append(nm, td(p.pos, "hide-sm"), sl, td("$" + p.y1, "n hide-sm"),
        td("$" + sal, "n"),
        td("$" + hitFor(p, cur), "n" + (whatIf[p.id] && c !== "taxi" ? " previewed" : "")), act);
      return tr;
    }));

    $("submit").disabled = locked || saving || off.room < 0;
    $("reset").disabled = locked || saving;
    if (!saving) {
      if (locked) setMsg("The deadline has passed. Your picks are locked.", data.submission ? "ok" : "err");
      else if (off.room < 0) setMsg("With official statuses you're " + money(-off.room) + " over the cap. Cut players or move them to taxi before you submit.", "err");
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
      const h = document.createElement("strong"); h.textContent = r.team + " · cap hit " + money(r.capHit);
      const list = (label, ps, sal) => { const d = document.createElement("div"); d.className = "mgr";
        d.textContent = label + ": " + (ps && ps.length ? ps.map(p => p.name + " ($" + sal(p) + ")").join(", ") : "nobody"); return d; };
      box.append(h, list("Cut", r.cut, p => p.s2), list("Taxi", r.taxi, p => p.y1)); return box;
    }));
  }

  async function load() {
    if (!token) { banner("This page needs your team's private link. Ask the commissioner for it.", true); return; }
    try {
      const r = await fetch("/api/team?token=" + encodeURIComponent(token), { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) { banner(j.error || "Couldn't load your team.", true); return; }
      data = j;
      choice = startingChoices(j.submission);
      document.title = j.team.team + " · CoD Keepers";
      if (j.deadline) $("lede").textContent += " Deadline: " + fmtTime(j.deadline) + ".";
      $("sheet").hidden = false;
      render();
    } catch (e) { banner("Couldn't reach the server. Check your connection and reload.", true); }
  }

  $("luxOn").onchange = e => { luxOn = e.target.checked; try { localStorage.setItem("cod-lux", luxOn ? "1" : "0"); } catch (x) {} render(); };
  $("resetWhatIf").onclick = () => { whatIf = {}; render(); };
  $("reset").onclick = () => { choice = startingChoices(null); dirty = true; render(); };
  $("submit").onclick = async () => {
    saving = true; render(); setMsg("Saving…");
    try {
      const cut = data.team.players.filter(p => choice[p.id] === "cut").map(p => p.id);
      const taxi = data.team.players.filter(p => choice[p.id] === "taxi").map(p => p.id);
      const r = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, cut, taxi }) });
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
