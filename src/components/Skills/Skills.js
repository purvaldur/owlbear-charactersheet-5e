import { computed } from 'vue'
import OBR from '@owlbear-rodeo/sdk';
import { useCharacterStore } from '@/stores/character'
import { rollCheck } from '@/utils/diceRoller'

export default {
  name: 'Skills',
  setup() {
    const characterStore = useCharacterStore()

    const skills = computed(() => characterStore.skills)
    const editing = computed(() => characterStore.editing)

    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha']

    const getSkillModifier = (skill) => {
      const abilityModifier = characterStore.getModifier(skill.ability)
      const proficiencyBonus = skill.proficient ? characterStore.proficiency : 0
      return abilityModifier + proficiencyBonus
    }

    const getSkillModifierString = (skill) => {
      const modifier = getSkillModifier(skill)
      return modifier >= 0 ? `+${modifier}` : `${modifier}`
    }

    const updateSkill = (index, skill) => {
      characterStore.updateSkill(index, skill)
    }

    const rollSkillCheck = (skill) => {
      const modifier = getSkillModifier(skill)
      const rollResult = rollCheck(modifier)
      OBR.notification.show(rollResult.output);
    }

    return {
      skills,
      editing,
      abilities,
      getSkillModifierString,
      updateSkill,
      rollSkillCheck
    }
  }
}