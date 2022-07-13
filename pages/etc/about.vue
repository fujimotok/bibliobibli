<template>
  <v-container class="fill-height" fluid>
    <v-card style="width: 100%">
      <v-card-title>
        アプリ情報
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-img src="icon.png" max-width="128" :aspect-ratio="1/1" />
          </v-row>
          <v-row>
            <v-col>アプリ名</v-col><v-col>BIBLIoBIBLI</v-col>
          </v-row>
          <v-row>
            <v-col>バージョン</v-col><v-col>0.0.1</v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card style="width: 100%" class="mt-4">
      <v-card-title>
        使い方
      </v-card-title>
      <v-card-text>
        iOS Safariでホーム画面に追加
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'AboutPage',
  head: () => ({
    title: 'About'
  })
}
</script>
