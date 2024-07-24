<template>
  <div id="app">
    <nav>
      <router-link to="/">Character Sheet</router-link> |
      <router-link to="/spellbook">Spellbook</router-link> |
      <router-link to="/settings">Settings</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<link rel="stylesheet" href="style.css">