// Heroic Codex prototype: state, rules math, dice, rendering and events. Vanilla JS, re-renders the popover on change.
const ICONS = {
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronUp: '<path d="m18 15-6-6-6 6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  pencil: '<path d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/>',
  eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="m2 2 20 20"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  dice: '<rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/><path d="M6 18h.01"/><path d="M10 14h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  grip: '<circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
  send: '<path d="M14.54 21.69a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.64l-19 6.5a.5.5 0 0 0-.03.94l7.93 3.18a2 2 0 0 1 1.11 1.11z"/><path d="m21.85 2.15-10.94 10.94"/>',
  widen: '<path d="m18 8 4 4-4 4"/><path d="M2 12h20"/><path d="m6 8-4 4 4 4"/>',
  download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  upload: '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  pointer: '<path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
  book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
};
const ic = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const mod = (s) => Math.floor(((+s || 0) - 10) / 2);
const sg = (n) => (n < 0 ? "−" : "+") + Math.abs(n);
const AB = Object.fromEntries(ABILITIES.map(([k, s, l]) => [k, { s, l }]));
const ACT = Object.fromEntries(ACTIVATIONS);
const ORD = ["Cantrips", "1st level", "2nd level", "3rd level", "4th level", "5th level", "6th level", "7th level", "8th level", "9th level"];
const ordShort = (l) => (l === 0 ? "Cantrip" : ORD[l].replace(" level", "-level"));
const initials = (n) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
const rnd = (n) => { const a = new Uint32Array(1); crypto.getRandomValues(a); return 1 + (a[0] % Math.max(1, n)); };

// ---------- State ----------
let S;
function freshState() {
  return {
    role: "player", dicePlus: true, wide: false, edit: false,
    lib: { player: [sampleIlse(), samplePip()], gm: [sampleDrake(), sampleFanatic(), sampleBandit()] },
    maren: sampleMaren(),
    active: { player: "ilse", gm: "drake" },
    tab: "main", drawer: false, menu: null, panel: null, editing: null, focusEditor: false,
    mode: "normal", vis: "public",
    log: [], unseen: 0, flash: false, toast: null, storageBlocked: false, firstRun: false,
    open: new Set(), selectedToken: null, quickErr: "",
  };
}
const ME = () => (S.role === "gm" ? "GM" : "Sam");
const mine = () => (S.firstRun ? [] : S.lib[S.role]);
const shared = () => (S.role === "gm" && !S.firstRun ? [S.lib.player[0], S.maren] : []);
const cur = () => mine().find((s) => s.id === S.active[S.role]) || shared().find((s) => s.id === S.active[S.role]) || mine()[0] || null;
const readOnly = () => { const s = cur(); return !!s && !mine().includes(s); };

// ---------- Rules math (freeform: only what is derivable) ----------
const P = (sh) => +sh.prof || 0;
const abMod = (sh, k) => (k === "sc" ? (sh.spellcasting ? mod(sh.abilities[sh.spellcasting.ab].score) : 0) : k ? mod(sh.abilities[k].score) : 0);
const saveMod = (sh, k) => abMod(sh, k) + (sh.abilities[k].save ? P(sh) : 0);
const skillAb = (k) => SKILLS.find((x) => x[0] === k)[2];
const skillMod = (sh, k) => abMod(sh, skillAb(k)) + P(sh) * (sh.skills[k] || 0);
const spellAtk = (sh) => abMod(sh, "sc") + P(sh) + (+sh.spellcasting?.atk || 0);
const spellDC = (sh) => 8 + abMod(sh, "sc") + P(sh) + (+sh.spellcasting?.dc || 0);
const partBonus = (sh, p) => abMod(sh, p.ab) + (+p.flat || 0);
const partStr = (sh, p) => {
  const b = partBonus(sh, p);
  if (!+p.n) return String(b);
  return `${p.n}d${p.d}${b ? (b > 0 ? "+" : "−") + Math.abs(b) : ""}`;
};
function info(sh, it, kind) {
  if (kind === "spell") {
    return {
      hit: it.hit && sh.spellcasting ? spellAtk(sh) : null,
      dc: it.save && sh.spellcasting ? spellDC(sh) : null,
      target: it.save?.target, dmg: it.dmg || [],
    };
  }
  if (kind === "feature") return { hit: null, dc: null, dmg: [] };
  return {
    hit: it.hit ? abMod(sh, it.hit.ab) + (it.hit.prof ? P(sh) : 0) + (+it.hit.flat || 0) : null,
    dc: it.save ? (it.save.dc ? +it.save.dc : 8 + P(sh) + abMod(sh, it.save.ab)) : null,
    target: it.save?.target, dmg: it.dmg || [],
  };
}
const healing = (parts) => parts.length > 0 && parts.every((p) => p.type === "healing");

// ---------- Dice ----------
function d20(mode) {
  const a = rnd(20);
  if (mode === "normal") return { rolls: [a], kept: 0, nat: a, mode };
  const b = rnd(20);
  const keep = mode === "adv" ? (a >= b ? 0 : 1) : (a <= b ? 0 : 1);
  return { rolls: [a, b], kept: keep, nat: [a, b][keep], mode };
}
function rollParts(sh, parts, crit) {
  return parts.map((p) => {
    const n = (+p.n || 0) * (crit ? 2 : 1);
    const rolls = Array.from({ length: n }, () => rnd(+p.d || 1));
    const bonus = partBonus(sh, p);
    return { n, d: +p.d, rolls, bonus, total: Math.max(0, rolls.reduce((a, b) => a + b, 0) + bonus), type: p.type };
  });
}
function parseNotation(str) {
  const s = str.replace(/\s+/g, "").toLowerCase();
  const m = s.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!m) return null;
  const n = +(m[1] || 1), d = +m[2], b = +(m[3] || 0);
  if (n < 1 || n > 50 || d < 2 || d > 1000) return null;
  return { n, d, ab: "", flat: b, type: "" };
}
const modeFrom = (e) => (e && e.shiftKey ? "adv" : e && (e.ctrlKey || e.metaKey) ? "dis" : S.mode);

// ---------- Log ----------
let seq = 0;
function post(entry, opts = {}) {
  entry.id = `r${++seq}`;
  entry.t = Date.now();
  entry.replies = entry.replies || [];
  entry.fresh = true;
  if (S.dicePlus && !opts.instant && (entry.d20 || entry.dmg?.length)) {
    entry.pending = true;
    setTimeout(() => { entry.pending = false; render(); }, 900);
  }
  S.log.push(entry);
  if (!S.drawer) { S.unseen++; S.flash = true; setTimeout(() => { S.flash = false; }, 1400); }
  if (opts.mine !== false) S.mode = "normal";
  const me = cur();
  if (!S.drawer && entry.save && me && !readOnly() && me.id !== entry.sheetId && (entry.vis !== "gm" || S.role === "gm")) {
    toast(`${entry.who}: ${AB[entry.save.target].l} save, DC ${entry.save.dc}`, null, { act: "drawer", label: "Show" });
  } else render();
  if (S.drawer) scrollLog();
}
function scrollLog() { requestAnimationFrame(() => { const l = document.getElementById("log"); if (l) l.scrollTop = l.scrollHeight; }); }
function base(sh, title) {
  return { sheetId: sh.id, who: sh.name, color: sh.ownerColor, player: sh.owner === "GM" ? "GM" : sh.owner || ME(), title, vis: S.vis };
}

function rollItem(sh, it, kind, e, part = "all") {
  const i = info(sh, it, kind);
  const en = base(sh, it.name);
  en.desc = it.desc;
  let crit = false;
  if (part !== "dmg" && i.hit != null) {
    const r = d20(modeFrom(e));
    crit = r.nat === 20;
    en.d20 = { ...r, mod: i.hit, total: r.nat + i.hit, label: "to hit" };
  }
  if (part !== "hit" && i.dmg.length) en.dmg = rollParts(sh, i.dmg, crit);
  if (part !== "hit" && part !== "dmg" && i.dc != null) en.save = { target: i.target, dc: i.dc };
  if (part === "all" || part === "hit") {
    if (kind === "spell" && it.level > 0) {
      const sl = sh.slots[it.level];
      if (sl && sl.used < sl.max) { sl.used++; en.spent = { sheet: sh.id, level: it.level, left: sl.max - sl.used }; }
      else en.note = `No ${ordShort(it.level)} slot left. Nothing was spent.`;
    }
    if (it.uses) {
      if (it.uses.used < it.uses.max) { it.uses.used++; en.used = { sheet: sh.id, item: it.id, left: it.uses.max - it.uses.used }; }
      else en.note = "No uses left. Rolled anyway.";
    }
  }
  if (!en.d20 && !en.dmg && !en.save) en.showDesc = true;
  post(en);
}
function rollD20Card(sh, title, modv, e, label) {
  const r = d20(modeFrom(e));
  const en = base(sh, title);
  en.d20 = { ...r, mod: modv, total: r.nat + modv, label };
  post(en);
}
function rollSaveReply(entry, e) {
  const sh = cur();
  if (!sh || readOnly()) return;
  const r = d20(modeFrom(e));
  const m = saveMod(sh, entry.save.target);
  const total = r.nat + m;
  entry.replies.push({ who: sh.name, color: sh.ownerColor, r, mod: m, total, pass: r.nat === 20 || (r.nat !== 1 && total >= entry.save.dc) });
  S.mode = "normal";
  render();
}
function rollDeath(sh) {
  const r = rnd(20);
  const en = base(sh, "Death save");
  en.d20 = { rolls: [r], kept: 0, nat: r, mode: "normal", mod: 0, total: r, label: "death save" };
  if (r === 20) { sh.hp.cur = 1; sh.death = { s: 0, f: 0 }; en.result = { pass: true, text: "Natural 20: back up with 1 HP" }; }
  else if (r === 1) { sh.death.f = Math.min(3, sh.death.f + 2); en.result = { pass: false, text: "Natural 1: two failures" }; }
  else if (r >= 10) { sh.death.s++; en.result = { pass: true, text: "Success" }; }
  else { sh.death.f++; en.result = { pass: false, text: "Failure" }; }
  if (sh.death.s >= 3) en.result.text += ". Stable";
  if (sh.death.f >= 3) en.result.text += ". Dead";
  post(en, { mine: false });
}

