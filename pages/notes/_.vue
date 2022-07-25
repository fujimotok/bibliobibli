<template>
  <div>
    <markdown v-model="note.content" />
    <v-bottom-sheet v-model="bottomSheet" max-width="480px">
      <v-list style="padding-bottom: 40px;">
        <p class="text-h6 ma-2">
          Menu
        </p>
        <v-divider />
        <v-list-item-group>
          <v-list-item @click="remove">
            <v-list-item-avatar>
              <v-avatar>
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>
              削除
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
    
    this.$store.commit('CHANGE_IS_SHOW_SAVE', true)
    this.$store.commit('CHANGE_IS_SHOW_DEL', false)
  },
  mounted () {
  },
  methods: {
    async save () {
      await this.recordActivity(`/notes/${this.note.id}`, 'Update Note', `${this.note.path} is updated.`)
      const noteRepo: NoteRepository = this.$noteRepository
      await noteRepo.store(this.note)
    },
    menu () {
      this.bottomSheet = true
    },
    async remove () {
      if (confirm('本当に削除しても良いですか？')) {
        await this.recordActivity('', 'Delete Note', `${this.note.path} is deleted.`)
        const noteRepo: NoteRepository = this.$noteRepository
        if (this.note.id) {
          await noteRepo.remove(this.note.id)
        }
        this.bottomSheet = false
        this.$router.push('/notes/')
      }
    },
  }
})
</script>
