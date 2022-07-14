<template>
  <div v-if="isMobile">
    <!-- mobileの時はlistにoverflow指定しないようにしてwindowのスクロールに任せる -->
    <div v-if="isRoot">
      <v-list style="padding-bottom: 80px;">
        <list-note ref="listMobile" class="ma-0 pa-0 fill-height" />
      </v-list>
      <div style="position: fixed; bottom: 100px; right: 16px;">
        <v-btn
          elevation="2"
          fab
          color="secondary"
          @click="add"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
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
        style="position: relative;"
      >
        <!-- desktopの時はlistにoverflow指定して個別のスクロール -->
        <v-list class="overflow-y-auto" style="position: absolute; height: 100%; width: 100%">
          <list-note ref="listDesktop" class="ma-0 pa-0 fill-height" />
        </v-list>
        <div style="position: absolute; bottom: 32px; right: 32px;">
          <v-btn
            elevation="2"
            fab
            small
            color="secondary"
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
  name: 'IndexPage',
  data: () => ({
    navi: 'activity',
    cardHeight: 0
  }),
  computed: {
    isMobile (){
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      return xs || sm
    },
    isRoot (){
      return this.$route.path === '/notes/'
    }
  },
  mounted () {
  },
  methods: {
    add () {
      this.$router.push({ path: '/notes/new'})
    },
    search () {
      if (this.isMobile) {
        this.$refs.listMobile.search()
      } else {
        this.$refs.listDesktop.search()
      }
    },
    save () {
      if (this.isMobile) {
        this.$refs.contentMobile.save()
      } else {
        this.$refs.contentDesktop.save()
      }
    }
  }
})
</script>
