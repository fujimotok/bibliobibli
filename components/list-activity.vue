<template>
  <v-list-item-group
    v-if="items.length > 0"
    v-model="internalValue"
  >
    <template v-for="(item, index) in items">
      <v-list-item :key="index" @click="show(item)">
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
          <v-list-item-subtitle
            class="text-caption wrap-text"
            v-text="item.content"
          />        
          <v-list-item-subtitle
            class="text-caption"
            v-text="item.eventAt"
          />        
        </v-list-item-content>
      </v-list-item>
      <v-divider :key="`${index}-divider`" />
    </template>
    <div v-intersect.quite="onIntersect" />
  </v-list-item-group>
  <div v-else style="position: absolute; height: 90%; width: 100%; align-items: center;">
    <p style="position: relative; top: 50%; text-align: center;">
      No Result
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Activity, ActivityRepository } from '~/js/db/interfaces/ActivityRepository'

export type DataType = {
  items: object[]
  isLoading: boolean
}

export default Vue.extend({
  props: {
    value: { type: Number, default: 0 }
  },
  data (): DataType {
    return {
      items: [],
      isLoading: false,
    }
  },
  computed: {
    internalValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    show (item: Activity) {
      this.$router.push({ path: item.link })
    },
    async search (offset = 0) {
      const repo: ActivityRepository = this.$activityRepository
      const activities = await repo.find('', offset, 20)
      if (activities !== undefined) {
        activities[0].forEach((activity) => {
          const dt = new Date(activity.createdAt || '')
          dt.setTime( dt.getTime() - dt.getTimezoneOffset() * 60 * 1000 )
          this.items.push({
            link: activity.link,
            title: activity.title,
            content: activity.content,
            eventAt: dt.toLocaleString()
          })
        })
      }
    },
    onIntersect () {
      this.isLoading = true
      this.search(this.items.length)
      this.isLoading = false
    }
  }
})
</script>

<style scoped>
.wrap-text {
  white-space: normal
}
</style>
