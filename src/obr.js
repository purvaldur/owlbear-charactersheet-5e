import OBR from "@owlbear-rodeo/sdk"

export default {
  data() {
    return {
      actions: {
        count: 0,
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
      this.actions = JSON.parse(localStorage.getItem('actions'))
    }
    OBR.player.getName().then(name => {
      OBR.notification.show(`Hello ${name}!`)
      this.msg = `Hello ${name}!`
    })
  }
}