// ---------- HP ----------
function applyHp(sh, op, n) {
  const before = JSON.parse(JSON.stringify(sh.hp));
  const beforeDeath = { ...sh.death };
  if (op === "dmg") {
    const fromTemp = Math.min(sh.hp.temp, n);
    sh.hp.temp -= fromTemp;
    sh.hp.cur = Math.max(0, sh.hp.cur - (n - fromTemp));
  } else if (op === "heal") {
    if (sh.hp.cur === 0) sh.death = { s: 0, f: 0 };
    sh.hp.cur = Math.min(sh.hp.max, sh.hp.cur + n);
  } else sh.hp.temp = n;
  const msg = op === "dmg" ? `${sh.name} took ${n} damage` : op === "heal" ? `${sh.name} healed ${n}` : `${sh.name} has ${n} temp HP`;
  toast(msg, () => { sh.hp = before; sh.death = beforeDeath; });
}
function hpHint(sh, op, n) {
  if (!n) return `${sh.hp.cur} of ${sh.hp.max}${sh.hp.temp ? ` · ${sh.hp.temp} temp` : ""}`;
  if (op === "dmg") {
    const ft = Math.min(sh.hp.temp, n);
    return `Damage: ${sh.hp.cur} → ${Math.max(0, sh.hp.cur - (n - ft))}${ft ? ` (temp absorbs ${ft})` : ""}`;
  }
  return `Heal: ${sh.hp.cur} → ${Math.min(sh.hp.max, sh.hp.cur + n)}`;
}

// ---------- Rests ----------
function rest(kind) {
  const sh = cur();
  const snap = JSON.stringify(sh);
  const both = (u) => u && (u.recharge === "SR" || (kind === "LR" && u.recharge === "LR"));
  [...sh.actions, ...sh.features].forEach((it) => { if (both(it.uses)) it.uses.used = 0; });
  if (kind === "LR") {
    Object.values(sh.slots).forEach((s) => (s.used = 0));
    sh.hp.cur = sh.hp.max; sh.hp.temp = 0; sh.death = { s: 0, f: 0 };
  }
  toast(kind === "LR" ? "Long rest: HP, spell slots and uses restored" : "Short rest: short-rest uses restored", () => Object.assign(sh, JSON.parse(snap)));
}

// ---------- Toast ----------
let toastTimer;
function toast(msg, undo, action) {
  S.toast = { msg, undo, action };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { S.toast = null; render(); }, 6000);
  render();
}

// ---------- Rendering ----------
const vitBar = (sh, cls = "") => {
  const pct = sh.hp.max ? (sh.hp.cur / sh.hp.max) * 100 : 0;
  const tp = sh.hp.max ? Math.min((sh.hp.temp / sh.hp.max) * 100, 100 - pct) : 0;
  const st = pct <= 25 ? "low" : pct <= 50 ? "mid" : "";
  return `<span class="bar ${st} ${cls}"><i style="width:${pct}%"></i>${tp > 0 ? `<i class="t" style="width:${tp}%"></i>` : ""}</span>`;
};

function logBtn() {
  const n = S.drawer ? 0 : S.unseen;
  return `<button class="btn icon ghost logbtn ${S.flash ? "flash" : ""}" data-act="drawer" aria-pressed="${S.drawer}" aria-controls="side" title="${S.drawer ? "Hide table rolls" : "Show table rolls"}" aria-label="Table rolls${n ? `, ${n} new` : ""}">${ic("dice")}${n ? `<span class="badge">${n}</span>` : ""}</button>`;
}

function head(sh) {
  if (!sh) {
    return `<header class="head"><div class="head-card"><div class="id-row">
      <div class="switcher" style="cursor:default"><span class="nm"><span>Valdur's Heroic Codex</span></span><span class="sub">No sheets yet</span></div>
      ${logBtn()}
      <button class="btn icon ghost" data-act="menu" data-menu="more" aria-label="More options">${ic("more")}</button>
    </div></div></header>`;
  }
  const ro = readOnly();
  const editing = S.edit && !ro;
  const idBlock = editing
    ? `<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px">
        <input class="in name-in" id="f-name" data-in="name" value="${esc(sh.name)}" aria-label="Name">
        <input class="in" id="f-sub" data-in="subtitle" value="${esc(sh.subtitle)}" placeholder="Subtitle, e.g. race and class, or size and CR" aria-label="Subtitle">
        <div class="edit-meta"><label>Proficiency bonus <input class="in num" style="width:56px" type="number" id="f-prof" data-in="prof" value="${sh.prof}"></label></div>
      </div>`
    : `<button class="switcher" data-act="menu" data-menu="switcher" aria-haspopup="menu" aria-expanded="${S.menu === "switcher"}">
        <span class="nm"><span>${esc(sh.name)}</span>${sh.linkedToken ? `<span class="nm-link" title="Linked to a token on the map" aria-label="Linked to a token on the map">${ic("link", "sm")}</span>` : ""}${ic("chevronDown", "sm")}</span>
        <span class="sub">${esc(sh.subtitle || (sh.kind === "creature" ? "Creature" : "Character"))} · <span style="white-space:nowrap">Prof ${sg(P(sh))}</span></span>
      </button>`;
  let hpBlock;
  if (editing) {
    hpBlock = `<div class="hp" style="cursor:default"><span class="hp-line"><label class="edit-meta">Max HP <input class="in num" type="number" id="f-hpmax" data-in="hpmax" value="${sh.hp.max}" style="width:72px"></label></span>${vitBar(sh)}</div>`;
  } else if (sh.hp.cur === 0 && sh.kind === "character") {
    hpBlock = `<div class="death">
      <span class="death-label">${ic("alert", "sm")}Down: death saves</span>
      <span class="death-row">
        <span class="pips" aria-label="${sh.death.s} successes">${[0, 1, 2].map((i) => `<span class="pip ok ${i < sh.death.s ? "on" : ""}"></span>`).join("")}</span>
        <span class="pips" aria-label="${sh.death.f} failures">${[0, 1, 2].map((i) => `<span class="pip bad ${i < sh.death.f ? "on" : ""}"></span>`).join("")}</span>
        ${ro ? "" : `<button class="btn" data-act="death">${ic("dice", "sm")}Roll</button><button class="btn ghost" data-act="menu" data-menu="hp">Heal</button>`}
      </span></div>`;
  } else {
    const inner = `<span class="hp-line"><span class="hp-cur num">${sh.hp.cur}</span><span class="hp-max num">/ ${sh.hp.max}</span>${sh.hp.temp ? `<span class="hp-temp num">+${sh.hp.temp} temp</span>` : ""}</span>${vitBar(sh)}`;
    hpBlock = ro
      ? `<div class="hp" style="cursor:default">${inner}</div>`
      : `<button class="hp" data-act="menu" data-menu="hp" aria-haspopup="dialog" aria-label="Hit points ${sh.hp.cur} of ${sh.hp.max}${sh.hp.temp ? `, ${sh.hp.temp} temporary` : ""}. Change hit points">${inner}</button>`;
  }
  const acBlock = `<div class="ac" title="Armor class"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS.shield}</svg><div>${
    editing ? `<input class="in num" type="number" id="f-ac" data-in="ac" value="${sh.ac}" aria-label="Armor class">` : `<b class="num">${sh.ac}</b>`
  }<small>AC</small></div></div>`;
  const down = !editing && sh.hp.cur === 0 && sh.kind === "character";
  const controls = ro ? "" : `
    <div class="seg" role="group" aria-label="Roll mode for the next roll">
      ${[["adv", "Adv", "Advantage on the next roll. Shift-click any roll for the same."], ["normal", "Normal", "Normal roll"], ["dis", "Dis", "Disadvantage on the next roll. Ctrl- or Cmd-click any roll for the same."]]
        .map(([v, l, t]) => `<button data-act="mode" data-v="${v}" aria-pressed="${S.mode === v}" title="${t}">${l}</button>`).join("")}
    </div>
    <button class="btn ${S.vis === "gm" ? "" : "icon"} vis" data-act="vis" aria-pressed="${S.vis === "gm"}" title="${S.vis === "gm" ? (S.role === "gm" ? "Rolls are hidden from players" : "Rolls go to the GM only") : "Rolls are visible to everyone. Click to roll privately."}" aria-label="Roll visibility">
      ${S.vis === "gm" ? ic("eyeOff", "sm") + (S.role === "gm" ? "Hidden" : "GM only") : ic("eye", "sm")}
    </button>`;
  return `<header class="head"><div class="head-card">
    <div class="id-row">${idBlock}
      ${logBtn()}
      ${ro ? "" : `<button class="btn ${S.edit ? "primary" : ""}" data-act="edit">${S.edit ? ic("check", "sm") + "Done" : ic("pencil", "sm") + "Edit"}</button>`}
      <button class="btn icon ghost" data-act="menu" data-menu="more" aria-haspopup="menu" aria-expanded="${S.menu === "more"}" aria-label="More options">${ic("more")}</button>
    </div>
    <div class="vitals ${down ? "down" : ""}">${hpBlock}${acBlock}${controls}</div>
  </div></header>`;
}

function banners(sh) {
  let h = "";
  if (sh && readOnly()) {
    h += `<div class="banner info">${ic("eye", "sm")}<span>Viewing ${esc(sh.owner)}'s sheet. Read-only.</span><button class="btn" data-act="back-mine">Back to my sheets</button></div>`;
  }
  if (S.storageBlocked) {
    h += `<div class="banner warn">${ic("alert", "sm")}<span>This browser is blocking storage, so changes will be lost when you leave the room. Export a file to keep your sheets.</span><button class="btn" data-act="export">Export</button></div>`;
  }
  return h ? `<div style="display:flex;flex-direction:column;gap:6px;padding-top:10px">${h}</div>` : "";
}

