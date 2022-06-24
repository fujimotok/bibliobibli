<template>
  <v-container class="ma-0 pa-0 fill-height" fluid>
    <v-row class="ma-0 pa-0 fill-height" no-gutters>
      <v-col
        v-show="hasList"
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
        v-show="hasDetail"
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
    hasList () {
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      const root = this.$route.path === '/'
      return root ? true : !(xs || sm)
    },
    hasDetail () {
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      const root = this.$route.path === '/'
      return root ? !(xs || sm) : true
    }
  }
}
</script>
