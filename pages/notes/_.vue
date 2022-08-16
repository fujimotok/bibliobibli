<template>
  <div>
    <markdown ref="markdown" v-model="note.content" :save="save" />
    <v-bottom-sheet v-model="bottomSheet" max-width="480px">
      <v-list style="padding-bottom: 40px;">
        <p class="text-h6 ma-4">
          {{ note.id }}: {{ note.path }}
        </p>
        <v-divider />
        <v-list-item-group>
          <v-list-item @click="rename">
            <v-list-item-avatar>
              <v-avatar>
                <v-icon>
                  mdi-pencil
                </v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>
              {{ $t('noteNameChange') }}
            </v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="remove">
            <v-list-item-avatar>
              <v-avatar>
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>
              {{ $t('noteDelete') }}
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
import { NoteRepository, Note } from '~/js/db/interfaces/NoteRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  bottomSheet: boolean
  note: Note
}

export interface Markdown extends Vue {
  leave(): void
}

export default Mixin.extend({
  name: 'NotesIndexPage',
  data(): DataType {
    return {
      bottomSheet: false,
      note: {
        id: undefined,
        createdAt: '',
        updatedAt: '',
        content: '',
        path: '',
      }
    }
  },
  watch: {
    '$route' (to) {
      const noteRepo: NoteRepository = this.$noteRepository
      const id = Number(to.params.pathMatch)
      if (id) {
        noteRepo.findById(id).then((note) =>{
          if (note) {
            this.note = note
          }
        })
      }
    }
  },
  async beforeMount () {
    const noteRepo: NoteRepository = this.$noteRepository
    const id = Number(this.$route.params.pathMatch)
    if (id) {
      const ret = await noteRepo.findById(id)
      if (ret) {
        this.note = ret
      }
    }
  },
  mounted () {
  },
  beforeRouteUpdate(_, __, next) {
    const m = this.$refs.markdown as Markdown
    m.leave()
    next()
  },
  beforeRouteLeave(_, ___, next) {
    const m = this.$refs.markdown as Markdown
    m.leave()
    next()
  },
  methods: {
    async save () {
      const note = this.note // When page update or leave, this.note change after 'await'.
      await this.recordActivity(`/notes/${note.id}`,
                                this.$t('noteUpdateActivityTitle').toString(),
                                this.$t('noteUpdateActivityContent', {name: note.path}).toString())
      const noteRepo: NoteRepository = this.$noteRepository
      const res = await noteRepo.store(note)
      console.log('saved', res)
    },
    menu () {
      this.bottomSheet = true
    },
    async remove () {
      if (confirm(this.$t('noteDeleteConfirm').toString())) {
        await this.recordActivity('',
                                  this.$t('noteDeleteActivityTitle').toString(),
                                  this.$t('noteDeleteActivityContent', {name: this.note.path}).toString())

        const noteRepo: NoteRepository = this.$noteRepository
        if (this.note.id) {
          await noteRepo.remove(this.note.id)
        }
        this.bottomSheet = false
        this.$router.push('/notes/')
      }
    },
    async rename () {
      const ret = prompt(this.$t('noteNameChange').toString(), this.note.path)
      if (ret) {
        const noteRepo: NoteRepository = this.$noteRepository
        if (this.note.id) {
          this.note.path = ret
          await noteRepo.store(this.note)
        }
        await this.recordActivity(`/notes/${this.note.id}`,
                                  this.$t('noteUpdateActivityTitle').toString(),
                                  this.$t('noteUpdateActivityContent', {name: this.note.path}).toString())
        this.bottomSheet = false
      }
    },
  }
})
</script>

<style scoped>
.v-sheet {
    border-radius: 20px 20px 0 0;
}
</style>
