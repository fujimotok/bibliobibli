<template>
  <default-layout ref="base">
    <v-btn color="white" icon @click="save()">
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
    <v-btn color="white" icon @click="del()">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </default-layout>
</template>

<script>
import defaultLayout from '~/layouts/default.vue'

export default {
  name: 'ShowItemLayout',
  components: { defaultLayout },
  data () {
    return {
    }
  },
  methods: {
    save () {
      this.$refs.base.$refs.page.$children[0].put()
    },
    del () {
      this.$refs.base.$refs.page.$children[0].remove()
    }
  }
}
</script>
