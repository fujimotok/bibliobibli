<template>
  <default-layout ref="base">
    <v-btn color="white" icon @click="save()">
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
    <v-btn color="white" icon @click="barcode()">
      <v-icon>mdi-barcode</v-icon>
    </v-btn>
  </default-layout>
</template>

<script>
import defaultLayout from '~/layouts/default.vue'

export default {
  name: 'AddItemLayout',
  components: { defaultLayout },
  data () {
    return {
    }
  },
  methods: {
    save () {
      this.$refs.base.$refs.page.$children[0].add()
    },
    barcode () {
      this.$refs.base.$refs.page.$children[0].barcodeReader()
    }
  }
}
</script>
