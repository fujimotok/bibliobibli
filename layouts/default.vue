<template>
  <v-app v-if="isMobile" ref="app">
    <v-app-bar
      color="primary"
      class="white--text text--lighten-1"
      dense
      app
    >
      <v-btn
        v-show="!isRoot"
        color="white"
        icon
        small
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title class="mx-2" v-text="title" />
      <v-spacer />
      <v-btn
        v-show="isRoot"
        color="white"
        icon
        small
        class="mx-2"
        @click="add()"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn
        v-show="!isRoot"
        color="white"
        icon
        small
        class="mx-2"
        @click="add()"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <Nuxt ref="page" keep-alive :keep-alive-props="{include: cachePageList, max: 2}" />
    </v-main>
    <bottom-navi v-model="selectedNaviItem" app @change="onNaviChanged" />
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
                <v-icon>mdi-magnify</v-icon>
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
                <v-icon>mdi-dots-vertical</v-icon>
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
      <left-navi v-model="selectedNaviItem" @change="onNaviChanged" />
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
      selectedNaviItem: "Activity"
    }
  },
  computed: {
    isMobile (){
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      return xs || sm
    },
    isRoot (){
      return this.$route.path === '/' || this.$route.path === '/books/' || this.$route.path === '/notes/' || this.$route.path === '/scraps/' || this.$route.path === '/etc/'
    },
    title () {
      return this.$store.state.title
    },
    count () {
      return this.$store.state.searchCount
    },
  },
  watch:{
    $route (to, _){
      const self:any = this
      switch(to.path.split('/')[1])
      {
        case 'books':
          self.selectedNaviItem = "Books"
          break
        case 'notes':
          self.selectedNaviItem = "Notes"
          break
        case 'scraps':
          self.selectedNaviItem = "Scrapss"
          break
        case 'etc':
          self.selectedNaviItem = "Etc"
          break
        default:
          self.selectedNaviItem = "Activity"
      }
    }
  },
  mounted () {
    const self:any = this
    switch(self.$route.path.split('/')[1])
    {
      case 'books':
        self.selectedNaviItem = "Books"
        break
      case 'notes':
        self.selectedNaviItem = "Notes"
        break
      case 'scraps':
        self.selectedNaviItem = "Scrapss"
        break
      case 'etc':
        self.selectedNaviItem = "Etc"
        break
      default:
        self.selectedNaviItem = "Activity"
    }
  },
  methods: {
    search () {
      const self:any = this
      self.$refs.page.$children[0].search()
    },
    menu () {
      const self:any = this
      self.$refs.page.$children[0].menu()
    },
    onNaviChanged (value: string)  {
      switch (value) {
        case "Activity":
          this.$router.push("/")
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
  }
})
</script>

<style>
</style>
