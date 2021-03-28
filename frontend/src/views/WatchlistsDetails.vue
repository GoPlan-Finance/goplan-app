<template>
  <div>
    <template v-if="watchlist">
      <h1 class="text-gray-700 text-3xl font-medium mb-6">
        {{ watchlist.get('name') }}
      </h1>

      <li v-for="symbol in symbols">
        <appLink
          :ticker="symbol.get('symbol')"
          to="ticker_details"
        >
          {{ symbol.get('name') }}
        </appLink>
      </li>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount,onUnmounted, ref} from 'vue'
import dayjs from 'dayjs'
import {Watchlist} from '../../../common/models/Watchlist'
import {AssetSymbol} from '../../../common/models'


export default defineComponent({
  props: {
    watchlistId: {
      type     : String,
      required : true,
    },
  },
  setup (props) {
    const newWatchlistName = ref('')
    const watchlist        = ref(null)
    const symbols          = ref([])
    let liveSubscription   = null
    const createList       = async () => {

      const watchlist = new Watchlist()

      watchlist.set('name', newWatchlistName.value)
      await watchlist.save()
      newWatchlistName.value = ''
    }

    onBeforeMount(async () => {
      const q = new Parse.Query(Watchlist)
      q.get(props.watchlistId)

      liveSubscription = await Watchlist.liveQuery(q, null, async wl => {
        symbols.value   = await wl.relation('symbols').query().find()
        watchlist.value = wl
      })
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })

    return {
      dayjs,
      watchlist,
      symbols,
      newWatchlistName,
      createList,
    }
  },
})
</script>
