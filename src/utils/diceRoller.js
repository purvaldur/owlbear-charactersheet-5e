import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { useCharacterStore } from '@/stores/character';
import { useDiceLogStore } from '@/stores/diceLog';

export function rollDice(notation) {
  const roll = new DiceRoll(notation);
  return roll;
}

export function rollCheck(modifier = 0) {
  const characterStore = useCharacterStore();
  const rollState = characterStore.rollState;

  let notation = '';

  if (rollState === 'advantage') {
    notation = '2d20kh1';  // Keep highest of 2d20
  } else if (rollState === 'disadvantage') {
    notation = '2d20kl1';  // Keep lowest of 2d20
  } else {
    notation = '1d20';
  }

  if (modifier !== 0) {
    notation += modifier > 0 ? `+${modifier}` : modifier;
  }

  const roll = rollDice(notation);

  return roll;
}

export function rollAction(action) {
  const characterStore = useCharacterStore();

  let rollResult = {
    character: characterStore.name,
    action: action.name,
    description: action.description,
    toHit: null,
    dice: [],
    save: null
  };

  if (action.toHit.enabled) {
    const toHitRoll = rollCheck(action.toHit.modifier);
    console.log(toHitRoll);

    rollResult.toHit = {
      total: toHitRoll.total,
      notation: toHitRoll.notation,
      breakdown: toHitRoll.output
    };
  }

  if (action.dice.length > 0) {
    action.dice.forEach(die => {
      const diceRoll = rollDice(die.notation);
      rollResult.dice.push({
        total: diceRoll.total,
        notation: diceRoll.notation,
        breakdown: diceRoll.output,
        type: die.type
      });
    });
  }

  if (action.save.enabled) {
    rollResult.save = {
      dc: action.save.dc,
      ability: action.save.baseStat
    };
  }

  return rollResult;
}