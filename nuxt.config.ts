import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Welcome to Maraboo for Business Dashboard',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'use-credentials',
        },
        {
          rel: 'stylesheet',
          type: 'text/css',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&family=Lato:wght@300;400;700;900&family=Open+Sans:wght@400&display=swap',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          type: 'image/x-icon',
          href: '/apple-touch-icon.png',
        },
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        {
          rel: 'mask-icon',
          href: '/safari-pinned-tab.svg',
          color: '#011627',
        },
      ],
    },
  },

  ssr: false,
  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      collectionsBaseUrl: process.env.NUXT_PUBLIC_COLLECTIONS_API_URL || 'https://collections.maraboo.dev',

      originHeader: process.env.NUXT_PUBLIC_ORIGIN_HEADER || 'admin.mara.boo',

      apiTimeout: parseInt(process.env.NUXT_PUBLIC_API_TIMEOUT || '30000', 10),
      environment: process.env.NODE_ENV || 'development',

      pusherKey: process.env.NUXT_PUBLIC_PUSHER_KEY,
      pusherCluster: process.env.NUXT_PUBLIC_PUSHER_CLUSTER,
    },
  },

  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
  devServer: {
    port: 3005,
  },
  css: ['~/assets/app.css'],
  compatibilityDate: '2025-04-25',
})
