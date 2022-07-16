<template>
  <div v-if="isMobile">
    <!-- mobileの時はlistにoverflow指定しないようにしてwindowのスクロールに任せる -->
    <div v-if="isRoot">
      <v-list style="padding-bottom: 80px;">
        <list-etc ref="listMobile" class="ma-0 pa-0 fill-height" />
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
        <!-- desktopの時はlistにoverflow指定して個別のスクロール -->
        <v-list class="overflow-y-auto" style="position: absolute; height: 100%; width: 100%">
          <list-etc ref="listDesktop" class="ma-0 pa-0 fill-height" />
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
        <!-- desktopの時はlistにoverflow指定して個別のスクロール -->
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

export default Vue.extend({
  name: 'EtcPage',
  data: () => ({
  }),
  computed: {
    isMobile (): boolean {
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      return xs || sm
    },
    isRoot (): boolean {
      return this.$route.path === '/etc/'
    }
  },
  mounted () {
  },
  methods: {
  }
})
</script>
