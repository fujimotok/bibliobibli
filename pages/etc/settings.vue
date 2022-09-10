<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col>
        {{ $t('appearanceTitle') }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <client-only>
          <v-card>
            <v-list-item>
              {{ $t('themeLabel') }}
              <v-spacer />
              <v-switch v-model="theme" append-icon="mdi-weather-night" prepend-icon="mdi-weather-sunny" />
            </v-list-item>
          </v-card>
        </client-only>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        {{ $t('importTitle') }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-list-item @click="dataImport">
            <v-list-item-content>
              <v-list-item-title>{{ $t('importLabelImport') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item @click="dataExport">
            <v-list-item-content>
              <v-list-item-title>{{ $t('importLabelExport') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-file-input ref="fileInput" v-model="file" style="visibility: hidden; width: 0; height: 0;" accept=".json" @change="onChange" />
      </v-col>
    </v-row>
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
  computed: {
    theme: {
      get: function () {
        return this.$vuetify.theme.dark
      },
      set: function (newValue :boolean) {
        this.$vuetify.theme.dark = newValue
        localStorage.setItem('themeDark', newValue.toString())
      }
    }
  },
  beforeMount () {
    this.$store.commit('CHANGE_CONTENT_TITLE', this.$t('settingsTitle').toString())
  },
  methods: {
    async onChange () {
      if (!window.File) {
        alert(this.$t('importErrorFileNotSupport').toString())
        return
      }
      
      if (!this.file) {
        return
      }
      
      const ret = await this.readFileAsync(this.file).catch((e) => {
        alert(`${e}`)
      })
      
      const ei: ExportImport = this.$exportImport
      if (typeof(ret) !== 'string') {
        return
      }
      
      const isSuccess = await ei.Import(ret)
      
      if (!isSuccess) {
        alert(this.$t('importErrorImportFailed').toString())
        return
      }
      
      alert(this.$t('importSuccess').toString())
      this.$router.push('/')
    },
    dataImport () {
      const file = this.$refs.fileInput as Vue
      if (file) {
        const input = file.$refs.input as HTMLElement
        if (input) {
          input.click()
        }
      }
    },    
    async dataExport () {
      const ei: ExportImport = this.$exportImport
      const json = await ei.Export()
      
      if (json === '' ) {
        alert(this.$t('exportErrorImportFailed').toString())
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
    },
    menu(){}
  }
})
</script>
