import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueTableIcons from 'vue-tabler-icons'

// ts-expect-error - defineNuxtPlugin is auto-imported by Nuxt
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
  })

  nuxtApp.vueApp.use(vuetify)
  nuxtApp.vueApp.use(VueTableIcons)
})
