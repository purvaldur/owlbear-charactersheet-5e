<template>
  <div class="features-traits">
    <h2>Features & Traits</h2>
    <span v-if="editing" class="add" @click="addFeature()" title="Create a new action">+</span>
    <div v-for="(feature, index) in featuresTraits" :key="index" class="feature-item">
      <div v-if="!editing || !feature.editing" class="feature-header" :title="feature.description">
        <span class="feature-name" >{{ feature.name ? feature.name : 'Feature #' + (index+1) }}</span>
        <div v-if="feature.limited" class="feature-uses">
          <input
            v-for="(pip, index) in feature.uses"
            type="checkbox"
            v-model="feature.uses[index]"
          />
        </div>
      </div>
      <img v-if="editing && !feature.editing" class="feature-edit-button" src="../../assets/gear.svg" @click="editFeature(index, feature)" />
      <div v-if="editing && feature.editing" class="feature-edit">
        <input type="text" v-model="feature.name" placeholder="Name" @change="updateFeature(index)" />
        <textarea v-model="feature.description" placeholder="Description" @change="updateFeature(index)"></textarea>
        <div class="feature-uses-edit" title="Toggle whether this feature or trait has a limited amount of uses per day/long rest/short rest/etc...">
          <label>
            <span>Limited uses</span>
            <input type="checkbox" v-model="feature.limited" @change="updateFeature(index)" />
          </label>
          <input v-if="feature.limited" type="number" v-model.number="feature.usesMax" @change="updateFeature(index)" title="Maximum number of uses"/>
        </div>
        <button @click="editFeature(index, feature)" class="save-feature">Save </button>
        <button @click="removeFeature(index)" class="remove-feature">Delete </button>
      </div>
    </div>
    <!-- <button v-if="editing" @click="addFeature" class="add-feature">Add Feature/Trait</button> -->
  </div>
</template>

<script src="./Features.js"></script>
<style src="./Features.css" scoped></style>