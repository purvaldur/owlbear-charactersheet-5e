import { DiceRoll } from '@dice-roller/rpg-dice-roller';

export function rollDice(notation) {
  try {
    const roll = new DiceRoll(notation);
    return {
      rolls: roll.rolls,
      total: roll.total,
      notation: roll.notation,
      output: roll.output
    };
  } catch (error) {
    console.error('Invalid dice notation:', error);
    throw new Error('Invalid dice notation');
  }
}