<template>
<v-list-item-group
  v-model="internalValue"
  >
  <template v-for="(item, index) in items">
    <v-list-item :key="index" @click="show(item.id)">
      <v-list-item-content>
        <v-list-item-title v-text="item.title" />
        <v-list-item-subtitle
          class="text-caption"
          v-text="item.authors ? item.authors.join(', ') : '' "
          />        
        <div>
          <v-icon v-if="item.status == status.want">
            mdi-progress-star
          </v-icon>
          <v-icon v-else-if="item.status == status.unread">
            mdi-progress-clock
          </v-icon>
          <v-icon v-else-if="item.status == status.reading">
            mdi-progress-check
          </v-icon>
          <v-icon v-else>
            mdi-check
          </v-icon>
          <v-chip
            v-for="tag in item.tags"
              :key="tag"
              small
              class="mr-1 mt-1"
            >
              {{ tag }}
            </v-chip>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-divider :key="`${index}-divider`" />
    </template>
    <div v-intersect.quite="onIntersect" />
  </v-list-item-group>
</template>

<script lang="ts">
import Vue from 'vue'
import { TagRepository } from '../js/db/interfaces/TagRepository'
import { Status, BookRepository } from '~/js/db/interfaces/BookRepository'

export default Vue.extend({
  props: {
    value: Number
  },
  data () {
    return {
      items: [],
      tagItems: [],
      searchTags: [],
      status: Status,
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
  async mounted () {
    const tagRepo: TagRepository = this.$tagRepository
    const tags = await tagRepo.find('')
    this.tagItems = tags[0]

    this.search()
  },
  methods: {
    show (id: number) {
      this.$router.push({ path: '/books/' + id })
    },
    async search (offset = 0) {
      const bookRepo: BookRepository = this.$bookRepository
      const books = await bookRepo.find('', [0,1,2,3], [], offset, 20)
      
      books[0].forEach((book) => {
        this.items.push({
          id: book.id,
          title: book.title,
          authors: book.authors,
          status: book.status,
          tags: book.tags.map((tag) => {
            const elem = this.tagItems.find((t) => t.id === tag)
            return elem.name
          })
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
