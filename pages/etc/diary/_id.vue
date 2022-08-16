<template>
  <div>
    <markdown ref="markdown" v-model="diary.content" :save="save" />
    <v-bottom-sheet v-model="bottomSheet" max-width="480px">
      <v-list style="padding-bottom: 40px;">
        <p class="text-h6 ma-4">
          {{ diary.id }}: {{ diary.content.split(/\r\n|\r|\n/)[0] }}
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
import { DiaryRepository, Diary } from '~/js/db/interfaces/DiaryRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  diary: Diary
  bottomSheet: boolean
}

export interface Markdown extends Vue {
  leave(): void
}

export default Mixin.extend({
  name: 'DiaryPage',
    data(): DataType {
    return {
      diary: {
        id: undefined,
        createdAt: '',
        updatedAt: '',
        eventAt: '',
        content: '',
      },
      bottomSheet: false
    }
  },
  watch: {
    '$route' (to) {
      const diaryRepo: DiaryRepository = this.$diaryRepository
      diaryRepo.findByDate(to.params.id).then((diary) =>{
        if (diary) {
          this.diary = diary
          this.$store.commit('CHANGE_CONTENT_TITLE', this.diary.eventAt)
        }
      })
    }
  },
  async beforeMount () {
    const diaryRepo: DiaryRepository = this.$diaryRepository
    const ret = await diaryRepo.findByDate(this.$route.params.id)
    if (ret) {
      this.diary = ret
      this.$store.commit('CHANGE_CONTENT_TITLE', this.diary.eventAt)
    }
  },
  mounted () {
  },
  beforeRouteUpdate(_, __, next) {
    const m = this.$refs.markdown as Markdown
    m.leave()
    next()
  },
  beforeRouteLeave(_, ___, next) {
    const m = this.$refs.markdown as Markdown
    m.leave()
    next()
  },
  methods: {
    async save () {
      const diary = this.diary // When page update or leave, this.diary change after 'await'.
      await this.recordActivity(`/etc/diary/${diary.eventAt}`,
                                this.$t('diaryUpdateActivityTitle').toString(),
                                this.$t('diaryUpdateActivityContent', {name: diary.eventAt}).toString())
      const diaryRepo: DiaryRepository = this.$diaryRepository
      await diaryRepo.store(diary)
    },
    menu () {
      this.bottomSheet = true
    },
    async remove () {
      if (confirm(this.$t('diaryDeleteConfirm').toString())) {
        await this.recordActivity('',
                                  this.$t('diaryDeleteActivityTitle').toString(),
                                  this.$t('diaryDeleteActivityContent', {name: this.diary.eventAt}).toString())

        const diaryRepo: DiaryRepository = this.$diaryRepository
        if (this.diary.id) {
          await diaryRepo.remove(this.diary.id)
        }
        this.bottomSheet = false
        this.$router.push('/etc/diary/')
      }
    },
  }
})
</script>
