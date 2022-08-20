<template>
  <v-app v-if="isMobile" ref="app">
    <v-app-bar
      v-if="hasHeader"
      v-touch="{ down: () => { if ($config.NODE_ENV === 'development') { bottomSheet = true } } }"
      color="primary"
      class="white--text text--lighten-1"
      dense
      app
    >
      <v-btn
        v-if="!isRoot"
        color="white"
        icon
        small
        @click.stop="$router.go(-1)"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title v-if="isRoot" class="mx-2" v-text="listTitle" />
      <v-toolbar-title v-else class="mx-2" v-text="contentTitle" />
      <v-spacer />
      <v-toolbar-title v-show="isRoot" class="mx-2" v-text="count" />
      <v-btn
        v-show="isRoot && hasSearch"
        color="white"
        icon
        small
        class="mx-2"
        @click.stop="search()"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn
        v-show="!isRoot"
        color="white"
        icon
        small
        class="mx-2"
        @click.stop="menu()"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <Nuxt ref="pageMobile" keep-alive :keep-alive-props="{include: cachePageList, max: 2}" />
    </v-main>
    <navi-bottom v-show="isRoot" v-model="selectedNaviItem" app @change="onNaviChanged" />
    <v-bottom-sheet v-model="bottomSheet">
      <v-list dense style="height: 50vh;" class="overflow-y-auto">
        <v-list-item
          v-for="(log, i) in logs"
          :key="i"
        >
          {{ log }}
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </v-app>
  <v-app v-else ref="app">
    <v-app-bar
      clipped-left
      color="primary"
      class="white--text text--lighten-1"
      dense
      app
    >
      <v-btn color="white" icon small @click.stop="$router.go(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn color="white" icon small @click.stop="$router.go(1)">
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
              <v-toolbar-title class="mx-2" v-text="listTitle" />
              <v-spacer />
              <v-toolbar-title class="mx-2" v-text="count" />
              <v-btn
                v-show="hasSearch"
                color="white"
                icon
                small
                class="mx-2"
                @click.stop="search()"
              >
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
              <v-toolbar-title class="mx-4" v-text="contentTitle" />
              <v-spacer />
              <v-btn color="white" icon small class="mx-2" @click.stop="menu()">
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
      <navi-left v-model="selectedNaviItem" @change="onNaviChanged" />
    </v-navigation-drawer>
    <v-main>
      <Nuxt ref="pageDesktop" keep-alive :keep-alive-props="{include: cachePageList, max: 2}" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export type DataType = {
  cachePageList: string[]
  selectedNaviItem: string
  hasSearch: boolean
  bottomSheet: boolean
  logs: string[]
}

export interface Page extends Vue {
  search(): void
  menu(): void
}

export default Vue.extend({
  name: 'DefaultLayout',
  data (): DataType {
    return {
      cachePageList: ['IndexPage'],
      selectedNaviItem: "Activity",
      hasSearch: true,
      bottomSheet: false,
      logs: []
    }
  },
  computed: {
    isMobile (){
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      return xs || sm
    },
    isRoot (){
      switch (this.$route.path) {
        case '/':
        case '/books':
        case '/books/':
        case '/notes':
        case '/notes/':
        case '/scraps':
        case '/scraps/':
        case '/etc':
        case '/etc/':
          return true
        default:
          return false
      }
    },
    listTitle () {
      return this.$store.state.listTitle
    },
    contentTitle () {
      return this.$store.state.contentTitle
    },
    count () {
      return this.$store.state.searchCount
    },
    hasHeader () {
      return this.$store.state.hasHeader
    },
  },
  watch:{
    $route (to, _){
      this.onRouteChanged(to.path)
    }
  },
  mounted () {
    this.logs = '$logHistory' in this ? this.$logHistory() : []
    this.onRouteChanged(this.$route.path)

    // Global click event handler for a tag
    document.addEventListener("click", (event: MouseEvent) => {
      const element = event.target as HTMLAnchorElement
      if (element.tagName === 'A') {
        const path = element.href
        const reg = new RegExp('^(https?:)?//'+document.domain);

        if (path.match(reg) || path.charAt(0) === '/') {
          this.$router.push(path.replace(reg, ''))
          event.preventDefault()
        }
      }
    })
  },
  methods: {
    search () {
      if (this.isMobile) {
        const elem = this.$refs.pageMobile as Vue
        const page = elem.$children.find((e: any) => !(e._inactive)) as Page
        page.search()
      } else {
        const elem = this.$refs.pageDesktop as Vue
        const page = elem.$children.find((e: any) => !(e._inactive)) as Page
        page.search()
      }
    },
    menu () {
      if (this.isMobile) {
        const elem = this.$refs.pageMobile as Vue
        const page = elem.$children.find((e: any) => !(e._inactive)) as Page
        page.menu()
      } else {
        const elem = this.$refs.pageDesktop as Vue
        const page = elem.$children.find((e: any) => !(e._inactive)) as Page
        page.menu()
      }
    },
    onNaviChanged (value: string)  {
      switch (value) {
        case 'Activity':
          this.$router.push('/')
          break;
        case 'Books':
          this.$router.push('/books/')
          break;
        case 'Notes':
          this.$router.push('/notes/')
          break;
        case 'Scraps':
          this.$router.push('/scraps/')
          break;
        case 'Etc':
          this.$router.push('/etc/')
          break;
      }
    },
    onRouteChanged (route: string) {
      switch(route.split('/')[1])
      {
        case 'books':
          this.hasSearch = true;
          this.selectedNaviItem = 'Books'
          this.$store.commit('CHANGE_LIST_TITLE', 'Books')
          break
        case 'notes':
          this.hasSearch = true;
          this.selectedNaviItem = 'Notes'
          this.$store.commit('CHANGE_LIST_TITLE', 'Notes')
          break
        case 'scraps':
          this.hasSearch = true;
          this.selectedNaviItem = 'Scraps'
          this.$store.commit('CHANGE_LIST_TITLE', 'Scraps')
          break
        case 'etc':
          this.hasSearch = false;
          this.selectedNaviItem = 'Etc'
          this.$store.commit('CHANGE_LIST_TITLE', 'Etc')
          this.$store.commit('CHANGE_SEARCH_COUNT', '')
          break
        default:
          this.hasSearch = false;
          this.selectedNaviItem = 'Activity'
          this.$store.commit('CHANGE_LIST_TITLE', 'Activity')
          this.$store.commit('CHANGE_SEARCH_COUNT', '')
      }
    }
  }
})
</script>

<style>
</style>
