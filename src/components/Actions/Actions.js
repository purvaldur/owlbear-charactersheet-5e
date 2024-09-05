import { computed } from 'vue'
import { useCharacterStore } from '@/stores/character'
import { useDiceLogStore } from '@/stores/diceLog'
import { rollAction } from '@/utils/diceRoller'
import OBR from '@owlbear-rodeo/sdk'

export default {
  name: 'Actions',
  setup() {
    const characterStore = useCharacterStore()
    const diceLogStore = useDiceLogStore()

    const actions = computed(() => {
      return characterStore.actions.map(action => {
        const modifier = action.toHit.enabled
          ? characterStore.getModifier(action.toHit.baseStat)
            + (action.toHit.proficient ? characterStore.proficiency : 0)
            + action.toHit.flatBonus
          : null;

        const processedDice = action.dice.map(die => {
          const baseStatModifier = die.baseStat ? characterStore.getModifier(die.baseStat) : 0;
          const totalBonus = baseStatModifier + die.flatBonus;
          const notation = `${die.count}d${die.sides}${totalBonus >= 0 ? '+' : ''}${totalBonus}`;

          return {
            ...die,
            notation
          };
        });

        let saveDC = null;
        if (action.save.enabled) {
          if (action.save.override || action.save.override === 0) {
            saveDC = action.save.override;
          } else {
            const baseStatModifier = characterStore.getModifier(action.save.baseStat);
            saveDC = 8 + baseStatModifier + characterStore.proficiency;
          }
        }

        return {
          ...action,
          toHit: {
            ...action.toHit,
            modifier
          },
          dice: processedDice,
          save: {
            ...action.save,
            dc: saveDC
          }
        };
      });
    });

    const editing = computed(() => characterStore.editing)
    const stats = computed(() => characterStore.stats)

    const damageTypes = [
      '',
      'bludgeoning',
      'piercing',
      'slashing',
      'healing',
      'fire',
      'cold',
      'lightning',
      'thunder',
      'acid',
      'poison',
      'radiant',
      'necrotic',
      'force',
      'psychic'
    ]

    const formatNumber = (modifier) => {
      return modifier >= 0 ? `+${modifier}` : `${modifier}`
    }

    const updateAction = (index, action) => {
      characterStore.updateAction(index, action)
    }

    const editAction = (index, action) => {
      action.editing = !action.editing
      updateAction(index, action)
    }

    const addAction = () => {
      characterStore.addAction({
        editing: true,
        name: '',
        toHit: {
          enabled: false,
          baseStat: 'str',
          proficient: false,
          flatBonus: 0
        },
        save: {
          enabled: false,
          baseStat: 'str',
          override: null,
          target: 'str',
        },
        diceEnabled: false,
        dice: [],
        description: ''
      })
    }

    const addDice = (index, action) => {
      action.dice.push({
        count: 1,
        sides: 4,
        baseStat: null,
        flatBonus: 0,
        type: ''
      })
      updateAction(index, action)
    }

    const removeDice = (diceIndex, index, action) => {
      action.dice.splice(diceIndex, 1)
      updateAction(index, action)
    }

    const removeAction = (index) => {
      characterStore.removeAction(index)
    }

    const performAction = (action) => {
      const result = rollAction(action)
      diceLogStore.addRoll(result)
    }

    return {
      actions,
      editing,
      stats,
      damageTypes,
      formatNumber,
      addAction,
      removeAction,
      updateAction,
      editAction,
      addDice,
      removeDice,
      performAction
    }
  }
}