function abilities(sh) {
  const ro = readOnly();
  const editing = S.edit && !ro;
  return `<div class="abil">${ABILITIES.map(([k, s, l]) => {
    const a = sh.abilities[k];
    const m = mod(a.score);
    const top = editing
      ? `<span class="ab-k" style="text-align:center">${s}</span><input class="in score num" type="number" id="f-ab-${k}" data-in="ab" data-k="${k}" value="${a.score}" aria-label="${l} score">`
      : `<button class="ab-roll" data-act="check" data-k="${k}" ${ro ? "disabled" : ""} aria-label="${l} check, ${sg(m)}"><span class="ab-k">${s}</span><span class="ab-m num">${sg(m)}</span><span class="ab-s num">${a.score}</span></button>`;
    const saveLbl = editing ? (a.save ? "Proficient in saves. Click to remove." : "Not proficient in saves. Click to add.") : `${l} save, ${sg(saveMod(sh, k))}`;
    return `<div class="ab">${top}<button class="ab-save" data-act="${editing ? "saveprof" : "save"}" data-k="${k}" ${ro ? "disabled" : ""} aria-label="${saveLbl}" title="${editing ? saveLbl : "Saving throw"}"><span class="dot ${a.save ? "on" : ""}"></span>Save <b class="num">${sg(saveMod(sh, k))}</b></button></div>`;
  }).join("")}</div>`;
}

function tabList(sh) {
  const editing = S.edit && !readOnly();
  const t = [];
  t.push(["main", "Main"]);
  if (sh.spells.length || sh.spellcasting || editing) t.push(["spells", "Spells"]);
  if (sh.kind === "character" || sh.inventory.items.length || editing) t.push(["inventory", "Inventory"]);
  return t;
}

function usesPips(sh, it, label = true) {
  if (!it.uses) return "";
  const ro = readOnly();
  const left = it.uses.max - it.uses.used;
  return `<span class="uses" title="${left} of ${it.uses.max} left · ${RECHARGES.find((r) => r[0] === it.uses.recharge)?.[1] || ""}">${Array.from({ length: it.uses.max }, (_, i) =>
    `<button class="pip ${i < left ? "on" : "spent"}" data-act="use" data-id="${it.id}" data-i="${i}" ${ro ? "disabled" : ""} aria-label="${i < left ? "Spend a use" : "Restore a use"}"></button>`).join("")}${label ? `<span class="uses-lbl">${esc(it.uses.recharge)}</span>` : ""}</span>`;
}

function effects(sh, it, kind) {
  const i = info(sh, it, kind);
  const f = [];
  if (i.hit != null) f.push(`<b>${sg(i.hit)}</b> to hit`);
  if (i.dmg.length) {
    const types = [...new Set(i.dmg.map((p) => p.type))];
    f.push(`<b>${i.dmg.map((p) => partStr(sh, p)).join(" + ")}</b> ${healing(i.dmg) ? "healing" : types.join(" and ")}`);
  }
  if (i.dc != null) f.push(`<b>DC ${i.dc}</b> ${AB[i.target].s}`);
  return f;
}

function row(sh, it, kind) {
  const ro = readOnly();
  const editing = S.edit && !ro;
  const open = editing && S.editing?.id === it.id;
  const fx = effects(sh, it, kind);
  const range = [it.range, kind === "spell" && it.ritual ? "ritual" : ""].filter(Boolean).join(" · ");
  const sep = `<span class="fx-sep" aria-hidden="true"> · </span>`;
  const line2 = fx.length ? fx.join(sep) + (range ? `${sep}<span class="rng">${esc(range)}</span>` : "") : esc(range);
  const marks = kind === "spell" && it.conc ? `<span class="mark" title="Concentration">C</span>` : "";
  const tools = editing ? `<span class="edit-tools">
      <button class="btn icon ghost" data-act="open-editor" data-kind="${kind}" data-id="${it.id}" aria-expanded="${open}" aria-label="Edit ${esc(it.name)}">${ic(open ? "chevronUp" : "pencil", "sm")}</button>
      <button class="btn icon ghost" data-act="delete-item" data-kind="${kind}" data-id="${it.id}" aria-label="Delete ${esc(it.name)}">${ic("trash", "sm")}</button></span>` : "";
  return `<div class="li ${open ? "open" : ""}"><div class="row">
    ${editing ? `<span class="grip" title="Drag to reorder">${ic("grip", "sm")}</span>` : ""}
    <button class="row-main" data-act="${editing ? "open-editor" : "roll"}" data-kind="${kind}" data-id="${it.id}" ${ro ? "disabled" : ""}
      ${editing ? `aria-expanded="${open}"` : ""} aria-label="${editing ? "Edit" : "Roll"} ${esc(it.name)}" title="${editing ? "Edit" : "Roll everything for " + esc(it.name)}">
      <span class="tag" title="${esc(ACT[it.act] || "")}">${esc(it.act)}</span>
      <span class="row-txt"><span class="row-nm"><span class="ell">${esc(it.name)}</span>${marks}</span>${line2 ? `<span class="row-fx">${line2}</span>` : ""}</span>
    </button>
    ${usesPips(sh, it)}${tools}
  </div>${open ? inlineEditor(sh, kind, it) : ""}</div>`;
}

function actionsTab(sh) {
  const editing = S.edit && !readOnly();
  return `<div class="list">${sh.actions.map((a) => row(sh, a, "action")).join("")}</div>
    ${editing ? `<button class="add-btn" data-act="add-item" data-kind="action">${ic("plus", "sm")}Add action</button>` : ""}
`;
}

function spellsTab(sh) {
  const ro = readOnly();
  const editing = S.edit && !ro;
  if (!sh.spellcasting) {
    return `<div class="empty" style="padding:24px 8px"><h2>No spellcasting</h2><p>Add spellcasting to set a casting ability, track spell slots and add spells, including from the SRD list.</p>
      <div class="acts"><button class="btn primary" data-act="add-casting">${ic("plus", "sm")}Add spellcasting</button></div></div>`;
  }
  const sc = sh.spellcasting;
  const sum = editing
    ? `<div class="fs" style="margin-bottom:6px"><div class="grid3">
        <label class="fld"><span>Casting ability</span><select class="in" id="f-scab" data-in="scab">${ABILITIES.map(([k, , l]) => `<option value="${k}" ${sc.ab === k ? "selected" : ""}>${l}</option>`).join("")}</select></label>
        <label class="fld"><span>Attack bonus</span><input class="in num" type="number" id="f-scatk" data-in="scatk" value="${sc.atk}"></label>
        <label class="fld"><span>DC bonus</span><input class="in num" type="number" id="f-scdc" data-in="scdc" value="${sc.dc}"></label>
      </div><span class="calc">Spell attack ${sg(spellAtk(sh))} and save DC ${spellDC(sh)}, from ${AB[sc.ab].l}, proficiency and the bonuses above. Bonuses are for magic items.</span></div>`
    : `<div class="cast-sum">
        <div class="stat-pill"><small>Spell attack</small><b class="num">${sg(spellAtk(sh))}</b></div>
        <div class="stat-pill"><small>Save DC</small><b class="num">${spellDC(sh)}</b></div>
        <div class="stat-pill"><small>Ability</small><b>${AB[sc.ab].s}</b></div>
      </div>`;
  let out = sum;
  for (let l = 0; l <= 9; l++) {
    const list = sh.spells.filter((s) => +s.level === l);
    const sl = sh.slots[l];
    if (!list.length && !(sl && sl.max) && !(editing && l <= 3)) continue;
    let slotUi = "";
    if (l > 0 && editing) {
      slotUi = `<span class="qty" aria-label="${ORD[l]} slots"><button data-act="slot-max" data-l="${l}" data-d="-1" aria-label="Remove a slot">${ic("minus", "sm")}</button><span class="num">${sl?.max || 0}</span><button data-act="slot-max" data-l="${l}" data-d="1" aria-label="Add a slot">${ic("plus", "sm")}</button></span><span class="slot-lbl">slots</span>`;
    } else if (l > 0 && sl && sl.max) {
      const left = sl.max - sl.used;
      slotUi = `<span class="slot-lbl num">${left} of ${sl.max} slots</span><span class="pips">${Array.from({ length: sl.max }, (_, i) =>
        `<button class="pip ${i < left ? "on" : "spent"}" data-act="slot" data-l="${l}" data-i="${i}" ${ro ? "disabled" : ""} aria-label="${i < left ? "Spend" : "Restore"} a ${ORD[l]} slot"></button>`).join("")}</span>`;
    }
    out += `<div class="section-h"><span>${ORD[l]}</span><span class="grow"></span>${slotUi}</div>
      <div class="list">${list.map((s) => row(sh, s, "spell")).join("")}</div>`;
  }
  if (editing) {
    out += `<div style="display:flex;gap:8px;padding:8px">
      <button class="add-btn" style="margin:0" data-act="add-item" data-kind="spell">${ic("plus", "sm")}New spell</button>
      <button class="add-btn" style="margin:0" data-act="picker">${ic("search", "sm")}Add from SRD list</button></div>`;
  }
  return out;
}

function skillsContent(sh) {
  const ro = readOnly();
  const editing = S.edit && !ro;
  const titles = ["Not proficient", "Proficient", "Expertise"];
  return `<div class="list">${SKILLS.map(([k, l, a]) => {
      const lv = sh.skills[k] || 0;
      return `<div class="row skill-row">
        ${editing ? `<button class="pm p${lv}" data-act="cycle-prof" data-k="${k}" aria-label="${l}: ${titles[lv]}. Click to change." title="${titles[lv]}"><i></i></button>` : `<span class="pm p${lv}" title="${titles[lv]}"><i></i></span>`}
        <button class="row-main" data-act="skill" data-k="${k}" ${ro || editing ? "disabled" : ""} aria-label="${l} check, ${sg(skillMod(sh, k))}">
          <span class="ab-tag">${AB[a].s}</span><span class="row-nm">${l}</span><span class="val" style="margin-left:auto">${sg(skillMod(sh, k))}</span>
        </button>
      </div>`;
    }).join("")}</div>
    <div class="section-h">Passive</div>
    <dl class="passives">${[["perception", "Perception"], ["insight", "Insight"], ["investigation", "Investigation"]]
      .map(([k, l]) => `<div><dt>${l}</dt><dd class="num">${10 + skillMod(sh, k)}</dd></div>`).join("")}</dl>`;
}

