<template>
  <div ref="list">
    <v-list two-line class="overflow-y-auto" :height="listHeight">
      <v-list-item-group
        v-model="selected"
      >
        <template v-for="(item, index) in items">
          <v-list-item :key="index" @click="show(item.id)">
            <template>
              <v-list-item-content>
                <v-list-item-title v-text="item.id" />
              </v-list-item-content>
            </template>
          </v-list-item>
          <v-divider :key="`${index}-divider`" />
        </template>
      </v-list-item-group>
    </v-list>
    <v-bottom-navigation
      :value="value"
      color="primary"
      class="elevation-0"
    >
      <v-btn>
        <span>Activity</span>
        <v-icon>mdi-bell-ring</v-icon>
      </v-btn>

      <v-btn>
        <span>Books</span>
        <v-icon>mdi-bookshelf</v-icon>
      </v-btn>

      <v-btn>
        <span>Notes</span>
        <v-icon>mdi-book-open-variant</v-icon>
      </v-btn>

      <v-btn>
        <span>Scraps</span>
        <v-icon>mdi-note-multiple-outline</v-icon>
      </v-btn>

      <v-btn>
        <span>Etc...</span>
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { id: 0 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
      { id: 9 },
      { id: 10 },
      { id: 11 },
      { id: 12 },
      { id: 13 },
      { id: 14 },
      { id: 15 },
      { id: 16 },
      { id: 17 },
      { id: 18 }
    ],
    selected: null,
    value: null,
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
    show (index) {
      this.$router.push({ path: '/books/' + index })
    }

  }
}
</script>
