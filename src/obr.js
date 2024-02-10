import OBR from "@owlbear-rodeo/sdk"
import { toRaw } from 'vue'

import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

const socket = io("ws://localhost:5173/", {});

socket.on("connect", () => {
  console.log(`connect ${socket.id}`);
});

socket.on("disconnect", () => {
  console.log("disconnect");
});

const metadataPrefix = 'com.purvaldur.actions'

const template = {
  name: '',
  currentHP: 1,
  maxHP: 37,
  tempHP: 8,
  armorClass: 16,
  proficiency: 2,
  spellStat: 'int',
  advantage: false,
  disadvantage: false,
  editing: false,
  tabs: {
    skills: true,
    actions: false,
    spells: false
  },
  stats: [
    {
      name: 'str',
      value: 18
    },
    {
      name: 'dex',
      value: 14
    },
    {
      name: 'con',
      value: 18
    },
    {
      name: 'int',
      value: 8
    },
    {
      name: 'wis',
      value: 8
    },
    {
      name: 'cha',
      value: 8
    }
  ],
  skills: [
    {
      name: 'Acrobatics',
      proficient: false,
      expertise: false,
      base: 'dex'
    },
    {
      name: 'Animal Handling',
      proficient: false,
      expertise: false,
      base: 'wis'
    },
    {
      name: 'Arcana',
      proficient: false,
      expertise: false,
      base: 'int'
    },
    {
      name: 'Athletics',
      proficient: false,
      expertise: false,
      base: 'str'
    },
    {
      name: 'Deception',
      proficient: false,
      expertise: false,
      base: 'cha'
    },
    {
      name: 'History',
      proficient: false,
      expertise: false,
      base: 'int'
    },
    {
      name: 'Insight',
      proficient: false,
      expertise: false,
      base: 'wis'
    },
    {
      name: 'Intimidation',
      proficient: false,
      expertise: false,
      base: 'cha'
    },
    {
      name: 'Investigation',
      proficient: false,
      expertise: false,
      base: 'int'
    },
    {
      name: 'Medicine',
      proficient: false,
      expertise: false,
      base: 'wis'
    },
    {
      name: 'Nature',
      proficient: false,
      expertise: false,
      base: 'int'
    },
    {
      name: 'Perception',
      proficient: false,
      expertise: false,
      base: 'wis'
    },
    {
      name: 'Performance',
      proficient: false,
      expertise: false,
      base: 'cha'
    },
    {
      name: 'Persuasion',
      proficient: false,
      expertise: false,
      base: 'cha'
    },
    {
      name: 'Religion',
      proficient: false,
      expertise: false,
      base: 'int'
    },
    {
      name: 'Sleight of Hand',
      proficient: false,
      expertise: false,
      base: 'dex'
    },
    {
      name: 'Stealth',
      proficient: false,
      expertise: false,
      base: 'dex'
    },
    {
      name: 'Survival',
      proficient: false,
      expertise: false,
      base: 'wis'
    }
  ],
  actions: [
    {
      name: 'Unarmed Strike',
      castingTime: {
        name: 'Action',
        short: 'A'
      },
      bonusFlat: 0,
      bonusStat: 'str',
      proficiency: true,
      save: false,
      saveStat: null,
      saveDC: null,
      damage: [
        {
          dice: '1d4',
          bonusFlat: 0,
          bonusStat: 'str',
          type: 'bludgeoning'
        },
        {
          dice: '1d4',
          bonusFlat: 0,
          bonusStat: null, // No bonus stat for damage
          type: 'fire'
        },
      ]
    },
    {
      name: 'Unarmed Strike',
      castingTime: {
        name: 'Bonus Action',
        short: 'B'
      },
      bonusFlat: 0,
      bonusStat: 'str',
      proficiency: true,
      save: true,
      saveStat: 'str',
      saveDC: null, //if null, calculate from saveStat
      damage: [
        {
          dice: '1d4',
          bonusFlat: 0,
          bonusStat: 'str',
          type: 'bludgeoning'
        }
      ]
    }
  ],
  spells: [
    {
      name: 'Fire Bolt',
      level: 0,
      castingTime: {
        name: 'Action',
        short: 'A'
      },
      bonusFlat: 0,
      range: '120 ft.',
      attack: true,
      save: null, // if not null, calculate from spellStat
      damage: [
        {
          dice: '1d10',
          bonusFlat: 0,
          bonusStat: null,
          type: 'fire'
        }
      ]
    },
    {
      name: 'Mind Sliver',
      level: 0,
      castingTime: {
        name: 'Action',
        short: 'A'
      },
      bonusFlat: 0,
      range: '60 ft.',
      attack: false,
      save: "int",
      damage: [
        {
          dice: '1d6',
          bonusFlat: 0,
          bonusStat: null,
          type: 'psychic'
        }
      ]
    }
  ]
}