// Main tab: skills on the left, actions then features on the right. Stacks to one column on a narrow popover.
function mainTab(sh) {
  const editing = S.edit && !readOnly();
  const acts = sh.actions.length || editing;
  const feats = sh.features.length || editing;
  return `<div class="two-col">
    <section class="col-l" aria-label="Skills"><div class="section-h">Skills</div>${skillsContent(sh)}</section>
    <section class="col-r" aria-label="Actions and features">
      ${acts ? `<div class="section-h">Actions</div>${actionsTab(sh)}` : ""}
      ${feats ? `<div class="section-h">Features</div>${featuresTab(sh)}` : ""}
      ${!acts && !feats ? `<p class="log-empty">No actions or features yet. Use Edit to add them.</p>` : ""}
    </section>
  </div>`;
}

function featuresTab(sh) {
  const ro = readOnly();
  const editing = S.edit && !ro;
  return `<div class="list">${sh.features.map((f) => {
    const open = editing ? S.editing?.id === f.id : S.open.has(f.id);
    return `<div class="li ${editing && open ? "open" : ""}">
      <div class="row">
        ${editing ? `<span class="grip">${ic("grip", "sm")}</span>` : ""}
        <button class="row-main" data-act="${editing ? "open-editor" : "toggle-open"}" data-kind="feature" data-id="${f.id}" aria-expanded="${open}">
          <span class="row-txt"><span class="row-nm"><span class="ell">${esc(f.name)}</span></span></span>
        </button>
        ${usesPips(sh, f)}
        ${editing ? `<span class="edit-tools"><button class="btn icon ghost" data-act="open-editor" data-kind="feature" data-id="${f.id}" aria-expanded="${open}" aria-label="Edit ${esc(f.name)}">${ic(open ? "chevronUp" : "pencil", "sm")}</button><button class="btn icon ghost" data-act="delete-item" data-kind="feature" data-id="${f.id}" aria-label="Delete ${esc(f.name)}">${ic("trash", "sm")}</button></span>`
          : `<span class="chev">${ic(open ? "chevronUp" : "chevronDown", "sm")}</span>`}
      </div>
      ${open && !editing ? `<div class="feat-desc">${esc(f.desc || "No description.")}${ro ? "" : `<div><button class="btn" data-act="share" data-id="${f.id}">${ic("send", "sm")}Share with the table</button></div>`}</div>` : ""}
      ${open && editing ? inlineEditor(sh, "feature", f) : ""}
    </div>`;
  }).join("")}</div>
  ${editing ? `<button class="add-btn" data-act="add-item" data-kind="feature">${ic("plus", "sm")}Add feature</button>` : ""}`;
}

function inventoryTab(sh) {
  const ro = readOnly();
  const inv = sh.inventory;
  const total = inv.items.reduce((a, i) => a + i.qty * i.wt, 0);
  return `<div class="coins">${Object.keys(inv.coins).map((k) => `<div class="coin"><label for="f-coin-${k}">${k}</label><input class="num" type="number" min="0" id="f-coin-${k}" data-in="coin" data-k="${k}" value="${inv.coins[k]}" ${ro ? "readonly" : ""}></div>`).join("")}</div>
    <div class="items-h"><span>Qty</span><span>Item</span><span style="text-align:right">Weight</span><span></span></div>
    <div class="list">${inv.items.map((it) => `<div class="item">
      <span class="qty"><button data-act="qty" data-id="${it.id}" data-d="-1" ${ro ? "disabled" : ""} aria-label="One fewer ${esc(it.name)}">${ic("minus", "sm")}</button><span>${it.qty}</span><button data-act="qty" data-id="${it.id}" data-d="1" ${ro ? "disabled" : ""} aria-label="One more ${esc(it.name)}">${ic("plus", "sm")}</button></span>
      <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(it.name)}</span>
      <span class="wt">${+(it.qty * it.wt).toFixed(2)} lb</span>
      ${ro ? "<span></span>" : `<button class="btn icon ghost rm" data-act="rm-item" data-id="${it.id}" aria-label="Remove ${esc(it.name)}">${ic("x", "sm")}</button>`}
    </div>`).join("")}</div>
    ${inv.items.length ? `<div class="inv-total"><span>${inv.items.length} items</span><span class="num">${+total.toFixed(1)} lb carried</span></div>` : `<p class="log-empty" style="padding:12px 8px">Nothing carried yet.</p>`}
    ${ro ? "" : `<form class="add-item" data-form="item"><input class="in" id="f-newitem" placeholder="Add an item, e.g. Potion of healing" aria-label="New item name" style="flex:1"><input class="in num" id="f-newwt" type="number" min="0" step="0.1" placeholder="lb" aria-label="Weight in pounds" style="width:64px"><button class="btn primary" type="submit">${ic("plus", "sm")}Add</button></form>`}`;
}

function emptyMain() {
  return `<div class="scroll"><div class="empty">
    <h2>No sheets yet</h2>
    <p>${S.role === "gm" ? "Make a creature for each monster or NPC you run, or a character if you play too." : "Make a sheet for your character. You can add more later for companions, familiars or alternate characters."} Sheets are saved in this browser.</p>
    <div class="acts">
      <button class="btn primary" data-act="new-sheet" data-kind="${S.role === "gm" ? "creature" : "character"}">${ic("plus", "sm")}${S.role === "gm" ? "New creature" : "New character"}</button>
      <button class="btn" data-act="new-sheet" data-kind="${S.role === "gm" ? "character" : "creature"}">${S.role === "gm" ? "New character" : "New creature"}</button>
      <button class="btn ghost" data-act="import">${ic("upload", "sm")}Import a sheet file</button>
    </div></div></div>`;
}

function diceLine(d) {
  if (!d) return "";
  const parts = d.rolls.map((r, i) => (d.rolls.length > 1 && i !== d.kept ? `<s>${r}</s>` : `<span class="k">${r}</span>`)).join(" ");
  return `d20 ${parts}${d.mod ? ` ${d.mod < 0 ? "−" : "+"} ${Math.abs(d.mod)}` : ""}${d.mode === "adv" ? " · advantage" : d.mode === "dis" ? " · disadvantage" : ""}`;
}
function card(en) {
  const pend = en.pending;
  const visIcon = en.vis === "gm" ? `<span title="${en.player === "GM" ? "Hidden from players" : "Sent to the GM only"}">${ic("eyeOff", "sm")}</span>` : "";
  let body = "";
  if (en.d20) {
    const nat = en.d20.nat;
    const flag = pend ? "" : nat === 20 && en.d20.label !== "death save" ? `<span class="flag crit">${en.d20.label === "to hit" ? "Critical hit" : "Natural 20"}</span>` : nat === 1 ? `<span class="flag fumble">Natural 1</span>` : "";
    body += `<div class="res"><span class="res-top">${pend ? `<span class="shimmer"></span>` : `<span class="res-n">${en.d20.total}</span>`}<span class="res-u">${en.d20.label}</span></span>
      <span class="res-x">${pend ? "Rolling with Dice+…" : diceLine(en.d20)}</span>${flag}</div>`;
  }
  if (en.dmg && en.dmg.length) {
    const heal = en.dmg.every((p) => p.type === "healing");
    const tot = en.dmg.reduce((a, p) => a + p.total, 0);
    const types = [...new Set(en.dmg.map((p) => p.type).filter(Boolean))];
    body += `<div class="res"><span class="res-top">${pend ? `<span class="shimmer"></span>` : `<span class="res-n ${en.d20 ? "sm" : ""}">${tot}</span>`}<span class="res-u">${heal ? "healing" : types.length === 1 ? types[0] : types.length ? "damage" : "total"}</span></span>
      <span class="res-x">${pend ? "&nbsp;" : en.dmg.map((p) => `${p.n ? `${p.n}d${p.d} (${p.rolls.join(", ")})` : ""}${p.bonus ? `${p.n ? " " : ""}${p.bonus < 0 ? "−" : "+"} ${Math.abs(p.bonus)}` : ""}${types.length > 1 ? ` ${p.type}` : ""}`).join(" · ")}${!pend && en.d20 && en.d20.nat === 20 ? " · crit doubles dice" : ""}</span></div>`;
  }
  if (en.result && !pend) body += `<span class="flag ${en.result.pass ? "pass" : "fail"}" style="align-self:center">${esc(en.result.text)}</span>`;
  const me = cur();
  const canSave = en.save && !pend && me && !readOnly() && me.id !== en.sheetId;
  const iRolled = en.replies.some((r) => r.who === me?.name);
  const saveLabel = S.role === "gm" ? `Roll a ${AB[en.save?.target]?.l} save for ${esc(me?.name)}` : `Roll your ${AB[en.save?.target]?.l} save`;
  const saveBtn = en.save && !pend ? (canSave && !iRolled
    ? `<button class="save-btn" data-act="save-reply" data-id="${en.id}">${ic("dice", "sm")}${saveLabel} · DC ${en.save.dc}</button>`
    : `<span class="calc">${AB[en.save.target].l} save · DC ${en.save.dc}</span>`) : "";
  const replies = en.replies.length ? `<div class="replies">${en.replies.map((r) => `<div class="reply"><span class="av" style="background:${r.color}">${initials(r.who)}</span>
      <span class="grow">${esc(r.who)} · ${AB[en.save.target].s} save · ${diceLine({ ...r.r, mod: r.mod })}</span><span class="rn">${r.total}</span><span class="flag ${r.pass ? "pass" : "fail"}">${r.pass ? "Pass" : "Fail"}</span></div>`).join("")}</div>` : "";
  const open = en.showDesc || S.open.has(en.id);
  const foot = [];
  if (en.desc && !en.showDesc) foot.push(`<button class="linkbtn" data-act="toggle-open" data-id="${en.id}" aria-expanded="${open}">${open ? "Hide description" : "Show description"}</button>`);
  if (en.spent && !pend) foot.push(`<span>Used a ${ordShort(en.spent.level)} slot, ${en.spent.left} left</span><button class="linkbtn" data-act="undo-spend" data-id="${en.id}">${ic("undo", "sm")}Undo</button>`);
  if (en.used && !pend) foot.push(`<span>Used one, ${en.used.left} left</span><button class="linkbtn" data-act="undo-spend" data-id="${en.id}">${ic("undo", "sm")}Undo</button>`);
  if (en.note && !pend) foot.push(`<span class="flag note">${esc(en.note)}</span>`);
  return `<article class="card ${pend ? "pending" : ""} ${en.fresh ? "new" : ""}" aria-label="${esc(en.who)}, ${esc(en.title)}">
    <div class="card-h"><span class="av" style="background:${en.color}">${initials(en.who)}</span><span class="who">${esc(en.who)}</span><span class="what">${esc(en.title)}</span>
      <span class="meta">${visIcon}<span>${esc(en.player)}</span></span></div>
    ${body ? `<div class="card-b">${body}</div>` : ""}
    ${open && en.desc ? `<div class="desc">${esc(en.desc)}</div>` : ""}
    ${saveBtn}${replies}
    ${foot.length ? `<div class="card-f">${foot.join("")}</div>` : ""}
  </article>`;
}
function visibleLog() {
  return S.log.filter((en) => en.vis !== "gm" || S.role === "gm" || en.player === ME());
}
function side() {
  const log = visibleLog();
  return `<aside class="side" id="side" aria-label="Table rolls">
    <div class="side-h"><h2>Table rolls</h2><span class="calc">${S.dicePlus ? "Rolling with Dice+" : "Built-in dice"}</span>
      <button class="btn icon ghost" data-act="drawer" aria-label="Hide table rolls">${ic("x")}</button></div>
    <div class="log" id="log">${log.length ? log.map(card).join("") : `<p class="log-empty">Rolls from everyone at the table show up here.</p>`}</div>
    <div class="quick">${["d4", "d6", "d8", "d10", "d12", "d20", "d100"].map((d) => `<button class="btn" data-act="quick" data-d="${d.slice(1)}">${d}</button>`).join("")}
      <form data-form="notation"><input class="in num" id="f-notation" placeholder="2d6+3" aria-label="Dice notation" autocomplete="off"><button class="btn primary" type="submit">Roll</button></form>
      ${S.quickErr ? `<div class="quick-err" role="alert">${esc(S.quickErr)}</div>` : ""}</div>
  </aside>`;
}

