<template>
  <v-list-item-group v-model="internalValue" class="mt-2" mandatory>
    <v-list-item value="Activity">
      <div class="icon-with-text">
        <v-icon :color="internalValue === 'Activity' ? 'primary' : 'normal'">
          mdi-bell-ring
        </v-icon>
        <span class="icon-text" :class="(internalValue === 'Activity') ? 'text-primary' : ''">
          Activity
        </span>
      </div>
    </v-list-item>
    <v-list-item value="Books">
      <div class="icon-with-text">
        <v-icon :color="internalValue === 'Books' ? 'primary' : 'normal'">
          mdi-bookshelf
        </v-icon>
        <span class="icon-text" :class="(internalValue === 'Books') ? 'text-primary' : ''">Books</span>
      </div>
    </v-list-item>
    <v-list-item value="Notes">
      <div class="icon-with-text">
        <v-icon :color="internalValue === 'Notes' ? 'primary' : 'normal'">
          mdi-book-open-variant
        </v-icon>
        <span class="icon-text" :class="(internalValue === 'Notes') ? 'text-primary' : ''">Notes</span>
      </div>
    </v-list-item>
    <v-list-item value="Scraps">
      <div class="icon-with-text">
        <v-icon :color="internalValue === 'Scraps' ? 'primary' : 'normal'">
          mdi-note-multiple-outline
        </v-icon>
        <span class="icon-text" :class="(internalValue === 'Scraps') ? 'text-primary' : ''">Scraps</span>
      </div>
    </v-list-item>
    <v-list-item value="Etc">
      <div class="icon-with-text">
        <v-icon :color="internalValue === 'Etc' ? 'primary' : 'normal'">
          mdi-dots-horizontal
        </v-icon>
        <span class="icon-text" :class="(internalValue === 'Etc') ? 'text-primary' : ''">Etc...</span>
      </div>
    </v-list-item>
  </v-list-item-group>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NaviLeft',
  props: {
    value: {
      type: String,
      default: 'Activity'
    },
  },
  computed: {
    internalValue: {
      get (): string {
        return this.value
      },
      set (value: string) {
        this.$emit('change', value)
      }
    }
  }
})
</script>

<style scoped>
.text-primary
{
    color: var(--v-primary-base);
}

.v-list-item
{
    justify-content: center;
    margin: 0px;
    padding: 0px;
}

.v-list-item--active
{
    border-right: solid;
}

.icon-with-text
{
    display: flex;
    flex-direction: column;
    align-items: center;
}

.icon-text
{
    display: block;
    font-size: 12px;
}
</style>
