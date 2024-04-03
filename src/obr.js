import OBR from "@owlbear-rodeo/sdk"
import { nextTick, toRaw } from 'vue'
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

const socket = io("https://owlbear.vald.io/", {})

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
          short: 0
        },
        {
          name: '1st Level',
          short: 1
        },
        {
          name: '2nd Level',
          short: 2
        },
        {
          name: '3rd Level',
          short: 3
        },
        {
          name: '4th Level',
          short: 4
        },
        {
          name: '5th Level',
          short: 5
        },
        {
          name: '6th Level',
          short: 6
        },
        {
          name: '7th Level',
          short: 7
        },
        {
          name: '8th Level',
          short: 8
        },
        {
          name: '9th Level',
          short: 9
        }
      ],
      damageTypes: [
        'Acid',
        'Bludgeoning',
        'Cold',
        'Fire',
        'Force',
        'Healing',
        'Lightning',
        'Necrotic',
        'Piercing',
        'Poison',
        'Psychic',
        'Radiant',
        'Slashing',
        'Thunder'
      ],
      spellBook: [],
      spellBookSelected: [],
      spellBookSearch: '',
      characters: {
        active: 0,
        list: []
      },
      template: {
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
          notes: false
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
          1: [],
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
        traits: [],
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
        Object.keys(this.player.spells).forEach(level => this.player.spells[level].forEach(spell => spell.editing = false))
        this.player.traits.forEach(trait => trait.editing = false)
        this.characters.list.forEach(character => character.sectionEditing = false)
        this.player.spellBookOpen = false
        this.setMetadata(false)
      }
    },
    togglePlayerSectionEdit(i) {
      this.characters.list[i].sectionEditing = !this.characters.list[i].sectionEditing
    },
    toggleSkillEdit(i) {
      this.player.skills[i].editing = !this.player.skills[i].editing
    },
    toggleActionEdit(i) {
      this.player.actions[i].editing = !this.player.actions[i].editing
    },
    toggleSpellEdit(i, j) {
      this.player.spells[i][j].editing = !this.player.spells[i][j].editing
    },
    toggleSpellbookOpen() {
      this.player.spellBookOpen = !this.player.spellBookOpen
    },
    toggleTraitEdit(i) {
      this.player.traits[i].editing = !this.player.traits[i].editing
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
    calculateSave(stat) {
      const modifier = this.calculateModifier(stat.value)
      const proficient = stat.saveProficient ? this.player.proficiency : 0
      return Number(modifier) + Number(proficient)
    },
    calculateSkill(skill) {
      const modifier = this.calculateModifier(this.player.stats.find(stat => stat.name === skill.base).value)
      const proficiency = skill.proficient ? this.player.proficiency : 0
      const expertise = skill.expertise ? this.player.proficiency : 0
      return Number(modifier) + Number(proficiency) + Number(expertise)
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
      const proficiency = Number(this.player.proficiency)
      const saveDC = action.saveDC ? action.saveDC : 8 + this.calculateModifier(saveStat) + proficiency

      if (saveStat !== undefined && !action.saveDC) {
        return 8 + this.calculateModifier(saveStat.value) + proficiency
      } else if (action.saveDC) {
        return saveDC
      } else {
        return 8 + proficiency
      }
    },
    calculateActionDamage(action) {
      return action.damageDice.map(d => {
        let tooltip = `` // tooltip = "each dice(dice+dice+dice...) + bonus = total"
        let total = 0
        let dice = []
        let type = d.type ? d.type : ''
        let bonusFlat = d.bonusFlat ? d.bonusFlat : 0
        let bonusStat = d.bonusStat ? this.calculateModifier(this.player.stats.find(stat => stat.name === d.bonusStat).value) : 0
        for (let i = 0; i < d.amount; i++) {
          dice.push(Math.floor(Math.random() * d.die) + 1)
        }
        dice.forEach((roll, i) => {
          if (i === 0) {
            tooltip += `1d${d.die}(${roll})`
          } else {
            tooltip += ` + 1d${d.die}(${roll})`
          }
          total += roll
        })
        total = dice.reduce((a, b) => a + b) + Number(bonusStat) + Number(bonusFlat)
        tooltip += ` + ${bonusStat} + ${bonusFlat} = ${total} ${type}`
        return { dice, total, tooltip, type }
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
    rollSave(save) {
      // save = 'str', 'dex', 'con', 'int', 'wis', 'cha'
      const saveStat = this.player.stats.find(stat => stat.name === save)
      let roll = { name: this.player.name, type: 'save', action: `${saveStat.fullName} Saving Throw` }
      roll.modifier = this.calculateSave(saveStat)
      roll = this.rollD20(roll)
      socket.emit('roll', roll)
    },
    rollAction(action) {
      let roll = { name: this.player.name, type: 'action', action: action.name, description: action.description }
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
      let roll = { name: this.player.name, type: 'spell', action: spell.name, description: spell.description}
      if (spell.rollToHit) {
        roll.modifier = this.calculateSpellAttack()
        roll = this.rollD20(roll)
      }
      if (spell.damage) {
        roll.damage = true
        roll.damageDice = this.calculateActionDamage(spell)
        if (roll.crit) {
          this.calculateActionDamage(spell).forEach(damage => {
            roll.damageDice.push(damage)
          })
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
    rollTrait(trait) {
      let roll = { name: this.player.name, type: 'trait', action: trait.name }
      roll.description = trait.description
      socket.emit('roll', roll)
    },
    newCharacter() {
      this.characters.list[this.characters.active].editing = false
      this.player = Object.assign({}, this.template)
      this.player.editing = true
      console.log(this.player);
      this.characters.list.push(this.player)
      this.characters.active = this.characters.list.length - 1
      this.setMetadata(false)
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
    newSpell(level) {
      this.player.spells[level].push({
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
    addBookSpell(spell) {
      const index = this.spellBookSelected.indexOf(spell)
      if (index === -1) {
        this.spellBookSelected.push(spell)
      } else {
        this.spellBookSelected.splice(index, 1)
      }
    },
    addBookSpells() {
      this.spellBookSelected.forEach(spell => {
        this.player.spells[spell.level].push(Object.assign({}, spell))
      })
      this.spellBookSelected = []
      this.toggleSpellbookOpen()
      this.setMetadata(false)
    },
    newTrait() {
      this.player.traits.push({
        name: '',
        description: '',
        counter: {
          enabled: false,
          amount: []
        },
        editing: true
      })
    },
    removeAction(i) {
      this.player.actions.splice(i, 1)
    },
    removeSpell(i, j) {
      this.player.spells[i].splice(j, 1)
    },
    removeTrait(i) {
      this.player.traits.splice(i, 1)
    },
    newActionDamage(action) {
      action.damageDice.push({ amount: 1, die: 4, bonusFlat: 0, bonusStat: null, type: 'bludgeoning' })
    },
    removeActionDamage(action) {
      action.damageDice.pop()
    },
    newSpellDamage(spell) {
      spell.damageDice.push({ amount: 1, die: 4, bonusFlat: 0, bonusStat: null, type: 'acid' })
    },
    removeSpellDamage(spell) {
      spell.damageDice.pop()
    },
    removeCharacter(i) {
      if (this.characters.list.length === 1) {
        this.setMetadata(true)
        console.log(this.characters.list);
      } else {
        if (this.characters.active === i) {
          this.characters.active = this.characters.active - 1 < 0 ? 0 : this.characters.active - 1
          this.player = this.characters.list[this.characters.active]
        }
        this.characters.list.splice(i, 1)
        this.setMetadata(false)
      }
    },
    changeCharacter(i) {
      this.characters.list[i].editing = this.player.editing ? true : false
      this.characters.list[this.characters.active].editing = false
      this.characters.active = i
      this.player = this.characters.list[i]
      this.setMetadata(false)
    },
    getMetadata() {
      const player = JSON.parse(localStorage.getItem('characters')).list[this.characters.active]
      console.log('player', player);
    },
    setMetadata(fromScratch) {
      if (fromScratch) {
        this.player = Object.assign({}, this.template)
        this.characters.list = [this.player]
        this.characters.active = 0
        localStorage.setItem('characters', JSON.stringify(this.characters))
      } else {
        this.player.advantage = false
        this.player.disadvantage = false
        this.characters.list[this.characters.active] = this.player
        localStorage.setItem('characters', JSON.stringify(this.characters))
        this.getMetadata()
      }
    },
    log() {
      // create array of spellbook spells without any casting time
      const spellBook = this.spellBook.find(spell => !spell.castingTime.short)
      console.log('spellBook', spellBook);
    }
  },

  computed: {
    console: () => console,
    savesComputed() {
      return this.player.stats.map(stat => {
        const saveModifier = this.calculateSave(stat)
        return Object.assign({}, stat, { saveModifier })
      })
    },
    skillsComputed() {
      return this.player.skills.map(skill => {
        const modifier = this.calculateSkill(skill)
        return Object.assign({}, skill, { modifier })
      })
    },
    passivePerception() {
      return 10 + this.calculateSkill(this.player.skills.find(skill => skill.name === 'Perception'))
    },
    actionsComputed() {
      return this.player.actions.map(action => {
        const modifier = this.calculateActionBonus(action)
        return Object.assign({}, action, { modifier })
      })
    },
    spellsComputed() {
      return Object.keys(this.player.spells).map(level => {
        return this.player.spells[level].map(spell => {
          const modifier = this.calculateSpellAttack()
          const saveDC = this.calculateSpellSave()
          return Object.assign({}, spell, { modifier, saveDC })
        })
      })
    },
    spellBookComputed() {
      return this.spellBook.map(spell => {
        const modifier = this.calculateSpellAttack()
        const saveDC = this.calculateSpellSave()
        return Object.assign({}, spell, { modifier, saveDC })
      }).sort((a, b) => {
        if (a.level === b.level) {
          return a.name.localeCompare(b.name)
        } else {
          return a.level - b.level
        }
      })
    },
    searchSpellBookComputed() {
      return this.spellBookComputed.filter(spell => {
        if (spell.name.toLowerCase().includes(this.spellBookSearch.toLowerCase())) {
          // console.log(spell.name);
          return spell
        }
      })
    },
  },

  beforeMount() {
    // query localstorage for characters. If empty, add template character and make it active
    const characters = JSON.parse(localStorage.getItem('characters'))
    if (JSON.parse(localStorage.getItem('player')) !== null) {
      const oldPlayer = JSON.parse(localStorage.getItem('player'))
      this.player = { ...this.template, ...oldPlayer}
      localStorage.removeItem('player')
      this.characters.active = 0
      this.setMetadata(false)
    } else if (characters === null || characters.length === 0) {
      this.setMetadata(true)
    } else {
      this.characters = characters
      // this.player = characters.list[characters.active]

      // only for development
      this.player.spells = this.template.spells
      this.player = { ...this.template, ...characters.list[characters.active]}
    }

    fetch("/spells/phb.json").then(response => response.json()).then(spells => {
      this.spellBook = this.spellBook.concat(spells)
    })
    fetch("/spells/xge.json").then(response => response.json()).then(spells => {
      this.spellBook = this.spellBook.concat(spells)
    })
    fetch("/spells/tcoe.json").then(response => response.json()).then(spells => {
      this.spellBook = this.spellBook.concat(spells)
    })

    console.log(this.spellsComputed);

    socket.on('roll', (roll) => {
      console.log('roll', roll)
      this.sidebar.log.push(roll)
      if (!this.sidebar.display) {
        this.toggleSidebar()
      }
      nextTick(() => {
        const el = toRaw(this.$refs).logEntry.pop()
        el.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'})
      })
    })
  },

  mounted() {
  }
}