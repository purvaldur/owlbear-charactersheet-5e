import { nextTick, toRaw, reactive } from 'vue'
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

// export const socket = io("https://owlbear.vald.io/", {})
export const socket = io("localhost:3000", {}) // for local development

export let codex = reactive({
  player: {
    tabs: {}
  },
  characters: {
    active: 0,
    list: []
  },

  meta: {
    obr: {
      user_id: null,
      room_id: null,
      user_name: null,
      isGM: null
    },
    get() {
      // not used anymore - keeping around for future ideas
    },
    set() {
      // uses codex.stuff instead of this.stuff because 'this' refers to 'codex.meta'
      codex.player.advantage = false
      codex.player.disadvantage = false
      codex.characters.list[codex.characters.active] = codex.player
      localStorage.setItem('characters', JSON.stringify(codex.characters))
      socket.emit('update', {
        id: codex.meta.obr.user_id,
        characters: JSON.stringify(codex.characters),
        name: codex.meta.obr.user_name
      })
    }
  }
})


export const template = {
  name: 'Change me!',
  editing: false,
  sectionEditing: false,
  active: false,
  currentHP: 10,
  maxHP: 10,
  tempHP: 0,
  armorClass: 10,
  proficiency: 2,
  spellStat: 'int',
  spellAttackBonus: 0,
  spellDCBonus: 0,
  advantage: false,
  disadvantage: false,
  spellBookOpen: false,
  tabs: {
    skills: true,
    actions: false,
    spells: false,
    traits: false,
    sheets: false,
    storage: false,
    raw: false
  },
  stats: [
    {
      name: 'str',
      fullName: "Strength",
      saveProficient: false,
      value: 10
    },
    {
      name: 'dex',
      fullName: "Dexterity",
      saveProficient: false,
      value: 10
    },
    {
      name: 'con',
      fullName: "Constitution",
      saveProficient: false,
      value: 10
    },
    {
      name: 'int',
      fullName: "Intelligence",
      saveProficient: false,
      value: 10
    },
    {
      name: 'wis',
      fullName: "Wisdom",
      saveProficient: false,
      value: 10
    },
    {
      name: 'cha',
      fullName: "Charisma",
      saveProficient: false,
      value: 10
    }
  ],
  skills: [
    {
      name: 'Acrobatics',
      proficient: false,
      expertise: false,
      base: 'dex',
      editing: false
    },
    {
      name: 'Animal Handling',
      proficient: false,
      expertise: false,
      base: 'wis',
      editing: false
    },
    {
      name: 'Arcana',
      proficient: false,
      expertise: false,
      base: 'int',
      editing: false
    },
    {
      name: 'Athletics',
      proficient: false,
      expertise: false,
      base: 'str',
      editing: false
    },
    {
      name: 'Deception',
      proficient: false,
      expertise: false,
      base: 'cha',
      editing: false
    },
    {
      name: 'History',
      proficient: false,
      expertise: false,
      base: 'int',
      editing: false
    },
    {
      name: 'Insight',
      proficient: false,
      expertise: false,
      base: 'wis',
      editing: false
    },
    {
      name: 'Intimidation',
      proficient: false,
      expertise: false,
      base: 'cha',
      editing: false
    },
    {
      name: 'Investigation',
      proficient: false,
      expertise: false,
      base: 'int',
      editing: false
    },
    {
      name: 'Medicine',
      proficient: false,
      expertise: false,
      base: 'wis',
      editing: false
    },
    {
      name: 'Nature',
      proficient: false,
      expertise: false,
      base: 'int',
      editing: false
    },
    {
      name: 'Perception',
      proficient: false,
      expertise: false,
      base: 'wis',
      editing: false
    },
    {
      name: 'Performance',
      proficient: false,
      expertise: false,
      base: 'cha',
      editing: false
    },
    {
      name: 'Persuasion',
      proficient: false,
      expertise: false,
      base: 'cha',
      editing: false
    },
    {
      name: 'Religion',
      proficient: false,
      expertise: false,
      base: 'int',
      editing: false
    },
    {
      name: 'Sleight of Hand',
      proficient: false,
      expertise: false,
      base: 'dex',
      editing: false
    },
    {
      name: 'Stealth',
      proficient: false,
      expertise: false,
      base: 'dex',
      editing: false
    },
    {
      name: 'Survival',
      proficient: false,
      expertise: false,
      base: 'wis',
      editing: false
    },

    {
      name: 'Strength Saving Throw',
      proficient: false,
      expertise: false,
      base: 'str',
      editing: false
    },
    {
      name: 'Dexterity Saving Throw',
      proficient: false,
      expertise: false,
      base: 'dex',
      editing: false
    },
    {
      name: 'Constitution Saving Throw',
      proficient: false,
      expertise: false,
      base: 'con',
      editing: false
    },
    {
      name: 'Intelligence Saving Throw',
      proficient: false,
      expertise: false,
      base: 'int',
      editing: false
    },
    {
      name: 'Wisdom Saving Throw',
      proficient: false,
      expertise: false,
      base: 'wis',
      editing: false
    },
    {
      name: 'Charisma Saving Throw',
      proficient: false,
      expertise: false,
      base: 'cha',
      editing: false
    }
  ],
  actions: [
    {
      name: 'Unarmed Strike',
      description: 'A punch, kick, head-butt, or similar forceful blow.',
      editing: false,
      castingTime: {
        name: 'Action',
        short: 'A'
      },
      rollToHit: true,
      bonusFlat: 0,
      bonusStat: 'str',
      proficiency: true,
      save: false,
      saveStat: null,
      saveDC: null,
      saveTarget: 'con',
      damage: true,
      damageDice: [
        {
          amount: 1,
          die: 1,
          bonusFlat: 0,
          bonusStat: 'str',
          type: 'bludgeoning'
        }
      ]
    }
  ],
  spells: {
    0: [],
    1: [
      {
        name: 'Fire Bolt',
        editing: false,
        level: 1,
        castingTime: {
          name: 'Action',
          short: 'A'
        },
        rollToHit: true,
        bonusFlat: 0,
        range: '120 ft.',
        save: false,
        saveTarget: 'dex',
        damage: true,
        damageDice: [
          {
            amount: 1,
            die: 10,
            bonusFlat: 0,
            bonusStat: 'int',
            type: 'fire'
          }
        ]
      }
    ],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: []
  },
  spellSlots: {
    1: [{used: false}],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: []
  },
  traits: [
    {
      name: 'Darkvision',
      description: 'You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can’t discern color in darkness, only shades of gray.',
      counter: {
        enabled: false,
        amount: []
      },
      editing: false
    }
  ],
  storage: {
    money: {
      cp: 0,
      sp: 0,
      ep: 0,
      gp: 0,
      pp: 0
    },
    equipment: [
      {
        amount: 1,
        name: 'Backpack',
        weight: "5lbs",
        value: "2gp"
      }
    ],
  }
}