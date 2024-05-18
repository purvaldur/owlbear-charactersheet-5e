<script>
import { store } from './store.js'
export default {
  data() {
    return {
      player: store.player,
      characters: store.characters,
      meta: store.meta
    }
  },
  methods: {
    remove(i) {
      this.player.storage.equipment.splice(i, 1)
      this.meta.set()
    },
    add() {
      this.player.storage.equipment.push({
        amount: 1,
        name: 'Item',
        weight: 0,
        value: 0
      })
      this.meta.set()
    }
  }
}
</script>

<template>
  <div class="wallet">
    <div class="coinType" v-for="(coinAmount, coinType) in player.storage.money">
      <input type="text" v-model="player.storage.money[coinType]" @change="meta.set(false)"/>
      <span>{{ coinType }}</span>
    </div>
  </div>
  <div class="meta" :class="{ 'editing': player.editing }">
    <p class="amount">#</p>
    <p class="name">Item name</p>
    <p class="weight">Weight</p>
    <p class="value">Value</p>
  </div>
  <div class="item" v-for="(item, i) in player.storage.equipment">
    <input class="amount" title="Item amount" type="text" v-model="item.amount" @change="meta.set(false)"/>
    <input class="name" title="Item name" type="text" v-model="item.name" @change="meta.set(false)"/>
    <input class="weight" title="Item weight" type="text" v-model="item.weight" @change="meta.set(false)"/>
    <input class="value" title="item value" type="text" v-model="item.value" @change="meta.set(false)"/>
    <button v-if="player.editing" @click="remove(i)" class="delete">X</button>
  </div>
  <button v-if="player.editing" @click="add()" class="add">ADD ITEM</button>
</template>

<style>
#storage {
    font-family: 'Fira Code', monospace;
}
#storage .wallet {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  margin-bottom: 0px;
  padding-bottom: 8px;
}
#storage .wallet .coinType {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#storage .wallet .coinType input {
  width: 60px;
  margin-bottom: 4px;
}
#storage .wallet .coinType span {
  text-transform: uppercase;
  font-weight: bold;
}
#storage .meta {
  display: flex;
  align-items: center;
  margin: 8px 0px;
}
#storage .meta.editing {
  padding-right: 48px;
}
#storage .meta p {
  margin: 0px 3px;
}
#storage .meta p:first-child {
  margin-left: 0px;
}
#storage .meta p:last-child {
  margin-right: 0px;
}
#storage .meta .amount {
  width: 60px;
  text-align: center;
}
#storage .meta .name {
  width: 100%;
  padding-left: 8px;
}
#storage .meta .weight {
  width: 90px;
  text-align: center;
}
#storage .meta .value {
  width: 100px;
  text-align: center;
}
#storage .item {
  display: flex;
  align-items: center;
}
#storage .item input {
  border-radius: 8px;
  margin: 0px 3px;
  border: 1px solid #fff;
}
#storage .item input:first-child {
  margin-left: 0px;
}
#storage .item input:last-child {
  margin-right: 0px;
}
#storage .item .name {
  width: 100%;
  text-align: start;
  padding-left: 8px;
}
#storage .item .weight {
  width: 60px;
  text-align: start;
  padding-left: 8px;
}
#storage .item .value {
  width: 60px;
  text-align: start;
  padding-left: 8px;
}
#storage .item .delete {
  max-width: 40px;
  max-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e65c5c;
  font-size: 2em;
  padding: 9px;
  margin-left: 3px;
}
#storage .add {
  background-color: #A6E3A1;
  display: flex;
  justify-content: center;
  font-weight: bold;
}
</style>