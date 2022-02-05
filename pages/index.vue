<template>
  <v-list two-line>
    <v-list-item-group>
      <template v-for="(item, index) in items">
        <v-list-item :key="item.id" @click="show(item.id)">
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
    <div v-if="items.length == 0">
      <p>空</p>
    </div>
  </v-list>
</template>

<script>
import { db } from '../js/db'

export default {
  name: 'IndexPage',
  data: () => ({
    selected: [2],
    json: '',
    items: []
  }),
  head: () => ({
    title: '本棚'
  }),
  mounted () {
    db.books.toArray().then((records) => {
      this.items = records
    })
  },
  methods: {
    add () {
      this.$router.push('/add-item')
    },
    show (index) {
      this.$router.push({ path: '/show-item', query: { index } })
    }
  }
}
</script>
