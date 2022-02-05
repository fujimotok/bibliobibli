<template>
  <v-container>
    <v-card class="justify-center">
      <v-img :src="cover" max-height="256" contain />
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-expansion-panels accordion flat>
        <v-expansion-panel>
          <v-expansion-panel-header>Book Info</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-text-field v-model="isbn" label="isbn13" />
            <v-text-field v-model="title" label="title" />
            <v-combobox v-model="authors" multiple label="authors" />
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
            <v-text-field v-model="cover" label="cover" />
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
      <v-card-actions>
        <v-btn text @click="put">
          更新
        </v-btn>
        <v-btn text @click="remove">
          削除
        </v-btn>
        <v-btn text @click="cancel">
          キャンセル
        </v-btn>
      </v-card-actions>
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
      id: null,
      cover: '',
      title: 'タイトル',
      isbn: '',
      authors: [],
      publisher: '',
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
        this.id = records[0].id
        this.title = records[0].title
        this.isbn = records[0].isbn
        this.authors = records[0].authors
        this.publisher = records[0].publisher
        this.publishdt = records[0].publishdt
        this.cover = records[0].cover
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
    put () {
      const dt = new Date()
      const tz = -dt.getTimezoneOffset() / 60
      const sign = Math.sign(tz) < 0 ? '-' : '+'

      db.books.update(this.id, {
        title: this.title,
        isbn: this.isbn,
        authors: this.authors,
        publisher: this.publisher,
        publishdt: this.publishdt,
        cover: this.cover,
        tags: this.tags,
        status: this.status.value,
        update: dt.toISOString().substr(0, 23) + sign + Math.abs(tz).toString().padStart(2, '0') + ':00',
        rate: this.rate,
        links: this.links,
        memos: this.memos
      })

      this.$router.push('/')
    },
    remove () {
      if (confirm('本当に削除しても良いですか？')) {
        db.books.delete(this.id)
        this.$router.push('/')
      }
    },
    cancel () {
      this.$router.push('/')
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
