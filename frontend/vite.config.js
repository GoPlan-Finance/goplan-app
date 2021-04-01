// vite.config.js
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  esmExternals : true,
  optimizeDeps : {
    exclude: [
      'parse', // @todo check if ok to ignore
      'vue-class-store', // @todo check if ok to ignore
      // 'crypto-js', // @todo check if ok to ignore
    ]
  },
  resolve: {
    alias: {
      '@/': resolve(__dirname, 'src')
    },
  },
  plugins: [
    vue(),
    pluginRewriteAll(), // we need  this to allow dot(.) in path
    vueI18n({
      include: resolve(__dirname, './src/locales/**')
    }),
  ]
})
