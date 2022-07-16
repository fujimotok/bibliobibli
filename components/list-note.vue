<template>
  <v-list-item-group
    v-model="internalValue"
  >
    <template v-for="(item, index) in items">
      <v-list-item :key="index" @click="show(item.id)">
        <v-list-item-content>
          <v-list-item-title v-text="item.header" />
          <v-list-item-subtitle
            class="text-caption"
            v-text="item.path"
          />
        </v-list-item-content>
      </v-list-item>
      <v-divider :key="`${index}-divider`" />
    </template>
    <div v-intersect.quite="onIntersect" />
  </v-list-item-group>
</template>

<script lang="ts">
import Vue from 'vue'
import { NoteRepository } from '~/js/db/interfaces/NoteRepository'

export type DataType = {
  items: object[]
  isLoading: boolean
}

export default Vue.extend({
  props: {
    value: { type: Number, default: 0 }
  },
  data (): DataType {
    return {
      items: [],
      isLoading: false
    }
  },
  computed: {
    internalValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    show (id: number) {
      this.$router.push({ path: '/notes/' + id })
    },
    async search (offset = 0) {
      const noteRepo: NoteRepository = this.$noteRepository
      const notes = await noteRepo.find('', offset, 20)
      if (notes !== undefined) {
        notes[0].forEach((note) => {
          this.items.push({
            id: note.id,
            header: note.content.slice(0, note.content.search(/\r\n|\r|\n/)),
            path: note.path,
          })
        })
      }
    },
    onIntersect () {
      this.isLoading = true
      this.search(this.items.length)
      this.isLoading = false
    }
  }
})
</script>
