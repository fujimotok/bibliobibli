<template>
  <v-list two-line>
    <v-list-item-group
      v-model="selected"
    >
      <template v-for="(item, index) in items">
        <v-list-item :key="item.name" @click="show(index)">
          <!-- <v-list-item-avatar> -->
          <!--   <v-img :src="item.img" /> -->
          <!-- </v-list-item-avatar> -->
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
            <v-list-item-subtitle
              class="text-caption"
              v-text="item.auther"
            />
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
        <v-divider
          :key="index"
        />
      </template>
    </v-list-item-group>
    <v-btn
      color="secondary"
      fab
      fixed
      right
      bottom
      @click="add"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-list>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    selected: [2],
    json: '',
    items: [{ title: 'title', auther: 'auther', status: 0 }]
  }),
  head: () => ({
    title: '本棚'
  }),
  mounted () {
    // this.items = JSON.parse(localStorage.getItem('items')) || []
  },
  methods: {
    addItem  () {
      this.items.push('item_' + this.items.length)
      this.setItems()
    },
    deleteAllItems  () {
      this.items = []
      this.setItems()
    },
    setItems  () {
      localStorage.setItem('items', JSON.stringify(this.items))
    },
    add () {
      localStorage.setItem('code', '')
      localStorage.setItem('format', 'CODE128')
      this.$router.push('/add-item')
    },
    show  (index) {
      this.$router.push({ path: '/show-item', query: { index } })
    }
  }
}
</script>
