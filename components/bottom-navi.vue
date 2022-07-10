<template>
  <v-bottom-navigation
    v-model="internalValue"
    color="primary"
    :height="80"
    fixed
    app
  >
    <v-btn value="Activity">
      <span>Activity</span>
      <v-icon>mdi-bell-ring</v-icon>
    </v-btn>
    
    <v-btn value="Books">
      <span>Books</span>
      <v-icon>mdi-bookshelf</v-icon>
    </v-btn>
    
    <v-btn value="Notes">
      <span>Notes</span>
      <v-icon>mdi-book-open-variant</v-icon>
    </v-btn>
    
    <v-btn value="Scraps">
      <span>Scraps</span>
      <v-icon>mdi-note-multiple-outline</v-icon>
    </v-btn>
    
    <V-btn value="Etc">
      <span>Etc...</span>
      <v-icon>mdi-dots-horizontal</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: 'Activity'
    },
  },
  computed: {
    internalValue: {
      get () {
        const self:any = this
        return self.$props.value
      },
      set (value) {
        const self:any = this
        self.$props.value = value
        self.$emit('input', value)
      }
    }
  },
})
</script>

<style>
.v-bottom-navigation .v-btn__content
{
  padding-bottom: 16px;
}
</style>
