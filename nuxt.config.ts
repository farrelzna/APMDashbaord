import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  ssr: false,

  typescript: {
    shim: false,
  },

  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  app: {
    head: {
      title: "Dasa Aprilindo Sentosa",
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
    
  build: {
    transpile: ["vuetify"],
  },

  nitro: {
    serveStatic: true,
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://be.talentaraya.co.id/api/v1',
      apiMedia: process.env.API_MEDIA || 'http://be.talentaraya.co.id',
      realtimeDelay: (() => {
        const raw = process.env.REALTIME_DELAY ?? '';
        const minutes = parseFloat(raw);
        return (minutes > 0 && !isNaN(minutes) ? minutes : 5) * 60 * 1000;
      })(),
      keycloakUrl: process.env.KEYCLOAK_URL || 'http://192.168.18.249:8080'
    }
  },

  vite: {
    vue: {
      template: { transformAssetUrls }
    },
    plugins: [
      vuetify({
        autoImport: true,
      }),
    ],
  },

  css: [ '@/assets/global.css' ],
})
