import OBR from "@owlbear-rodeo/sdk"
import { nextTick, toRaw } from 'vue'
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

const metadataPrefix = 'com.purvaldur.actions'

const socket = io("ws://localhost:5173/", {})

socket.on("connect", () => {
  console.log(`connect ${socket.id}`);
})
socket.on("disconnect", () => {
  console.log("disconnect");
})

export default {
  data() {
    return {
      castingTimes: [
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
          name: '24 Hours',
          short: '24H'
        }
      ],
      template: {
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
            fullName: "Strength",
            value: 18
          },
          {
            name: 'dex',
            fullName: "Dexterity",
            value: 14
          },
          {
            name: 'con',
            fullName: "Constitution",
            value: 18
          },
          {
            name: 'int',
            fullName: "Intelligence",
            value: 8
          },
          {
            name: 'wis',
            fullName: "Wisdom",
            value: 8
          },
          {
            name: 'cha',
            fullName: "Charisma",
            value: 8
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
            editing: false,
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
            editing: false,
            castingTime: {
              name: 'Bonus Action',
              short: 'B'
            },
            rollToHit: true,
            bonusFlat: 0,
            bonusStat: 'str',
            proficiency: true,
            save: true,
            saveStat: 'str',
            saveDC: null, //if null, calculate from saveStat
            editing: false,
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
            editing: false,
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
            editing: false,
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
      },
      player: { tabs: {}},
      meta: {},
      msg: 'Hello OBR!',
      sidebar: {
        display: false,
        log: [],
      }
    }
  },

  methods: {
    increment() {
      this.player.currentHP++
      this.setMetadata(false)
    },
    toggleSidebar() {
      this.sidebar.display = !this.sidebar.display
      const width = this.sidebar.display ? 800 : 500
      OBR.action.setWidth(width).then(() => {
        if (this.sidebar.display === true && this.sidebar.log.length > 0) {
          const el = toRaw(this.$refs).logEntry.pop()
          el.scrollIntoView({behavior: 'instant', block: 'nearest', inline: 'start'})
        }
      })
    },
    togglePlayerEdit() {
      this.player.editing = !this.player.editing
    },
    toggleSkillEdit(i) {
      this.player.skills[i].editing = !this.player.skills[i].editing
    },
    toggleActionEdit(i) {
      this.player.actions[i].editing = !this.player.actions[i].editing
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
      const bonusFlat = action.bonusFlat ? action.bonusFlat : 0
      const proficiency = action.proficiency ? this.player.proficiency : 0
      return Number(bonusStat) + Number(bonusFlat) + Number(proficiency)
    },
    calculateActionSave(action) {
      const saveStat = this.player.stats.find(stat => stat.name === action.saveStat)
      const saveDC = action.saveDC ? action.saveDC : 8 + this.calculateModifier(saveStat) + this.player.proficiency

      if (saveStat !== undefined && !action.saveDC) {
        return 8 + this.calculateModifier(saveStat.value) + this.player.proficiency
      } else if (action.saveDC) {
        return saveDC
      } else {
        return 8 + this.player.proficiency
      }
    },
    calculateActionDamage(action) {
      return action.damage.map(d => {
        const bonusStat = d.bonusStat ? this.calculateModifier(this.player.stats.find(stat => stat.name === d.bonusStat).value) : 0
        // The split turns '1d4' into [1, 4]
        const split = d.dice.split('d')
        let dice = 0
        // loop over amount of dice, rolling each one and adding the result to total
        for (let i = 0; i < split[0]; i++) {
          dice += Math.floor(Math.random() * split[1]) + 1
        }
        const total = dice + bonusStat + d.bonusFlat
        return {
          total: total,
          type: d.type
        }
      })
    },
    rollD20(roll) {
      roll.d20 = true
      roll.advantage = this.player.advantage
      roll.disadvantage = this.player.disadvantage
      roll.roll1 = Math.floor(Math.random() * 20) + 1
      roll.roll2 = Math.floor(Math.random() * 20) + 1
      roll.upper = Math.max(roll.roll1, roll.roll2)
      roll.lower = Math.min(roll.roll1, roll.roll2)
      
      if (this.player.advantage) {
        roll.total = roll.upper + roll.modifier
      } else if (this.player.disadvantage) {
        roll.total = roll.lower + roll.modifier
      } else {
        roll.total = roll.roll1 + roll.modifier
      }
      return roll
    },
    rollAbility(ability) {
      if (!this.player.editing) {
        let roll = { name: this.player.name, type: 'ability', action: ability.fullName }
        roll.modifier = this.calculateModifier(ability.value)
        roll = this.rollD20(roll)
        socket.emit('roll', roll)
      }
    },
    rollSkill(skill) {
      let roll = { name: this.player.name, type: 'skill', action: skill.name }
      roll.modifier = this.calculateSkill(skill)
      roll = this.rollD20(roll)
      socket.emit('roll', roll)
    },
    rollAction(action) {
      let roll = { name: this.player.name, type: 'action', action: action.name }
      if (action.rollToHit) {
        roll.modifier = this.calculateActionBonus(action)
        roll = this.rollD20(roll)
      }
      if (action.damage) {
        roll.damage = this.calculateActionDamage(action)
      }
      if (action.save) {
        roll.save = true
        roll.saveStat = action.saveStat
        roll.saveDC = action.saveDC
      }
      socket.emit('roll', roll)
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
        this.player = Object.assign({}, toRaw(this.template));
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
    console: () => console,
    skillsComputed() {
      return this.player.skills.map(skill => {
        const modifier = this.calculateSkill(skill)
        return Object.assign({}, skill, { modifier })
      })
    },
    actionsComputed() {
      return this.player.actions.map(action => {
        const modifier = this.calculateActionBonus(action)
        return Object.assign({}, action, { modifier })
      })
    }
  },

  beforeMount() {
    this.setMetadata(true) // Initially set metadata from template until we know if we have any saved metadata
    OBR.room.getMetadata().then(metadata => {
      if (metadata[`${metadataPrefix}`] && metadata[`${metadataPrefix}`][OBR.player.id]) {
        this.player = metadata[`${metadataPrefix}`][OBR.player.id].player
        OBR.player.getName().then(name => {
          this.player.name = name
        })
      }
      console.log(metadata)
      this.toggleSidebar()
    })

    socket.on('roll', (roll) => {
      console.log('roll', roll)
      this.sidebar.log.push(roll)
      if (this.sidebar.display) {
        nextTick(() => {
          const el = toRaw(this.$refs).logEntry.pop()
          el.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'})
        })
      }
    })
  },

  mounted() {
  }
}