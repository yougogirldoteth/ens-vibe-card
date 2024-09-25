// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  runtimeConfig: {
    public: {
      walletAddress: process.env.NUXT_PUBLIC_WALLET_ADDRESS || '',
    },
  },

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],

  compatibilityDate: '2024-04-03',
})
