<template>
  <v-list-item-group
    v-model="internalValue"
  >
    <template v-for="(item, index) in items">
      <v-list-item :key="index" @click="show(item.link)">
        <v-list-item-content>
          <v-list-item-title v-text="item.id" />
        </v-list-item-content>
      </v-list-item>
      <v-divider :key="`${index}-divider`" />
    </template>
  </v-list-item-group>
</template>

<script lang="ts">
import Vue from 'vue'

export type DataType = {
  items: object[]
}

export default Vue.extend({
  props: {
    value: { type: Number, default: 0 }
  },
  data (): DataType {
    return {
      items: []
    }
  },
  computed: {
    internalValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  mounted () {
    this.items = [
      { id: 0, link: '/books/0' },
      { id: 1, link: '/books/1' },
      { id: 2, link: '/books/2' },
      { id: 3, link: '/books/3' },
      { id: 4, link: '/books/4' }
    ]
  },
  methods: {
    show (link: string) {
      this.$router.push({ path: link })
    }
  }
})
</script>
