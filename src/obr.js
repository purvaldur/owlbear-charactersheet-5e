import OBR from "@owlbear-rodeo/sdk"
import { toRaw } from 'vue'

const metadataPrefix = 'com.purvaldur.actions'
const template = {
  count: 0,
  hitPoints: 37,
  tempHitPoints: 8,
  armorClass: 16,
  advantage: false,
  disadvantage: false,
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
      this.player.count++
      OBR.notification.show(`count is ${this.player.count}`)
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
    getMetadata() {
      OBR.room.getMetadata().then(metadata => {
        console.log(metadata)
      })
    },
    setMetadata(fromTemplate) {
      if (fromTemplate) {
        // Clone the template object so we don't mutate it
        this.player = Object.assign({}, template);
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
        console.log('metadata set')
      })
    }
  },

  mounted() {
    OBR.room.getMetadata().then(metadata => {
      // uncomment to reset metadata
      // OBR.room.setMetadata({
      //   [`${metadataPrefix}`]: {
      //     [OBR.player.id]: undefined
      //   }
      // })
      if (!metadata[`${metadataPrefix}`] || !metadata[`${metadataPrefix}`][OBR.player.id]) {
        this.setMetadata(true)
      } else {
        this.player = metadata[`${metadataPrefix}`][OBR.player.id].player
      }
      console.log(metadata)
    })
    OBR.player.getName().then(name => {
      this.msg = `Hello ${name}!`
    })
  }
}