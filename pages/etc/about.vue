<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col>
        {{ $t('aboutTitle') }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card style="width: 100%">
          <v-card-text>
            <v-container>
              <v-row justify="center">
                <v-img src="../icon.png" max-width="128" :aspect-ratio="1/1" />
              </v-row>
              <v-row>
                <v-col>{{ $t('aboutName') }}</v-col><v-col style="text-align: end;">
                  BIBLIoBIBLI
                </v-col>
              </v-row>
              <v-row>
                <v-col>{{ $t('aboutVersion') }}</v-col><v-col style="text-align: end;">
                  0.0.1
                </v-col>
              </v-row>
              <v-row>
                <v-col>{{ $t('aboutWeb') }}</v-col><v-col style="text-align: end;">
                  <a href="https://github.com/fujimotok/bibliobibli">github.com/fujimotok/bibliobibli</a>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AboutPage',
  beforeMount () {
    this.$store.commit('CHANGE_CONTENT_TITLE', 'About')
  },
  methods: {
    menu(){}
  }
})
</script>
