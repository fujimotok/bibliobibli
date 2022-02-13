<template>
  <default-layout ref="base">
    <v-text-field
      v-model="word"
      dark
      hide-details
      outlined
      prepend-inner-icon="mdi-magnify"
      single-line
      dense
      rounded
      style="width: 50%;"
      placeholder="Search in Title"
      @change="onChangeWord(word)"
    />
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
      word: ''
    }
  },
  methods: {
    click () {
      this.$refs.base.$refs.page.$children[0].add()
    },
    onChangeWord (word) {
      this.$refs.base.$refs.page.$children[0].search(word)
    }
  }
}
</script>
