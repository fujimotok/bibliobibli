<template>
  <div ref="list">
    <v-list class="overflow-y-auto" :height="listHeight">
      <activity-list
        v-show="value=='Activity'"
        v-model="selectedActivity"
      />

      <book-list
        v-show="value=='Books'"
        v-model="selectedBook"
      />

      <note-list
        v-show="value=='Notes'"
        v-model="selectedNote"
      />

      <scrap-list
        v-show="value=='Scraps'"
        v-model="selectedScrap"
      />

      <others-list
        v-show="value=='Etc'"
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
  props: {
    value: String
  },
  data: () => ({
    selectedActivity: null,
    selectedBook: null,
    selectedNote: null,
    selectedScrap: null,
    selectedOther: null,
    listHeight: 0
  }),
  computed: {
    SelectedNaviItem: {
      get(){
        return this.value
      },
      set(value){
        this.$emit('input', value)
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
    },
    search(){
      console.log('search')
    }
  }
}
</script>
