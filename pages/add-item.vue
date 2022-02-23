<template>
  <v-container>
    <div style="display: flex;align-items: center;">
      <iconCombobox v-model="status" :items="states" />
      <h2>{{ title }}</h2>
    </div>
    <v-tabs icons-and-text centered fixed-tabs height="48">
      <v-tab href="#tab-1">
        Book Info
        <v-icon>mdi-information</v-icon>
      </v-tab>
      <v-tab href="#tab-2">
        Note
        <v-icon>mdi-note</v-icon>
      </v-tab>

      <v-tab-item value="tab-1" class="ma-2">
        <v-img :src="cover" max-height="256" contain />
        <v-select v-model="tags" multiple :items="tagItems" label="tags" :menu-props="{ offsetY: true }" />
        <div style="display: flex;align-items: center;">
          <label class="v-label">rate</label>
          <v-spacer />
          <v-rating v-model="rate" />
        </div>
        <div v-for="(link, index) in links" :key="`${index}-link`">
          <editable-link v-model="links[index]" label="link" />
        </div>
        <div class="mb-2">
          <v-btn text @click="addLink">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn text :disabled="links.length < 2" @click="delLink">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>

        <v-text-field
          v-model="isbn"
          label="isbn13"
          @change="onChangeISBN(isbn)"
        />
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
      </v-tab-item>
      <v-tab-item value="tab-2" class="ma-2">
        <div style="display: flex;align-items: center;">
          <v-select v-model="selectedMemoIndex" :items="memoTitles" />
          <v-btn text class="ml-2" @click="addMemo">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn text :disabled="memos.length < 2" @click="delMemo">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
        <vue-simplemde ref="markdownEditor" v-model="memos[selectedMemoIndex]" :configs="config" />
      </v-tab-item>
    </v-tabs>
    <!-- <v-expansion-panel> -->
    <!--   <v-expansion-panel-header>System Info</v-expansion-panel-header> -->
    <!--   <v-expansion-panel-content> -->
    <!--     <v-text-field v-model="registerdt" label="register date" /> -->
    <!--     <v-text-field v-model="readdt" label="read date" /> -->
    <!--     <v-text-field v-model="update" label="update" /> -->
    <!--   </v-expansion-panel-content> -->
    <!-- </v-expansion-panel> -->
  </v-container>
</template>

<script>
import axios from 'axios'
import iconCombobox from '../components/icon-combobox'
import editableLink from '../components/editable-link'
import { db } from '../js/db'

export default {
  name: 'AddItem',
  components: {
    iconCombobox,
    editableLink
  },
  layout: 'add-item',
  data () {
    return {
      config: { spellChecker: false },
      activePicker: null,
      menu: false,
      selectedMemoIndex: 0,
      states: [
        { text: '読みたい', value: 0, icon: 'mdi-progress-star' },
        { text: '未読', value: 1, icon: 'mdi-progress-clock' },
        { text: '読中', value: 2, icon: 'mdi-progress-check' },
        { text: '読了', value: 3, icon: 'mdi-check' }
      ],
      tagItems: [],
      title: 'タイトル',
      isbn: '',
      authors: [],
      publisher: '',
      publishdt: null,
      cover: '/noimage.png',
      tags: [],
      status: { text: '未読', value: 1, icon: 'mdi-progress-clock' },
      registerdt: null,
      readdt: null,
      update: null,
      rate: 0,
      links: [''],
      memos: ['']
    }
  },
  head: () => ({
    title: '新規登録'
  }),
  computed: {
    memoTitles () {
      return this.memos.map((memo, i) => { return { text: i + ': ' + memo.split(/\r\n|\n/)[0], value: i } })
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  beforeMount () {
    db.tags.orderBy('tag').uniqueKeys()
      .then((keysArray) => {
        this.tagItems = keysArray

        this.isbn = this.$route.query.isbn || ''
        if (this.$route.query.status) {
          const i = Number(this.$route.query.status)
          if (i >= 0 && i < this.states.length) {
            this.status = this.states[i]
          }
        }
        if (this.$route.query.tags) {
          for (const tag of this.$route.query.tags) {
            const i = Number(tag)
            if (i >= 0 && i < this.tagItems.length) {
              this.tags.push(this.tagItems[i])
            }
          }
        }
        this.onChangeISBN(this.isbn)
      })
  },
  methods: {
    barcodeReader () {
      this.$router.push('/barcode-reader')
    },
    save (date) {
      this.$refs.menu.save(date)
    },
    onChangeISBN (value) {
      const isbn = value.replace(/[^0-9]/g, '')
      this.$nextTick(() => {
        this.isbn = isbn
      })
      if (isbn.length === 13) {
        axios.get('https://api.openbd.jp/v1/get?isbn=' + isbn)
          .then((res) => {
            if (res.status === 200) {
              this.title = res.data[0].summary.title
              this.authors = res.data[0].summary.author.split(' ')
              this.publisher = res.data[0].summary.publisher

              if (res.data[0].summary.pubdate.includes('-')) {
                const date = res.data[0].summary.pubdate.split('-')
                const year = date[0] || '2000'
                const month = date[1] || '01'
                const day = date[2] || '01'
                this.publishdt = year + '-' + month + '-' + day
              } else {
                this.publishdt = res.data[0].summary.pubdate.substr(0, 4) +
                  '-' + res.data[0].summary.pubdate.substr(4, 2) +
                  '-' + res.data[0].summary.pubdate.substr(6, 2)
              }

              this.cover = res.data[0].summary.cover || '/noimage.png'
            }
          })
      }
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
    add () {
      const dt = new Date()
      const tz = -dt.getTimezoneOffset() / 60
      const sign = Math.sign(tz) < 0 ? '-' : '+'
      this.registerdt = dt.toISOString().substr(0, 23) + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'
      this.update = this.registerdt
      if (this.status.value === 3) {
        this.readdt = this.registerdt
      }

      db.books.add(
        {
          title: this.title,
          authors: this.authors,
          isbn: this.isbn,
          publisher: this.publisher,
          publishdt: this.publishdt,
          cover: this.cover,
          tags: this.tags,
          status: this.status.value,
          registerdt: this.registerdt,
          readdt: this.readdt,
          update: this.update,
          rate: this.rate,
          links: this.links,
          memos: this.memos
        }
      ).then((result) => {
        sessionStorage.setItem('DBChangeEvent', 'add')
        sessionStorage.setItem('DBChangeEventArg', result)
        this.$router.push('/')
      })
    },
    cancel () {
      this.$router.push('/')
    }
  }
}
</script>
