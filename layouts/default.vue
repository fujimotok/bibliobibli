<template>
<v-app ref="app">
  <v-app-bar
    :clipped-left="clipped"
    color="primary"
    class="white--text text--lighten-1"
    dense
    fixed
    app
    >
    <v-btn v-show="isShowBack" color="white" icon small @click.stop="$router.go(-1)">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-toolbar-title class="mx-4 pa-0" v-text="title" />
    <v-btn v-show="isShowAdd" color="white" icon small class="mx-2" @click="add()">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn v-show="isShowSearch" color="white" icon small class="mx-2" @click="search()">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <div v-show="isShowSearch">
      {{ count }} hit
    </div>
    <v-spacer />
    <v-btn v-show="isShowSave" color="white" icon small class="mx-2" @click="save()">
      <v-icon>mdi-content-save</v-icon>
    </v-btn>
    <v-btn v-show="isShowDel" color="white" icon small class="mx-2" @click="del()">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
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
      rightDrawer: false,
    }
  },
  computed: {
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
      this.$refs.page.$children[0].add()
    },
    search () {
      this.$refs.page.$children[0].search()
    },
    save () {
      this.$refs.page.$children[0].put()
    },
    del () {
      this.$refs.page.$children[0].remove()
    }
  }
}
</script>
