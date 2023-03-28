// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],
  ssr: false,
  typescript: {
    strict: true,
    typeCheck: "build",
  },
  css: ["@/assets/main.scss"],
});
