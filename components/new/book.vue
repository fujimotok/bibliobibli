<template>
  <div>
    <div v-if="barcode === false">
      <div style="display: flex;align-items: center;">
        <icon-combobox v-model="book.status" :items="states" item-value="id" item-text="status" />
        <h2>{{ book.title }}</h2>
      </div>
      <v-img :src="book.cover" max-height="160" contain />

      <v-text-field
        ref="isbn"
        v-model="book.isbn"
        label="isbn13"
        append-outer-icon="mdi-barcode-scan"
        @change="onChangeISBN"
        @click:append-outer="barcode = true"
      />
      <v-text-field v-model="book.title" label="title" />
      <v-combobox v-model="book.authors" multiple label="authors" />
      <v-text-field v-model="book.publisher" label="publisher" />
      <v-menu
        ref="datePickerMenu"
        v-model="datePickerMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="book.publishedAt"
            label="publish date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <v-date-picker
          v-model="book.publishedAt"
          :active-picker.sync="activePicker"
          :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
          min="1950-01-01"
          @change="dateChanged"
        />
      </v-menu>
      <v-text-field v-model="book.cover" label="cover" />
      <v-select
        v-model="book.tags"
        multiple
        :items="tagItems"
        item-value="id"
        item-text="name"
        label="tags"
        :menu-props="{ offsetY: true }"
      />
      <div v-for="(link, index) in book.links" :key="`${index}-link`">
        <editable-link v-model="book.links[index]" label="link" />
      </div>
      <div class="mb-2">
        <v-btn icon @click="addLink">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn icon :disabled="book.links.length < 2" @click="delLink">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-else>
      <barcode-scanner v-model="code" />
      <div class="center">
        <v-btn class="ma-2" @click="barcode = false">
          スキャンをやめる
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
import axios from 'axios'
import { BookRepository, Book } from '~/js/db/interfaces/BookRepository'
import { TagRepository } from '~/js/db/interfaces/TagRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  activePicker: string | undefined
  datePickerMenu: boolean
  states: object[]
  tagItems: object[]
  book: Book
  barcode: boolean
  code: string
}

export interface VMenu extends Vue {
  save(value: any): void
}

export default Mixin.extend({
  name: 'BooksNewPage',
  data(): DataType {
    return {
      barcode: false,
      code: '',
      activePicker: undefined,
      datePickerMenu: false,
      states: [
        { text: '読みたい', value: 0, icon: 'mdi-progress-star' },
        { text: '未読', value: 1, icon: 'mdi-progress-clock' },
        { text: '読中', value: 2, icon: 'mdi-progress-check' },
        { text: '読了', value: 3, icon: 'mdi-check' }
      ],
      tagItems: [],
      book: {
        id: 0,
        createdAt: '',
        updatedAt: '',
        isbn: '',
        title: 'title',
        authors: [''],
        publisher: '',
        publishedAt: '',
        cover: '/noimage.png',
        status: 0,
        readAt: '',
        links: [''],
        tags: [],
      },
    }
  },
  watch: {
    datePickerMenu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
    code (val) {
      if (val.startsWith('978') || val.startsWith('979')) {
        this.barcode = false
        this.book.isbn = val
        this.onChangeISBN(this.book.isbn)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      const el = this.$refs.isbn as HTMLElement
      el.focus()
    })
    
    if (this.$route.query.isbn) {
      this.book.isbn = this.$route.query.isbn as string
      this.onChangeISBN(this.book.isbn)
    }
  },
  async beforeMount () {
    const tagRepo: TagRepository = this.$tagRepository
    await tagRepo.find('', 0, 0).then((tags) => {
      if (tags !== undefined) {
        this.tagItems = tags[0]
      }
    })
  },
  deactivated () {
    this.barcode = false
  },
  methods: {
    dateChanged (date: string) {
      const menu = this.$refs.datePickerMenu as VMenu
      menu.save(date)
    },
    onChangeISBN (value: string) {
      let isbn = value.replace(/[^0-9]/g, '')
      
      switch (isbn.length) {
        case 9:
          isbn = this.checkDigit('978' + isbn)
          break;
        case 10:
          isbn = this.checkDigit('978' + isbn.slice(0, 9))
          break;
        case 12:
          isbn = this.checkDigit(isbn)
          break;
        case 13:
        default:
          break;
      }
      
      this.$nextTick(() => {
        this.book.isbn = isbn
      })

      if (isbn.length === 13) {
        axios.get('https://api.openbd.jp/v1/get?isbn=' + isbn)
          .then((res) => {
            if (res.status === 200) {
              this.book.title = res.data[0].summary.title
              this.book.authors = res.data[0].summary.author.split(' ')
              this.book.publisher = res.data[0].summary.publisher
              
              if (res.data[0].summary.pubdate.includes('-')) {
                const date = res.data[0].summary.pubdate.split('-')
                const year = date[0] || '2000'
                const month = date[1] || '01'
                const day = date[2] || '01'
                this.book.publishedAt = year + '-' + month + '-' + day
              } else {
                this.book.publishedAt = res.data[0].summary.pubdate.substr(0, 4) +
                  '-' + res.data[0].summary.pubdate.substr(4, 2) +
                  '-' + res.data[0].summary.pubdate.substr(6, 2)
              }
              
              this.book.cover = res.data[0].summary.cover || '/noimage.png'
            }
          })
      }
    },
    checkDigit (isbn12: string): string {
      const sum = isbn12.split('').map(s => parseInt(s))
        .reduce((p, c, i) => p + ((i % 2 === 0) ? c : c * 3));
      
      const rem = 10 - sum % 10;
      const checkdigit = rem === 10 ? 0 : rem;

      return `${isbn12}${checkdigit}`;
    },
    addLink () {
      this.book.links.push('')
    },
    delLink () {
      if (confirm(this.$t('bookLinkDeleteConfirm').toString())) {
        this.book.links.pop()
      }
    },
    async save () {
      const bookRepo: BookRepository = this.$bookRepository
      const ret = await bookRepo.store(this.book)
      if (ret) {
        await this.recordActivity(`/books/${ret.id}`,
                                  this.$t('bookCreateActivityTitle').toString(),
                                  this.$t('bookCreateActivityContent', {name: ret.title}).toString())
      }
      this.close()
    },
    close () {
      this.barcode = false
      this.code = ''
      this.book = {
        id: 0,
        createdAt: '',
        updatedAt: '',
        isbn: '',
        title: 'title',
        authors: [''],
        publisher: '',
        publishedAt: '',
        cover: '/noimage.png',
        status: 0,
        readAt: '',
        links: [''],
        tags: [],
      }
    }
  }
})
</script>

<style scoped>
.center {
    text-align: center;
}
</style>
