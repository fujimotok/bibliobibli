<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col>
        <v-btn icon @click="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon @click="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        {{ value.substr(0, 7) }}
      </v-col>
    </v-row>
    <v-row class="fill-height">
      <v-col class="fill-height">
        <v-calendar
          ref="calendar"
          v-model="value"
          :events="events"
          color="primary"
          event-color="secondary"
          @click:event="onEventClick"
          @click:date="onDateClick"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { DiaryRepository, Diary } from '~/js/db/interfaces/DiaryRepository'
import Mixin from '~/js/mixin/record-activity'

export type DataType = {
  events: {name: string, start: string, id?: number}[]
  value: string
}

export default Mixin.extend({
  name: 'DiaryIndexPage',
  data(): DataType {
    return {
      events: [],
      value: new Date().toISOString()
    }
  },
  async beforeMount () {
    const diaryRepo: DiaryRepository = this.$diaryRepository
    
    const now = new Date()
    const date = now.toISOString().substr(0, 8)
    const ret = await diaryRepo.find('', date, 0, 0)
    if (ret) {
      ret[0].forEach((d) => {
        this.events.push({
          name: `${d.content.split(/\r\n|\r|\n/)[0]}`,
          start: d.eventAt?.substr(0, 10),
          id: d.id
        })
      })
    }

    this.$store.commit('CHANGE_CONTENT_TITLE', 'Diary')
  },
  methods: {
    onEventClick({ event }: { event: any }) {
      this.$router.push({ path: `/etc/diary/${event.start}` })
    },
    async onDateClick({ date }: { date:string }) {
      const event = this.events.find((e) => e.start === date)
      if (event) {
        this.$router.push({ path: `/etc/diary/${event.start}` })
      }
      else {
        const ret = await this.createDiary(date)
        if (ret) {
          await this.recordActivity(`/etc/diary/${ret.eventAt}`,
                                    this.$t('diaryCreateActivityTitle').toString(),
                                    this.$t('diaryCreateActivityContent', {name: ret.eventAt}).toString())
          this.$router.push({ path: `/etc/diary/${ret.eventAt}` })
        }
      }
    },
    async createDiary(date: string){
      const diaryRepo: DiaryRepository = this.$diaryRepository
      const diary: Diary = {
        eventAt: date,
        content: `\n# ${date}\n`
      }
      return await diaryRepo.store(diary)      
    },
    menu(){
    }
  }
})
</script>

