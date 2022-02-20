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

<script>
import { db } from '../js/db'

export default {
  name: 'TagsPage',
  layout: 'tags',
  data () {
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
    load () {
      db.tags.orderBy(':id').reverse().toArray()
        .then((tags) => {
          this.tags = tags
        })
    },
    add () {
      this.selectedTag = null
      this.editTag = ''
      this.dialogTitle = 'Add'
      this.dialog = true
    },
    edit (tag) {
      this.selectedTag = tag
      this.editTag = tag.tag
      this.dialogTitle = 'Edit'
      this.dialog = true
    },
    del (tag) {
      if (confirm('本当に削除しても良いですか？')) {
        db.books.filter((book) => {
          return book.tags.includes(tag.tag)
        }).toArray().then((records) => {
          for (const record of records) {
            const newTags = record.tags.filter(t => t !== tag.tag)
            db.books.update(record.id, { tags: newTags })
          }
          sessionStorage.setItem('DBChangeEvent', 'import')
        })

        db.tags.delete(tag.id).then(() => {
          this.load()
        })
      }
    },
    save () {
      if (this.selectedTag) {
        db.books.filter((book) => {
          return book.tags.includes(this.selectedTag.tag)
        }).toArray().then((records) => {
          for (const record of records) {
            const index = record.tags.indexOf(this.selectedTag.tag)
            const newTags = record.tags
            if (index > -1) {
              newTags[index] = this.editTag
            }
            db.books.update(record.id, { tags: newTags })
          }
          this.selectedTag.tag = this.editTag
          sessionStorage.setItem('DBChangeEvent', 'import')
        })

        db.tags.update(this.selectedTag.id, {
          tag: this.editTag
        })
      } else {
        db.tags.add({
          tag: this.editTag
        }).then(() => {
          this.load()
        })
      }
      this.dialog = false
    }
  }
}
</script>
