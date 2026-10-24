// Where dice come from: Dice+ when the room has it, otherwise the built-in roller.
import { cryptoRng, rollOutcome, rollParts, type Rng } from "./roller";
import type { DiceOutcome, RollIntent, Visibility } from "./types";

export interface DiceSource {
  readonly name: "dice+" | "builtin";
  /** With `critOnly`, rolls just the extra dice a natural 20 adds to each damage part. */
  roll(intent: RollIntent, opts: { vis: Visibility; critOnly?: boolean }): Promise<DiceOutcome>;
}

export const builtinDice = (rng: Rng = cryptoRng): DiceSource => ({
  name: "builtin",
  async roll(intent, opts) {
    return opts.critOnly ? { parts: rollParts(intent, rng) } : rollOutcome(intent, rng);
  },
});
