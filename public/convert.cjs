// convert spellsInput.json to format used in player template
// output to spells.json

// example input format
// {
//   "spells": [
//     {
//       "castingTime": "1 Action",
//       "components": [
//         "V",
//         "M"
//       ],
//       "description": "Magical darkness spreads from a point you choose within range to fill a 15-foot-radius sphere for the duration. The darkness spreads around corners. A creature with darkvision can't see through this darkness, and nonmagical light can't illuminate it.\n\nIf the point you choose is on an object you are holding or one that isn't being worn or carried, the darkness emanates from the object and moves with it. Completely covering the source of the darkness with an opaque object, such as a bowl or a helm, blocks the darkness.\n\nIf any of this spell's area overlaps with an area of light created by a spell of 2nd level or lower, the spell that created the light is dispelled.",
//       "duration": "Up to 10 minutes",
//       "level": 2,
//       "materials": "bat fur and a drop of pitch or piece of coal",
//       "name": "Darkness",
//       "range": "60 ft.",
//       "requiresConcentration": true,
//       "savingThrow": {
//       },
//       "school": "Evocation",
//       "tags": [
//         "sorcerer",
//         "warlock",
//         "wizard"
//       ]
//     },
//     {
//       "canBeCastAsRitual": true,
//       "castingTime": "1 minute",
//       "components": [
//         "V",
//         "S",
//         "M"
//       ],
//       "description": "By casting gem-inlaid sticks, rolling dragon bones, laying out ornate cards, or employing some other divining tool, you receive an omen from an otherworldly entity about the results of a specific course of action that you plan to take within the next 30 minutes. The DM chooses from the following possible omens:\n\n• Weal, for good results\n\n• Woe, for bad results\n\n• Weal and woe, for both good and bad results\n\n• Nothing, for results that aren't especially good or bad\n\nThe spell doesn't take into account any possible circumstances that might change the outcome, such as the casting of additional spells or the loss or gain of a companion.\n\nIf you cast the spell two or more times before completing your next long rest, there is a cumulative 25 percent chance for each casting after the first that you get a random reading. The DM makes this roll in secret.",
//       "duration": "Instantaneous",
//       "level": 2,
//       "materials": "specially marked sticks, bones, or similar tokens worth at least 25 gp",
//       "name": "Augury",
//       "range": "Self",
//       "savingThrow": {
//       },
//       "school": "Divination",
//       "tags": [
//         "cleric"
//       ]
//     },
//     {
//       "canCastAtHigherLevel": true,
//       "castingTime": "1 Action",
//       "components": [
//         "V",
//         "S"
//       ],
//       "damage": [
//         {
//           "dice": "1d10",
//           "type": "Fire"
//         }
//       ],
//       "description": "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn't being worn or carried. \n\nThis spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
//       "duration": "Instantaneous",
//       "higherLevelDescription": "This spell's damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
//       "higherLevels": [
//         {
//           "applyAtLevels": [
//             5,
//             11,
//             17
//           ],
//           "damage": {
//             "dice": "1d10",
//             "type": "Fire"
//           },
//           "type": "at-character-level"
//         }
//       ],
//       "level": 0,
//       "name": "Fire Bolt",
//       "range": "120 ft.",
//       "rollsAttack": true,
//       "savingThrow": {
//       },
//       "school": "Evocation",
//       "tags": [
//         "Artificer",
//         "Sorcerer",
//         "Wizard"
//       ]
//     },
//   ]
// }

// example output format
// {
//   spells: [
//     {
//       name: 'Fire Bolt',
//       editing: false,
//       level: 0,
//       castingTime: {
//         name: 'Action',
//         short: 'A'
//       },
//       rollToHit: true,
//       bonusFlat: 0,
//       range: '120 ft.',
//       save: false,
//       saveTarget: 'dex',
//       damage: true,
//       damageDice: [
//         {
//           amount: 1,
//           die: 10,
//           type: 'fire'
//         }
//       ]
//     }
//   ]
// }

const fs = require('fs');
const spellsInput = require('./spellsInput.json');

const castingTimeMapOutput = [
  {
    name: 'Action',
    short: 'A'
  },
  {
    name: 'Bonus Action',
    short: 'B'
  },
  {
    name: 'Reaction',
    short: 'R'
  },
  {
    name: '1 Minute',
    short: '1M'
  },
  {
    name: '10 Minutes',
    short: '10M'
  },
  {
    name: '1 Hour',
    short: '1H'
  },
  {
    name: '8 Hours',
    short: '8H'
  },
  {
    name: '12 Hours',
    short: '12H'
  },
  {
    name: '24 Hours',
    short: '24H'
  }
]
const castingTimeMapInput = [
  {
    name: '1 Action',
    short: 'A'
  },
  {
    name: '1 Bonus Action',
    short: 'B'
  },
  {
    name: '1 Reaction',
    short: 'R'
  },
  {
    name: '1 minute',
    short: '1M'
  },
  {
    name: '10 minutes',
    short: '10M'
  },
  {
    name: '1 hour',
    short: '1H'
  },
  {
    name: '8 hours',
    short: '8H'
  },
  {
    name: '12 hours',
    short: '12H'
  },
  {
    name: '24 hours',
    short: '24H'
  }
]

const spells = spellsInput.spells.map(spell => {
  const newSpell = {
    name: spell.name,
    editing: false,
    level: spell.level,
    castingTime: {
    },
    rollToHit: false,
    range: spell.range,
    save: false,
    saveTarget: null,
    damage: false,
    damageDice: []
  };
  newSpell.castingTime = castingTimeMapOutput[castingTimeMapInput.findIndex(castingTime => castingTime.name === spell.castingTime)];
  if (spell.rollsAttack) newSpell.rollToHit = true;
  if (spell.savingThrow && spell.savingThrow.abilityName) {
    newSpell.save = true;
    newSpell.saveTarget = spell.savingThrow.abilityName;
  }
  if (spell.damage) {
    newSpell.damage = true;
    spell.damage.forEach(damage => {
      newSpell.damageDice.push({
        amount: damage.dice.split('d')[0],
        die: damage.dice.split('d')[1],
        type: damage.type
      });
    });
  }
  return newSpell;
})

fs.writeFileSync('spells.json', JSON.stringify(spells, null, 2));
console.log('spells.json created');