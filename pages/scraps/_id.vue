<template>
  <div>
    <v-file-input ref="fileInput" v-model="file" style="visibility: hidden; width: 0; height: 0;" />
    <vue-simplemde ref="markdownEditor" v-model="scrap.content" :configs="config" />
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
import { ScrapRepository, Scrap } from '../../js/db/interfaces/ScrapRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  config: object
  scrap: Scrap
  file: string
  bottomSheet: boolean
}

export default Mixin.extend({
  name: 'ScrapsPage',
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
      scrap: {
        id: undefined,
        tags: [],
        createdAt: '',
        updatedAt: '',
        content: '',
      },
      file: '',
      bottomSheet: false
    }
  },
  watch: {
    '$route' (to) {
      const scrapRepo: ScrapRepository = this.$scrapRepository
      scrapRepo.findById(Number(to.params.id)).then((scrap) =>{
        if (scrap) {
          this.scrap = scrap          
        }
      })
    }
  },
  async beforeMount () {
    const scrapRepo: ScrapRepository = this.$scrapRepository
    const ret = await scrapRepo.findById(Number(this.$route.params.id))
    if (ret) {
      this.scrap = ret
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
    async save () {
      await this.recordActivity(`/scraps/${this.scrap.id}`, 'Update Scrap Info', `${this.scrap.id} is updated.`)
      const scrapRepo: ScrapRepository = this.$scrapRepository
      await scrapRepo.store(this.scrap)
    },
    menu () {
      this.bottomSheet = true
    },
    async remove () {
      if (confirm('本当に削除しても良いですか？')) {
        await this.recordActivity('', 'Delete Scrap', `${this.scrap.id} is deleted.`)
        const scrapRepo: ScrapRepository = this.$scrapRepository
        if (this.scrap.id) {
          await scrapRepo.remove(this.scrap.id)
        }
        this.bottomSheet = false
        this.$router.push('/scraps/')
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