function menus(sh) {
  if (S.menu === "switcher") {
    const item = (s, ro) => `<button class="mi ${cur() === s ? "on" : ""}" role="menuitem" data-act="switch" data-id="${s.id}">
      <span class="av" style="background:${s.ownerColor}">${initials(s.name)}</span>
      <span class="mi-t">${esc(s.name)}<small>${esc(s.subtitle || "")}${ro ? ` · ${esc(s.owner)}` : ""}</small></span>
      <span class="mini"><span>${s.hp.cur}/${s.hp.max} · AC ${s.ac}</span>${vitBar(s)}</span></button>`;
    return `<div class="menu" role="menu" data-anchor=".switcher" style="top:64px;left:16px;width:min(340px, calc(100% - 32px))">
      <div class="menu-h">${S.role === "gm" ? "Your creatures" : "Your sheets"}</div>
      ${mine().map((s) => item(s, false)).join("")}
      ${shared().length ? `<div class="menu-h">Players · read-only</div>${shared().map((s) => item(s, true)).join("")}` : ""}
      <div class="sep"></div>
      <button class="mi" role="menuitem" data-act="new-sheet" data-kind="character">${ic("plus")}<span class="mi-t">New character</span></button>
      <button class="mi" role="menuitem" data-act="new-sheet" data-kind="creature">${ic("plus")}<span class="mi-t">New creature</span></button>
      <button class="mi" role="menuitem" data-act="import">${ic("upload")}<span class="mi-t">Import a sheet file</span></button>
    </div>`;
  }
  if (S.menu === "more") {
    const has = !!sh && !readOnly();
    return `<div class="menu" role="menu" data-anchor="[data-menu=more]" style="top:56px;right:16px">
      <button class="mi" role="menuitem" data-act="rest" data-k="SR" ${has ? "" : "disabled"}>${ic("moon")}<span class="mi-t">Short rest<small>Restores short-rest uses</small></span></button>
      <button class="mi" role="menuitem" data-act="rest" data-k="LR" ${has ? "" : "disabled"}>${ic("bed")}<span class="mi-t">Long rest<small>Restores HP, slots and all uses</small></span></button>
      <div class="sep"></div>
      <button class="mi" role="menuitem" data-act="wide">${ic("widen")}<span class="mi-t">${S.wide ? "Narrow panel" : "Widen panel"}<small>${S.wide ? "Back to 500 px" : "Room for damage types and ability tags"}</small></span></button>
      <button class="mi" role="menuitem" data-act="export" ${sh ? "" : "disabled"}>${ic("download")}<span class="mi-t">Export sheet file</span></button>
      <button class="mi" role="menuitem" data-act="import">${ic("upload")}<span class="mi-t">Import a sheet file</span></button>
      <div class="sep"></div>
      <div class="status"><i class="${S.dicePlus ? "" : "off"}"></i>${S.dicePlus ? "Dice+ found: rolls use its 3D dice" : "Dice+ not found: using built-in dice"}</div>
      <div class="status" style="padding-top:0"><i class="${S.storageBlocked ? "off" : ""}"></i>${S.storageBlocked ? "Not saving: storage is blocked" : "Sheets are saved in this browser"}</div>
    </div>`;
  }
  if (S.menu === "hp" && sh) {
    return `<div class="menu hp-panel" role="dialog" aria-label="Change hit points" data-anchor=".vitals" style="top:118px;left:24px">
      <h3>Hit points</h3>
      <input class="in num" id="f-hpdelta" type="number" min="0" inputmode="numeric" placeholder="Amount" aria-label="Amount">
      <div class="hint" id="hp-hint">${hpHint(sh, "dmg", 0)}</div>
      <div class="row2">
        <button class="btn danger" data-act="hp" data-op="dmg">Damage</button>
        <button class="btn" data-act="hp" data-op="heal">Heal</button>
        <button class="btn" data-act="hp" data-op="temp">Set temp</button>
      </div>
      <span class="calc">Damage uses temp HP first.</span>
    </div>`;
  }
  return "";
}

