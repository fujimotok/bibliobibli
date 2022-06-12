<template>
  <v-list-item-group
    v-model="internalValue"
  >
    <template v-for="(item, index) in items">
      <v-list-item :key="index" @click="show(item.link)">
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
</template>

<script>
export default {
  props: {
    value: Number
  },
  data () {
    return {
      items: [],
      tagItems: [],
      searchTags: [],
      states: [
        { text: '読みたい', value: 0, icon: 'mdi-progress-star' },
        { text: '未読', value: 1, icon: 'mdi-progress-clock' },
        { text: '読中', value: 2, icon: 'mdi-progress-check' },
        { text: '読了', value: 3, icon: 'mdi-check' }
      ]
    }
  },
  computed: {
    internalValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  mounted () {
    this.items = [
      { id: 0, link: '/books/0', title: 'title1', authors: ['Jon Smith'], tags: ['tag'], status: 0 },
      { id: 1, link: '/books/1', title: 'title2', authors: ['Jon Smith'], tags: ['tag'], status: 1 },
      { id: 2, link: '/books/2', title: 'title3', authors: ['Jon Smith'], tags: ['tag'], status: 2 },
      { id: 3, link: '/books/3', title: 'title4', authors: ['Jon Smith'], tags: ['tag'], status: 3 },
      { id: 4, link: '/books/4', title: 'title5', authors: ['Jon Smith'], tags: ['tag'], status: 0 },
      { id: 5, link: '/books/5', title: 'title6', authors: ['Jon Smith'], tags: ['tag'], status: 0 },
      { id: 6, link: '/books/5', title: 'title6', authors: ['Jon Smith'], tags: ['tag'], status: 0 },
      { id: 7, link: '/books/5', title: 'title6', authors: ['Jon Smith'], tags: ['tag'], status: 0 },
      { id: 8, link: '/books/5', title: 'title6', authors: ['Jon Smith'], tags: ['tag'], status: 0 },
      { id: 9, link: '/books/5', title: 'title6', authors: ['Jon Smith'], tags: ['tag'], status: 0 },
      { id: 10, link: '/books/5', title: 'title6', authors: ['Jon Smith'], tags: ['tag'], status: 0 }

    ]
  },
  methods: {
    show (link) {
      this.$router.push({ path: link })
    }
  }
}
</script>
