import OBR from "@owlbear-rodeo/sdk"

export default {
  data() {
    return {
      actions: {
        count: 0,
        profiency: 2,
        defined: [
          {
            name: 'Unarmed Strike',
            bonus: 4,
            advantage: false,
            disadvantage: false,
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
      },
      msg: 'Hello OBR!'
    }
  },

  methods: {
    increment() {
      this.actions.count++
      OBR.notification.show(`count is ${this.actions.count}`)
      localStorage.setItem('actions', JSON.stringify(this.actions))
    }
  },

  mounted() {
    if (localStorage.getItem('actions') === null) {
      localStorage.setItem('actions', JSON.stringify(this.actions))
    } else {
      // this.actions = JSON.parse(localStorage.getItem('actions'))
    }
    OBR.player.getName().then(name => {
      OBR.notification.show(`Hello ${name}!`)
      this.msg = `Hello ${name}!`
    })
    OBR.action.setWidth(500)
  }
}