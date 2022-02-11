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
          <v-icon>{{ value.icon }}</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="updateValue(item)"
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

<script>
export default {
  props: {
    items: Array,
    value: Object
  },
  methods: {
    updateValue (newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
