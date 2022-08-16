<template>
  <div>
    no select
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ScrapsPageIndex',
  beforeMount () {
    this.$store.commit('CHANGE_CONTENT_TITLE', '')
  }
})
</script>
