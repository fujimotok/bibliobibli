<template>
  <div v-if="isMobile">
    <div v-if="isRoot">
      <v-list style="padding-bottom: 80px;">
        <list-scraps ref="listMobile" class="ma-0 pa-0 fill-height" />
      </v-list>
      <div style="position: fixed; bottom: 100px; right: 16px;">
        <v-btn
          elevation="2"
          fab
          color="secondary"
          @click.stop="add"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-else>
      <nuxt-child ref="contentMobile" class="ma-0 pa-0 fill-height" />
    </div>
  </div>
  <v-container v-else class="ma-0 pa-0 fill-height" fluid style="position: relative;">
    <v-row class="ma-0 pa-0 fill-height" no-gutters>
      <v-col
        xs="12"
        sm="12"
        md="4"
        lg="4"
        lx="4"
        class="ma-0 pa-0 fill-height"
        style="position: relative;"
      >
        <v-list class="overflow-y-auto" style="position: absolute; height: 100%; width: 100%">
          <list-scraps ref="listDesktop" class="ma-0 pa-0 fill-height" />
        </v-list>
        <div style="position: absolute; bottom: 32px; right: 32px;">
          <v-btn
            elevation="2"
            fab
            small
            color="secondary"
            @click.stop="add"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="8"
        lg="8"
        lx="8"
        class="ma-0 pa-0 fill-height"
        style="position: relative;"
      >
        <v-card class="overflow-y-auto" style="position: absolute; height: 100%; width: 100%">
          <div>
            <nuxt-child ref="contentDesktop" class="ma-0 pa-0 fill-height" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { ScrapRepository, Scrap } from '~/js/db/interfaces/ScrapRepository'
import ListScraps from '~/components/list/scraps.vue'
import Mixin from '~/js/mixin/record-activity'

export interface Content extends Vue {
  save(): void
  menu(): void
}

export default Mixin.extend({
  name: 'ScrapsPage',
  data: () => ({
  }),
  computed: {
    isMobile (): boolean {
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      return xs || sm
    },
    isRoot (): boolean {
      return this.$route.path === '/scraps/'
    }
  },
  mounted () {
  },
  methods: {
    async add () {
      const scrapRepo: ScrapRepository = this.$scrapRepository

      const scrap: Scrap = {
        content: '',
        tags: []
      }
      const ret = await scrapRepo.store(scrap)
      if (ret) {
        await this.recordActivity(`/scraps/${ret.id}`,
                                  this.$t('scrapCreateActivityTitle').toString(),
                                  this.$t('scrapCreateActivityContent', {name: ret.content.split(/\r\n|\r|\n/)[0]}).toString())
        this.$router.push({ path: `/scraps/${ret.id}` })
      }
    },
    search (): void  {
      const self = this
      if (self.isMobile) {
        const list = self.$refs.listMobile as InstanceType<typeof ListScraps>
        list.search()
      } else {
        const list = self.$refs.listDesktop as InstanceType<typeof ListScraps>
        list.search()
      }
    },
    save (): void {
      if (this.isMobile) {
        const content = this.$refs.contentMobile as Content
        content.save()
      } else {
        const content = this.$refs.contentDesktop as Content
        content.save()
      }
    },
    menu (): void {
      if (this.isMobile) {
        const content = this.$refs.contentMobile as Content
        content.menu()
      } else {
        const content = this.$refs.contentDesktop as Content
        content.menu()
      }
    }
  }
})
</script>
