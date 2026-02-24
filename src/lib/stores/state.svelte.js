import OBR from "@owlbear-rodeo/sdk";

const SOURCE_ID = 'valdurs-heroic-codex';

let toastTimer;
const pendingRolls = new Map(); // rollId → { name, mod }

function d20() { return Math.floor(Math.random() * 20) + 1; }

const meta = $state({
  editMode: false,
  rollState: 'normal', // 'normal' | 'advantage' | 'disadvantage'
  activeTab: 'main',   // 'main' | 'spells' | 'inventory' | 'backstory' | 'notes'
  currentCharacterIndex: 0,
  rollHistory: [],
  toast: null,              // { label, total, die } | null
  dicePlusAvailable: false,
  obrPlayer: { id: '', name: '' },
})

const characters = $state([
  {
    meta: {
      name: 'Valdur Ironhide',
      class: 'Barbarian',
      race: 'Half-Orc',
      level: 6,
      hp: { current: 24, max: 30, temp: 0 },
      armorClass: 15,
      proficiencyBonus: 3,
      inspiration: false
    },
    stats: [
      { name: { full: 'strength',     short: 'str' }, saveProficient: true,  value: 20 },
      { name: { full: 'dexterity',    short: 'dex' }, saveProficient: false, value: 14 },
      { name: { full: 'constitution', short: 'con' }, saveProficient: true,  value: 10 },
      { name: { full: 'intelligence', short: 'int' }, saveProficient: false, value: 12 },
      { name: { full: 'wisdom',       short: 'wis' }, saveProficient: false, value: 10 },
      { name: { full: 'charisma',     short: 'cha' }, saveProficient: false, value: 4  },
    ],
    skills: [
      { name: 'acrobatics',      proficiency: false, expertise: false, baseStat: 'dex' },
      { name: 'animal handling', proficiency: false, expertise: false, baseStat: 'wis' },
      { name: 'arcana',          proficiency: false, expertise: false, baseStat: 'int' },
      { name: 'athletics',       proficiency: true,  expertise: true,  baseStat: 'str' },
      { name: 'deception',       proficiency: false, expertise: false, baseStat: 'cha' },
      { name: 'history',         proficiency: false, expertise: false, baseStat: 'int' },
      { name: 'insight',         proficiency: false, expertise: false, baseStat: 'wis' },
      { name: 'intimidation',    proficiency: true,  expertise: false, baseStat: 'cha' },
      { name: 'investigation',   proficiency: false, expertise: false, baseStat: 'int' },
      { name: 'medicine',        proficiency: false, expertise: false, baseStat: 'wis' },
      { name: 'nature',          proficiency: false, expertise: false, baseStat: 'int' },
      { name: 'perception',      proficiency: true,  expertise: true,  baseStat: 'wis' },
      { name: 'performance',     proficiency: false, expertise: false, baseStat: 'cha' },
      { name: 'persuasion',      proficiency: false, expertise: false, baseStat: 'cha' },
      { name: 'religion',        proficiency: false, expertise: false, baseStat: 'int' },
      { name: 'sleight of hand', proficiency: false, expertise: false, baseStat: 'dex' },
      { name: 'stealth',         proficiency: false, expertise: false, baseStat: 'dex' },
      { name: 'survival',        proficiency: false, expertise: false, baseStat: 'wis' },
    ],
    actions: [
      { name: 'Unarmed Strike', attackBonus: 8, damage: '1d6+5',  desc: 'Bonus action. DC 15 on hit.' },
      { name: 'Greataxe',       attackBonus: 8, damage: '1d12+5', desc: 'Heavy, two-handed.' },
      { name: 'Handaxe',        attackBonus: 8, damage: '1d6+5',  desc: 'Range 20/60 ft.', thrown: true },
    ],
    features: [
      { name: 'Rage',                desc: 'ADV STR checks & saves. +2 dmg. Resist B/P/S.', pips: { total: 3, used: 1 } },
      { name: 'Darkvision',          desc: '60 ft. Dim as bright, dark as dim.' },
      { name: 'Relentless Endurance', desc: '1× long rest: reach 1 HP instead of 0.' },
      { name: 'Languages',           desc: 'Common, Orcish.' },
    ]
  }
]);

function getModifier(statValue) {
  return Math.floor((statValue - 10) / 2);
}

// ── Internal roll (fallback) ──────────────────────────────────────────────────

