<template>
  <div>
    <v-text-field v-model="note.path" label="path" />
  </div>
</template>

<script lang="ts">
import { NoteRepository, Note } from '~/js/db/interfaces/NoteRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  note: Note
}

export default Mixin.extend({
  name: 'NotesNewPage',
  data(): DataType {
    return {
      note: {
        id: undefined,
        createdAt: '',
        updatedAt: '',
        content: '',
        path: '',
      }
    }
  },
  beforeMount () {
    this.note.path = '/Fleeting/' + this.formatDate(new Date)
  },
  async mounted () {
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
    async save () {
      const noteRepo: NoteRepository = this.$noteRepository
      
      const ret = await noteRepo.store(this.note)
      if (ret) {
        await this.recordActivity(`/notes/${ret.id}`,
                                  this.$t('noteCreateActivityTitle').toString(),
                                  this.$t('noteCreateActivityContent', {name: ret.path}).toString())
        
        this.$router.push({ path: `/notes/${ret.id}` })
      }
    },
    close () {
      this.note = {
        id: undefined,
        createdAt: '',
        updatedAt: '',
        content: '',
        path: '',
      }
    }
  }
})
</script>
