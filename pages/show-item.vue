<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="justify-center">
        <v-card-title>
          {{ title }}
        </v-card-title>
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>Book Info</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field v-model="isbn" label="isbn13" />
              <v-text-field v-model="title" label="title" />
              <v-combobox v-model="authers" multiple label="authers" />
              <v-text-field v-model="publisher" label="publisher" />
              <v-text-field v-model="publishdt" label="publish date" />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>User Info</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-combobox v-model="tags" multiple label="tags" />
              <v-combobox v-model="status" :items="states" label="status" />
              <v-rating v-model="rate" label="rate" />
              <div v-for="(link, index) in links" :key="link">
                <v-text-field v-model="links[index]" label="link" />
              </div>
              <div v-for="(memo, index) in memos" :key="memo">
                <v-textarea v-model="memos[index]" label="memo" />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>System Info</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field v-model="registerdt" label="register date" />
              <v-text-field v-model="readdt" label="read date" />
              <v-text-field v-model="update" label="update" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'BookInfo',
  data () {
    return {
      states: [{ text: '読みたい', value: 0 }, { text: '未読', value: 1 }, { text: '読中', value: 2 }, { text: '読了', value: 3 }],
      id: this.$route.params.id,
      title: 'titletitletitletitletitletitletitletitletitletitletitletitletitle',
      isbn: '9780123456789',
      authers: ['hoge', 'fuga'],
      publisher: '出版社',
      publishdt: '2002-04-06T00:00:00',
      tags: ['programming', 'javascript'],
      status: { text: '未読', value: 1 },
      registerdt: '2009-12-06T09:00:00',
      readdt: '2009-12-06T09:00:00',
      update: '2012-09-06T09:00:00',
      rate: 4,
      links: ['http://hoge.com'],
      memos: ['hoge\nfuga\n', 'piyo']
    }
  },
  head: () => ({
    title: '書籍情報'
  })
}
</script>
