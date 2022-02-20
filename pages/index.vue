<template>
  <v-list two-line>
    <v-list-item-group>
      <template v-for="(item, index) in items">
        <v-list-item :key="index" @click="show(item.id)">
          <!-- <v-list-item-avatar> -->
          <!--   <v-img :src="item.img" /> -->
          <!-- </v-list-item-avatar> -->
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
            <v-list-item-subtitle
              class="text-caption"
              v-text="item.authors.join(', ')"
            />
            <div>
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
          <v-list-item-action>
            <v-icon v-if="item.status == 0">
              mdi-progress-star
            </v-icon>
            <v-icon v-else-if="item.status == 1">
              mdi-progress-clock
            </v-icon>
            <v-icon v-else-if="item.status == 2">
              mdi-progress-check
            </v-icon>
            <v-icon v-else>
              mdi-check
            </v-icon>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="`${index}-divider`" />
      </template>
      <v-progress-circular v-if="isLoading" indeterminate />
      <div v-intersect.quite="onIntersect" />
    </v-list-item-group>

    <div v-if="items.length == 0" style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%) ">
      <v-icon>mdi-magnify</v-icon>No Results
    </div>

    <v-dialog v-model="dialog" max-width="400">
      <v-card class="pa-4">
        <v-card-title>
          Search
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="searchQuery"
            hide-details
            outlined
            prepend-inner-icon="mdi-magnify"
            single-line
            placeholder="Search in Title"
          />
          <v-switch v-model="isUseStates" label="Filter States" />
          <v-select
            v-model="searchStates"
            multiple
            :items="states"
            label="states"
            :disabled="!isUseStates"
            :menu-props="{ offsetY: true }"
          />
          <v-switch v-model="isUseTags" label="Filter Tags" />
          <v-select
            v-model="searchTags"
            multiple
            :items="tagItems"
            label="tags"
            :disabled="!isUseTags"
            :menu-props="{ offsetY: true }"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="clear()">
            <v-icon>mdi-filter-variant-remove</v-icon>
            クリア
          </v-btn>
          <v-btn class="primary" @click="search()">
            <v-icon>mdi-magnify</v-icon>
            検索
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
import { db } from '../js/db'

let cacheData = null
let scrollPos = null

export default {
  name: 'IndexPage',
  layout: 'index',
  data () {
    if (cacheData) {
      return cacheData
    }
    return {
      items: [],
      dialog: false,
      isLoading: false,
      searchQuery: '',
      isUseTags: false,
      tagItems: [],
      searchTags: [],
      isUseStates: false,
      states: [{ text: '読みたい', value: 0, icon: 'mdi-progress-star' }, { text: '未読', value: 1, icon: 'mdi-progress-clock' }, { text: '読中', value: 2, icon: 'mdi-progress-check' }, { text: '読了', value: 3, icon: 'mdi-check' }],
      searchStates: []
    }
  },
  head: () => ({
    title: '本棚'
  }),
  beforeDestory () {
    cacheData = null
  },
  created () {

  },
  deactivated () {
    if (!cacheData) {
      cacheData = JSON.parse(JSON.stringify(this._data))
    }
    scrollPos = window.pageYOffset
  },
  activated () {
    if (!cacheData) {
      this.search()
    }
  },
  mounted () {
    db.books.orderBy('tags').uniqueKeys()
      .then((keysArray) => {
        this.tagItems = keysArray
      })
    if (cacheData && sessionStorage.getItem('DBChangeEvent') === 'add') {
      const id = Number(sessionStorage.getItem('DBChangeEventArg'))
      db.books.where('id').equals(id).toArray()
        .then((records) => {
          const words = this.searchQuery.split(' ')
          const regex = new RegExp(words.join('|'), 'i')
          const hitWord = regex.test(records[0].title)
          const hitStatus = this.isUseStates ? this.searchStates.some(status => records[0].status === status.value) : true
          const hitTags = this.isUseTags ? this.searchTags.every(tag => records[0].tags.includes(tag)) : true
          if (hitWord && hitStatus && hitTags) {
            this.items.unshift(records[0])
          }
        })
    }

    if (cacheData && sessionStorage.getItem('DBChangeEvent') === 'update') {
      const id = Number(sessionStorage.getItem('DBChangeEventArg'))
      const index = this.items.findIndex(v => v.id === id)
      if (index !== -1) {
        db.books.where('id').equals(id).toArray()
          .then((records) => {
            this.$set(this.items, index, records[0])
            setTimeout(() => {
              window.scrollTo(0, scrollPos)
            })
          })
      }
    }

    if (cacheData && sessionStorage.getItem('DBChangeEvent') === 'del') {
      const id = Number(sessionStorage.getItem('DBChangeEventArg'))
      const index = this.items.findIndex(v => v.id === id)
      if (index !== -1) {
        this.items.splice(index, 1)
        setTimeout(() => {
          window.scrollTo(0, scrollPos)
        })
      }
    }

    if (cacheData && sessionStorage.getItem('DBChangeEvent') === 'import') {
      this.search()
    }

    sessionStorage.removeItem('DBChangeEvent')
    sessionStorage.removeItem('DBChangeEventArg')
  },
  methods: {
    add () {
      this.$router.push('/add-item')
    },
    show (index) {
      this.$router.push({ path: '/show-item', query: { index } })
    },
    showSearchDialog () {
      this.dialog = true
    },
    search (offset = 0) {
      const words = this.searchQuery.split(' ')
      const regex = new RegExp(words.join('|'), 'i')
      db.books.orderBy(':id').reverse().filter((book) => {
        const hitWord = regex.test(book.title)
        const hitStatus = this.isUseStates ? this.searchStates.some(status => book.status === status.value) : true
        const hitTags = this.isUseTags ? this.searchTags.every(tag => book.tags.includes(tag)) : true
        return hitWord && hitStatus && hitTags
      }).offset(offset).limit(20).toArray().then((records) => {
        if (offset === 0) {
          this.items = []
        }
        this.items = this.items.concat(records)
      })

      this.dialog = false
      cacheData = null
    },
    clear () {
      this.searchQuery = ''
      this.isUseStates = false
      this.searchStates = []
      this.isUseTags = false
      this.searchTags = []

      this.search()
      this.dialog = false
      cacheData = null
    },
    onIntersect () {
      this.isLoading = true
      this.search(this.items.length)
      this.isLoading = false
    }
  }
}
</script>
