<template>
  <v-bottom-navigation
    v-model="internalValue"
    color="primary"
    :height="80"
    fixed
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
    
    <v-btn value="Etc">
      <span>Etc...</span>
      <v-icon>mdi-dots-horizontal</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NaviBottom',
  props: {
    value: {
      type: String,
      default: 'Activity'
    },
  },
  computed: {
    internalValue: {
      get (): string {
        return this.$props.value
      },
      set (value: string) {
        this.$emit('change', value)
      }
    }
  },
})
</script>

<style>
.v-bottom-navigation
{
    border-top: solid 1px;
    border-color: #E0E0E0;
}

.v-bottom-navigation .v-btn__content
{
  padding-bottom: 16px;
}

.v-bottom-navigation .v-btn--active
{
    border-top: solid;
}
</style>
