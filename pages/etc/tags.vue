<template>
  <v-list>
    <v-list-item-group>
      <template v-for="(tag, index) in tags">
        <v-list-item :key="index">
          <v-list-item-content>
            <v-list-item-title v-text="tag.tag" />
          </v-list-item-content>
          <v-list-item-action>
            <div>
              <v-btn icon @click="edit(tag)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="del(tag)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-list-item-action>
        </v-list-item>
        <v-divider :key="`${index}-divider`" />
      </template>
    </v-list-item-group>
    <v-dialog v-model="dialog" max-width="400">
      <v-card class="pa-4">
        <v-card-title>
          {{ dialogTitle }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editTag"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">
            キャンセル
          </v-btn>
          <v-btn class="primary" @click="save()">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue'
import { TagRepository, Tag } from '../../js/db/interfaces/TagRepository'

export type DataType = {
  tags: Tag[]
  selectedTag: Tag | null
  editTag: string
  dialog: boolean
  dialogTitle: string
}

export default Vue.extend({
  name: 'TagsPage',
  layout: 'tags',
  data (): DataType {
    return {
      tags: [],
      selectedTag: null,
      editTag: '',
      dialog: false,
      dialogTitle: ''
    }
  },
  head: () => ({
    title: 'タグ管理'
  }),
  mounted () {
    this.load()
  },
  methods: {
    async load () {
      const tagRepo: TagRepository = this.$tagRepository
      const tags = await tagRepo.find('', 0, 0)
      if (tags !== undefined) {
        this.tags = tags[0]
      }
    },
    add () {
      this.selectedTag = null
      this.editTag = ''
      this.dialogTitle = 'Add'
      this.dialog = true
    },
    edit (tag: Tag) {
      this.selectedTag = tag
      this.editTag = tag.name
      this.dialogTitle = 'Edit'
      this.dialog = true
    },
    async del (tag: Tag) {
      if (confirm('本当に削除しても良いですか？')) {
        const tagRepo: TagRepository = this.$tagRepository
        if (tag.id) {
          await tagRepo.remove(tag.id)
          this.load()
        }
      }
    },
    async save () {
      const tagRepo: TagRepository = this.$tagRepository
      if (this.selectedTag) {
        if (this.selectedTag.id) {
          await tagRepo.store(this.selectedTag)
          this.load()
        }
      } else {
        const newTag: Tag = {
          id: undefined,
          name: this.editTag
        }
        await tagRepo.store(newTag)
        this.load()
      }
      this.dialog = false
    }
  }
})
</script>