export default {
  data() {
    return {
      player: template,
      meta: {},
      msg: 'Hello OBR!',
    }
  },

  methods: {
    increment() {
      this.player.currentHP++
      this.setMetadata(false)
    },
    setAdvantage(advantage, i) {
      if (advantage) {
        this.player.advantage = !this.player.advantage
        this.player.disadvantage = false
      } else {
        this.player.disadvantage = !this.player.disadvantage
        this.player.advantage = false
      }
    },
    setTab(tab) {
      this.player.tabs[tab] = true
      for (const key in this.player.tabs) {
        if (key !== tab) {
          this.player.tabs[key] = false
        }
      }
    },
    calculateModifier(stat) {
      return Math.floor((stat - 10) / 2)
    },
    calculateSkill(skill) {
      const modifier = this.calculateModifier(this.player.stats.find(stat => stat.name === skill.base).value)
      const proficiency = skill.proficient ? this.player.proficiency : 0
      const expertise = skill.expertise ? this.player.proficiency : 0
      return modifier + proficiency + expertise
    },
    calculateSpellAttack() {
      const modifier = this.calculateModifier(this.player.stats.find(s => s.name === this.player.spellStat).value)
      const proficiency = this.player.proficiency
      return (modifier + proficiency >= 0 ? '+' : '') + (modifier + proficiency)
    },
    calculateSpellSave() {
      const modifier = this.calculateModifier(this.player.stats.find(s => s.name === this.player.spellStat).value)
      const proficiency = this.player.proficiency
      return 8 + modifier + proficiency
    },
    calculateActionBonus(action) {
      const bonusStat = action.bonusStat ? this.calculateModifier(this.player.stats.find(stat => stat.name === action.bonusStat).value) : 0
      const proficiency = action.proficiency ? this.player.proficiency : 0
      const bonus = bonusStat + proficiency
      return (bonus >= 0 ? '+' : '') + bonus
    },
    calculateActionDamage(action) {
      const damage = action.damage.map(d => {
        const bonusStat = d.bonusStat ? this.calculateModifier(this.player.stats.find(stat => stat.name === d.bonusStat).value) : 0
        const bonus = bonusStat
        return d.dice + (bonus >= 0 ? '+' : '') + bonus + ' ' + d.type
      })
      return damage.join(', ')
    },
    rollSkill(skill) {
      const modifier = this.calculateSkill(skill)
      const roll1 = Math.floor(Math.random() * 20) + 1
      const roll2 = Math.floor(Math.random() * 20) + 1
      const upper = Math.max(roll1, roll2)
      const lower = Math.min(roll1, roll2)
      let total = 0
      let result = ''
      if (this.player.advantage) {
        total = upper + modifier
        result = `↑[${upper} | ${lower}] + ${modifier} = ${total}`
      } else if (this.player.disadvantage) {
        total = lower + modifier
        result = `↓[${upper} | ${lower}] + ${modifier} = ${total}`
      } else {
        total = roll1 + modifier
        result = `${roll1} + ${modifier} = ${total}`
      }
      OBR.notification.show(`${this.player.name} rolled ${skill.name}: ${result}!`)
    },
    newAction() {
      console.log('TODO');
    },
    getMetadata() {
      OBR.room.getMetadata().then(metadata => {
        console.log('metadata: ', metadata)
      })
    },
    setMetadata(fromTemplate) {
      if (fromTemplate) {
        // Clone the template object so we don't mutate it
        this.player = Object.assign({}, template);
        OBR.player.getName().then(name => {
          this.player.name = name
        })
      } else {
        this.player.advantage = false
        this.player.disadvantage = false
      }
      OBR.room.setMetadata({
        [`${metadataPrefix}`]: {
          [OBR.player.id]: {
            player: toRaw(this.player)
          }
        }
      }).then(() => {
        this.getMetadata()
      })
    },
    resetMetadata() {
      OBR.room.setMetadata({
        [`${metadataPrefix}`]: {
          [OBR.player.id]: undefined
        }
      }).then(() => {
        console.log('metadata reset')
      })
    }
  },

  computed: {
    skillsComputed() {
      return this.player.skills.map(skill => {
        const modifier = this.calculateSkill(skill)
        return Object.assign({}, skill, { modifier })
      })
    }
  },

  mounted() {
    OBR.room.getMetadata().then(metadata => {
      if (!metadata[`${metadataPrefix}`] || !metadata[`${metadataPrefix}`][OBR.player.id]) {
        this.setMetadata(true) // Set metadata from template
      } else {
        this.player = metadata[`${metadataPrefix}`][OBR.player.id].player
        OBR.player.getName().then(name => {
          this.player.name = name
        })
      }
      console.log(metadata)
    })
  }
}