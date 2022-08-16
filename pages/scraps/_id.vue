<template>
  <div>
    <markdown ref="markdown" v-model="scrap.content" :save="save" />
    <v-bottom-sheet v-model="bottomSheet" max-width="480px">
      <v-list style="padding-bottom: 40px;">
        <p class="text-h6 ma-4">
          {{ scrap.id }}: {{ scrap.content.split(/\r\n|\r|\n/)[0] }}
        </p>
        <v-select
          v-model="scrap.tags"
          class="ma-4"
          multiple
          :items="tagItems"
          item-value="id"
          item-text="name"
          label="tags"
          :menu-props="{ offsetY: true, top: true }"
        />
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
              {{ $t('scrapDelete') }}
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

export interface Markdown extends Vue {
  leave(): void
  focus(): void
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
          this.$store.commit('CHANGE_CONTENT_TITLE', this.scrap.content.split(/\r\n|\r|\n/)[0])
        }
      })
    },
    'scrap.content' (val) {
      this.$store.commit('CHANGE_CONTENT_TITLE', val.split(/\r\n|\r|\n/)[0])
    },
    'scrap.tags' () {
      this.save()
    },
    'bottomSheet' (val) {
      if (val === false) {
        this.$nextTick(() => {
          window.scrollTo(0, 0)
        })
      }
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
      this.$store.commit('CHANGE_CONTENT_TITLE', this.scrap.content.split(/\r\n|\r|\n/)[0])
    }
  },
  mounted () {
  },
  beforeRouteUpdate(_, __, next) {
    const m = this.$refs.markdown as Markdown
    m.leave()
    next()
  },
  beforeRouteLeave(_, ___, next) {
    const m = this.$refs.markdown as Markdown
    m.leave()
    next()
  },
  methods: {
    async save () {
      const scrap = this.scrap // When page update or leave, this.scrap change after 'await'.
      await this.recordActivity(`/scraps/${scrap.id}`,
                                this.$t('scrapUpdateActivityTitle').toString(),
                                this.$t('scrapUpdateActivityContent', {name: this.scrap.content.split(/\r\n|\r|\n/)[0]}).toString())
      const scrapRepo: ScrapRepository = this.$scrapRepository
      await scrapRepo.store(scrap)
    },
    menu () {
      this.bottomSheet = true
    },
    async remove () {
      if (confirm(this.$t('scrapDeleteConfirm').toString())) {
        await this.recordActivity('',
                                  this.$t('scrapDeleteActivityTitle').toString(),
                                  this.$t('scrapDeleteActivityContent', {name: this.scrap.content.split(/\r\n|\r|\n/)[0]}).toString())

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
