<template>
  <div>
    <v-file-input ref="fileInput" v-model="file" style="visibility: hidden; width: 0; height: 0;" />
    <vue-simplemde ref="mde" v-model="internalValue" :configs="config" />
    <v-sheet v-if="dialog" class="pa-2" outlined style="position: absolute; width: 100%; bottom: 0; left: 0; z-index: 2;">
      <v-text-field
        v-model="searchWord"
        label="Search Word"
        hide-details="true"
        outlined
        dense
        :suffix="(current + 1).toString() + '/' + matches.length.toString()"
        @keydown.enter="find(searchWord)"
      >
        <template #prepend>
          <v-btn icon small @click.stop="dialog = false; clearMarksAndSelection()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #append-outer>
          <v-btn icon small @click.stop="findForward">
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
          <v-btn icon small @click.stop="findBackward">
            <v-icon>mdi-chevron-up</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export interface Match {
  start: number
  end: number
}

export type DataType = {
  dialog: boolean
  dirty: boolean
  timerID: number
  file: object
  matches: Match[]
  current: number
  searchWord: string
  config: object
}

export interface Marker extends Vue {
  className: string
  clear(): void
}

export interface CodeMirror extends Vue {
  posFromIndex(index: number): object
  setSelection(anchor: object, head: object): void
  markText(anchor: object, head: object, option: object): void
  getAllMarks(): Marker[]
}

export interface Simplemde extends Vue {
  codemirror: CodeMirror
}

export interface VueSimplemde extends Vue {
  simplemde: Simplemde
}

export default Vue.extend({
  name: 'MarkdownEditor',
  props: {
    value: { type: String, default: '' },
    save: { type: Function, default: () => {} }
  },
  data(): DataType {
    return {
      dialog: false,
      dirty: false,
      timerID: 0,
      file: {},
      matches: [],
      current: 0,
      searchWord: '',
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
          {
            name: 'find',
            action: () => {
              this.$data.dialog = true
            },            
            className: 'fa fa-binoculars',
            title: 'find'
          },
          '|',
          'preview'
        ]
      }
    }
  },
  computed: {
    internalValue: {
      get (): string {
        return this.value
      },
      set (value: string): void {
        this.dirty = true
        if (this.timerID > 0) {
          window.clearTimeout(this.timerID)
          this.timerID = 0
        }
        this.timerID = window.setTimeout(() => {
          this.leave()
          this.timerID = 0
        }, 3000)
        this.$emit('input', value)
      }
    }
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
    find (word: string) {
      if (word.length === 0) {
        return
      }

      this.current = 0
      this.matches = []
      this.clearMarksAndSelection()

      const re = new RegExp(word, 'g')
      let m
      while ((m = re.exec(this.internalValue)) != null) {
        this.matches.push({start: m.index, end: m.index + m.toString().length})
      }

      if (this.matches.length === 0) {
        return
      }

      this.setMarks()
      this.setSelection()
    },
    findForward () {
      if (this.matches.length === 0) {
        return
      }

      this.current++
      if (this.current >= this.matches.length) {
        this.current = 0
      }

      this.setSelection()
    },
    findBackward () {
      if (this.matches.length === 0) {
        return
      }

      this.current--
      if (this.current < 0) {
        this.current = this.matches.length - 1
      }

      this.setSelection()
    },
    setSelection () {
      const vmde = this.$refs.mde as VueSimplemde
      const cm = vmde.simplemde.codemirror
      const match = this.matches[this.current]
      const options = { className: 'selection' }
      cm.getAllMarks().filter(m => m.className === 'selection').forEach(m => m.clear())
      cm.setSelection(cm.posFromIndex(match.start), cm.posFromIndex(match.end))
      cm.markText(cm.posFromIndex(match.start), cm.posFromIndex(match.end), options)
      
    },
    setMarks () {
      const vmde = this.$refs.mde as VueSimplemde
      const cm = vmde.simplemde.codemirror
      const options = { className: 'mark' }
      this.matches.forEach(m => cm.markText(cm.posFromIndex(m.start), cm.posFromIndex(m.end), options))
    },
    clearMarksAndSelection () {
      const vmde = this.$refs.mde as VueSimplemde
      const cm = vmde.simplemde.codemirror
      cm.getAllMarks().filter(m => m.className === 'mark').forEach(m => m.clear())
      cm.getAllMarks().filter(m => m.className === 'selection').forEach(m => m.clear())
    },
    async leave () {
      if (this.dirty) {
        await this.$props.save()
      }
      this.dirty = false
    }
  }
})
</script>

<style>
.CodeMirror .mark {
    background: yellow
}

.CodeMirror .selection {
    background: aqua
}

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
