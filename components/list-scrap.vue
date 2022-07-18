<template>
  <v-list-item-group
    v-if="items.length > 0"
    v-model="internalValue"
  >
    <template v-for="(item, index) in items">
      <v-list-item :key="index" @click="show(item.id)">
        <v-list-item-content>
          <v-list-item-title v-text="item.header" />
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
      </v-list-item>
      <v-divider :key="`${index}-divider`" />
    </template>
    <div v-intersect.quite="onIntersect" />
  </v-list-item-group>
  <div v-else style="position: absolute; height: 90%; width: 100%; align-items: center;">
    <p style="position: relative; top: 50%; text-align: center;">
      No Result
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TagRepository, Tag } from '../js/db/interfaces/TagRepository'
import { ScrapRepository } from '~/js/db/interfaces/ScrapRepository'

export type DataType = {
  items: object[]
  tagItems: Tag[]
  searchWord: string
  searchTags: number[]
  isLoading: boolean
}

export default Vue.extend({
  props: {
    value: { type: Number, default: 0 }
  },
  data (): DataType {
    return {
      items: [],
      tagItems: [],
      searchWord: '',
      searchTags: [],
      isLoading: false,
    }
  },
  computed: {
    internalValue: {
      get (): number {
        return this.value
      },
      set (value): void {
        this.$emit('input', value)
      }
    }
  },
  async mounted () {
    const tagRepo: TagRepository = this.$tagRepository
    const tags = await tagRepo.find('', 0, 30)
    if (tags !== undefined) {
      this.tagItems = tags[0]
    }
    
    this.search()
  },
  methods: {
    show (link: string) {
      this.$router.push({ path: link })
    },
    async search (offset = 0) {
      const scrapRepo: ScrapRepository = this.$scrapRepository
      const scraps = await scrapRepo.find(this.searchWord, this.searchTags, offset, 20)
      if (scraps !== undefined) {
        scraps[0].forEach((scrap) => {
          this.items.push({
            id: scrap.id,
            header: scrap.content.slice(0, scrap.content.search(/\r\n|\r|\n/)),
            tags: scrap.tags.map((tag) => {
              const elem = this.tagItems.find((t) => t.id === tag)
              return elem?.name
            })
          })
        })
      }
    },
  }
})
</script>
