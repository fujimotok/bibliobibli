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
import { db } from '../js/db'

export default {
  name: 'BookInfo',

  data () {
    return {
      states: [{ text: '読みたい', value: 0 }, { text: '未読', value: 1 }, { text: '読中', value: 2 }, { text: '読了', value: 3 }],
      id: this.$route.params.id,
      title: null,
      isbn: null,
      authers: [],
      publisher: null,
      publishdt: null,
      tags: [],
      status: { text: '未読', value: 1 },
      registerdt: null,
      readdt: null,
      update: null,
      rate: 0,
      links: [],
      memos: []
    }
  },
  head: () => ({
    title: '書籍情報'
  }),
  beforeMount () {
    db.books.where('id').equals(Number(this.$route.query.index)).toArray()
      .then((records) => {
        this.title = records[0].title
        this.isbn = records[0].isbn
        this.authers = records[0].authers
        this.publisher = records[0].publisher
        this.publishdt = records[0].publishdt
        this.tags = records[0].tags
        this.status = records[0].status
        this.registerdt = records[0].registerdt
        this.readdt = records[0].readdt
        this.update = records[0].update
        this.rate = records[0].rate
        this.links = records[0].links
        this.memos = records[0].memos
      })
  }
}
</script>
