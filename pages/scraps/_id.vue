<template>
  <div>
    <markdown v-model="scrap.content" />
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
import { ScrapRepository, Scrap } from '../../js/db/interfaces/ScrapRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  scrap: Scrap
  bottomSheet: boolean
}

export default Mixin.extend({
  name: 'ScrapsPage',
  data(): DataType {
    return {
      scrap: {
        id: undefined,
        tags: [],
        createdAt: '',
        updatedAt: '',
        content: '',
      },
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
