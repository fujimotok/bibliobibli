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
            placeholder="Search in Title or ISBN"
            class="mb-4"
            @keydown.enter="onEnter"
          />
          <v-select
            v-model="searchStates"
            multiple
            :items="states"
            label="states"
            :menu-props="{ offsetY: true }"
          >
            <template #prepend-item>
              <v-list-item
                ripple
                @mousedown.prevent
                @click="selectAllStates"
              >
                <v-list-item-action>
                  <v-icon :color="searchStates.length > 0 ? 'primary' : ''">
                    {{ searchStatesIcon }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    Select All
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mt-2" />
            </template>
          </v-select>
          <v-select
            v-model="searchTags"
            multiple
            :items="tagItems"
            label="tags"
            item-value="id"
            item-text="name"
            :menu-props="{ offsetY: true }"
          >
            <template #prepend-item>
              <v-list-item
                ripple
                @mousedown.prevent
                @click="selectAllTags"
              >
                <v-list-item-action>
                  <v-icon :color="searchTags.length > 0 ? 'primary' : ''">
                    {{ searchTagsIcon }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    Select All
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mt-2" />
            </template>
          </v-select>
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
import { TagRepository, Tag } from '~/js/db/interfaces/TagRepository'
import { Status, BookRepository } from '~/js/db/interfaces/BookRepository'

export type DataType = {
  items: object[]
  tagItems: Tag[]
  searchWord: string
  searchTags: number[]
  states: object[],
  searchStates: number[],
  isLoading: boolean
  dialog: boolean
  status: object
}

export default Vue.extend({
  name: 'ListBooks',
  props: {
    value: { type: Number, default: 0 }
  },
  data (): DataType {
    return {
      items: [],
      tagItems: [],
      searchWord: '',
      searchTags: [],
      states: [
        { text: '読みたい', value: 0, icon: 'mdi-progress-star' },
        { text: '未読', value: 1, icon: 'mdi-progress-clock' },
        { text: '読中', value: 2, icon: 'mdi-progress-check' },
        { text: '読了', value: 3, icon: 'mdi-check' }
      ],
      searchStates: [
        0, 1, 2, 3
      ],
      isLoading: false,
      dialog: false,
      status: Status
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
    },
    searchAllTags (): boolean {
      return this.searchTags.length === this.tagItems.length
    },
    searchSomeTags (): boolean {
      return this.searchTags.length > 0 && !this.searchAllTags
    },
    searchTagsIcon (): string {
      if (this.searchAllTags) { return 'mdi-close-box' }
      if (this.searchSomeTags) { return 'mdi-minus-box' }
      return 'mdi-checkbox-blank-outline'
    },
    searchAllStates (): boolean {
      return this.searchStates.length === this.states.length
    },
    searchSomeStates (): boolean {
      return this.searchStates.length > 0 && !this.searchAllStates
    },
    searchStatesIcon (): string {
      if (this.searchAllStates) { return 'mdi-close-box' }
      if (this.searchSomeStates) { return 'mdi-minus-box' }
      return 'mdi-checkbox-blank-outline'
    }
  },
  async mounted () {
    const tagRepo: TagRepository = this.$tagRepository
    const tags = await tagRepo.find('', 0, 30)
    if (tags !== undefined) {
      this.tagItems = tags[0]
    }
    
    await this.find()
  },
  methods: {
    show (id: number) {
      this.$router.push({ path: '/books/' + id })
    },
    async find (offset = 0) {
      if (offset === 0) {
        this.items = []
      }

      const bookRepo: BookRepository = this.$bookRepository
      const books = await bookRepo.find(this.searchWord, this.searchStates, this.searchTags, offset, 20)
      if (books !== undefined) {
        books[0].forEach((book) => {
          this.items.push({
            id: book.id,
            title: book.title,
            authors: book.authors,
            status: book.status,
            tags: book.tags.map((tag) => {
              const elem = this.tagItems.find((t) => t.id === tag)
              return elem?.name
            })
          })
        })
        this.$store.commit('CHANGE_SEARCH_COUNT', books[1])
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
    selectAllStates () {
      this.$nextTick(() => {
        if (this.searchAllStates) {
          this.searchStates = []
        } else {
          this.searchStates = this.states.map((s: any) => s.value as number)
        }
      })
    },
    selectAllTags () {
      this.$nextTick(() => {
        if (this.searchAllTags) {
          this.searchTags = []
        } else {
          this.searchTags = this.tagItems.slice().map(t => t.id || 0)
        }
      })
    },
    clear () {
      this.searchWord = ''
      this.searchStates = [0, 1, 2, 3]
      this.searchTags = []

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
