// Short labels shared by the sheet, roll cards and the SRD spell list.
import { SPELL_LEVELS } from "../model/defaults";

/** "Cantrip", "1st-level", "2nd-level"… */
export const levelLabel = (level: number) => (level === 0 ? "Cantrip" : SPELL_LEVELS[level]!.replace(" level", "-level"));

/** Up to two initials for an avatar: "Ilse Varga" → "IV"; "?" for a blank name. */
export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
