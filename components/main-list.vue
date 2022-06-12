<template>
  <div ref="list">
    <v-list two-line class="overflow-y-auto" :height="listHeight">
      <!-- activity list -->
      <v-list-item-group
        v-if="selectedNaviItem=='activity'"
        v-model="selectedActivity"
      >
        <template v-for="(item, index) in activities">
          <v-list-item :key="index" @click="show(item.link)">
            <v-list-item-content>
              <v-list-item-title v-text="item.id" />
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="`${index}-divider`" />
        </template>
      </v-list-item-group>

      <!-- book list -->
      <v-list-item-group
        v-if="selectedNaviItem=='books'"
        v-model="selectedBook"
      >
        <template v-for="(item, index) in books">
          <v-list-item :key="index" @click="show(item.link)">
            <v-list-item-content>
              <v-list-item-title v-text="item.id" />
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="`${index}-divider`" />
        </template>
      </v-list-item-group>

      <!-- note list -->
      <v-list-item-group
        v-if="selectedNaviItem=='notes'"
        v-model="selectedBook"
      >
        <template v-for="(item, index) in notes">
          <v-list-item :key="index" @click="show(item.link)">
            <v-list-item-content>
              <v-list-item-title v-text="item.id" />
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="`${index}-divider`" />
        </template>
      </v-list-item-group>

      <!-- scrap list -->
      <v-list-item-group
        v-if="selectedNaviItem=='scraps'"
        v-model="selectedBook"
      >
        <template v-for="(item, index) in scraps">
          <v-list-item :key="index" @click="show(item.link)">
            <v-list-item-content>
              <v-list-item-title v-text="item.id" />
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="`${index}-divider`" />
        </template>
      </v-list-item-group>

      <!-- others list -->
      <v-list-item-group
        v-if="selectedNaviItem=='etc'"
        v-model="selectedBook"
      >
        <template v-for="(item, index) in others">
          <v-list-item :key="index" @click="show(item.link)">
            <v-list-item-content>
              <v-list-item-title v-text="item.id" />
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="`${index}-divider`" />
        </template>
      </v-list-item-group>
    </v-list>

    <!-- bottom bar -->
    <v-divider />
    <v-bottom-navigation
      v-model="selectedNaviItem"
      color="primary"
      class="elevation-0"
    >
      <v-btn value="activity">
        <span>Activity</span>
        <v-icon>mdi-bell-ring</v-icon>
      </v-btn>

      <v-btn value="books">
        <span>Books</span>
        <v-icon>mdi-bookshelf</v-icon>
      </v-btn>

      <v-btn value="notes">
        <span>Notes</span>
        <v-icon>mdi-book-open-variant</v-icon>
      </v-btn>

      <v-btn value="scraps">
        <span>Scraps</span>
        <v-icon>mdi-note-multiple-outline</v-icon>
      </v-btn>

      <v-btn value="etc">
        <span>Etc...</span>
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  data: () => ({
    activities: [
      { id: 0, link: '/books/0' },
      { id: 1, link: '/books/1' },
      { id: 2, link: '/books/2' },
      { id: 3, link: '/books/3' },
      { id: 4, link: '/books/4' }
    ],
    books: [
      { id: 0, link: '/books/0' },
      { id: 1, link: '/books/1' },
      { id: 2, link: '/books/2' },
      { id: 3, link: '/books/3' },
      { id: 4, link: '/books/4' },
      { id: 5, link: '/books/5' },
      { id: 6, link: '/books/6' },
      { id: 7, link: '/books/7' },
      { id: 8, link: '/books/8' },
      { id: 9, link: '/books/9' },
      { id: 10, link: '/books/10' },
      { id: 11, link: '/books/11' },
      { id: 12, link: '/books/12' },
      { id: 13, link: '/books/13' },
      { id: 14, link: '/books/14' },
      { id: 15, link: '/books/15' },
      { id: 16, link: '/books/16' },
      { id: 17, link: '/books/17' },
      { id: 18, link: '/books/18' }
    ],
    notes: [
      { id: 0, link: '/books/0' },
      { id: 1, link: '/books/0' },
      { id: 2, link: '/books/0' },
      { id: 3, link: '/books/0' },
      { id: 4, link: '/books/0' },
      { id: 5, link: '/books/0' },
      { id: 6, link: '/books/0' },
      { id: 7, link: '/books/0' }
    ],
    scraps: [
      { id: 0, link: '/books/0' },
      { id: 1, link: '/books/0' },
      { id: 2, link: '/books/0' },
      { id: 3, link: '/books/0' },
      { id: 4, link: '/books/0' },
      { id: 5, link: '/books/0' },
      { id: 6, link: '/books/0' },
      { id: 7, link: '/books/0' },
      { id: 8, link: '/books/0' },
      { id: 9, link: '/books/0' }
    ],
    others: [
      { id: 0, link: '/about' },
      { id: 1, link: '/tags' },
      { id: 2, link: '/settings' },
      { id: 3, link: '/' }
    ],
    selectedActivity: null,
    selectedBook: null,
    selectedNaviItem: 'activity',
    listHeight: 0
  }),
  mounted () {
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  methods: {
    resize () {
      this.listHeight = window.innerHeight - (56 + 48 + 24)
    },
    show (link) {
      this.$router.push({ path: link })
    }

  }
}
</script>
