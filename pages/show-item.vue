<template>
  <v-container>
    <v-card class="justify-center">
      <div style="display: flex;align-items: start;">
        <iconCombobox v-model="status" :items="states" />
        <v-img :src="cover" max-height="256" contain />
      </div>
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
                :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                min="1950-01-01"
                @change="save"
              />
            </v-menu>
            <v-text-field v-model="cover" label="cover" />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>User Info</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-combobox v-model="tags" multiple :items="tagItems" label="tags" />
            <div style="display: flex;align-items: center;">
              <label class="v-label">rate</label>
              <v-spacer />
              <v-rating v-model="rate" />
            </div>
            <draggable
              v-model="links"
              :options="{handle: '.item-handle'}"
            >
              <div v-for="(link, index) in links" :key="`${index}-link`">
                <v-text-field v-model="links[index]" label="link">
                  <v-icon slot="prepend" class="item-handle">
                    mdi-arrow-up-down-bold
                  </v-icon>
                </v-text-field>
              </div>
            </draggable>
            <v-btn text @click="addLink">
              追加
            </v-btn>
            <v-btn text :disabled="links.length < 2" @click="delLink">
              削除
            </v-btn>
            <v-expansion-panels flat>
              <draggable
                v-model="memos"
                :options="{handle: '.item-handle'}"
              >
                <v-expansion-panel v-for="(memo, index) in memos" :key="`${index}-memo`">
                  <v-expansion-panel-header class="item-handle">
                    <div>
                      <v-icon>
                        mdi-arrow-up-down-bold
                      </v-icon>
                      {{ memo.split(/\r\n|\n/)[0] }}
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <vue-simplemde ref="markdownEditor" v-model="memos[index]" />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </draggable>
            </v-expansion-panels>
            <v-btn text @click="addMemo">
              追加
            </v-btn>
            <v-btn text :disabled="memos.length < 2" @click="delMemo">
              削除
            </v-btn>
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
import draggable from 'vuedraggable'
import iconCombobox from '../components/icon-combobox'
import { db } from '../js/db'

export default {
  name: 'BookInfo',
  components: {
    draggable,
    iconCombobox
  },
  layout: 'show-item',
  data () {
    return {
      activePicker: null,
      menu: false,
      states: [{ text: '読みたい', value: 0, icon: 'mdi-progress-star' }, { text: '未読', value: 1, icon: 'mdi-progress-clock' }, { text: '読中', value: 2, icon: 'mdi-progress-check' }, { text: '読了', value: 3, icon: 'mdi-check' }],
      tagItems: [],
      id: null,
      cover: '',
      title: 'タイトル',
      isbn: '',
      authors: [],
      publisher: '',
      publishdt: null,
      tags: [],
      status: { text: '未読', value: 1, icon: 'mdi-progress-clock' },
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
    db.books.orderBy('tags').uniqueKeys()
      .then((keysArray) => {
        this.tagItems = keysArray
      })
  },

  methods: {
    save (date) {
      this.$refs.menu.save(date)
    },
    addLink () {
      this.links.push('')
    },
    delLink () {
      if (confirm('linkを本当に削除しても良いですか？')) {
        this.links.pop()
      }
    },
    addMemo () {
      this.memos.push('')
    },
    delMemo () {
      if (confirm('memoを本当に削除しても良いですか？')) {
        this.memos.pop()
      }
    },
    put () {
      const dt = new Date()
      const tz = -dt.getTimezoneOffset() / 60
      const sign = Math.sign(tz) < 0 ? '-' : '+'

      let beforState
      db.books.where('id').equals(Number(this.$route.query.index)).toArray()
        .then((records) => {
          beforState = records[0].status
        })

      if (beforState !== 3 && this.status.value === 3) {
        this.readdt = dt.toISOString().substr(0, 23) + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'
      }

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
        readdt: this.readdt,
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
