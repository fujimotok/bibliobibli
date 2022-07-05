<template>
  <div>
    <v-text-field v-model="note.path" label="path" />
    <vue-simplemde ref="markdownEditor" v-model="note.content" :configs="config"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { NoteRepository } from '../../js/db/interfaces/NoteRepository'

export default Vue.extend({
  name: 'NotesIndexPage',
  data: () => ({
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
          action: (editor) => {
            const self = this
            this.$refs.fileInput.$refs.input.addEventListener('change', function onChange () {
              self.$refs.fileInput.$refs.input.removeEventListener('change', onChange)
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
            this.$refs.fileInput.$refs.input.click()
          },
          className: 'fa fa-image',
          title: 'image'
        },
        '|',
        'preview'
      ]
    },
    note: {
      id: null,
      createdAt: '',
      updatedAt: '',
      content: '',
      path: '',
    }
  }),
  watch: {
    '$route' (to) {
      const noteRepo: NoteRepository = this.$noteRepository
      const id = Number(to.params.pathMatch)
      if (id) {
        noteRepo.findById(id).then((note) =>{
          this.note = note
        })
      }
    }
  },
  async beforeMount () {
    const noteRepo: NoteRepository = this.$noteRepository
    const id = Number(this.$route.params.pathMatch)
    if (id) {
      this.note = await noteRepo.findById(id)
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
      const toolbarHeight = document.querySelector('.editor-toolbar').clientHeight
      const height = window.visualViewport.height - (48 + 66 + 16 * 2 + toolbarHeight)
      document.querySelector('.CodeMirror').style.height = height + 'px'
      window.scroll(0, 0)
    },
    save () {
      const noteRepo: NoteRepository = this.$noteRepository
      noteRepo.store(this.note)
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
