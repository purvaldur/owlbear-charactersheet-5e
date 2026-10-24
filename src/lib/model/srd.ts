// SRD spells as the SRD list in the dialog popover loads them (public/srd-spells.json, written by scripts/build-srd.mjs), and turning one into
// a sheet's spell.
import { ACTIVATIONS, damage, newSpell } from "./defaults";
import type { AbilityKey, Activation, Spell } from "./types";

/** [name, level, activation, range, spellAttack, saveTarget, [[dice, die, type]], description] */
export type SrdSpell = [string, number, string, string, number, string, [number, number, string][], string];

export const srdSaveTarget = (s: SrdSpell) => (s[5] ? (s[5].toLowerCase() as AbilityKey) : null);

export function spellFromSrd(s: SrdSpell): Spell {
  const target = srdSaveTarget(s);
  return newSpell({
    name: s[0],
    level: s[1],
    act: (ACTIVATIONS.some((a) => a[0] === s[2]) ? s[2] : "A") as Activation,
    range: s[3],
    hit: !!s[4],
    save: target ? { target } : null,
    dmg: s[6].map((d) => damage(d[0], d[1], "", 0, d[2])),
    desc: s[7],
  });
}