function pushHistory(name, total) {
  meta.rollHistory.unshift({ name: name.split(' ')[0], total });
  if (meta.rollHistory.length > 6) meta.rollHistory.pop();
}

function fireToast(name, total, die) {
  const rs = meta.rollState;
  const suffix = rs === 'advantage' ? ' ↑' : rs === 'disadvantage' ? ' ↓' : '';
  meta.toast = { label: (name + suffix).toUpperCase(), total, die };
  pushHistory(name, total);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { meta.toast = null; }, 1800);
}

function rollDiceInternal(name, mod) {
  const d1 = d20(), d2 = d20();
  const rs = meta.rollState;
  let die;
  if (rs === 'advantage')         die = Math.max(d1, d2);
  else if (rs === 'disadvantage') die = Math.min(d1, d2);
  else                            die = d1;
  fireToast(name, die + mod, die);
}

// ── Dice+ roll ────────────────────────────────────────────────────────────────

function buildNotation(mod) {
  const rs = meta.rollState;
  const base = rs === 'advantage' ? '2d20kh1' : rs === 'disadvantage' ? '2d20kl1' : '1d20';
  const modStr = mod === 0 ? '' : mod > 0 ? `+${mod}` : `${mod}`;
  return base + modStr;
}

async function rollDicePlus(name, mod) {
  const rollId = `roll_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  pendingRolls.set(rollId, { name, mod });

  const notation = buildNotation(mod);

  try {
    await OBR.broadcast.sendMessage('dice-plus/roll-request', {
      rollId,
      playerId:   meta.obrPlayer.id,
      playerName: meta.obrPlayer.name,
      rollTarget: 'everyone',
      diceNotation: notation,
      showResults: true,
      timestamp: Date.now(),
      source: SOURCE_ID,
    }, { destination: 'ALL' });
  } catch {
    // OBR broadcast failed — fall back to internal
    pendingRolls.delete(rollId);
    rollDiceInternal(name, mod);
  }
}

// ── Public roll entry-point ───────────────────────────────────────────────────

function rollDice(name, mod) {
  if (meta.dicePlusAvailable) {
    rollDicePlus(name, mod);
  } else {
    rollDiceInternal(name, mod);
  }
}

function toggleRollState(mode) {
  meta.rollState = meta.rollState === mode ? 'normal' : mode;
}

// ── Dice+ initialisation (called once from App.svelte) ────────────────────────

export function initDicePlus() {
  OBR.onReady(async () => {
    // Cache OBR player info
    try {
      const [id, name] = await Promise.all([OBR.player.getId(), OBR.player.getName()]);
      meta.obrPlayer = { id, name };
    } catch {
      // Unexpected — leave defaults
    }

    // Ready check
    const ready = await checkDicePlusReady();
    meta.dicePlusAvailable = ready;
    if (!ready) return;

    // Subscribe to results — Dice+ shows its own popup, we only update the log
    OBR.broadcast.onMessage(`${SOURCE_ID}/roll-result`, (event) => {
      const data = event.data;
      const pending = pendingRolls.get(data.rollId);
      if (!pending) return;
      pendingRolls.delete(data.rollId);
      pushHistory(pending.name, data.result.totalValue);
    });

    // Subscribe to errors — fall back to internal roll
    OBR.broadcast.onMessage(`${SOURCE_ID}/roll-error`, (event) => {
      const pending = pendingRolls.get(event.data.rollId);
      if (!pending) return;
      pendingRolls.delete(event.data.rollId);
      rollDiceInternal(pending.name, pending.mod);
    });
  });
}

function checkDicePlusReady() {
  return new Promise((resolve) => {
    const requestId = crypto.randomUUID();

    const unsubscribe = OBR.broadcast.onMessage('dice-plus/isReady', (event) => {
      const data = event.data;
      if ('ready' in data && data.requestId === requestId) {
        unsubscribe();
        resolve(true);
      }
    });

    OBR.broadcast.sendMessage('dice-plus/isReady', {
      requestId,
      timestamp: Date.now(),
    }, { destination: 'ALL' }).catch(() => {
      unsubscribe();
      resolve(false);
    });

    setTimeout(() => { unsubscribe(); resolve(false); }, 1000);
  });
}

export const state = {
  meta,
  characters,
  get character() {
    return this.characters[meta.currentCharacterIndex];
  },
  getModifier,
  rollDice,
  toggleRollState,
}
