<template>
  <div v-if="isMobile">
    <div v-if="isRoot">
      <v-list style="padding-bottom: 80px;">
        <list-activities ref="listMobile" class="ma-0 pa-0 fill-height" />
      </v-list>
    </div>
    <v-card v-else>
      <div style="padding: 16px;">
        <nuxt-child ref="contentMobile" class="ma-0 pa-0 fill-height" />
      </div>
    </v-card>
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
          <list-activities ref="listDesktop" class="ma-0 pa-0 fill-height" />
        </v-list>
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
import ListActivities from '~/components/list/activities.vue'

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
        const list = this.$refs.listMobile as InstanceType<typeof ListActivities>
        list.search()
      } else {
        const list = this.$refs.listDesktop  as InstanceType<typeof ListActivities>
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
