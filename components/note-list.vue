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
      { id: 0, link: '/notes/0' },
      { id: 1, link: '/notes/1' },
      { id: 2, link: '/notes/2' },
      { id: 3, link: '/notes/hoge' },
      { id: 4, link: '/notes/hoge/fuga' },
      { id: 5, link: '/notes/hoge/piyo' },
      { id: 6, link: '/notes/fuga' },
      { id: 7, link: '/notes/piyo' }
    ]
  },
  methods: {
    show (link) {
      this.$router.push({ path: link })
    }
  }
}
</script>
