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
      { id: 0, link: '/books/0' },
      { id: 1, link: '/books/1' },
      { id: 2, link: '/books/2' },
      { id: 3, link: '/books/3' },
      { id: 4, link: '/books/4' },
      { id: 5, link: '/books/5' },
      { id: 6, link: '/books/6' },
      { id: 7, link: '/books/7' },
      { id: 8, link: '/books/8' },
      { id: 9, link: '/books/9' },
      { id: 10, link: '/books/10' },
      { id: 11, link: '/books/11' },
      { id: 12, link: '/books/12' },
      { id: 13, link: '/books/13' },
      { id: 14, link: '/books/14' },
      { id: 15, link: '/books/15' },
      { id: 16, link: '/books/16' },
      { id: 17, link: '/books/17' },
      { id: 18, link: '/books/18' }
    ]
  },
  methods: {
    show (link) {
      this.$router.push({ path: link })
    }
  }
}
</script>
