// vite.config.js
import path, { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import vueI18n from '@intlify/vite-plugin-vue-i18n'

// https://vitejs.dev/config/
export default {
  server: {
    https: true,
    host:  'local.goplan.finance',
  },

  esmExternals: true,
  optimizeDeps: {
    exclude: [
      'parse', // @todo check if ok to ignore
    ]
  },
  resolve:      {
    alias: [
      { find: '@', replacement: resolve('./src'), },
      { find: '@styleguide', replacement: resolve('./src/styleguide'), },
      { find: '@core', replacement: resolve('./src/@core'), },
      { find: '~@core', replacement: resolve('./src/@core'), },
      { find: '@themeConfig', replacement: resolve('./src/themeConfig.ts'), },
      { find: '@validations', replacement: resolve('./src/@core/utils/validations/validations.js'), },
      { find: '@models', replacement: resolve('../common/src/models'), },
      { find: '@locales', replacement: resolve('../common/src/locales'), },
      { find: '@common', replacement: resolve('../common/src'), },
      { find: '@utils', replacement: resolve('../utils/src'), },
      { find: '@components', replacement: resolve('./src/components'), },
      { find: '@pages', replacement: resolve('./src/pages'), },
      { find: '@views', replacement: resolve('./src/views'), },
      { find: '@store', replacement: resolve('./src/store'), },
      { find: '@ui-utils', replacement: resolve('./src/utils'), },
    ],
  },
  plugins:      [
    vue(),
    pluginRewriteAll(), // we need  this to allow dot(.) in path
    vueI18n({
      include: path.resolve(__dirname, './src/locales/**')
    })
  ]
}
