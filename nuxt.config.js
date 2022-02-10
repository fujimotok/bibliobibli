import colors from 'vuetify/es5/util/colors'
import path from 'path'
import fs from 'fs'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    script: [
      {
        src:
        "https://cdn.jsdelivr.net/npm/pwacompat@2.0.6/pwacompat.min.js",
        integrity:
        "sha384-GOaSLecPIMCJksN83HLuYf9FToOiQ2Df0+0ntv7ey8zjUHESXhthwvq9hXAZTifA",
        crossorigin: "anonymous",
        defer:true //ここ
      }
    ],
    titleTemplate: '%s - BIBLIoBIBLI',
    title: 'BIBLIoBIBLI',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'mobile-web-app-capable', content: 'yes' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'BIBLIoBIBLI',
      lang: 'ja',
      description: '説明',
      orientation: 'portrait', scope: '/',
      display: 'standalone',
      id: '/',
      start_url: '/',
      theme_color: '#3C6A0F',
      background_color: '#FFFFFF',
      icons: [
        {
          src: '/icon.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: '#3C6A0F',
          secondary: '#57624B',
          accent: '#BA1B1B',
          error: '#e91e63',
          warning: '#ffeb3b',
          info: '#03a9f4',
          success: '#8bc34a'
        },
        light: {
          primary: '#3C6A0F',
          secondary: '#57624B',
          accent: '#BA1B1B',
          error: '#e91e63',
          warning: '#ffeb3b',
          info: '#03a9f4',
          success: '#8bc34a'
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
