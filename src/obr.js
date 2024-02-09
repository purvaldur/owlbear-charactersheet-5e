import OBR from "@owlbear-rodeo/sdk"
import { toRaw } from 'vue'

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
      type: {
        name: 'Action',
        short: 'A '
      },
      bonusFlat: 0,
      bonusStat: 'str',
      proficiency: true,
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
      type: {
        name: 'Bonus Action',
        short: 'BA'
      },
      bonusFlat: 0,
      bonusStat: 'str',
      proficiency: true,
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
    }
  ]
}

export default {
  data() {
    return {
      player: {},
      msg: 'Hello OBR!',
      player: template
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
    calculateSkill(skillIndex) {
      const skill = this.player.skills[skillIndex]
      const modifier = this.calculateModifier(this.player.stats.find(stat => stat.name === skill.base).value)
      const proficiency = skill.proficient ? this.player.proficiency : 0
      const expertise = skill.expertise ? this.player.proficiency : 0
      return (modifier + proficiency + expertise >= 0 ? '+' : '') + (modifier + proficiency + expertise)
    },
    calculateSave(stat) {
      const modifier = this.calculateModifier(this.player.stats.find(s => s.name === stat).value)
      const proficiency = this.player.proficiency
      return 8 + modifier + proficiency
    },
    calculateActionBonus(actionIndex) {
      const action = this.player.actions[actionIndex]
      const bonusStat = action.bonusStat ? this.calculateModifier(this.player.stats.find(stat => stat.name === action.bonusStat).value) : 0
      const proficiency = action.proficiency ? this.player.proficiency : 0
      const bonus = bonusStat + proficiency
      return (bonus >= 0 ? '+' : '') + bonus
    },
    calculateActionDamage(actionIndex) {
      // TODO
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