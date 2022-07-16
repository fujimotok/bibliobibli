<template>
  <div v-if="isMobile"> 
    <list-activity v-if="isRoot" ref="listMobile" class="ma-0 pa-0 fill-height" />
    <v-card v-else>
      <div style="padding: 16px;">
        <nuxt-child ref="contentMobile" class="ma-0 pa-0 fill-height" />
      </div>
    </v-card>
  </div>
  <v-container v-else class="ma-0 pa-0 fill-height" fluid>
    <v-row class="ma-0 pa-0 fill-height" no-gutters>
      <v-col
        xs="12"
        sm="12"
        md="4"
        lg="4"
        lx="4"
        class="ma-0 pa-0 fill-height"
      >
        <list-activity ref="listDesktop" class="ma-0 pa-0 fill-height" />
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="8"
        lg="8"
        lx="8"
        class="ma-0 pa-0 fill-height"
      >
        <v-card class="overflow-y-auto" :height="cardHeight">
          <div style="padding: 16px;">
            <nuxt-child ref="contentDesktop" class="ma-0 pa-0 fill-height" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import ListActivity from '~/components/list-activity.vue'

export default Vue.extend({
  name: 'IndexPage',
  data: () => ({
  }),
  computed: {
    isMobile (): boolean {
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      return xs || sm
    },
    isRoot (): boolean {
      return this.$route.path === '/'
    }
  },
  mounted () {
  },
  methods: {
    add (): void {
      this.$router.push({ path: '/books/new'})
    },
    search (): void {
      if (this.isMobile) {
        const list = this.$refs.listMobile as InstanceType<typeof ListActivity>
        list.search()
      } else {
        const list = this.$refs.listDesktop  as InstanceType<typeof ListActivity>
        list.search()
      }
    },
    save (): void {
    },
    del () {
    }
  }
})
</script>
