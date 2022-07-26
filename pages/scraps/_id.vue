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
    <v-bottom-sheet v-model="bottomSheet" max-width="480px">
      <v-list style="padding-bottom: 40px;">
        <p class="text-h6 ma-4">
          {{ scrap.id }}: {{ scrap.content.split(/\r\n|\r|\n/)[0] }}
        </p>
        <v-divider />
        <v-list-item-group>
          <v-list-item @click="remove">
            <v-list-item-avatar>
              <v-avatar>
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>
              削除
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
import { ScrapRepository, Scrap } from '../../js/db/interfaces/ScrapRepository'
import { TagRepository } from '~/js/db/interfaces/TagRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  scrap: Scrap
  tagItems: object[]
  bottomSheet: boolean
}

export default Mixin.extend({
  name: 'ScrapsPage',
  data(): DataType {
    return {
      scrap: {
        id: undefined,
        tags: [],
        createdAt: '',
        updatedAt: '',
        content: '',
      },
      tagItems: [],
      bottomSheet: false
    }
  },
  watch: {
    '$route' (to) {
      const scrapRepo: ScrapRepository = this.$scrapRepository
      scrapRepo.findById(Number(to.params.id)).then((scrap) =>{
        if (scrap) {
          this.scrap = scrap          
        }
      })
    }
  },
  async beforeMount () {
    const tagRepo: TagRepository = this.$tagRepository
    await tagRepo.find('', 0, 0).then((tags) => {
      if (tags !== undefined) {
        this.tagItems = tags[0]
      }
    })

    const scrapRepo: ScrapRepository = this.$scrapRepository
    const ret = await scrapRepo.findById(Number(this.$route.params.id))
    if (ret) {
      this.scrap = ret
    }
  },
  mounted () {
  },
  methods: {
    async save () {
      await this.recordActivity(`/scraps/${this.scrap.id}`, 'Update Scrap Info', `${this.scrap.id} is updated.`)
      const scrapRepo: ScrapRepository = this.$scrapRepository
      await scrapRepo.store(this.scrap)
    },
    menu () {
      this.bottomSheet = true
    },
    async remove () {
      if (confirm('本当に削除しても良いですか？')) {
        await this.recordActivity('', 'Delete Scrap', `${this.scrap.id} is deleted.`)
        const scrapRepo: ScrapRepository = this.$scrapRepository
        if (this.scrap.id) {
          await scrapRepo.remove(this.scrap.id)
        }
        this.bottomSheet = false
        this.$router.push('/scraps/')
      }
    },
  }
})
</script>
