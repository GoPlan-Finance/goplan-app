// vite.config.js

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default {
  esmExternals : true,
  optimizeDeps : {
    exclude: [
      'parse', // @todo check if ok to ignore
      'vue-class-store', // @todo check if ok to ignore
      // 'crypto-js', // @todo check if ok to ignore
    ]
  },
  plugins: [
    vue(),
  ]
}
