// vite.config.js
import path from 'path'
import vue from '@vitejs/plugin-vue'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import vueI18n from '@intlify/vite-plugin-vue-i18n'


// https://vitejs.dev/config/
export default {
  server: {
    https: true
  },
  esmExternals : true,
  optimizeDeps : {
    exclude: [
      'parse', // @todo check if ok to ignore
    ]
  },
  resolve: {
    alias: {
      '/@common'     : path.resolve(__dirname, '../common'),
      '/@components' : path.resolve(__dirname, './src/components'),
      '/@styleguide' : path.resolve(__dirname, './src/styleguide'),
      '/@views'      : path.resolve(__dirname, './src/views'),
      '/@store'      : path.resolve(__dirname, './src/store'),
      '/@utils'      : path.resolve(__dirname, './src/utils'),
    },
  },
  plugins: [
    vue(),
    pluginRewriteAll(), // we need  this to allow dot(.) in path
    vueI18n({
      include: path.resolve(__dirname, './src/locales/**')
    })
  ]
}
