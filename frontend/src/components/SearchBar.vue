<template>
  <asset-search v-model="assetSymbol" />
</template>

<script lang="ts">

import {defineComponent, reactive, ref, watch} from 'vue'
import {AssetSymbol} from '../../../common/models'
import {useRouter} from 'vue-router'
import AssetSearch from './AssetSearch.vue'


export default defineComponent({
  components: {AssetSearch},
  setup () {
    const {push} = useRouter()

    const assetSymbol : AssetSymbol                     = ref(null)

    watch(assetSymbol, async () => {

      if (!assetSymbol.value) {
        return
      }

      const symbol      = assetSymbol.value
      assetSymbol.value = null

      push({
        name   : 'ticker_details',
        params : {
          ticker: symbol.symbol
        }
      })

    })


    return {
      assetSymbol
    }
  }


})
</script>
