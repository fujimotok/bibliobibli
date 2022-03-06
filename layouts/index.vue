<template>
  <default-layout ref="base">
    {{ count }} hit
    <v-btn color="white" icon @click="search()">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn color="white" icon @click="add()">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </default-layout>
</template>

<script>
import defaultLayout from '~/layouts/default.vue'

export default {
  name: 'IndexLayout',
  components: { defaultLayout },
  data () {
    return {
    }
  },
  computed: {
    count () {
      return this.$store.state.searchCount
    }
  },
  methods: {
    add () {
      this.$refs.base.$refs.page.$children[0].add()
    },
    search () {
      this.$refs.base.$refs.page.$children[0].showSearchDialog()
    }
  }
}
</script>
