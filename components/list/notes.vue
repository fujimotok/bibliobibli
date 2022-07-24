<template>
  <div>
    <v-list-item-group
      v-if="items.length > 0"
      v-model="internalValue"
    >
      <template v-for="(item, index) in items">
        <v-list-item :key="index" @click="show(item.id)">
          <div v-if="index === items.length - 1" v-intersect.quiet="onIntersect" />
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
    </v-list-item-group>
    <div v-else style="position: absolute; height: 90%; width: 100%; align-items: center;">
      <p style="position: relative; top: 50%; text-align: center;">
        No Result
      </p>
    </div>
    <v-dialog v-model="dialog" max-width="400">
      <v-card class="pa-4">
        <v-card-title>
          Search
        </v-card-title>
        <v-card-text>
          <v-text-field
            ref="input"
            v-model="searchWord"
            hide-details
            outlined
            prepend-inner-icon="mdi-magnify"
            single-line
            placeholder="Search word"
            class="mb-4"
            @keydown.enter="onEnter"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="clear()">
            <v-icon>mdi-filter-variant-remove</v-icon>
            クリア
          </v-btn>
          <v-btn class="primary" @click="find(); dialog = false">
            <v-icon>mdi-magnify</v-icon>
            検索
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { NoteRepository } from '~/js/db/interfaces/NoteRepository'

export type DataType = {
  items: object[]
  isLoading: boolean
  searchWord: string
  dialog: boolean
}

export default Vue.extend({
  name: 'ListNote',
  props: {
    value: { type: Number, default: 0 }
  },
  data (): DataType {
    return {
      items: [],
      isLoading: false,
      searchWord: '',
      dialog: false
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
    this.find()
  },
  methods: {
    show (id: number) {
      this.$router.push({ path: '/notes/' + id })
    },
    async find (offset = 0) {
      if (offset === 0) {
        this.items = []
      }
      
      const noteRepo: NoteRepository = this.$noteRepository
      const notes = await noteRepo.find(this.searchWord, offset, 20)
      if (notes !== undefined) {
        notes[0].forEach((note) => {
          this.items.push({
            id: note.id,
            header: note.path.split('/').slice(-1)[0],
            path: note.path,
          })
        })
      }
    },
    async onIntersect () {
      this.isLoading = true
      await this.find(this.items.length)
      this.isLoading = false
    },
    search () {
      this.dialog = true
    },
    clear () {
      this.searchWord = ''

      this.find()
      this.dialog = false
      window.scrollTo({ top: 0 })
    },
    onEnter (event: any) {
      if (event.keyCode !== 13) {
        return
      }
      const input = this.$refs.input as HTMLElement
      input.blur() // hide software keyboard
      this.find()
      this.dialog = false
      window.scrollTo({ top: 0 })
    }
  }
})
</script>
