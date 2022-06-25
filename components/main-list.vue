<template>
  <div ref="list">
    <v-list class="overflow-y-auto" :height="listHeight" two-line>
      <activity-list
        v-show="selectedNaviItem=='Activity'"
        v-model="selectedActivity"
      />

      <book-list
        v-show="selectedNaviItem=='Books'"
        v-model="selectedBook"
      />

      <note-list
        v-show="selectedNaviItem=='Notes'"
        v-model="selectedNote"
      />

      <scrap-list
        v-show="selectedNaviItem=='Scraps'"
        v-model="selectedScrap"
      />

      <others-list
        v-show="selectedNaviItem=='Etc'"
        v-model="selectedOther"
      />
    </v-list>

    <!-- bottom bar -->
    <v-divider />
    <v-bottom-navigation
      v-model="SelectedNaviItem"
      color="primary"
      class="elevation-0"
    >
      <v-btn value="Activity">
        <span>Activity</span>
        <v-icon>mdi-bell-ring</v-icon>
      </v-btn>

      <v-btn value="Books">
        <span>Books</span>
        <v-icon>mdi-bookshelf</v-icon>
      </v-btn>

      <v-btn value="Notes">
        <span>Notes</span>
        <v-icon>mdi-book-open-variant</v-icon>
      </v-btn>

      <v-btn value="Scraps">
        <span>Scraps</span>
        <v-icon>mdi-note-multiple-outline</v-icon>
      </v-btn>

      <V-btn value="Etc">
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
    selectedNaviItem: 'Activity',
    listHeight: 0
  }),
  computed: {
    SelectedNaviItem: {
      get(){
        return this.selectedNaviItem
      },
      set(value){
        this.selectedNaviItem = value
        this.$store.commit('CHANGE_TITLE', value)
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.resize)
    this.resize()
    this.SelectedNaviItem = 'Activity'
  },
  methods: {
    resize () {
      this.listHeight = window.innerHeight - (56 + 48 + 24)
    }
  }
}
</script>
