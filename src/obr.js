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
          name: '12 Hours',
          short: '12H'
        },
        {
          name: '24 Hours',
          short: '24H'
        }
      ],
      spellLevels: [
        {
          name: 'Cantrip',
          short: '0'
        },
        {
          name: '1st Level',
          short: '1'
        },
        {
          name: '2nd Level',
          short: '2'
        },
        {
          name: '3rd Level',
          short: '3'
        },
        {
          name: '4th Level',
          short: '4'
        },
        {
          name: '5th Level',
          short: '5'
        },
        {
          name: '6th Level',
          short: '6'
        },
        {
          name: '7th Level',
          short: '7'
        },
        {
          name: '8th Level',
          short: '8'
        },
        {
          name: '9th Level',
          short: '9'
        }
      ],
      damageTypes: [
        'acid',
        'bludgeoning',
        'cold',
        'fire',
        'force',
        'lightning',
        'necrotic',
        'piercing',
        'poison',
        'psychic',
        'radiant',
        'slashing',
        'thunder'
      ],
      spellBook: [],
      spellBookSelected: [],
      template: {
        name: '',
        currentHP: 1,
        maxHP: 37,
        tempHP: 8,
        armorClass: 16,
        proficiency: 2,
        spellStat: 'int',
        spellAttackBonus: 0,
        spellDCBonus: 0,
        advantage: false,
        disadvantage: false,
        editing: false,
        spellBookOpen: false,
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
            saveTarget: 'con',
            damage: true,
            damageDice: [
              {
                amount: 1,
                die: 4,
                bonusFlat: 0,
                bonusStat: 'str',
                type: 'bludgeoning'
              },
              {
                amount: 1,
                die: 4,
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
            saveTarget: 'con',
            damage: true,
            damageDice: [
              {
                amount: 1,
                die: 4,
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
            editing: false,
            level: 0,
            castingTime: {
              name: 'Action',
              short: 'A'
            },
            rollToHit: true, // if true, use spell attack bonus (spellStat + proficiency)
            range: '120 ft.',
            save: true, // if true, calculate from spellStat (8 + spellStat + proficiency)
            saveTarget: 'dex',
            damage: true,
            damageDice: [
              {
                amount: 1,
                die: 10,
                type: 'fire'
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
      if (!this.player.editing) {
        this.player.skills.forEach(skill => skill.editing = false)
        this.player.actions.forEach(action => action.editing = false)
        this.player.spells.forEach(spell => spell.editing = false)
        this.player.spellBookOpen = false
        this.setMetadata(false)
      }
    },
    toggleSkillEdit(i) {
      this.player.skills[i].editing = !this.player.skills[i].editing
    },
    toggleActionEdit(i) {
      this.player.actions[i].editing = !this.player.actions[i].editing
    },
    toggleSpellEdit(i) {
      this.player.spells[i].editing = !this.player.spells[i].editing
    },
    toggleSpellbookOpen() {
      this.player.spellBookOpen = !this.player.spellBookOpen
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
      const bonus = this.player.spellAttackBonus
      return Number(modifier) + Number(proficiency) + Number(bonus)
    },
    calculateSpellSave() {
      const modifier = this.calculateModifier(this.player.stats.find(s => s.name === this.player.spellStat).value)
      const proficiency = this.player.proficiency
      const bonus = this.player.spellDCBonus
      return 8 + Number(modifier) + Number(proficiency) + Number(bonus)
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
      return action.damageDice.map(d => {
        let total = 0
        for (let i = 0; i < d.amount; i++) {
          total += Math.floor(Math.random() * d.die) + 1
        }
        total += d.bonusFlat
        if (d.bonusStat) {
          total += this.calculateModifier(this.player.stats.find(stat => stat.name === d.bonusStat).value)
        }
        return { total, type: d.type }
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
        roll.crit = roll.upper === 20 ? true : false
        roll.total = roll.upper + roll.modifier
      } else if (this.player.disadvantage) {
        roll.crit = roll.lower === 20 ? true : false
        roll.total = roll.lower + roll.modifier
      } else {
        roll.crit = roll.roll1 === 20 ? true : false
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
        roll.damage = true
        roll.damageDice = this.calculateActionDamage(action)
        if (roll.crit) {
          roll.damageDice.push(this.calculateActionDamage(spell))
        }
      }
      if (action.save) {
        roll.save = true
        roll.saveTarget = action.saveTarget
        roll.saveDC = this.calculateActionSave(action)
      }
      socket.emit('roll', roll)
    },
    rollSpell(spell) {
      let roll = { name: this.player.name, type: 'spell', action: spell.name }
      if (spell.rollToHit) {
        roll.modifier = this.calculateSpellAttack()
        roll = this.rollD20(roll)
      }
      if (spell.damage) {
        roll.damage = true
        roll.damageDice = this.calculateActionDamage(spell)
        if (roll.crit) {
          roll.damageDice.push(this.calculateActionDamage(spell))
        }
      }
      if (spell.save) {
        roll.save = true
        roll.saveTarget = spell.saveTarget
        roll.saveDC = this.calculateSpellSave()
      }
      // TODO: Add range, description, etc.
      socket.emit('roll', roll)
    },
    newAction() {
      this.player.actions.push({
        name: 'New Action',
        editing: true,
        castingTime: {
          name: 'Action',
          short: 'A'
        },
        rollToHit: false,
        bonusFlat: 0,
        bonusStat: null,
        proficiency: false,
        save: false,
        saveStat: null,
        saveDC: null,
        saveTarget: 'con',
        damage: false,
        damageDice: []
      })
    },
    newSpell() {
      this.player.spells.push({
        name: 'New Spell',
        editing: true,
        level: 0,
        castingTime: {
          name: 'Action',
          short: 'A'
        },
        rollToHit: false,
        bonusFlat: 0,
        range: '120 ft.',
        save: false,
        saveTarget: 'str',
        damage: false,
        damageDice: []
      })
    },
    removeAction(i) {
      this.player.actions.splice(i, 1)
    },
    removeSpell(i) {
      this.player.spells.splice(i, 1)
    },
    newActionDamage(action) {
      action.damageDice.push({ amount: 1, die: 4, bonusFlat: 0, bonusStat: null, type: 'bludgeoning' })
    },
    removeActionDamage(action) {
      action.damageDice.pop()
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
    },
    log() {
      // create array of spellbook spells without any casting time
      const spellBook = this.spellBook.find(spell => !spell.castingTime.short)
      console.log('spellBook', spellBook);
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
    },
    spellsComputed() {
      return this.player.spells.map(spell => {
        const modifier = this.calculateSpellAttack()
        return Object.assign({}, spell, { modifier })
      })
    },
    spellBookComputed() {
      return this.spellBook.map(spell => {
        const modifier = this.calculateSpellAttack()
        return Object.assign({}, spell, { modifier })
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

    fetch("/spells.json")
    .then(response => response.json())
    .then(spells => {
      this.spellBook = spells
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
