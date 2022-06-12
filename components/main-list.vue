<template>
  <div ref="list">
    <v-list class="overflow-y-auto" :height="listHeight">
      <activity-list
        v-show="selectedNaviItem=='activity'"
        v-model="selectedActivity"
      />

      <book-list
        v-show="selectedNaviItem=='books'"
        v-model="selectedBook"
      />

      <note-list
        v-show="selectedNaviItem=='notes'"
        v-model="selectedNote"
      />

      <scrap-list
        v-show="selectedNaviItem=='scraps'"
        v-model="selectedScrap"
      />

      <others-list
        v-show="selectedNaviItem=='etc'"
        v-model="selectedOther"
      />
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

      <V-btn value="etc">
        <span>Etc...</span>
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  data: () => ({
    selectedActivity: null,
    selectedBook: null,
    selectedNote: null,
    selectedScrap: null,
    selectedOther: null,
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
    }
  }
}
</script>
