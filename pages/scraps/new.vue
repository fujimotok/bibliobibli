<template>
  <div>
    <v-file-input ref="fileInput" v-model="file" style="visibility: hidden; width: 0; height: 0;" />
    <v-select
      v-model="scrap.tags"
      multiple
      :items="tagItems"
      item-value="id"
      item-text="name"
      label="tags"
      :menu-props="{ offsetY: true }"
    />
    <vue-simplemde ref="markdownEditor" v-model="scrap.content" :configs="config" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ScrapRepository, Scrap } from '../../js/db/interfaces/ScrapRepository'
import { TagRepository } from '~/js/db/interfaces/TagRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  config: object
  scrap: Scrap
  file: object
  tagItems: object[]
}

export default Mixin.extend({
  name: 'ScrapsIndexPage',
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
      file: {},
      tagItems: []
    }
  },
  async beforeMount () {
    const tagRepo: TagRepository = this.$tagRepository
    await tagRepo.find('', 0, 0).then((tags) => {
      if (tags !== undefined) {
        this.tagItems = tags[0]
      }
    })
  },
  mounted () {
    window.addEventListener('resize', this.resize)
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
      const scrapRepo: ScrapRepository = this.$scrapRepository
      const ret = await scrapRepo.store(this.scrap)
      if (ret) {
        await this.recordActivity(`/scraps/${ret.id}`, 'Created Scrap', `${ret.id} is created.`)
        this.$router.replace({ path: `/scraps/${ret.id}` })
      }
    },
    menu () {
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

