import { computed } from 'vue'
import { useCharacterStore } from '@/stores/character'
import OBR from '@owlbear-rodeo/sdk'

export default {
  name: 'FeaturesTraits',
  setup() {
    const characterStore = useCharacterStore()

    const featuresTraits = computed(() => {
      return characterStore.featuresTraits.map((feature, index) => {
        if (feature.limited && feature.usesMax) {
          for (let i = 0; i < feature.usesMax; i++) {
            feature.uses[i] = feature.uses[i] ? feature.uses[i] : false
          }
          feature.uses.length = feature.usesMax
        }
        return {
          ...feature,
        }
      })
    })
    const editing = computed(() => characterStore.editing)

    const updateFeature = (index) => {
      characterStore.updateFeatureTrait(index, featuresTraits.value[index])
    }

    const editFeature = (index, feature) => {
      feature.editing = !feature.editing
      characterStore.updateFeatureTrait(index, feature)
    }

    const addFeature = () => {
      characterStore.addFeatureTrait({
        editing: true,
        name: '',
        description: '',
        limited: false,
        uses: [],
        usesMax: null,
      })
    }

    const removeFeature = (index) => {
      characterStore.removeFeatureTrait(index)
    }

    const useFeature = (index) => {
      const feature = featuresTraits.value[index]
      if (feature.uses > 0) {
        feature.uses--
        characterStore.updateFeatureTrait(index, feature)
        OBR.notification.show(`Used ${feature.name}. ${feature.uses} uses remaining.`)
      }
    }

    const resetFeatureUses = (index) => {
      const feature = featuresTraits.value[index]
      feature.uses = feature.usesMax
      characterStore.updateFeatureTrait(index, feature)
      OBR.notification.show(`Reset uses for ${feature.name}.`)
    }

    return {
      featuresTraits,
      editing,
      updateFeature,
      editFeature,
      addFeature,
      removeFeature,
      useFeature,
      resetFeatureUses
    }
  }
}