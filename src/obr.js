// import npm packages
import OBR from "@owlbear-rodeo/sdk"
import { nextTick, toRaw } from 'vue'

// import vue components
import { codex, template, socket } from "./components/codex.js"
import Storage from "./components/storage.vue"
import Sheets from "./components/sheets.vue"
import Raw from "./components/raw.vue"

// import OBR functions
// import { setupContextMenu } from "./contextMenu.js"

export default {
  data() {
    return {
      codex,

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
      isGM: false,
      sidebar: {
        display: false,
        log: [],
      }
    }
  },

  methods: {
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
      codex.player.editing = !codex.player.editing
      if (!codex.player.editing) {
        codex.player.skills.forEach(skill => skill.editing = false)
        codex.player.actions.forEach(action => action.editing = false)
        Object.keys(codex.player.spells).forEach(level => codex.player.spells[level].forEach(spell => spell.editing = false))
        codex.player.traits.forEach(trait => trait.editing = false)
        codex.characters.list.forEach(character => character.sectionEditing = false)
        codex.player.spellBookOpen = false
        codex.meta.set(false)
      }
    },
    toggleSkillEdit(i) {
      codex.player.skills[i].editing = !codex.player.skills[i].editing
    },
    toggleActionEdit(i) {
      codex.player.actions[i].editing = !codex.player.actions[i].editing
    },
    toggleSpellEdit(i, j) {
      codex.player.spells[i][j].editing = !codex.player.spells[i][j].editing
    },
    toggleSpellbookOpen() {
      codex.player.spellBookOpen = !codex.player.spellBookOpen
    },
    toggleTraitEdit(i) {
      codex.player.traits[i].editing = !codex.player.traits[i].editing
    },
    setAdvantage(advantage, i) {
      if (advantage) {
        codex.player.advantage = !codex.player.advantage
        codex.player.disadvantage = false
      } else {
        codex.player.disadvantage = !codex.player.disadvantage
        codex.player.advantage = false
      }
    },
    setTab(tab) {
      codex.player.tabs[tab] = true
      for (const key in codex.player.tabs) {
        if (key !== tab) {
          codex.player.tabs[key] = false
        }
      }
    },
    calculateModifier(stat) {
      return Math.floor((stat - 10) / 2)
    },
    calculateSave(stat) {
      const modifier = this.calculateModifier(stat.value)
      const proficient = stat.saveProficient ? codex.player.proficiency : 0
      return Number(modifier) + Number(proficient)
    },
    calculateSkill(skill) {
      const modifier = this.calculateModifier(codex.player.stats.find(stat => stat.name === skill.base).value)
      const proficiency = skill.proficient ? codex.player.proficiency : 0
      const expertise = skill.expertise ? codex.player.proficiency : 0
      return Number(modifier) + Number(proficiency) + Number(expertise)
    },
    calculateSpellAttack() {
      const modifier = this.calculateModifier(codex.player.stats.find(s => s.name === codex.player.spellStat).value)
      const proficiency = codex.player.proficiency
      const bonus = codex.player.spellAttackBonus
      return Number(modifier) + Number(proficiency) + Number(bonus)
    },
    calculateSpellSave() {
      const modifier = this.calculateModifier(codex.player.stats.find(s => s.name === codex.player.spellStat).value)
      const proficiency = codex.player.proficiency
      const bonus = codex.player.spellDCBonus
      return 8 + Number(modifier) + Number(proficiency) + Number(bonus)
    },
    calculateActionBonus(action) {
      const bonusStat = action.bonusStat ? this.calculateModifier(codex.player.stats.find(stat => stat.name === action.bonusStat).value) : 0
      const bonusFlat = action.bonusFlat ? action.bonusFlat : 0
      const proficiency = action.proficiency ? codex.player.proficiency : 0
      return Number(bonusStat) + Number(bonusFlat) + Number(proficiency)
    },
    calculateActionSave(action) {
      const saveStat = codex.player.stats.find(stat => stat.name === action.saveStat)
      const proficiency = Number(codex.player.proficiency)
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
        let bonusStat = d.bonusStat ? this.calculateModifier(codex.player.stats.find(stat => stat.name === d.bonusStat).value) : 0
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
    rollGeneric(dice) {
      // expects dice to be "1d20", "2d6", "3d8", "4d10", "5d12", "6d4", etc
      // then emits a roll event with the result
      const [amount, die] = dice.split('d')
      const rolls = []
      let total = 0
      for (let i = 0; i < amount; i++) {
        const roll = Math.floor(Math.random() * die) + 1
        rolls.push(roll)
        total += roll
      }
      const tooltip = `${amount}d${die}(${rolls.join('+')}) = ${total}`
      const roll = {
        name: codex.player.name,
        type: 'generic',
        action: `${dice} = [ ${total} ]`,
        description: tooltip
      }
      socket.emit('roll', { room: OBR.room.id, roll })
    },
    rollD20(roll) {
      roll.d20 = true
      roll.advantage = codex.player.advantage
      roll.disadvantage = codex.player.disadvantage
      roll.roll1 = Math.floor(Math.random() * 20) + 1
      roll.roll2 = Math.floor(Math.random() * 20) + 1
      roll.upper = Math.max(roll.roll1, roll.roll2)
      roll.lower = Math.min(roll.roll1, roll.roll2)

      if (codex.player.advantage) {
        roll.crit = roll.upper === 20 ? true : false
        roll.total = roll.upper + roll.modifier
      } else if (codex.player.disadvantage) {
        roll.crit = roll.lower === 20 ? true : false
        roll.total = roll.lower + roll.modifier
      } else {
        // use roll2, because for some reason, roll1 never crits???
        roll.crit = roll.roll2 === 20 ? true : false
        roll.total = roll.roll2 + roll.modifier
      }
      return roll
    },
    rollAbility(ability) {
      if (!codex.player.editing) {
        let roll = { name: codex.player.name, type: 'ability', action: ability.fullName }
        roll.modifier = this.calculateModifier(ability.value)
        roll = this.rollD20(roll)
        socket.emit('roll', { room: OBR.room.id, roll })
      }
    },
    rollSkill(skill) {
      let roll = { name: codex.player.name, type: 'skill', action: skill.name }
      roll.modifier = this.calculateSkill(skill)
      roll = this.rollD20(roll)
      socket.emit('roll', { room: OBR.room.id, roll })
    },
    rollSave(save) {
      // save = 'str', 'dex', 'con', 'int', 'wis', 'cha'
      const saveStat = codex.player.stats.find(stat => stat.name === save)
      let roll = { name: codex.player.name, type: 'save', action: `${saveStat.fullName} Saving Throw` }
      roll.modifier = this.calculateSave(saveStat)
      roll = this.rollD20(roll)
      socket.emit('roll', { room: OBR.room.id, roll })
    },
    rollAction(action) {
      let roll = { name: codex.player.name, type: 'action', action: action.name, description: action.description }
      if (action.rollToHit) {
        roll.modifier = this.calculateActionBonus(action)
        roll = this.rollD20(roll)
      }
      if (action.damage) {
        roll.damage = true
        roll.damageDice = this.calculateActionDamage(action)
        if (roll.crit) {
          roll.damageDice.push(this.calculateActionDamage(action))
        }
      }
      if (action.save) {
        roll.save = true
        roll.saveTarget = action.saveTarget
        roll.saveDC = this.calculateActionSave(action)
      }
      socket.emit('roll', { room: OBR.room.id, roll })
    },
    rollSpell(spell) {
      let roll = { name: codex.player.name, type: 'spell', action: spell.name, description: spell.description}
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
      socket.emit('roll', { room: OBR.room.id, roll })
    },
    rollTrait(trait) {
      let roll = { name: codex.player.name, type: 'trait', action: trait.name }
      roll.description = trait.description
      socket.emit('roll', { room: OBR.room.id, roll })
    },
    newAction() {
      codex.player.actions.push({
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
      codex.player.spells[level].push({
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
        codex.player.spells[spell.level].push(Object.assign({}, spell))
      })
      this.spellBookSelected = []
      this.toggleSpellbookOpen()
      codex.meta.set(false)
    },
    newTrait() {
      codex.player.traits.push({
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
      codex.player.actions.splice(i, 1)
    },
    removeSpell(i, j) {
      codex.player.spells[i].splice(j, 1)
    },
    removeTrait(i) {
      codex.player.traits.splice(i, 1)
    },
    newDamage(object) {
      object.damageDice.push({ amount: 1, die: 4, bonusFlat: 0, bonusStat: null, type: 'Bludgeoning' })
    },
    removeDamage(object) {
      object.damageDice.pop()
    },
    log() {
      // create array of spellbook spells without any casting time
      const spellBook = this.spellBook.find(spell => !spell.castingTime.short)
    }
  },

  computed: {
    console: () => console,
    savesComputed() {
      return codex.player.stats.map(stat => {
        const saveModifier = this.calculateSave(stat)
        return Object.assign({}, stat, { saveModifier })
      })
    },
    skillsComputed() {
      return codex.player.skills.map(skill => {
        const modifier = this.calculateSkill(skill)
        return Object.assign({}, skill, { modifier })
      })
    },
    passivePerception() {
      return 10 + this.calculateSkill(codex.player.skills.find(skill => skill.name === 'Perception'))
    },
    actionsComputed() {
      return codex.player.actions.map(action => {
        const modifier = this.calculateActionBonus(action)
        return Object.assign({}, action, { modifier })
      })
    },
    spellsComputed() {
      return Object.keys(codex.player.spells).map(level => {
        return codex.player.spells[level].map(spell => {
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
          return spell
        }
      })
    },
  },

  components: {
    // Skills,
    // Actions,
    // Spells,
    // Traits,
    Storage,
    Sheets,
    Raw
  },

  beforeMount() {
    // console.log('TEST');
    OBR.player.getRole().then(role => {
      OBR.player.getName().then(name => {
        codex.meta.obr.user_id = OBR.player.id
        codex.meta.obr.room_id = OBR.room.id
        codex.meta.obr.user_name = name
        codex.meta.obr.isGM = role === 'GM' ? true : false
      })
    })
    socket.emit('identify', {
      id: OBR.player.id,
      room: OBR.room.id
    })

    fetch("/spells/srd.json").then(response => response.json()).then(spells => {
      this.spellBook = this.spellBook.concat(spells)
    })
    // fetch("/spells/phb.json").then(response => response.json()).then(spells => {
    //   this.spellBook = this.spellBook.concat(spells)
    // })
    // fetch("/spells/xge.json").then(response => response.json()).then(spells => {
    //   this.spellBook = this.spellBook.concat(spells)
    // })
    // fetch("/spells/tcoe.json").then(response => response.json()).then(spells => {
    //   this.spellBook = this.spellBook.concat(spells)
    // })

    // setupContextMenu()

    // if no cloud database character, query local storage
    // if no local storage character, create from template first
    // finally emit event to create character in cloud database
    // if cloud database character exists, use it
    socket.on('characters', (characters) => {
      if (characters === null) {
        const characters = JSON.parse(localStorage.getItem('characters'))
        if (characters === null || characters.length === 0) {
          codex.player = Object.assign({}, template)
          codex.characters.list = [codex.player]
          codex.characters.active = 0
          codex.meta.set()
        } else {
          codex.characters = characters
          codex.player = characters.list[characters.active]
        }
        socket.emit('create', {
          id: codex.meta.obr.user_id,
          characters: JSON.stringify(codex.characters),
          name: codex.meta.obr.name
        })
      } else {
        characters = JSON.parse(characters)
        codex.characters = characters
        codex.player = characters.list[characters.active]
      }
    })

    socket.on('roll', (roll) => {
      this.sidebar.log.push(roll)
      if (!this.sidebar.display) {
        this.toggleSidebar()
      }
      nextTick(() => {
        const el = toRaw(this.$refs).logEntry.pop()
        el.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'})
      })
    })
  }
}