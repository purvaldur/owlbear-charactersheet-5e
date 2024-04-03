// NOTE2SELF: I originally took spellsInput from an alchemy export (why?).
// FUTURE: Take from 5e.tools instead. Will require a reworked conversion script.
// https://github.com/5etools-mirror-2/5etools-mirror-2.github.io/tree/main/data/spells

// convert spellsInput.json to format used in player template

// example input format
// {
//   "spell": [
//     {
//       "name": "Control Flames",
//       "source": "XGE",
//       "page": 152,
//       "otherSources": [
//         {
//           "source": "EEPC",
//           "page": 16
//         }
//       ],
//       "level": 0,
//       "school": "T",
//       "time": [
//         {
//           "number": 1,
//           "unit": "action"
//         }
//       ],
//       "range": {
//         "type": "point",
//         "distance": {
//           "type": "feet",
//           "amount": 60
//         }
//       },
//       "components": {
//         "s": true
//       },
//       "duration": [
//         {
//           "type": "instant"
//         },
//         {
//           "type": "timed",
//           "duration": {
//             "type": "hour",
//             "amount": 1
//           }
//         }
//       ],
//       "entries": [
//         "You choose nonmagical flame that you can see within range and that fits within a 5-foot cube. You affect it in one of the following ways:",
//         {
//           "type": "list",
//           "items": [
//             "You instantaneously expand the flame 5 feet in one direction, provided that wood or other fuel is present in the new location.",
//             "You instantaneously extinguish the flames within the cube.",
//             "You double or halve the area of bright light and dim light cast by the flame, change its color, or both. The change lasts for 1 hour.",
//             "You cause simple shapes\u2014such as the vague form of a creature, an inanimate object, or a location\u2014to appear within the flames and animate as you like. The shapes last for 1 hour."
//           ]
//         },
//         "If you cast this spell multiple times, you can have up to three non-instantaneous effects created by it active at a time, and you can dismiss such an effect as an action."
//       ],
//       "miscTags": [
//         "LGT",
//         "SGT"
//       ],
//       "areaTags": [
//         "C"
//       ],
//       "hasFluffImages": true
//     },
//     {
//			 "name": "Steel Wind Strike",
//			 "source": "XGE",
//			 "page": 166,
//			 "level": 5,
//			 "school": "C",
//			 "time": [
//			 	{
//			 		"number": 1,
//			 		"unit": "action"
//			 	}
//			 ],
//			 "range": {
//			 	"type": "point",
//			 	"distance": {
//			 		"type": "feet",
//			 		"amount": 30
//			 	}
//			 },
//			 "components": {
//			 	"s": true,
//			 	"m": {
//			 		"text": "a melee weapon worth at least 1 sp",
//			 		"cost": 10
//			 	}
//			 },
//			 "duration": [
//			 	{
//			 		"type": "instant"
//			 	}
//			 ],
//			 "entries": [
//			 	"You flourish the weapon used in the casting and then vanish to strike like the wind. Choose up to five creatures you can see within range. Make a melee spell attack against each target. On a hit, a target takes {@damage 6d10} force damage.",
//			 	"You can then teleport to an unoccupied space you can see within 5 feet of one of the targets you hit or missed."
//			 ],
//			 "damageInflict": [
//			 	"force"
//			 ],
//			 "spellAttack": [
//			 	"M"
//			 ],
//			 "miscTags": [
//			 	"SGT",
//			 	"TP"
//			 ],
//			 "areaTags": [
//			 	"MT"
//			 ]
//		}
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
const spellsInput = JSON.parse(fs.readFileSync('spellsInput.json'));

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
    "number": 1,
    "unit": "action"
  },
  {
    "number": 1,
    "unit": "bonus"
  },
  {
    "number": 1,
    "unit": "reaction"
  },
  {
    "number": 1,
    "unit": "minute"
  },
  {
    "number": 10,
    "unit": "minute"
  },
  {
    "number": 1,
    "unit": "hour"
  },
  {
    "number": 8,
    "unit": "hour"
  },
  {
    "number": 12,
    "unit": "hour"
  },
  {
    "number": 24,
    "unit": "hour"
  }
]

const spells = spellsInput.spell.map(spell => {
  const newSpell = {
    name: spell.name,
    description: "",
    editing: false,
    level: spell.level,
    castingTime: {},
    rollToHit: false,
    range: "",
    save: false,
    saveTarget: null,
    damage: false,
    damageDice: []
  };
  newSpell.castingTime = castingTimeMapOutput[castingTimeMapInput.findIndex(castingTime => castingTime.number === spell.time[0].number && castingTime.unit === spell.time[0].unit)];
  if (spell.range.distance.type === 'feet') {
    newSpell.range = `${spell.range.distance.amount} ft.`;
  } else {
    newSpell.range = spell.range.distance.type;
  }
  for (let entry of spell.entries) {
    if (typeof entry === 'string') {
      newSpell.description += entry + '\n';
    } else if (entry.type === 'list') {
      for (let item of entry.items) {
        newSpell.description += item + '\n';
      }
    }
  }
  if (spell.spellAttack) {
    newSpell.rollToHit = true;
  }
  if (spell.savingThrow) {
    newSpell.save = true;
    newSpell.saveTarget = spell.savingThrow[0].slice(0, 3);
  }

  // TODO: Smarter damage parsing. Look at thunderclap for example of what went wrong.
  if (spell.damageInflict) {
    newSpell.damage = true;
    let damages
    if (spell.level === 0) {
      damages = spell.entries[0].match(/{@damage \d+d\d+}/g);
    } else {
      damages = newSpell.description.match(/{@damage \d+d\d+}/g);
    }
    if (damages) {
      damages.forEach(damage => {
        const dice = damage.match(/\d+d\d+/)[0].split('d');
        newSpell.damageDice.push({
          amount: parseInt(dice[0]),
          die: parseInt(dice[1]),
          type: spell.damageInflict[0].charAt(0).toUpperCase() + spell.damageInflict[0].slice(1)
        });
      });
    }
  }

  // finally, fix the description. convert {@damage 1d10} to 1d10
  newSpell.description = newSpell.description.replace(/{@damage (\d+d\d+)}/g, '$1');
  newSpell.description = newSpell.description.replace(/{@dice (\d+d\d+)}/g, '$1');
  return newSpell;
})

spells.forEach(spell => {
  if (!spell.castingTime) {
    console.log(spell.name);
  }
})

fs.writeFileSync('spellsOutput.json', JSON.stringify(spells, null, 2));
console.log('spellsOutput.json created');