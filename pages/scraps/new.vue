<template>
  <div>
    <v-select
      v-model="scrap.tags"
      multiple
      :items="tagItems"
      item-value="id"
      item-text="name"
      label="tags"
      :menu-props="{ offsetY: true }"
    />
    <markdown v-model="scrap.content" />
  </div>
</template>

<script lang="ts">
import { ScrapRepository, Scrap } from '../../js/db/interfaces/ScrapRepository'
import { TagRepository } from '~/js/db/interfaces/TagRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  scrap: Scrap
  tagItems: object[]
}

export default Mixin.extend({
  name: 'ScrapsIndexPage',
  data(): DataType {
    return {
      scrap: {
        id: undefined,
        tags: [],
        createdAt: '',
        updatedAt: '',
        content: '',
      },
      tagItems: []
    }
  },
  async beforeMount () {
    const tagRepo: TagRepository = this.$tagRepository
    await tagRepo.find('', 0, 0).then((tags) => {
      if (tags !== undefined) {
        this.tagItems = tags[0]
      }
    })
  },
  mounted () {
  },
  methods: {
    async save () {
      const scrapRepo: ScrapRepository = this.$scrapRepository
      const ret = await scrapRepo.store(this.scrap)
      if (ret) {
        await this.recordActivity(`/scraps/${ret.id}`, 'Created Scrap', `${ret.id} is created.`)
        this.$router.replace({ path: `/scraps/${ret.id}` })
      }
    },
    menu () {
    }
  }
})
</script>
