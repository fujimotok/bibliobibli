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
            <v-text-field
              v-model="isbn"
              :rules="[rules.counter]"
              type="number"
              counter="13"
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
            <v-combobox v-model="status" :items="states" label="status" />
            <div style="display: flex;align-items: center;">
              <label class="v-label">rate</label>
              <v-spacer />
              <v-rating v-model="rate" />
            </div>
            <draggable
              v-model="links"
            >
              <div v-for="(link, index) in links" :key="`${index}-link`">
                <v-text-field v-model="links[index]" label="link" />
              </div>
            </draggable>
            <v-btn text @click="addLink">
              追加
            </v-btn>
            <v-btn text :disabled="links.length < 2" @click="delLink">
              削除
            </v-btn>
            <draggable
              v-model="memos"
            >
              <div v-for="(memo, index) in memos" :key="`${index}-memo`">
                <v-textarea v-model="memos[index]" label="memo" />
              </div>
            </draggable>
            <v-btn text @click="addMemo">
              追加
            </v-btn>
            <v-btn text :disabled="memos.length < 2" @click="delMemo">
              削除
            </v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <!-- <v-expansion-panel> -->
        <!--   <v-expansion-panel-header>System Info</v-expansion-panel-header> -->
        <!--   <v-expansion-panel-content> -->
        <!--     <v-text-field v-model="registerdt" label="register date" /> -->
        <!--     <v-text-field v-model="readdt" label="read date" /> -->
        <!--     <v-text-field v-model="update" label="update" /> -->
        <!--   </v-expansion-panel-content> -->
        <!-- </v-expansion-panel> -->
      </v-expansion-panels>
      <v-card-actions>
        <v-btn text @click="add">
          登録
        </v-btn>
        <v-btn text @click="cancel">
          キャンセル
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-btn
      color="secondary"
      fab
      fixed
      right
      bottom
      @click="barcodeReader"
    >
      <v-icon>mdi-camera</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'
import { db } from '../js/db'

export default {
  name: 'AddItem',
  components: {
    draggable
  },
  data () {
    return {
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 13 || 'Max 13 characters',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      },
      activePicker: null,
      menu: false,
      states: [{ text: '読みたい', value: 0 }, { text: '未読', value: 1 }, { text: '読中', value: 2 }, { text: '読了', value: 3 }],
      tagItems: [],
      id: this.$route.params.id,
      title: 'タイトル',
      isbn: '',
      authors: [],
      publisher: '',
      publishdt: null,
      cover: '/noimage.png',
      tags: [],
      status: { text: '未読', value: 1 },
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
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  beforeMount () {
    db.books.orderBy('tags').uniqueKeys()
      .then((keysArray) => {
        this.tagItems = keysArray
      })
  },
  methods: {
    barcodeReader () {
      this.$router.push('/barcode-reader')
    },
    save (date) {
      this.$refs.menu.save(date)
    },
    onChangeISBN (isbn) {
      if (isbn.length === 13) {
        axios.get('https://api.openbd.jp/v1/get?isbn=' + isbn)
          .then((res) => {
            if (res.status === 200) {
              this.title = res.data[0].summary.title
              this.authors = res.data[0].summary.author.split(' ')
              this.publisher = res.data[0].summary.publisher
              this.publishdt = res.data[0].summary.pubdate.substr(0, 4) + '-' + res.data[0].summary.pubdate.substr(4, 2) + '-' + res.data[0].summary.pubdate.substr(6, 2)
              this.cover = res.data[0].summary.cover
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
      this.update = dt.toISOString().substr(0, 23) + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'

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
          readdt: null,
          update: this.registerdt,
          rate: this.rate,
          links: this.links,
          memos: this.memos
        }
      )

      this.$router.push('/')
    },
    cancel () {
      this.$router.push('/')
    }
  }
}
</script>
