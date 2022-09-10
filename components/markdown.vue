<template>
  <div v-touch="{ right: () => navi = true }">
    <v-file-input ref="fileInput" v-model="file" style="visibility: hidden; width: 0; height: 0; margin: 0; padding: 0;" @change="onChange" />
    <v-sheet
      v-if="dialog"
      id="top-sheet"
      class="pa-1"
      outlined
      style="position: fixed; width: 100%; top: 0; left: 0; z-index: 5; touch-action: none;"
    >
      <div>
        <v-text-field
          ref="search"
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
      </div>
    </v-sheet>
    <v-navigation-drawer
      v-model="navi"
      width="85%"
      absolute
      temporary
    >
      <v-list dense style="height: 100%;" class="overflow-y-auto">
        <v-list-item
          v-for="(t, i) in toc"
          :key="i"
          @click="jump(t)"
        >
          {{ t.text }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <vue-simplemde id="textarea" ref="mde" v-model="internalValue" :configs="config" />
    <v-sheet
      id="bottom-sheet"
      class="pa-1"
      outlined
      style="width: 100%; bottom: 0; left: 0; z-index: 2; touch-action: pan-x;"
    >
      <v-slide-group
        multiple
        show-arrows
        @click:prev="$refs.mde.simplemde.codemirror.focus()"
        @click:next="$refs.mde.simplemde.codemirror.focus()"
        @click="$refs.mde.simplemde.codemirror.focus()"
      >
        <v-slide-item
          v-for="(t, i) in toolbar"
          :key="i"
        >
          <v-btn
            icon
            class="mx-2"
            @click.stop.prevent="t.action()"
          >
            <v-icon>{{ t.icon }}</v-icon>
          </v-btn>
        </v-slide-item>
      </v-slide-group>
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
  navi: boolean
  dirty: boolean
  timerID: number
  file: object
  matches: Match[]
  current: number
  searchWord: string
  toc: {text: string, start: number, end: number}[]
  config: object
  toolbar: {name: string, icon: string, action: () => void }[]
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
  cursorCoords(where: boolean, mode: string): { left: number, right: number, top: number, bottom: number}
  scrollTo(x: number, y: number): void
  focus(): void
  on(event: string, func: (e: any) => void): void
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
      navi: false,
      dirty: false,
      timerID: 0,
      file: {},
      matches: [],
      current: 0,
      searchWord: '',
      toc: [],
      toolbar: [],
      config: {
        spellChecker: false,
        forceSync: true,
        indentWithTabs: false,
        status: false,
        toolbar: []
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
        console.log("set")
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
  watch: {
    navi: function (value) {
      if (value) {
        this.toc = this.createToc()
      }
    }
  },
  beforeMount () {
    this.toolbar = [
      {
        name: 'Preview',
        icon: 'mdi-eye',
        action: () => {
          // copy from simplemde.js
          const mde = this.$refs.mde as VueSimplemde
          const editor = mde.simplemde as any
	        const cm = editor.codemirror;
	        const wrapper = cm.getWrapperElement();
	        let preview = wrapper.lastChild;
	        if(!preview || !/editor-preview/.test(preview.className)) {
		        preview = document.createElement("div");
		        preview.className = "editor-preview";
		        wrapper.appendChild(preview);
	        }
	        if(/editor-preview-active/.test(preview.className)) {
		        preview.className = preview.className.replace(
			        /\s*editor-preview-active\s*/g, ""
		        );
	        } else {
		        setTimeout(function() {
			        preview.className += " editor-preview-active";
		        }, 1);
	        }
	        preview.innerHTML = editor.options.previewRender(editor.value(), preview);
        },
      },
      {
        name: 'Undo',
        icon: 'mdi-undo',
        action: () => {
          const mde = this.$refs.mde as VueSimplemde
          const editor = mde.simplemde as any
	        editor.undo(editor)
        },
      },
      {
        name: 'Redo',
        icon: 'mdi-redo',
        action: () => {
          const mde = this.$refs.mde as VueSimplemde
          const editor = mde.simplemde as any
	        editor.redo(editor)
        },
      },
      {
        name: 'Find',
        icon: 'mdi-file-find',
        action: () => {
          this.dialog = true

          this.$nextTick(() => {
            const s = this.$refs.search as HTMLElement
            s.focus({ preventScroll: true })
          })
        },
      },
      {
        name: 'Bold',
        icon: 'mdi-format-bold',
        action: () => {
          const mde = this.$refs.mde as VueSimplemde
          const editor = mde.simplemde as any
	        editor.toggleBold(editor)
        },
      },
      {
        name: 'Strikethrough',
        icon: 'mdi-format-strikethrough',
        action: () => {
          const mde = this.$refs.mde as VueSimplemde
          const editor = mde.simplemde as any
	        editor.toggleStrikethrough(editor)
        }
      },
      {
        name: 'Heading Smaller',
        icon: 'mdi-format-header-pound',
        action: () => {
          const mde = this.$refs.mde as VueSimplemde
          const editor = mde.simplemde as any
	        editor.toggleHeadingSmaller(editor)
        }
      },
      {
        name: 'List Numbered',
        icon: 'mdi-format-list-numbered',
        action: () => {
          const mde = this.$refs.mde as VueSimplemde
          const editor = mde.simplemde as any
	        editor.toggleOrderedList(editor)
        }
      },
      {
        name: 'List',
        icon: 'mdi-format-list-bulleted',
        action: () => {
          const mde = this.$refs.mde as VueSimplemde
          const editor = mde.simplemde as any
	        editor.toggleUnorderedList(editor)
        }
      },
      {
        name: 'Code',
        icon: 'mdi-code-braces',
        action: () => {
          const mde = this.$refs.mde as VueSimplemde
          const editor = mde.simplemde as any
	        editor.toggleCodeBlock(editor)
        }
      },
      {
        name: 'Link',
        icon: 'mdi-link',
        action: () => {
          const mde = this.$refs.mde as VueSimplemde
          const editor = mde.simplemde as any
	        editor.drawLink(editor)
        }
      },
      {
        name: 'Image',
        icon: 'mdi-image',
        action: () => {
          const file = this.$refs.fileInput as Vue
          const input = file.$refs.input as HTMLElement
          input.click()
        }
      },
    ]
  },
  mounted () {
    window.addEventListener('resize', this.resize)
    window.visualViewport.addEventListener('resize', this.resize)
    this.resize()

    this.applyTheme()    

    const vmde = this.$refs.mde as VueSimplemde
    const editor = vmde.simplemde.codemirror
    editor.on('focus', this.onFocus)
    editor.on('blur', this.onBlur)

    // Workaround for overscroll problem
    const textarea = document.querySelector('.CodeMirror-scroll')
    if (textarea) {
      textarea.scrollTop = 1
      textarea.addEventListener('scroll', function(_) {
        if (textarea.scrollTop === 0) {
          textarea.scrollTop = 1
        }
        else if (textarea.scrollTop + textarea.clientHeight === textarea.scrollHeight) {
          textarea.scrollTop = textarea.scrollTop - 1
        }
      }, { passive: false });
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
    window.visualViewport.removeEventListener('resize', this.resize)
    
    this.$store.commit('CHANGE_HAS_HEADER', true)
  },
  methods: {
    applyTheme() {
      const mde = this.$refs.mde as VueSimplemde
      const editor = mde.simplemde as any
      const cm = editor.codemirror as any

      if (this.$vuetify.theme.dark) {
        cm.setOption('theme', 'dracula')
      }
    },
    onFocus() {
      this.$store.commit('CHANGE_HAS_HEADER', false)
    },
    onBlur() {
      this.$store.commit('CHANGE_HAS_HEADER', true)
    },
    resize () {
      const appbarHeight = this.$store.state.hasHeader ? 48 : 0
      const bs = document.getElementById("bottom-sheet")
      const bsHeight = bs?.clientHeight || 0
      const height = window.visualViewport.height - (appbarHeight + bsHeight + 2)
      const node = document.querySelector('.CodeMirror') as HTMLElement
      const style = node?.style
      if (style) {
        style.height = height + 'px'
      }
      window.scroll(0, 0)
    },
    // toolbar functions
    onChange() {
      const fileReader = new FileReader()
      const vmde = this.$refs.mde as VueSimplemde
      const editor = vmde.simplemde as any

      fileReader.onload = function () {
        const dataURI = this.result
        const cm = editor.codemirror
        const pos = cm.getCursor('start')
        cm.replaceRange('![](' + dataURI + ')', { line: pos.line, ch: 0 })
      }
      if (this.file) {
        fileReader.readAsDataURL(this.file as Blob)
      }
    },
    createToc (): {text: string, start: number, end: number}[] {
      const re = /^#+ .*/gm
      const matches = []
      let m
      while ((m = re.exec(this.internalValue)) != null) {
        matches.push({text: m.toString(), start: m.index, end: m.index + m.toString().length})
      }
      return matches
    },
    jump (t: {text: string, start: number, end: number}) {
      const vmde = this.$refs.mde as VueSimplemde
      const cm = vmde.simplemde.codemirror
      this.navi = false
      cm.setSelection(cm.posFromIndex(t.start), cm.posFromIndex(t.end))
      const p = cm.cursorCoords(true, 'local')
      cm.scrollTo(0, p.top)
      console.log(p)
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
    focus () {
      const vmde = this.$refs.mde as VueSimplemde
      const cm = vmde.simplemde.codemirror
      cm.focus()
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
@import 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/dracula.min.css';

.CodeMirror {
    border: 0;
    overscroll-behavior: contain;
}

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
