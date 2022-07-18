<template>
  <div>
    <v-list two-line>
      <v-list-item-group>
        <div v-if="done" class="text-caption">
          候補
        </div>
        <v-divider v-if="done" />
        <template v-for="(item, index) in items">
          <v-list-item :key="item.format" @click="select(index)">
            <v-list-item-content>
              <v-list-item-title v-text="item.code" />
              <v-list-item-subtitle
                class="text-caption"
                v-text="item.format"
              />
            </v-list-item-content>
          </v-list-item>
          <v-divider
            :key="index"
          />
        </template>
      </v-list-item-group>
      <v-layout v-if="done" justify-center>
        <v-btn class="mr-4" @click="enter">
          決定
        </v-btn>
        <v-btn @click="retry">
          リトライ
        </v-btn>
      </v-layout>
    </v-list>
    <div id="interactive" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Quagga from 'quagga'

export type Result = {
  code: string
  format: string
}

export type DataType = {
  items: Result[]
  isError: boolean
  done: boolean
  code: string
  format: object
  config: object
}

export default Vue.extend({
  name: 'BarcodeReader',
  data(): DataType {
    return {
      items: [],
      isError: false,
      done: false,
      code: '0',
      format: { format: 'CODE128' },
      config: {}
    }
  },
  head: () => ({
    title: 'バーコードリーダー'
  }),
  mounted () {
    this.config = {
      // カメラの映像の設定
      inputStream: {
        type: 'LiveStream',
        target: document.querySelector('#interactive'), // カメラ映像を表示するHTML要素の設定
        constraints: { facingMode: 'environment'}, // バックカメラの利用を設定. (フロントカメラは'user')
        area: { top: '30%', right: '10%', left: '10%', bottom: '30%' }
      },
      // 解析するワーカ数の設定
      numOfWorkers: navigator.hardwareConcurrency || 4,
      // バーコードの種類を設定
      decoder: { readers: ['ean_reader'] }
    }
    Quagga.init(this.config, this.onInitilize)
    Quagga.onDetected(this.onDetected)
  },
  destroyed () {
    Quagga.stop()
  },
  errorCaptured (err) {
    console.log('catched by `CHILD errorCaptured`', err.toString())
    this.isError = true
    return false
  },
  methods: {
    onInitilize (error: any) {
      if (error) {
        alert(`Error1: ${error}`)
        return
      }

      // エラーがない場合は、読み取りを開始
      Quagga.start()
    },
    onDetected (success: any) {
      Quagga.stop()
      this.items.push({ code: success.codeResult.code, format: this.QuaggaToJsBarcodeFormat(success.codeResult.format) })
      this.done = true
      this.code = this.items[0].code
      this.format = { format: this.items[0].format }
      alert('読込完了')
    },
    QuaggaToJsBarcodeFormat (QuaggaFormat: string) {
      switch (QuaggaFormat) {
        case 'code_128': return 'CODE128'
        case 'ean': return 'EAN13'
        case 'ean_13': return 'EAN13'
        case 'ean_8': return 'EAN8'
        case 'ean_5': return 'EAN5'
        case 'ean_2': return 'EAN2'
        case 'upc_a': return 'UPC'
        case 'code_39': return 'CODE39'
        case 'i2of5': return 'ITF14'
        case 'codabar': return 'codabar'
        default: return ''
      }
    },
    select (index: number) {
      this.isError = false
      this.code = this.items[index].code
      this.format = { format: this.items[index].format }
    },
    retry () {
      this.done = false
      this.items = []
      Quagga.init(this.config, this.onInitilize)
    },
    enter () {
      this.$router.push({ path: '/books/new', query: { isbn: this.code } })
    }
  }
})
</script>

<style scoped>
#interactive {
    margin: -16px;
}
</style>
