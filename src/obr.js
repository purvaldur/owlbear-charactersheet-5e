import OBR from "@owlbear-rodeo/sdk"
import { toRaw } from 'vue'

const metadataPrefix = 'com.purvaldur.actions'
const template = {
  name: '',
  currentHP: 1,
  maxHP: 37,
  tempHP: 8,
  armorClass: 16,
  advantage: false,
  disadvantage: false,
  editing: false,
  actions: [
    {
      name: 'Unarmed Strike',
      bonus: 4,
      save: 15,
      damage: [
        {
          dice: '1d4',
          bonus: 2,
          type: 'bludgeoning'
        },
        {
          dice: '1d4',
          bonus: 2,
          type: 'bludgeoning'
        },
      ]
    },
    {
      name: 'Unarmed Strike',
      bonus: 4,
      save: 15,
      damage: [
        {
          dice: '1d4',
          bonus: 2,
          type: 'bludgeoning'
        },
        {
          dice: '1d4',
          bonus: 2,
          type: 'bludgeoning'
        },
      ]
    }
  ]
}

export default {
  data() {
    return {
      player: {},
      msg: 'Hello OBR!'
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
        this.setMetadata(true)
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