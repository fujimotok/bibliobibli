<template>
  <v-container>
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
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="publishdt"
                  label="publish date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="publishdt"
                :active-picker.sync="activePicker"
                @change="save"
              />
            </v-menu>
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
            <v-text-field v-model="registerdt" readonly label="register date" />
            <v-text-field v-model="readdt" readonly label="read date" />
            <v-text-field v-model="update" readonly label="update" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script>
import { db } from '../js/db'

export default {
  name: 'BookInfo',
  data () {
    return {
      activePicker: null,
      menu: false,
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
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  beforeMount () {
    db.books.where('id').equals(Number(this.$route.query.index)).toArray()
      .then((records) => {
        this.title = records[0].title
        this.isbn = records[0].isbn
        this.authers = records[0].authers
        this.publisher = records[0].publisher
        this.publishdt = records[0].publishdt
        this.tags = records[0].tags
        this.status = this.states.find(elem => elem.value === records[0].status)
        this.registerdt = this.datestring2localestring(records[0].registerdt)
        this.readdt = this.datestring2localestring(records[0].readdt)
        this.update = this.datestring2localestring(records[0].update)
        this.rate = records[0].rate
        this.links = records[0].links
        this.memos = records[0].memos
      })
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date)
    },

    datestring2localestring (datestr) {
      if (!datestr) {
        return 'Unregistered'
      }

      const ts = Date.parse(datestr)
      const dt = new Date(ts)
      const tz = -dt.getTimezoneOffset() / 60
      dt.setHours(dt.getHours() + tz)
      return dt.toLocaleString()
    }
  }
}
</script>
