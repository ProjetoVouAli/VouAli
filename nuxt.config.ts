import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@nuxtjs/tailwindcss";


export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  compatibilityDate: '2025-05-15',

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    'shadcn-nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  }
})