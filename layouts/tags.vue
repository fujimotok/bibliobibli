<template>
  <default-layout ref="base">
    <v-btn color="white" icon @click="add()">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </default-layout>
</template>

<script>
import defaultLayout from '~/layouts/default.vue'

export default {
  name: 'TagsLayout',
  components: { defaultLayout },
  data () {
    return {
    }
  },
  methods: {
    add () {
      this.$refs.base.$refs.page.$children[0].add()
    }
  }
}
</script>