// ---------- Panels ----------
function findItem(sh, kind, id) {
  const list = kind === "spell" ? sh.spells : kind === "feature" ? sh.features : sh.actions;
  return list.find((x) => x.id === id);
}
function inlineEditor(sh, kind, it) {
  const word = kind === "spell" ? "spell" : kind === "feature" ? "feature" : "action";
  const abOpts = (v, none = true, sc = false) => `${none ? `<option value="" ${!v ? "selected" : ""}>None</option>` : ""}${sc ? `<option value="sc" ${v === "sc" ? "selected" : ""}>Spellcasting</option>` : ""}${ABILITIES.map(([k, , l]) => `<option value="${k}" ${v === k ? "selected" : ""}>${l}</option>`).join("")}`;
  const sw = (f, on, label) => `<label class="switch" title="${label}"><input type="checkbox" data-in="it-toggle" data-f="${f}" id="f-t-${f}" ${on ? "checked" : ""} aria-label="${label}"><span></span></label>`;
  const i = info(sh, it, kind);
  let h = `<fieldset class="fs">
    <label class="fld"><span>Name</span><input class="in" id="f-it-name" data-in="it" data-f="name" value="${esc(it.name)}"></label>
    ${kind !== "feature" ? `<div class="grid2">
      <label class="fld"><span>Activation</span><select class="in" id="f-it-act" data-in="it" data-f="act">${ACTIVATIONS.map(([k, l]) => `<option value="${k}" ${it.act === k ? "selected" : ""}>${l}</option>`).join("")}</select></label>
      <label class="fld"><span>Range or note</span><input class="in" id="f-it-range" data-in="it" data-f="range" value="${esc(it.range)}" placeholder="Melee · 5 ft"></label></div>` : ""}
    ${kind === "spell" ? `<div class="grid3" style="align-items:end">
      <label class="fld"><span>Level</span><select class="in" id="f-it-level" data-in="it" data-f="level" data-num="1">${ORD.map((o, l) => `<option value="${l}" ${+it.level === l ? "selected" : ""}>${l === 0 ? "Cantrip" : o}</option>`).join("")}</select></label>
      <label class="check"><input type="checkbox" id="f-it-conc" data-in="it-bool" data-f="conc" ${it.conc ? "checked" : ""}>Concentration</label>
      <label class="check"><input type="checkbox" id="f-it-ritual" data-in="it-bool" data-f="ritual" ${it.ritual ? "checked" : ""}>Ritual</label></div>` : ""}
  </fieldset>`;
  if (kind === "action") {
    h += `<fieldset class="fs"><div class="fs-h"><h3>Attack roll ${it.hit ? `<small class="num">${sg(i.hit)} to hit</small>` : ""}</h3>${sw("hit", !!it.hit, "Attack roll")}</div>
      ${it.hit ? `<div class="grid3" style="align-items:end">
        <label class="fld"><span>Ability</span><select class="in" id="f-hit-ab" data-in="it" data-f="hit.ab">${abOpts(it.hit.ab)}</select></label>
        <label class="fld"><span>Flat bonus</span><input class="in num" type="number" id="f-hit-flat" data-in="it" data-f="hit.flat" data-num="1" value="${it.hit.flat}"></label>
        <label class="check" style="height:32px"><input type="checkbox" id="f-hit-prof" data-in="it-bool" data-f="hit.prof" ${it.hit.prof ? "checked" : ""}>Add proficiency</label></div>` : ""}
    </fieldset>
    <fieldset class="fs"><div class="fs-h"><h3>Saving throw ${it.save ? `<small class="num">DC ${i.dc}</small>` : ""}</h3>${sw("save", !!it.save, "Saving throw")}</div>
      ${it.save ? `<div class="grid3">
        <label class="fld"><span>Target saves with</span><select class="in" id="f-sv-target" data-in="it" data-f="save.target">${abOpts(it.save.target, false)}</select></label>
        <label class="fld"><span>DC from</span><select class="in" id="f-sv-ab" data-in="it" data-f="save.ab">${abOpts(it.save.ab)}</select></label>
        <label class="fld"><span>Or fixed DC</span><input class="in num" type="number" id="f-sv-dc" data-in="it" data-f="save.dc" value="${it.save.dc ?? ""}" placeholder="${8 + P(sh) + abMod(sh, it.save.ab)}"></label></div>
        <span class="calc">Calculated DC is 8 + proficiency + the ability modifier. A fixed DC overrides it.</span>` : ""}
    </fieldset>`;
  }
  if (kind === "spell") {
    h += `<fieldset class="fs"><div class="fs-h"><h3>Spell attack ${it.hit ? `<small class="num">${sg(spellAtk(sh))} to hit</small>` : ""}</h3>${sw("hit", !!it.hit, "Spell attack")}</div></fieldset>
    <fieldset class="fs"><div class="fs-h"><h3>Saving throw ${it.save ? `<small class="num">DC ${spellDC(sh)}</small>` : ""}</h3>${sw("save", !!it.save, "Saving throw")}</div>
      ${it.save ? `<label class="fld"><span>Target saves with</span><select class="in" id="f-sv-target" data-in="it" data-f="save.target">${abOpts(it.save.target, false)}</select></label>` : ""}
    </fieldset>`;
  }
  if (kind !== "feature") {
    h += `<fieldset class="fs"><div class="fs-h"><h3>Damage or healing</h3><small>${it.dmg.length ? it.dmg.map((p) => partStr(sh, p)).join(" + ") : "None"}</small></div>
      ${it.dmg.map((p, j) => `<div class="dmg-part">
        <input class="in num" type="number" min="0" id="f-dp-n-${j}" data-in="dp" data-j="${j}" data-f="n" value="${p.n}" aria-label="Number of dice">
        <select class="in" id="f-dp-d-${j}" data-in="dp" data-j="${j}" data-f="d" aria-label="Die">${[4, 6, 8, 10, 12, 20].map((d) => `<option value="${d}" ${+p.d === d ? "selected" : ""}>d${d}</option>`).join("")}</select>
        <select class="in" id="f-dp-ab-${j}" data-in="dp" data-j="${j}" data-f="ab" aria-label="Add ability modifier">${abOpts(p.ab, true, kind === "spell")}</select>
        <input class="in num" type="number" id="f-dp-flat-${j}" data-in="dp" data-j="${j}" data-f="flat" value="${p.flat}" aria-label="Flat bonus">
        <select class="in" id="f-dp-type-${j}" data-in="dp" data-j="${j}" data-f="type" aria-label="Damage type">${DAMAGE_TYPES.map((t) => `<option value="${t}" ${p.type === t ? "selected" : ""}>${t}</option>`).join("")}</select>
        <button class="btn icon ghost" data-act="dp-rm" data-j="${j}" aria-label="Remove this part">${ic("x", "sm")}</button></div>`).join("")}
      ${it.dmg.length ? `<span class="calc">Dice · die · ability · flat bonus · type. On a critical hit only the dice are doubled.</span>` : ""}
      <button class="btn outline" data-act="dp-add" style="align-self:flex-start">${ic("plus", "sm")}Add a damage part</button>
    </fieldset>`;
  }
  if (kind !== "spell") {
    h += `<fieldset class="fs"><div class="fs-h"><h3>Limited uses</h3>${sw("uses", !!it.uses, "Limited uses")}</div>
      ${it.uses ? `<div class="grid2">
        <label class="fld"><span>Uses</span><input class="in num" type="number" min="1" id="f-us-max" data-in="it" data-f="uses.max" data-num="1" value="${it.uses.max}"></label>
        <label class="fld"><span>Recharges on</span><select class="in" id="f-us-rc" data-in="it" data-f="uses.recharge">${RECHARGES.map(([k, l]) => `<option value="${k}" ${it.uses.recharge === k ? "selected" : ""}>${l}</option>`).join("")}</select></label></div>` : ""}
    </fieldset>`;
  }
  h += `<fieldset class="fs"><div class="fs-h"><h3>Description</h3><small>Shown on the roll card and when shared</small></div>
    <textarea class="in" id="f-it-desc" data-in="it" data-f="desc" rows="4" aria-label="Description">${esc(it.desc)}</textarea></fieldset>`;
  return `<div class="inline-ed" role="group" aria-label="Edit ${esc(it.name || word)}">${h}
    <div class="ed-f"><button class="btn ghost" style="color:var(--text-2)" data-act="delete-item" data-kind="${kind}" data-id="${it.id}">${ic("trash", "sm")}Delete ${word}</button><span class="grow calc">Changes save as you type</span><button class="btn" data-act="close-editor">Done</button></div>
  </div>`;
}

function pickerPanel(sh) {
  const p = S.panel;
  const owned = new Set(sh.spells.map((s) => s.name.toLowerCase()));
  const q = p.q.trim().toLowerCase();
  const list = SRD.filter((s) => (p.lvl === "all" || s[1] === +p.lvl) && (!q || s[0].toLowerCase().includes(q))).sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
  const shown = list.slice(0, 120);
  return `<div class="panel" role="dialog" aria-label="Add spells from the SRD list">
    <div class="panel-h"><button class="btn icon ghost" data-act="close-panel" aria-label="Back">${ic("chevronLeft")}</button><h2>Add from SRD list</h2></div>
    <div style="padding:12px 12px 0;display:flex;flex-direction:column;gap:8px">
      <div class="search">${ic("search", "sm")}<input class="in" id="f-pick-q" data-in="pick-q" value="${esc(p.q)}" placeholder="Search ${SRD.length} SRD spells" aria-label="Search spells" autocomplete="off"></div>
      <div class="lvl-chips" role="group" aria-label="Filter by level">${["all", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => `<button data-act="pick-lvl" data-l="${l}" aria-pressed="${String(p.lvl) === String(l)}">${l === "all" ? "All" : l === 0 ? "Cantrips" : `Level ${l}`}</button>`).join("")}</div>
    </div>
    <div class="panel-b" id="panel-b" style="gap:0">
      ${shown.length ? shown.map((s) => {
        const [name, level, act, range, hit, save, dmgs] = s;
        const has = owned.has(name.toLowerCase());
        const meta = [level === 0 ? "Cantrip" : ordShort(level), ACT[act] || act, range, hit ? "spell attack" : "", save ? `${AB[save]?.s || save.toUpperCase()} save` : "", dmgs.map((d) => `${d[0]}d${d[1]} ${d[2]}`).join(" + ")].filter(Boolean).join(" · ");
        return `<label class="pick ${has ? "owned" : ""}"><input type="checkbox" data-in="pick" data-name="${esc(name)}" id="f-pk-${esc(name).replace(/[^a-z0-9]/gi, "")}" ${p.sel.has(name) ? "checked" : ""} ${has ? "disabled" : ""}>
          <span class="row-txt"><span class="row-nm">${esc(name)}${has ? ` <span class="mark">Added</span>` : ""}</span><span class="row-meta">${esc(meta)}</span></span></label>`;
      }).join("") : `<p class="log-empty">No SRD spells match “${esc(p.q)}”. Try another name, or make it yourself with New spell.</p>`}
      ${list.length > shown.length ? `<p class="calc" style="padding:8px">Showing ${shown.length} of ${list.length}. Search to narrow it down.</p>` : ""}
    </div>
    <div class="panel-f"><span class="grow">${p.sel.size ? `${p.sel.size} selected` : "Pick spells to add"}</span><button class="btn primary" data-act="pick-add" ${p.sel.size ? "" : "disabled"}>${p.sel.size ? `Add ${p.sel.size} spell${p.sel.size > 1 ? "s" : ""}` : "Add spells"}</button></div>
  </div>`;
}

