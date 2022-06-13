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

<script>
export default {
  props: {
    value: Number
  },
  data () {
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
      { id: 0, link: '/scraps/0' },
      { id: 1, link: '/scraps/1' },
      { id: 2, link: '/scraps/2' },
      { id: 3, link: '/scraps/3' },
      { id: 4, link: '/scraps/4' },
      { id: 5, link: '/scraps/5' },
      { id: 6, link: '/scraps/6' },
      { id: 7, link: '/scraps/7' },
      { id: 8, link: '/scraps/8' },
      { id: 9, link: '/scraps/9' }
    ]
  },
  methods: {
    show (link) {
      this.$router.push({ path: link })
    }
  }
}
</script>
