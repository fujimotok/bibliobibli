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

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DiaryPage'
})
</script>
