// vite.config.js

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default {
  esmExternals : true,
  optimizeDeps : {
    exclude: [
      'parse'
    ]
  },
  plugins: [
    vue(),
  ]
}
