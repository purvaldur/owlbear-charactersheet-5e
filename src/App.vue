<script src="./obr.js"></script>

<template>
  <div id="main">
    <h1>{{ msg }}</h1>
    <div class="action" v-for="action in actions.defined">
      <div>
        <button class="name" type="button" @click="increment">{{ action.name }}</button>
        <div class="advantage">
          <button type="button" :class="{ active: advantage}" @click="advantage">ADV</button>
          <button type="button" :class="{ active: disadvantage}" @click="disadvantage">DISADV</button>
        </div>
      </div>
      <div>
        <p class="tohit">To hit: {{ (action.bonus<0?"":"+") + action.bonus }}</p>
        <p class="damage">
          Damage: 
          <span v-for="(damage, i) in action.damage">
            {{ damage.dice }}{{ (damage.bonus<0?"":"+") + damage.bonus }} {{ damage.type }} {{ i<action.damage.length-1 ? "+ " : ""}}
          </span>
        </p>
        <p class="save">Save: {{ action.save ? "DC"+action.save : "none" }}</p>
      </div>
    </div>
  </div>
</template>