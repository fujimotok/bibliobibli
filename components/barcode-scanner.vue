<template>
  <div id="interactive" />
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
  name: 'BarcodeScanner',
  props: {
    value: { type: String, default: "" },
  },
  data(): DataType {
    return {
      items: [],
      isError: false,
      done: false,
      code: '0',
      format: { format: 'CODE128' },
      config: {},
    }
  },
  errorCaptured (err) {
    console.log('catched by `CHILD errorCaptured`', err.toString())
    this.isError = true
    return false
  },
  mounted () {
      this.config = {
        // カメラの映像の設定
        inputStream: {
          type: 'LiveStream',
          target: document.querySelector('#interactive'), // カメラ映像を表示するHTML要素の設定
          constraints: { facingMode: 'environment'}, // バックカメラの利用を設定. (フロントカメラは'user')
          // area: { top: '30%', right: '10%', left: '10%', bottom: '30%' }
        },
        // 解析するワーカ数の設定
        numOfWorkers: navigator.hardwareConcurrency || 4,
        // バーコードの種類を設定
        decoder: { readers: ['ean_reader'] }
      }
      Quagga.init(this.config, this.onInitilize)
      Quagga.onDetected(this.onDetected)
  },
  async beforeMount () {
  },
  beforeDestroy () {
    Quagga.stop()
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
    onDetected (success: {codeResult: {code: string}}) {
      const code = success.codeResult.code
      if (code.startsWith('978') || code.startsWith('979')) {
        Quagga.stop()
        this.$emit('input', code)
      }
    }
  }
})
</script>

<style scoped>
#interactive {
    display: flex;
    justify-content: center;
}

#interactive >>> video {
    width: 50%;
    height: 50%;
}

#interactive >>> canvas.drawing {
    display: none;
}

#interactive >>> canvas.drawingBuffer {
    display: none;
}
</style>
