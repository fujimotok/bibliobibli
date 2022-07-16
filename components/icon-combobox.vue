<template>
  <div>
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          depressed
          icon
          v-on="on"
        >
          <v-icon>{{ items.find(v => v.value == value).icon }}</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="updateValue(index)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" />
          </v-list-item-icon>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    items: Array,
    value: Number
  },
  methods: {
    updateValue (newValue: number) {
      this.$emit('input', newValue)
    }
  }
})
</script>
