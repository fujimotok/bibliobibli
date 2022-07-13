<template>
  <div v-if="isMobile"> 
    <activity-list v-if="isRoot" ref="listMobile" v-model="navi" class="ma-0 pa-0 fill-height" @input="naviChanged" />
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
      >
        <activity-list ref="listDesktop" v-model="navi" class="ma-0 pa-0 fill-height" @input="naviChanged" />
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="8"
        lg="8"
        lx="8"
        class="ma-0 pa-0 fill-height"
      >
        <v-card class="overflow-y-auto" :height="cardHeight">
          <div style="padding: 16px;">
            <nuxt-child ref="contentDesktop" class="ma-0 pa-0 fill-height" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
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
      return this.$route.path === '/'
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
    naviChanged (value) {
      this.$store.commit('CHANGE_TITLE', value)
      this.$store.commit('CHANGE_IS_SHOW_SEARCH', value === 'Books' || value === 'Notes' || value === 'Scraps')
      this.$store.commit('CHANGE_IS_SHOW_ADD', value === 'Books' || value === 'Notes' || value === 'Scraps')
    },
    add () {
      switch (this.navi) {
      case 'Books':
        this.$router.push({ path: '/books/'})
        break;
      case 'Notes':
        this.$router.push({ path: '/notes/'})
        break;
      case 'Scraps':
        this.$router.push({ path: '/scraps/'})
        break;
      }
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
    },
    del () {
      console.log('del')
    }
  }
}
</script>
