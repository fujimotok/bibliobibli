<template>
  <default-layout ref="base">
    <v-btn color="white" icon @click="click()">
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
  methods: {
    click () {
      this.$refs.base.$refs.page.$children[0].add()
    }
  }
}
</script>
