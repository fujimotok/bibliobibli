<template>
  <div v-if="isMobile">
    <div v-if="isRoot">
      <v-list style="padding-bottom: 80px;">
        <list-books ref="listMobile" class="ma-0 pa-0 fill-height" />
      </v-list>
      <div style="position: fixed; bottom: 100px; right: 16px;">
        <v-btn
          elevation="2"
          fab
          color="secondary"
          @click.stop="add"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-else style="padding: 16px;">
      <nuxt-child ref="contentMobile" class="ma-0 pa-0 fill-height" />
    </div>
  </div>
  <v-container v-else class="ma-0 pa-0 fill-height" fluid style="position: relative;">
    <v-row class="ma-0 pa-0 fill-height" no-gutters>
      <v-col
        xs="12"
        sm="12"
        md="4"
        lg="4"
        lx="4"
        class="ma-0 pa-0 fill-height"
        style="position: relative;"
      >
        <v-list class="overflow-y-auto" style="position: absolute; height: 100%; width: 100%">
          <list-books ref="listDesktop" class="ma-0 pa-0 fill-height" />
        </v-list>
        <div style="position: absolute; bottom: 32px; right: 32px;">
          <v-btn
            elevation="2"
            fab
            small
            color="secondary"
            @click.stop="add"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="8"
        lg="8"
        lx="8"
        class="ma-0 pa-0 fill-height"
        style="position: relative;"
      >
        <v-card class="overflow-y-auto" style="position: absolute; height: 100%; width: 100%">
          <div style="padding: 16px;">
            <nuxt-child ref="contentDesktop" class="ma-0 pa-0 fill-height" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Mixin from '~/js/mixin/record-activity'
import { BookRepository, Book } from '~/js/db/interfaces/BookRepository'
import ListBooks from '~/components/list/books.vue'

export interface Content extends Vue {
  save(): void
  menu(): void
}

export default Mixin.extend({
  name: 'BooksPage',
  data: () => ({
    dialog: false
  }),
  computed: {
    isMobile (): boolean {
      const xs = this.$vuetify.breakpoint.xs
      const sm = this.$vuetify.breakpoint.sm
      return xs || sm
    },
    isRoot (): boolean {
      return this.$route.path === '/books/'
    }
  },
  mounted () {
  },
  methods: {
     async add () {
      const bookRepo: BookRepository = this.$bookRepository

      const book: Book = {
        createdAt: '',
        updatedAt: '',
        isbn: '',
        title: 'title',
        authors: [''],
        publisher: '',
        publishedAt: '',
        cover: this.$config.ROOT_URI + 'noimage.png',
        status: 0,
        readAt: '',
        links: [''],
        tags: [],
      }
      const ret = await bookRepo.store(book)
      if (ret) {
        await this.recordActivity(`/books/${ret.id}`,
                                  this.$t('bookCreateActivityTitle').toString(),
                                  this.$t('bookCreateActivityContent', {name: ret.title}).toString())
        this.$router.push({ path: `/books/${ret.id}` })
      }
    },
    search (): void {
      if (this.isMobile) {
        const list = this.$refs.listMobile as InstanceType<typeof ListBooks>
        list.search()
      } else {
        const list = this.$refs.listDesktop as InstanceType<typeof ListBooks>
        list.search()
      }
    },
    save (): void {
      if (this.isMobile) {
        const content = this.$refs.contentMobile as Content
        content.save()
      } else {
        const content = this.$refs.contentDesktop as Content
        content.save()
      }
    },
    menu (): void {
      if (this.isMobile) {
        const content = this.$refs.contentMobile as Content
        content.menu()
      } else {
        const content = this.$refs.contentDesktop as Content
        content.menu()
      }
    }
  }
})
</script>
