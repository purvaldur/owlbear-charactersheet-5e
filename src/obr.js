import OBR from '@owlbear-rodeo/sdk'

export default {
  data() {
    return {
      count: 0,
      msg: 'Hello OBR!'
    }
  },

  methods: {
    increment() {
      this.count++
      OBR.notification.show(`count is ${this.count}`)
    }
  },

  mounted() {
    OBR.notification.show('Hello OBR!')
  }
}