<template>
  <v-app>
    <v-app-bar
      :clipped-left="clipped"
      color="primary"
      class="white--text text--lighten-1"
      dense
      fixed
      app
    >
      <v-btn v-show="$router.history.current['path'] !=='/'" color="white" icon @click.stop="$router.go(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <slot />
    </v-app-bar>
    <v-main>
      <Nuxt ref="page" keep-alive :keep-alive-props="{include: cachePageList, max: 2}" />
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
      cachePageList: ['IndexPage'],
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
