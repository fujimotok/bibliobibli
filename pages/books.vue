<template>
  <div v-if="isMobile">
    <!-- mobileの時はlistにoverflow指定しないようにしてwindowのスクロールに任せる -->
    <div v-if="isRoot">
      <v-list style="padding-bottom: 80px;">
        <book-list ref="listMobile" v-model="navi" class="ma-0 pa-0 fill-height" />
      </v-list>
      <div style="position: fixed; bottom: 100px; right: 16px;">
        <v-btn
          elevation="2"
          fab
          color="secondary"
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
          <book-list ref="listDesktop" v-model="navi" class="ma-0 pa-0 fill-height" @input="naviChanged" />
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
  beforeRouteUpdate(to, from, next) {
    console.log(from)

    this.$store.commit('CHANGE_IS_SHOW_BACK', to.path !== '/')

    switch (this.navi) {
      case 'Books':
      case 'Notes':
      case 'Scraps':
        this.$store.commit('CHANGE_IS_SHOW_SEARCH', true)
        this.$store.commit('CHANGE_IS_SHOW_ADD', true)
        break;
      default:
        this.$store.commit('CHANGE_IS_SHOW_SEARCH', false)
        this.$store.commit('CHANGE_IS_SHOW_ADD', false)
    }

    if (this.isMobile)
    {
      if (to.path === '/')
      {
        // hide right menu
        this.$store.commit('CHANGE_IS_SHOW_SAVE', false)
        this.$store.commit('CHANGE_IS_SHOW_DEL', false)

      }
      else
      {
        // hide left menu
        this.$store.commit('CHANGE_IS_SHOW_SEARCH', false)
        this.$store.commit('CHANGE_IS_SHOW_ADD', false)
      }
    }
    next()
  },
  layout: 'default',
  data: () => ({
    navi: 'activity',
    cardHeight: 0
  }),
  head: () => ({
    title: 'index'
  }),
  computed: {
    isMobile (){
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      return xs || sm
    },
    isRoot (){
      return this.$route.path === '/books/'
    }
  },
  mounted () {
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  methods: {
    resize () {
      this.cardHeight = window.innerHeight - 48
    },
    add () {
      this.$router.push({ path: '/books/new'})
    },
    search () {
      if (this.isMobile) {
        this.$refs.listMobile.search()
      } else {
        this.$refs.listDesktop.search()
      }
    },
    save () {
    },
    del () {
      console.log('del')
    }
  }
})
</script>
