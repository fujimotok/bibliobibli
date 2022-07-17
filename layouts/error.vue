<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export type DataType = {
  pageNotFound: string
  otherError: string
}

export default Vue.extend({
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data(): DataType {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    return {
      title: 'error'
    }
  }
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
