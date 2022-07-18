import Vue from 'vue'
import {Activity, ActivityRepository} from "~/js/db/interfaces/ActivityRepository"

export default Vue.extend({
  methods: {
    async recordActivity (link: string, title: string, content: string): Promise<void> {
      const repo: ActivityRepository = this.$activityRepository
      const act: Activity = {
        link,
        title,
        content
      }

      await repo.store(act)
      
      // limit data counts.
      const result = await repo.find('', 0, 0)
      const max = 20 // TODO: apply user setting.
      if (result && result[1] > max) {
        // The result is sorted by new rank of ID.
        const delItems = result[0].slice(max)
        delItems.map(async (item: Activity) => {
          if (item.id) {
            await repo.remove(item.id)
          }
        })
      }
    }
  }
})
