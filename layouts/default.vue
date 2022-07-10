<template>
  <v-app v-if="isMobile" ref="app">
    <v-app-bar
      color="primary"
      class="white--text text--lighten-1"
      dense
      app
    >
      <v-toolbar-title class="mx-2" v-text="title" />
      <v-spacer />
      <v-btn color="white" icon small class="mx-2" @click="add()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <Nuxt ref="page" keep-alive :keep-alive-props="{include: cachePageList, max: 2}" />
    </v-main>
    <bottom-navi v-model="selectedNaviItem" />
  </v-app>
  <v-app v-else ref="app">
    <v-app-bar
      clipped-left
      color="primary"
      class="white--text text--lighten-1"
      dense
      app
    >
      <v-btn color="white" icon small @click="add()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn color="white" icon small @click="add()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-container class="ml-2 pa-0 fill-height" fluid>
        <v-row>
          <v-col
            xs="12"
            sm="12"
            md="4"
            lg="4"
            lx="4"
          >
            <v-row>
              <v-toolbar-title class="mx-2" v-text="title" />
              <v-spacer />
              <v-btn color="white" icon small class="mx-2" @click="add()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-row>
          </v-col>
          <v-col
            xs="12"
            sm="12"
            md="8"
            lg="8"
            lx="8"
          >
            <v-row>
              <v-divider vertical />
              <v-toolbar-title class="mx-2" v-text="title" />
              <v-spacer />
              <v-btn color="white" icon small class="mx-2" @click="add()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-navigation-drawer
      mini-variant
      clipped
      permanent
      hide-overlay
      app
    >
      <left-navi v-model="selectedNaviItem" />
    </v-navigation-drawer>
    <v-main>
      <Nuxt ref="page" keep-alive :keep-alive-props="{include: cachePageList, max: 2}" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DefaultLayout',
  data () {
    return {
      cachePageList: ['IndexPage'],
      innerSelectedNaviItem: "Activity"
    }
  },
  computed: {
    isMobile (){
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      return xs || sm
    },
    selectedNaviItem: {
      get () {
        const self:any = this
        return self.innerSelectedNaviItem
      },
      set (value) {
        const self:any = this
        self.innerSelectedNaviItem = value
        switch (value) {
        case "Activity":
          this.$router.push("/activity/")
          break;
        case "Books":
          this.$router.push("/books/")
          break;
        case "Notes":
          this.$router.push("/notes/")
          break;
        case "Scraps":
          this.$router.push("/scraps/")
          break;
        case "Etc":
          this.$router.push("/etc/")
          break;
        }
      }
    },
    isRoot (){
      return this.$route.path === '/'
    },
    title () {
      return this.$store.state.title
    },
    count () {
      return this.$store.state.searchCount
    },
    isShowAdd () {
      return this.$store.state.isShowAdd
    },
    isShowSearch () {
      return this.$store.state.isShowSearch
    },
    isShowSave () {
      return this.$store.state.isShowSave
    },
    isShowDel () {
      return this.$store.state.isShowDel
    },
    isShowBack () {
      return this.$store.state.isShowBack
    },
  },
  methods: {
    add () {
      const self:any = this
      self.$refs.page.$children[0].add()
    },
    search () {
      const self:any = this
      self.$refs.page.$children[0].search()
    },
    save () {
      const self:any = this
      self.$refs.page.$children[0].save()
    },
    del () {
      const self:any = this
      self.$refs.page.$children[0].del()
    }
  }
})
</script>

<style>
</style>
