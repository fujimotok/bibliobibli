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
          追加
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
import { db } from '../js/db'

export default {
  name: 'AddItem',
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
    title: '新規登録'
  }),
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  methods: {
    barcodeReader () {
      this.$router.push('/barcode-reader')
    },
    save (date) {
      this.$refs.menu.save(date)
    },
    add () {
      const dt = new Date()
      const tz = -dt.getTimezoneOffset() / 60
      console.log(tz)
      const sign = Math.sign(tz) < 0 ? '-' : '+'
      this.registerdt = dt.toISOString().substr(0, 23) + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'
      this.update = dt.toISOString().substr(0, 23) + sign + Math.abs(tz).toString().padStart(2, '0') + ':00'

      db.books.add(
        {
          title: this.title,
          authers: this.authers,
          isbn: this.isbn,
          publisher: this.publisher,
          publishdt: this.publishdt,
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
