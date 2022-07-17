<template>
  <v-container class="fill-height" fluid>
    <v-card style="width: 100%;">
      <v-card-title>
        データインポート/エクスポート
      </v-card-title>
      <v-card-actions>
        <v-file-input v-model="file" label="インポート" accept=".json" class="mr-4" @change="dataImport" />
        <v-btn @click="dataExport">
          エクスポート
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
import { ExportImport } from '../../js/db/interfaces/ExportImport'

export default Vue.extend({
  name: 'SettingsPage',
  data () {
    return {
      file: null
    }
  },
  head: () => ({
    title: 'Settings'
  }),
  methods: {
    async dataImport () {
      if (!window.File) {
        alert('お使いのブラウザは対応しておりません')
        return
      }

      if (!this.file) {
        return
      }
      
      const ret = await this.readFileAsync(this.file).catch((e) => {
        alert(`エラー:${e}`)
      })

      const ei: ExportImport = this.$exportImport
      if (typeof(ret) !== 'string') {
        return
      }
      
      const isSuccess = await ei.Import(ret)
      
      if (!isSuccess) {
        alert('インポートに失敗しました')
        return
      }

      alert('インポート完了')
      sessionStorage.setItem('DBChangeEvent', 'import')
      this.$router.push('/')
    },
    async dataExport () {
      const ei: ExportImport = this.$exportImport
      const json = await ei.Export()
      
      if (json === '' ) {
        alert('エクスポートに失敗しました')
        return
      }

      const fileName = 'export.json'
      const data = json
      const link = document.createElement('a')

      link.href = 'data:application/json,' + encodeURIComponent(data)
      link.download = fileName
      link.click()
    },
    readFileAsync (file: any) {
      // ファイルデータを非同期で読み込みます。
      return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsText(file)
      })
    }
  }
})
</script>
