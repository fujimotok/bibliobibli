<template>
  <v-container>
    <global-events
      :filter="(event, handler, eventName) => event.altKey || event.ctrlKey"
      @keydown.prevent.ctrl.s="put()"
      @keydown.prevent.ctrl.d="remove()"
    />
    <v-file-input ref="fileInput" v-model="file" style="visibility: hidden; width: 0; height: 0;" />
    <div v-if="editNote">
      <vue-simplemde ref="markdownEditor" v-model="memos[selectedMemoIndex]" :configs="config" />
    </div>
    <div v-else>
      <div style="display: flex;align-items: center;">
        <iconCombobox v-model="status" :items="states" />
        <h2>{{ title }}</h2>
      </div>
      <v-img :src="cover" max-height="256" contain />
      <v-select v-model="selectedMemoIndex" :items="memoTitles">
        <template #append-outer>
          <v-btn icon @click="editNote = true">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="addMemo">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn icon :disabled="memos.length < 2" @click="delMemo">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-select>
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
        <v-btn icon @click="addLink">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn icon :disabled="links.length < 2" @click="delLink">
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
      <v-text-field v-model="registerdt" readonly label="register date" />
      <v-text-field v-model="readdt" readonly label="read date" />
      <v-text-field v-model="update" readonly label="update" />
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'
import GlobalEvents from 'vue-global-events'
import iconCombobox from '../components/icon-combobox'
import editableLink from '../components/editable-link'
import { db } from '../js/db'

export default {
  name: 'BookInfo',
  components: {
    iconCombobox,
    editableLink,
    GlobalEvents
  },
  layout: 'show-item',
  data () {
    return {
      config: {
        spellChecker: false,
        forceSync: true,
        indentWithTabs: false,
        toolbar: [
          {
            name: 'custom',
            action: () => { this.editNote = false },
            className: 'fa fa-close',
            title: 'Custom Button'
          },
          '|',
          'bold',
          'italic',
          'strikethrough',
          '|',
          'heading',
          'unordered-list',
          'ordered-list',
          '|',
          'code',
          'quote',
          '|',
          'link',
          {
            name: 'image',
            action: (editor) => {
              const self = this
              this.$refs.fileInput.$refs.input.addEventListener('change', function onChange (e) {
                self.$refs.fileInput.$refs.input.removeEventListener('change', onChange)
                const fileReader = new FileReader()
                fileReader.onload = function () {
                  const dataURI = this.result
                  const cm = editor.codemirror
                  const pos = cm.getCursor('start')
                  cm.replaceRange('![](' + dataURI + ')', { line: pos.line, ch: 0 })
                }
                if (self.file) {
                  fileReader.readAsDataURL(self.file)
                }
              })
              this.$refs.fileInput.$refs.input.click()
            },
            className: 'fa fa-image',
            title: 'image'
          },
          '|',
          'preview'
        ]
      },
      file: null,
      activePicker: null,
      menu: false,
      editNote: false,
      selectedMemoIndex: 0,
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
    db.tags.orderBy('tag').uniqueKeys()
      .then((keysArray) => {
        this.tagItems = keysArray
      })
  },
  methods: {
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

      sessionStorage.setItem('DBChangeEvent', 'update')
      sessionStorage.setItem('DBChangeEventArg', this.id)
      this.$router.push('/')
    },
    remove () {
      if (confirm('本当に削除しても良いですか？')) {
        db.books.delete(this.id)
        sessionStorage.setItem('DBChangeEvent', 'del')
        sessionStorage.setItem('DBChangeEventArg', this.id)
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

<style>
.CodeMirror .CodeMirror-code .cm-header-1 {
    font-size: 110%;
    line-height: 110%;
}

.CodeMirror .CodeMirror-code .cm-header-2 {
    font-size: 110%;
    line-height: 110%;
}

.CodeMirror .CodeMirror-code .cm-header-3 {
    font-size: 110%;
    line-height: 110%;
}

.CodeMirror .CodeMirror-code .cm-header-4 {
    font-size: 110%;
    line-height: 110%;
}

.CodeMirror .CodeMirror-code .cm-comment {
    background: rgba(0, 0, 255, .1);
    border-radius: 2px;
}
</style>