function popHtml() {
  const sh = cur();
  let tabsH = "", content = "";
  if (sh) {
    const tabs = tabList(sh);
    if (!tabs.find((t) => t[0] === S.tab)) S.tab = "main";
    tabsH = tabs.length < 2 ? "" : `<div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" id="tab-${k}" aria-selected="${S.tab === k}" data-act="tab" data-k="${k}">${l}</button>`).join("")}</div>`;
    content = { main: mainTab, spells: spellsTab, inventory: inventoryTab }[S.tab](sh);
  }
  const panel = S.panel && sh ? pickerPanel(sh) : "";
  return `<div class="pop ${S.wide ? "wide" : ""} ${S.drawer ? "log-open" : ""}" id="pop">
    <div class="sheet ${S.edit && !readOnly() ? "editing" : ""}" id="sheet">
      ${head(sh)}
      ${banners(sh)}
      ${sh ? `${abilities(sh)}${tabsH}<div class="scroll" id="scroll-main" ${tabsH ? `role="tabpanel" aria-labelledby="tab-${S.tab}"` : ""}>${content}</div>` : emptyMain()}
      ${menus(sh)}
      ${S.toast ? `<div class="toast" role="status"><span>${esc(S.toast.msg)}</span>${S.toast.undo ? `<button class="btn" data-act="undo">${ic("undo", "sm")}Undo</button>` : ""}${S.toast.action ? `<button class="btn" data-act="${S.toast.action.act}">${esc(S.toast.action.label)}</button>` : ""}</div>` : ""}
      ${panel}
    </div>
    ${S.drawer ? side() : ""}
  </div>`;
}

function renderTokens() {
  const host = document.getElementById("tokens");
  host.innerHTML = TOKENS.map((t) => `<button class="token" style="left:${t.x}px;top:${t.y}px;--tk:${t.color}" data-act="token" data-id="${t.id}" aria-pressed="${S.selectedToken === t.id}" aria-label="Select token ${t.label}">${t.initials}<small>${t.label}</small></button>`).join("");
  document.getElementById("obr-bar").innerHTML = ["pointer", "ruler", "pencil", "dice", "book"].map((n) => `<span class="${n === "book" ? "on" : ""}">${ic(n)}</span>`).join("");
}

function render() {
  const host = document.getElementById("pop-host");
  const a = document.activeElement;
  const focusId = a && a.id && host.contains(a) ? a.id : null;
  let sel = null;
  try { if (focusId && a.selectionStart != null) sel = [a.selectionStart, a.selectionEnd]; } catch (e) { sel = null; }
  const scrolls = {};
  ["scroll-main", "log", "panel-b"].forEach((id) => { const el = document.getElementById(id); if (el) scrolls[id] = el.scrollTop; });
  const logEl = document.getElementById("log");
  const logAtEnd = logEl && logEl.scrollHeight - logEl.scrollTop - logEl.clientHeight < 12;
  host.innerHTML = popHtml();
  Object.entries(scrolls).forEach(([id, v]) => { const el = document.getElementById(id); if (el) el.scrollTop = v; });
  // Reading the newest rolls stays pinned to the newest as cards arrive or grow; a reader scrolled up keeps their place.
  const newLog = document.getElementById("log");
  if (newLog && (logAtEnd || !logEl)) newLog.scrollTop = newLog.scrollHeight;
  if (focusId) {
    const el = document.getElementById(focusId);
    if (el) { el.focus({ preventScroll: true }); try { if (sel) el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* number inputs */ } }
  }
  const m = host.querySelector(".menu[data-anchor]");
  if (m) {
    const sheet = document.getElementById("sheet");
    const a = sheet.querySelector(m.dataset.anchor);
    if (a) m.style.top = `${a.getBoundingClientRect().bottom - sheet.getBoundingClientRect().top + 6}px`;
  }
  if (S.focusEditor) {
    S.focusEditor = false;
    const ed = host.querySelector(".inline-ed");
    if (ed) { ed.closest(".li").scrollIntoView({ block: "nearest" }); document.getElementById("f-it-name")?.focus({ preventScroll: true }); }
  }
  S.log.forEach((en) => (en.fresh = false));
  renderTokens();
  document.getElementById("p-role").value = S.role;
  const d = document.getElementById("p-dice");
  d.setAttribute("aria-pressed", S.dicePlus);
  d.textContent = S.dicePlus ? "Installed" : "Not installed";
}

// ---------- Events ----------
function setPath(obj, path, v) {
  const ks = path.split(".");
  let o = obj;
  ks.slice(0, -1).forEach((k) => (o = o[k]));
  o[ks[ks.length - 1]] = v;
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]");
  const inMenu = e.target.closest(".menu");
  if (!t) { if (S.menu && !inMenu) { S.menu = null; render(); } return; }
  const act = t.dataset.act;
  const sh = cur();
  if (S.menu && !inMenu && act !== "menu") S.menu = null;
  switch (act) {
    case "menu": S.menu = S.menu === t.dataset.menu ? null : t.dataset.menu; render();
      if (S.menu === "hp") document.getElementById("f-hpdelta")?.focus();
      return;
    case "edit": S.edit = !S.edit; S.panel = null; S.editing = null; break;
    case "mode": S.mode = t.dataset.v; break;
    case "vis": S.vis = S.vis === "gm" ? "public" : "gm"; break;
    case "tab": S.tab = t.dataset.k; break;
    case "check": rollD20Card(sh, `${AB[t.dataset.k].l} check`, abMod(sh, t.dataset.k), e, "check"); return;
    case "save": rollD20Card(sh, `${AB[t.dataset.k].l} save`, saveMod(sh, t.dataset.k), e, "save"); return;
    case "saveprof": sh.abilities[t.dataset.k].save = !sh.abilities[t.dataset.k].save; break;
    case "skill": { const k = t.dataset.k; rollD20Card(sh, SKILLS.find((x) => x[0] === k)[1], skillMod(sh, k), e, "check"); return; }
    case "cycle-prof": sh.skills[t.dataset.k] = ((sh.skills[t.dataset.k] || 0) + 1) % 3; break;
    case "roll": { const it = findItem(sh, t.dataset.kind, t.dataset.id); if (it) rollItem(sh, it, t.dataset.kind, e); return; }
    case "use": {
      const it = [...sh.actions, ...sh.features].find((x) => x.id === t.dataset.id);
      const left = it.uses.max - it.uses.used;
      it.uses.used = +t.dataset.i < left ? it.uses.used + 1 : it.uses.used - 1;
      break;
    }
    case "slot": { const sl = sh.slots[t.dataset.l]; const left = sl.max - sl.used; sl.used = +t.dataset.i < left ? sl.used + 1 : sl.used - 1; break; }
    case "slot-max": {
      const l = t.dataset.l; sh.slots[l] = sh.slots[l] || { max: 0, used: 0 };
      sh.slots[l].max = Math.max(0, sh.slots[l].max + +t.dataset.d); sh.slots[l].used = Math.min(sh.slots[l].used, sh.slots[l].max); break;
    }
    case "toggle-open": S.open.has(t.dataset.id) ? S.open.delete(t.dataset.id) : S.open.add(t.dataset.id); break;
    case "share": { const f = sh.features.find((x) => x.id === t.dataset.id); const en = base(sh, f.name); en.desc = f.desc; en.showDesc = true; post(en, { mine: false }); return; }
    case "drawer": S.drawer = !S.drawer; S.toast = null; if (S.drawer) { S.unseen = 0; scrollLog(); } break;
    case "quick": { const p = { n: 1, d: +t.dataset.d, ab: "", flat: 0, type: "" }; const en = base(sh || { name: ME(), ownerColor: "#888", owner: ME() }, `1d${t.dataset.d}`); en.dmg = rollParts(sh || { abilities: {} }, [p], false); post(en, { mine: false }); return; }
    case "save-reply": { const en = S.log.find((x) => x.id === t.dataset.id); rollSaveReply(en, e); return; }
    case "undo-spend": {
      const en = S.log.find((x) => x.id === t.dataset.id);
      const owner = [...S.lib.player, ...S.lib.gm, S.maren].find((s) => s.id === (en.spent || en.used).sheet);
      if (en.spent) { owner.slots[en.spent.level].used--; en.spent = null; en.note = "Slot returned"; }
      if (en.used) { const it = [...owner.actions, ...owner.features].find((x) => x.id === en.used.item); it.uses.used--; en.used = null; en.note = "Use returned"; }
      break;
    }
    case "death": rollDeath(sh); return;
    case "hp": {
      const n = Math.max(0, parseInt(document.getElementById("f-hpdelta").value, 10) || 0);
      if (!n && t.dataset.op !== "temp") { document.getElementById("f-hpdelta").focus(); return; }
      S.menu = null; applyHp(sh, t.dataset.op, n); return;
    }
    case "rest": S.menu = null; rest(t.dataset.k); return;
    case "wide": S.wide = !S.wide; S.menu = null; break;
    case "export": S.menu = null; toast(`${sh ? sh.name : "Sheets"} exported as a .codex.json file (simulated)`); return;
    case "import": S.menu = null; toast("Opens a file picker for a .codex.json file (simulated)"); return;
    case "switch": S.active[S.role] = t.dataset.id; S.menu = null; S.edit = false; S.panel = null; S.editing = null; break;
    case "back-mine": S.active[S.role] = mine()[0]?.id; break;
    case "new-sheet": {
      const ns = blankSheet(t.dataset.kind); ns.owner = ME(); ns.ownerColor = S.role === "gm" ? "#2b9fc0" : "#3d8bfd";
      S.firstRun = false; if (S.role === "player" && !S.lib.player.length) S.lib.player = [];
      S.lib[S.role].push(ns); S.active[S.role] = ns.id; S.edit = true; S.menu = null; S.tab = "main"; break;
    }
    case "add-casting": sh.spellcasting = { ab: "int", atk: 0, dc: 0 }; break;
    case "add-item": {
      const k = t.dataset.kind;
      const it = k === "spell" ? spl({ name: "New spell", level: 1 }) : k === "feature" ? ft({ name: "New feature" }) : act({ name: "New action" });
      (k === "spell" ? sh.spells : k === "feature" ? sh.features : sh.actions).push(it);
      S.editing = { kind: k, id: it.id }; S.focusEditor = true; break;
    }
    case "open-editor": {
      const same = S.editing?.id === t.dataset.id;
      S.editing = same ? null : { kind: t.dataset.kind, id: t.dataset.id }; S.focusEditor = !same; break;
    }
    case "close-editor": S.editing = null; break;
    case "delete-item": {
      const k = t.dataset.kind; const listName = k === "spell" ? "spells" : k === "feature" ? "features" : "actions";
      const idx = sh[listName].findIndex((x) => x.id === t.dataset.id); const [gone] = sh[listName].splice(idx, 1);
      S.editing = null; toast(`Deleted ${gone.name}`, () => sh[listName].splice(idx, 0, gone)); return;
    }
    case "close-panel": S.panel = null; break;
    case "dp-add": { const it = findItem(sh, S.editing.kind, S.editing.id); it.dmg.push(dmg(1, 6, "", 0, it.dmg[0]?.type || "slashing")); break; }
    case "dp-rm": { const it = findItem(sh, S.editing.kind, S.editing.id); it.dmg.splice(+t.dataset.j, 1); break; }
    case "picker": S.panel = { type: "picker", q: "", lvl: "all", sel: new Set() }; break;
    case "pick-lvl": S.panel.lvl = t.dataset.l; break;
    case "pick-add": {
      const n = S.panel.sel.size;
      S.panel.sel.forEach((name) => {
        const s = SRD.find((x) => x[0] === name);
        sh.spells.push(spl({ name: s[0], level: s[1], act: ACT[s[2]] ? s[2] : "A", range: s[3], hit: !!s[4], save: s[5] ? { target: s[5] } : null, dmg: s[6].map((d) => dmg(d[0], d[1], "", 0, d[2])), desc: s[7] }));
      });
      S.panel = null; toast(`Added ${n} spell${n > 1 ? "s" : ""} from the SRD list`); return;
    }
    case "qty": { const it = sh.inventory.items.find((x) => x.id === t.dataset.id); it.qty = Math.max(0, it.qty + +t.dataset.d); break; }
    case "rm-item": {
      const items = sh.inventory.items; const idx = items.findIndex((x) => x.id === t.dataset.id); const [gone] = items.splice(idx, 1);
      toast(`Removed ${gone.name}`, () => items.splice(idx, 0, gone)); return;
    }
    case "undo": { const u = S.toast?.undo; S.toast = null; if (u) u(); break; }
    case "token": {
      const tk = TOKENS.find((x) => x.id === t.dataset.id);
      S.selectedToken = tk.id;
      const target = mine().find((s) => s.id === tk.sheet) || shared().find((s) => s.id === tk.sheet);
      if (target) { S.active[S.role] = target.id; S.edit = false; S.panel = null; toast(`Selected ${tk.label} on the map: showing ${shared().includes(target) ? "their sheet, read-only" : "its sheet"}`); return; }
      toast(`${tk.label} isn't linked to one of your sheets`); return;
    }
  }
  render();
});

