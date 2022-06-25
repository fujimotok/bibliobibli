<template>
  <div v-if="isMobile"> 
    <main-list v-if="isRoot" class="ma-0 pa-0 fill-height" />
    <nuxt-child v-else/>
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
        <main-list class="ma-0 pa-0 fill-height" />
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="8"
        lg="8"
        lx="8"
      >
        <nuxt-child />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'IndexPage',
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
  }
}
</script>
