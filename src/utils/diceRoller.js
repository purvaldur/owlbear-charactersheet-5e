import { DiceRoll } from '@dice-roller/rpg-dice-roller'

export function rollDice(notation) {
  const roll = new DiceRoll(notation)
  return {
    notation: roll.notation,
    total: roll.total,
    rolls: roll.rolls,
    output: roll.output
  }
}

export function rollCheck(modifier = 0, advantage = false, disadvantage = false) {
  let notation = '1d20'
  if (advantage && !disadvantage) {
    notation = '2d20kh1'
  } else if (disadvantage && !advantage) {
    notation = '2d20kl1'
  }

  const roll = new DiceRoll(notation)
  const total = roll.total + modifier

  return {
    notation: roll.notation,
    rolls: roll.rolls,
    modifier,
    total,
    isSuccess: roll.total === 20,
    isCriticalFailure: roll.total === 1,
    output: `${roll.output} ${modifier >= 0 ? '+' : ''}${modifier} = ${total}`
  }
}

export function rollDamage(diceNotation, modifier = 0) {
  const roll = new DiceRoll(diceNotation)
  const total = roll.total + modifier

  return {
    notation: roll.notation,
    rolls: roll.rolls,
    modifier,
    total,
    output: `${roll.output} ${modifier >= 0 ? '+' : ''}${modifier} = ${total}`
  }
}