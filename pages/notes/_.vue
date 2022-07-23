<template>
  <div>
    <v-file-input ref="fileInput" v-model="file" style="visibility: hidden; width: 0; height: 0;" />
    <vue-simplemde ref="markdownEditor" v-model="note.content" :configs="config" />
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
import Vue from 'vue'
import { NoteRepository, Note } from '~/js/db/interfaces/NoteRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  bottomSheet: boolean
  file: object
  config: object
  note: Note
}

export default Mixin.extend({
  name: 'NotesIndexPage',
  data(): DataType {
    return {
      bottomSheet: false,
      file: {},
      config: {
        spellChecker: false,
        forceSync: true,
        indentWithTabs: false,
        status: false,
        toolbar: [
          'bold',
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
            action: (editor: any) => {
              const self = this as any
              const file = this.$refs.fileInput as Vue
              if (file) {
                const input = file.$refs.input as HTMLElement
                if (input) {
                  input.addEventListener('change', function onChange () {
                    input.removeEventListener('change', onChange)
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
                  input.click()
                }
              }
            },
            className: 'fa fa-image',
            title: 'image'
          },
          '|',
          'preview'
        ]
      },
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
    window.addEventListener('resize', this.resize)
    window.visualViewport.addEventListener('resize', this.resize)
    this.resize()
  },
  methods: {
    resize () {
      const toolbarHeight = document.querySelector('.editor-toolbar')?.clientHeight || 0
      const height = window.visualViewport.height - (48 + 66 + 16 * 2 + toolbarHeight)
      const node = document.querySelector('.CodeMirror') as HTMLElement
      const style = node?.style
      if (style) {
        style.height = height + 'px'
      }
      window.scroll(0, 0)
    },
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
