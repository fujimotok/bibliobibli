<template>
  <div>
    <v-text-field v-model="note.path" label="path" />
    <vue-simplemde ref="markdownEditor" v-model="note.content" :configs="config" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
import { NoteRepository, Note } from '~/js/db/interfaces/NoteRepository'
import { BookRepository, Book } from '~/js/db/interfaces/BookRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  config: object
  note: Note
  book: Book | undefined
}

export default Mixin.extend({
  name: 'NotesNewPage',
  data(): DataType {
    return {
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
      },
      book: undefined,
    }
  },
  beforeMount () {
    this.note.path = '/Fleeting/' + this.formatDate(new Date)
  },
  async mounted () {
    window.addEventListener('resize', this.resize)
    window.visualViewport.addEventListener('resize', this.resize)
    this.resize()
    
    if (this.$route.query.id) {
      const idStr = this.$route.query.id as string
      const id = Number.parseInt(idStr)
      const bookRepo: BookRepository = this.$bookRepository
      const book = await bookRepo.findById(id)
      if (book) {
        this.book = book
        this.note.path = `/Literature/${book.title}`
      }
    }
  },
  methods: {
    resize (): void {
      const toolbarHeight = document.querySelector('.editor-toolbar')?.clientHeight || 0
      const height = window.visualViewport.height - (48 + 66 + 16 * 2 + toolbarHeight)
      const node = document.querySelector('.CodeMirror') as HTMLElement
      const style = node?.style
      if (style) {
        style.height = height + 'px'
      }
      window.scroll(0, 0)
    },
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
      const bookRepo: BookRepository = this.$bookRepository
      
      const ret = await noteRepo.store(this.note)
      if (ret) {
        await this.recordActivity(`/notes/${ret.id}`, 'Created Note', `${ret.path} is created.`)
        
        if (this.book) {
          this.book.links.push(`/notes/${ret.id}`)
          await bookRepo.store(this.book)
        }

        this.$router.replace({ path: `/notes/${ret.id}` })
      }
    },
    menu (): void {
    }
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

