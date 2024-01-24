<script src="./obr.js"></script>

<template>
  <div id="main">
    <h1>{{ msg }}</h1>
  
    <div class="card">
      <button type="button" @click="increment">count is {{ actions.count }}</button>
    </div>
  </div>
</template>