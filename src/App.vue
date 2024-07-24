<template>
  <div id="app">
    <h1>Owlbear Rodeo Character Sheet</h1>
    <DiceRoller />
    <!-- Other components will go here -->
  </div>
</template>

<script>
import DiceRoller from '@/components/DiceRoller.vue'

export default {
  name: 'App',
  components: {
    DiceRoller
  }
}
</script>