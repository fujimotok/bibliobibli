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
    </v-list-item-group>

    <div v-if="items.length == 0">
      <p>空</p>
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
          <v-combobox v-model="searchStates" multiple :items="states" label="states" :disabled="!isUseStates" />
          <v-switch v-model="isUseTags" label="Filter Tags" />
          <v-combobox v-model="searchTags" multiple :items="tagItems" label="tags" :disabled="!isUseTags" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">
            キャンセル
          </v-btn>
          <v-btn @click="search()">
            検索
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
import { db } from '../js/db'

export default {
  name: 'IndexPage',
  layout: 'index',
  data: () => ({
    items: [],
    dialog: false,
    searchQuery: '',
    isUseTags: false,
    tagItems: [],
    searchTags: [],
    isUseStates: false,
    states: [{ text: '読みたい', value: 0, icon: 'mdi-progress-star' }, { text: '未読', value: 1, icon: 'mdi-progress-clock' }, { text: '読中', value: 2, icon: 'mdi-progress-check' }, { text: '読了', value: 3, icon: 'mdi-check' }],
    searchStates: []
  }),
  head: () => ({
    title: '本棚'
  }),
  mounted () {
    db.books.orderBy(':id').reverse().limit(100).toArray().then((records) => {
      this.items = records
    })
    db.books.orderBy('tags').uniqueKeys()
      .then((keysArray) => {
        this.tagItems = keysArray
      })
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
    search () {
      const words = this.searchQuery.split(' ')
      const regex = new RegExp(words.join('|'), 'i')
      db.books.filter((book) => {
        const hitWord = regex.test(book.title)
        const hitStatus = this.isUseStates ? this.searchStates.some(status => book.status === status.value) : true
        const hitTags = this.isUseTags ? this.searchTags.every(tag => book.tags.includes(tag)) : true
        return hitWord && hitStatus && hitTags
      }).limit(100).toArray().then((records) => {
        this.items = records
      })

      this.dialog = false
    }
  }
}
</script>
