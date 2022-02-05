<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="clipped"
      color="primary"
      class="white--text text--lighten-1"
      fixed
      app
    >
      <v-app-bar-nav-icon v-if="$router.history.current['path'] =='/'" color="white" @click.stop="drawer = !drawer" />
      <v-btn v-else color="white" icon @click.stop="$router.go(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-cog',
          title: 'Settings',
          to: '/settings'
        },
        {
          icon: 'mdi-information',
          title: 'About',
          to: '/about'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false
    }
  },
  computed: {
    title () {
      const matchedRoute = this.$route.matched[0] // マッチしたrouteを取得
      const headInfo = matchedRoute.components.default.options.head() // 該当routeのdefault componentのhead情報を取得
      return headInfo ? headInfo.title : ''
    }
  }
}
</script>