document.addEventListener("input", (e) => {
  const t = e.target;
  const k = t.dataset.in;
  if (!k) return;
  const sh = cur();
  if (t.id === "f-hpdelta") return;
  const num = (v) => (v === "" ? 0 : +v);
  switch (k) {
    case "name": sh.name = t.value; break;
    case "subtitle": sh.subtitle = t.value; break;
    case "prof": sh.prof = num(t.value); break;
    case "hpmax": sh.hp.max = Math.max(1, num(t.value)); sh.hp.cur = Math.min(sh.hp.cur, sh.hp.max); break;
    case "ac": sh.ac = num(t.value); break;
    case "ab": sh.abilities[t.dataset.k].score = num(t.value); break;
    case "coin": sh.inventory.coins[t.dataset.k] = Math.max(0, num(t.value)); return; // no re-render needed
    case "scab": sh.spellcasting.ab = t.value; break;
    case "scatk": sh.spellcasting.atk = num(t.value); break;
    case "scdc": sh.spellcasting.dc = num(t.value); break;
    case "it": {
      const it = findItem(sh, S.editing.kind, S.editing.id);
      let v = t.value;
      if (t.dataset.num || t.type === "number") v = t.dataset.f === "save.dc" && v === "" ? null : num(v);
      setPath(it, t.dataset.f, v); break;
    }
    case "it-bool": { const it = findItem(sh, S.editing.kind, S.editing.id); setPath(it, t.dataset.f, t.checked); break; }
    case "it-toggle": {
      const it = findItem(sh, S.editing.kind, S.editing.id); const f = t.dataset.f;
      if (S.editing.kind === "spell") it[f] = f === "hit" ? t.checked : t.checked ? { target: "dex" } : null;
      else if (f === "hit") it.hit = t.checked ? { ab: "str", prof: true, flat: 0 } : null;
      else if (f === "save") it.save = t.checked ? { ab: "con", dc: null, target: "dex" } : null;
      else if (f === "uses") it.uses = t.checked ? { max: 1, used: 0, recharge: "LR" } : null;
      break;
    }
    case "dp": {
      const it = findItem(sh, S.editing.kind, S.editing.id); const p = it.dmg[+t.dataset.j];
      p[t.dataset.f] = ["n", "d", "flat"].includes(t.dataset.f) ? num(t.value) : t.value; break;
    }
    case "pick-q": S.panel.q = t.value; break;
    case "pick": t.checked ? S.panel.sel.add(t.dataset.name) : S.panel.sel.delete(t.dataset.name); break;
  }
  render();
});
document.addEventListener("input", (e) => {
  if (e.target.id !== "f-hpdelta") return;
  const sh = cur();
  const n = Math.max(0, parseInt(e.target.value, 10) || 0);
  document.getElementById("hp-hint").textContent = hpHint(sh, "dmg", n);
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target.dataset.form;
  const sh = cur();
  if (f === "notation") {
    const v = document.getElementById("f-notation").value;
    const p = parseNotation(v);
    if (!p) { S.quickErr = "Use dice notation like 2d6+3 or d20-1."; render(); return; }
    S.quickErr = "";
    const who = sh || { name: ME(), ownerColor: "#888", owner: ME(), abilities: {} };
    const en = base(who, v.replace(/\s+/g, ""));
    en.dmg = rollParts(who, [p], false);
    post(en, { mine: false });
    const inp = document.getElementById("f-notation"); if (inp) inp.value = "";
  }
  if (f === "item") {
    const name = document.getElementById("f-newitem").value.trim();
    if (!name) { document.getElementById("f-newitem").focus(); return; }
    sh.inventory.items.push(itm(1, name, +document.getElementById("f-newwt").value || 0));
    render();
    document.getElementById("f-newitem")?.focus();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (S.menu) S.menu = null; else if (S.panel) S.panel = null; else if (S.editing) S.editing = null; else if (S.drawer) S.drawer = false; else return;
  render();
});

// ---------- Prototype controls ----------
function incoming(kind) {
  if (kind === "breath") {
    const d = sampleDrake();
    const en = { sheetId: "drake", who: "Ash Drake", color: d.ownerColor, player: "GM", title: "Fire Breath", vis: "public", desc: d.actions[3].desc };
    en.dmg = rollParts(d, d.actions[3].dmg, false); en.save = { target: "dex", dc: 13 };
    post(en, { mine: false });
  } else if (kind === "bolt") {
    const m = S.maren; const it = m.spells.find((s) => s.name === "Guiding Bolt");
    const r = d20("normal"); const crit = r.nat === 20;
    const en = { who: m.name, color: m.ownerColor, player: "Robin", title: "Guiding Bolt", vis: "public", desc: it.desc };
    en.d20 = { ...r, mod: spellAtk(m), total: r.nat + spellAtk(m), label: "to hit" }; en.dmg = rollParts(m, it.dmg, crit);
    post(en, { mine: false });
  } else if (kind === "sneaky") {
    const i = S.lib.player[0]; const r = d20("normal");
    post({ who: i.name, color: i.ownerColor, player: "Sam", title: "Stealth", vis: "gm", d20: { ...r, mod: skillMod(i, "stealth"), total: r.nat + skillMod(i, "stealth"), label: "check" } }, { mine: false });
    if (S.role !== "gm") toast("Sam's roll went to the GM only. Switch to the GM view to see it.");
  }
}
function seedLog() {
  const m = S.maren; const i = S.lib.player[0];
  S.log.push(
    { id: `r${++seq}`, who: m.name, color: m.ownerColor, player: "Robin", title: "Guiding Bolt", vis: "public", replies: [], desc: m.spells.find((s) => s.name === "Guiding Bolt").desc,
      d20: { rolls: [14], kept: 0, nat: 14, mode: "normal", mod: 7, total: 21, label: "to hit" }, dmg: [{ n: 4, d: 6, rolls: [5, 2, 6, 3], bonus: 0, total: 16, type: "radiant" }] },
    { id: `r${++seq}`, who: i.name, color: i.ownerColor, player: "Sam", title: "Rapier", vis: "public", replies: [], desc: i.actions[0].desc,
      d20: { rolls: [17, 6], kept: 0, nat: 17, mode: "adv", mod: 7, total: 24, label: "to hit" }, dmg: [{ n: 1, d: 8, rolls: [6], bonus: 4, total: 10, type: "piercing" }] },
    { id: `r${++seq}`, sheetId: "drake", who: "Ash Drake", color: "#2b9fc0", player: "GM", title: "Fire Breath", vis: "public", replies: [], desc: "Each creature in a 15-foot cone makes a DEX save, taking 6d6 fire damage on a failure or half as much on a success.",
      dmg: [{ n: 6, d: 6, rolls: [4, 6, 1, 3, 5, 2], bonus: 0, total: 21, type: "fire" }], save: { target: "dex", dc: 13 } },
  );
  S.unseen = 1;
}

function applyState(v) {
  if (v === "reset") { S = freshState(); seedLog(); }
  if (v === "firstrun") { S.firstRun = true; S.edit = false; S.panel = null; }
  if (v === "down") { S.role = "player"; S.firstRun = false; S.active.player = "ilse"; const i = S.lib.player[0]; i.hp.cur = 0; i.hp.temp = 0; i.death = { s: 1, f: 1 }; }
  if (v === "storage") S.storageBlocked = true;
  if (v === "readonly") { S.role = "gm"; S.firstRun = false; S.active.gm = "maren"; S.edit = false; S.tab = "spells"; }
  render();
}
document.getElementById("p-toggle").addEventListener("click", (e) => {
  const open = document.getElementById("p-ctl").classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", open);
});
document.getElementById("p-role").addEventListener("change", (e) => { S.role = e.target.value; S.edit = false; S.panel = null; S.menu = null; S.selectedToken = null; render(); });
document.getElementById("p-theme").addEventListener("change", (e) => {
  const v = e.target.value; if (v === "system") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", v);
});
document.getElementById("p-dice").addEventListener("click", () => { S.dicePlus = !S.dicePlus; render(); });
document.getElementById("p-incoming").addEventListener("change", (e) => { if (e.target.value) incoming(e.target.value); e.target.value = ""; });
document.getElementById("p-state").addEventListener("change", (e) => { if (e.target.value) applyState(e.target.value); e.target.value = ""; });

// Boot. A bare #token list (joined by "-") opens a preset, e.g. #gm-wide or #edit.
S = freshState();
seedLog();
(location.hash.slice(1) || "").split("-").filter(Boolean).forEach((k) => {
  const sh = () => cur();
  ({
    gm: () => (S.role = "gm"), light: () => document.documentElement.setAttribute("data-theme", "light"), dark: () => document.documentElement.setAttribute("data-theme", "dark"),
    wide: () => (S.wide = true), drawer: () => { S.drawer = true; S.unseen = 0; }, edit: () => (S.edit = true),
    editor: () => { S.edit = true; S.editing = { kind: "action", id: sh().actions[0].id }; },
    picker: () => { S.edit = true; S.tab = "spells"; S.panel = { type: "picker", q: "", lvl: "all", sel: new Set(["Sleep", "Cure Wounds"]) }; },
    hp0: () => applyState("down"), firstrun: () => (S.firstRun = true), readonly: () => applyState("readonly"), storage: () => (S.storageBlocked = true),
    spells: () => (S.tab = "spells"), skills: () => (S.tab = "main"), features: () => { S.tab = "main"; S.open.add(sh().features[0].id); }, inventory: () => (S.tab = "inventory"),
    more: () => (S.menu = "more"), switcher: () => (S.menu = "switcher"), hppanel: () => (S.menu = "hp"), nodice: () => (S.dicePlus = false),
  })[k]?.();
});
render();
