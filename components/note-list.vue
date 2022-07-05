<template>
<v-list class="overflow-y-auto" :height="listHeight">
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
</v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import { NoteRepository } from '~/js/db/interfaces/NoteRepository'

export default Vue.extend({
  props: {
    value: Number
  },
  data () {
    return {
      listHeight: 0,
      items: [],
      searchTags: [],
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
    window.addEventListener('resize', this.resize)
    this.resize()

    this.search()
  },
  methods: {
    resize () {
      this.listHeight = window.innerHeight - (48 + 2)
    },
    show (id: number) {
      this.$router.push({ path: '/notes/' + id })
    },
    async search (offset = 0) {
      const noteRepo: NoteRepository = this.$noteRepository
      const notes = await noteRepo.find('', offset, 20)
      
      notes[0].forEach((note) => {
        this.items.push({
          id: note.id,
          header: note.content.slice(0, note.content.search(/\r\n|\r|\n/)),
          path: note.path,
        })
      })
    },
    onIntersect () {
      this.isLoading = true
      this.search(this.items.length)
      this.isLoading = false
    }
  }
})
</script>
