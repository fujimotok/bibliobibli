import colors from 'vuetify/es5/util/colors'
import path from 'path'
import fs from 'fs'

// for Github Pages
const rootURI = (process.env.DEPLOY_ENV === 'GH_PAGES') ? '/bibliobibli/' : '/'

const config = {
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    script: [
      {
        src:
        "https://cdn.jsdelivr.net/npm/pwacompat@2.0.6/pwacompat.min.js",
        integrity:
        "sha384-GOaSLecPIMCJksN83HLuYf9FToOiQ2Df0+0ntv7ey8zjUHESXhthwvq9hXAZTifA",
        crossorigin: "anonymous",
        defer:true
      }
    ],
    title: 'BIBLIoBIBLI',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no' },
      { hid: 'description', name: 'description', content: 'Personal knowledge management system' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'mobile-web-app-capable', content: 'yes' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: rootURI + 'favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'simplemde/dist/simplemde.min.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/nuxt-simplemde-plugin.js', mode: 'client' },
    { src: '~plugins/dependencies.ts', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/i18n'
  ],

  router: {
    base: rootURI
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'BIBLIoBIBLI',
      description: 'Personal knowledge management system',
      orientation: 'portrait',
      scope: rootURI,
      display: 'standalone',
      id: rootURI,
      start_url: rootURI,
      theme_color: '#3C6A0F',
      background_color: '#FFFFFF',
      icons: [
        {
          src: rootURI + 'icon.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
    }
  },

  i18n: {
    locales: [
      { code: 'ja', name: 'Japanese', iso: 'ja-JP', file: 'ja.json' },
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' }
    ],
    defaultLocale: 'en',
    langDir: 'js/i18n/',
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'en'
    },
    detectBrowserLanguage: {
      useCookie: false
    },
    vueI18nLoader: true,
    lazy: true
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
      },
      options: { customProperties: true }
    },
  },

  // env
  publicRuntimeConfig: {
    NODE_ENV : process.env.NODE_ENV,
    ROOT_URI : rootURI,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}

if (process.env.NODE_ENV === "development") {
  config.server = {
    port: 443,
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/localhost.pem'))
    }
  }
  config.plugins.push({ src: '~plugins/console-history.ts', mode: 'client' })
}

export default config
