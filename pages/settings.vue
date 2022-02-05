<template>
  <v-container>
    <v-card>
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

<script>
export default {
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
    dataImport () {
      if (window.File) {
        // ファイルデータを非同期で読み込みます。
        if (this.file) {
          this.readFileAsync(this.file)
            .then((result) => {
              // this.fileData.data = result;
              const json = JSON.parse(result)
              localStorage.setItem('code', json.code)
              localStorage.setItem('format', json.code)
              localStorage.setItem('items', JSON.stringify(json.items))
              alert('インポート完了')
            })
            .catch((e) => {
              alert(`エラー:${e}`)
            })
        }
      } else {
        alert('お使いのブラウザは対応しておりません')
      }
    },
    dataExport () {
      const jsonData = {
        code: localStorage.getItem('code') ?? '',
        format: localStorage.getItem('format') ?? '',
        items: JSON.parse(localStorage.getItem('items')) || []
      }

      const fileName = 'export.json'
      const data = JSON.stringify(jsonData)
      const link = document.createElement('a')

      link.href = 'data:application/json,' + encodeURIComponent(data)
      link.download = fileName
      link.click()
    },
    // ファイルデータを非同期で読み込みます。
    readFileAsync (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsText(file)
      })
    }
  }
}
</script>
