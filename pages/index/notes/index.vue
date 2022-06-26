<template>
  <vue-simplemde ref="markdownEditor" v-model="note.content" :configs="config"/>
</template>

<script lang="ts">
import Vue from 'vue'
import { NoteRepository } from '../../../js/db/interfaces/NoteRepository'

export default Vue.extend({
  name: 'NotesIndexPage',
  data: () => ({
    height: '600px',
    config: {
      spellChecker: false,
      forceSync: true,
      indentWithTabs: false,
      status: false,
      toolbar: [
        {
          name: 'custom',
          action: () => { this.editNote = false },
          className: 'fa fa-close',
          title: 'Custom Button'
        },
        '|',
        'bold',
        'italic',
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
  beforeMount () {
    this.$store.commit('CHANGE_IS_SHOW_SAVE', true)
    this.$store.commit('CHANGE_IS_SHOW_DEL', false)
  },
  mounted () {
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  methods: {
    resize () {
      const height = window.innerHeight - 200
      document.querySelector('.CodeMirror').style.height = height + 'px'
      // document.querySelector('.CodeMirror-scroll').style.height = height+ 'px'
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

.editor-toolbar {
  position: -webkit-sticky;  /* Safari fallback */
  position: sticky; /* other browsers */
  top: 0px; /* become fixed/sticky when toolbar goes against the top of the viewport */

  /* Make toolbar useable/visible when it becomes sticky */
  z-index: 100;
  opacity: initial; 
  background-color: white;
  border-bottom: 1px solid #bbb;
}

 /* Hovering would otherwise cause the text to become visible 'behind' the toolbar */
.editor-toolbar:hover {
  opacity: initial;
}

.editor .CodeMirror-scroll {
    overflow: hidden !important;
}

/* hide the scrollbars */
.editor .CodeMirror-vscrollbar, .editor .CodeMirror-hscrollbar {
    display: none !important;
}
</style>

