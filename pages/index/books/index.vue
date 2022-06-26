<template>
  <div>
    <global-events
      :filter="(event, handler, eventName) => event.altKey || event.ctrlKey"
      @keydown.prevent.ctrl.s="save()"
    />
    <div>
      <div style="display: flex;align-items: center;">
        <icon-combobox v-model="book.status" :items="states" item-value="id" item-text="status"/>
        <h2>{{ book.title }}</h2>
      </div>
      <v-img :src="book.cover" max-height="256" contain />

      <v-text-field
        ref="isbn"
        v-model="book.isbn"
        label="isbn13"
        @change="onChangeISBN(isbn)"
      />
      <v-text-field v-model="book.title" label="title" />
      <v-combobox v-model="book.authors" multiple label="authors" />
      <v-text-field v-model="book.publisher" label="publisher" />
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
      <v-select v-model="book.tags" multiple :items="tagItems" item-value="id" item-text="name" label="tags" :menu-props="{ offsetY: true }" />
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import GlobalEvents from 'vue-global-events'
import { BookRepository } from '../../../js/db/interfaces/BookRepository'
import { TagRepository } from '../../../js/db/interfaces/TagRepository'

export default Vue.extend({
  name: 'BooksIndexPage',
  components: {
    GlobalEvents
  },
  data: () => ({
    activePicker: null,
    menu: false,
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
    }
  }),
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.isbn.focus()
    })
  },
  async beforeMount () {
    const tagRepo: TagRepository = this.$tagRepository
    const tags = await tagRepo.find('')
    this.tagItems = tags[0]

    this.$store.commit('CHANGE_IS_SHOW_SAVE', true)
    this.$store.commit('CHANGE_IS_SHOW_DEL', false)
  },
  methods: {
    barcodeReader () {
      this.$router.push('/barcode-reader')
    },
    dateChanged (date) {
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
      this.book.links.push('')
    },
    delLink () {
      if (confirm('linkを本当に削除しても良いですか？')) {
        this.book.links.pop()
      }
    },
    add () {
      const bookRepo: BookRepository = this.$bookRepository
      bookRepo.store(this.book)
    }
  }
})
</script>
