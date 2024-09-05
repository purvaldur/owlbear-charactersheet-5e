import { computed } from 'vue'
import { useCharacterStore } from '@/stores/character'
import { rollDice, rollCheck } from '@/utils/diceRoller'
import OBR from '@owlbear-rodeo/sdk'

export default {
  name: 'Spells',
  setup() {
    const characterStore = useCharacterStore()

    const spells = computed(() => characterStore.spells)
    const editing = computed(() => characterStore.editing)
    const spellcastingAbility = computed(() => characterStore.spellcastingAbility)

    const spellSchools = [
      'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
      'Evocation', 'Illusion', 'Necromancy', 'Transmutation'
    ]

    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha']

    const getSpellLevelName = (level) => {
      return level === '0' ? 'Cantrips' : `Level ${level}`
    }

    const updateSpell = (level, index, spell) => {
      characterStore.updateSpell(level, index, spell)
    }

    const addSpell = (level) => {
      characterStore.addSpell(level, {
        name: 'New Spell',
        school: 'Evocation',
        castingTime: '1 action',
        range: '30 feet',
        concentration: false,
        attackRoll: false,
        savingThrow: '',
        damage: '',
        description: ''
      })
    }

    const removeSpell = (level, index) => {
      characterStore.removeSpell(level, index)
    }

    const updateSpellcastingAbility = () => {
      characterStore.updateSpellcastingAbility(spellcastingAbility.value)
    }

    const getSpellAttackBonus = () => {
      const abilityModifier = characterStore.getModifier(spellcastingAbility.value)
      return abilityModifier + characterStore.proficiency
    }

    const getSpellSaveDC = () => {
      const abilityModifier = characterStore.getModifier(spellcastingAbility.value)
      return 8 + abilityModifier + characterStore.proficiency
    }

    const castSpell = (spell) => {
      let castingResult = `Casting ${spell.name}:\n`

      if (spell.attackRoll) {
        const attackRoll = rollCheck(getSpellAttackBonus())
        castingResult += `Spell Attack Roll: ${attackRoll.output}\n`
      }

      if (spell.damage) {
        const damageRoll = rollDice(spell.damage)
        castingResult += `Damage Roll: ${damageRoll.output}\n`
      }

      if (spell.savingThrow) {
        castingResult += `${spell.savingThrow.toUpperCase()} Save DC: ${getSpellSaveDC()}\n`
      }

      castingResult += `Effect: ${spell.description}`

      OBR.notification.show(castingResult)
    }

    return {
      spells,
      editing,
      spellcastingAbility,
      spellSchools,
      abilities,
      getSpellLevelName,
      updateSpell,
      addSpell,
      removeSpell,
      updateSpellcastingAbility,
      getSpellAttackBonus,
      getSpellSaveDC,
      castSpell
    }
  }
}