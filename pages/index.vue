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
  </v-list>
</template>

<script>
import { db } from '../js/db'

export default {
  name: 'IndexPage',
  layout: 'index',
  data: () => ({
    selected: [2],
    json: '',
    items: []
  }),
  head: () => ({
    title: '本棚'
  }),
  mounted () {
    db.books.orderBy(':id').reverse().limit(100).toArray().then((records) => {
      this.items = records
    })
  },
  methods: {
    add () {
      this.$router.push('/add-item')
    },
    show (index) {
      this.$router.push({ path: '/show-item', query: { index } })
    },
    search (query) {
      const words = query.split(' ')
      const regex = new RegExp(words.join('|'), 'i')
      db.books.filter((book) => {
        return regex.test(book.title)
      }).limit(100).toArray().then((records) => {
        this.items = records
      })
    }
  }
}
</script>
