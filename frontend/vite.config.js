// vite.config.js

import vue from '@vitejs/plugin-vue'
import pluginRewriteAll from 'vite-plugin-rewrite-all';


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
    pluginRewriteAll(), // we need  this to allow dot(.) in path
  ]
}
