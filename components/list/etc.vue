<template>
  <v-list-item-group
    v-model="internalValue"
  >
    <template v-for="(item, index) in items">
      <v-list-item :key="index" @click="show(item.link)">
        <v-list-item-icon>
          <v-icon v-text="item.icon" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.name" />
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>
            mdi-chevron-right
          </v-icon>
        </v-list-item-action>
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
  name: 'ListEtc',
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
      { id: 0, link: '/etc/about', name: 'about', icon: 'mdi-information' },
      { id: 1, link: '/etc/tags', name: 'tags', icon: 'mdi-tag' },
      { id: 2, link: '/etc/settings', name: 'settings', icon: 'mdi-cog' }
    ]
  },
  methods: {
    show (link: string) {
      this.$router.push({ path: link })
    }
  }
})
</script>
