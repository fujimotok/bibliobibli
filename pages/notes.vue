<template>
  <div v-if="isMobile">
    <div v-if="isRoot">
      <v-list style="padding-bottom: 80px;">
        <list-notes ref="listMobile" class="ma-0 pa-0 fill-height" />
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
    <v-card v-else>
      <div style="padding: 16px;">
        <nuxt-child ref="contentMobile" class="ma-0 pa-0 fill-height" />
      </div>
    </v-card>
  </div>
  <v-container v-else class="ma-0 pa-0 fill-height" fluid>
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
          <list-notes ref="listDesktop" class="ma-0 pa-0 fill-height" />
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
import { NoteRepository, Note } from '~/js/db/interfaces/NoteRepository'
import ListNotes from '~/components/list/notes.vue'

export interface Content extends Vue {
  save(): void
  menu(): void
}

export default Mixin.extend({
  name: 'NotesPage',
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
      return this.$route.path === '/notes/'
    }
  },
  mounted () {
  },
  methods: {
    formatDate(dt: Date): string {
      const yyyy = dt.getFullYear()
      const MM = ('00' + (dt.getMonth()+1)).slice(-2)
      const dd = ('00' + dt.getDate()).slice(-2)
      const hh = ('00' + dt.getHours()).slice(-2)
      const mm = ('00' + dt.getMinutes()).slice(-2)
      const ss = ('00' + dt.getSeconds()).slice(-2)
      return `${yyyy}-${MM}-${dd}-${hh}:${mm}:${ss}`
    },
    async add () {
      const noteRepo: NoteRepository = this.$noteRepository

      const note: Note = {
        path: '/Fleeting/' + this.formatDate(new Date),
        content: '',
        createdAt: '',
        updatedAt: '',
      }
      const ret = await noteRepo.store(note)
      if (ret) {
        await this.recordActivity(`/notes/${ret.id}`,
                                  this.$t('noteCreateActivityTitle').toString(),
                                  this.$t('noteCreateActivityContent', {name: ret.path}).toString())
        this.$router.push({ path: `/notes/${ret.id}` })
      }
    },
    search (): void {
      if (this.isMobile) {
        const list = this.$refs.listMobile as InstanceType<typeof ListNotes>
        list.search()
      } else {
        const list = this.$refs.listDesktop  as InstanceType<typeof ListNotes>
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
