<template>
  <v-container fluid style="height: 100%; background: #808080;">
    <v-row justify="center" align="center">
      <v-col>
        <v-card class="logo py-4 d-flex justify-center">
          <p>params: {{ $route.params.id }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'BooksPage',
  head: () => ({
    title: 'book'
  }),
  mounted () {
    this.$store.commit('CHANGE_IS_SHOW_SAVE', true)
    this.$store.commit('CHANGE_IS_SHOW_DEL', true)
    if (this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm)
    {
      this.$store.commit('CHANGE_IS_SHOW_LEFT_MENU', false)
    }
  }
}
</script>
