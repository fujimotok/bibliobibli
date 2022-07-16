<template>
  <div v-if="isEdit">
    <v-text-field
      v-model="internalValue"
      :label="label"
    >
      <template #append-outer>
        <v-btn
          depressed
          icon
          @click="isEdit = false"
        >
          <v-icon>mdi-link</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </div>
  <div v-else style="display: flex; align-items: center;">
    <div>
      <div>
        <label style="font-size: 12px; color: #00000099">
          {{ label }}
        </label>
      </div>
      <div style="margin: 0px 0px 22px 0px;">
        <a v-if="value" :href="value" target="_blank" style="word-break: break-all;">
          {{ value }}
        </a>
        <p v-else style="word-wrap: break-word;">
          {{ label }} is empty
        </p>
      </div>
    </div>
    <v-spacer />
    <v-btn
      depressed
      icon
      @click="isEdit = true"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    value: { type: String, default: "" },
    label: { type: String, default: "Label" },
  },
  data () {
    return {
      isEdit: false
    }
  },
  computed: {
    internalValue: {
      get (): string {
        return this.value
      },
      set (value: string): void {
        this.$emit('input', value)
      }
    }
  }
})
</script>
