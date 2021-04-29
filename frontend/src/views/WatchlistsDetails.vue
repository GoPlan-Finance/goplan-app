<template>
  <template v-if="watchlist">
    <h1 class="text-gray-700 text-3xl font-medium mb-6">
      {{ watchlist.name }}
    </h1>

    <DataTable
      :config="config"
      :rows="sortedItems"
    >
      <template
        #beforeFilters(right)
      >
        <AssetSearch
          v-model="selectedAsset"
          placeholder="Add Symbol"
        />
      </template>


      <!--Copied from Transactions.vue-->
      <template
        #field(ticker)="{ row }"
      >
        <AppLink
          v-if="row.symbol"
          :ticker="row.symbol.symbol"
          class="font-bold"
          to="ticker_details"
        >
          <p class="font-normal text-sm overflow-hidden overflow-ellipsis">
            {{ row.symbol.symbol }}
          </p>
        </AppLink>
        <span v-else>
          {{ row.symbol.symbol }}
        </span>
      </template>

      <template
        #field(name)="{ row }"
      >
        <AppLink
          v-if="row.symbol"
          :ticker="row.symbol.symbol"
          class="font-bold"
          to="ticker_details"
        >
          <p class="font-normal text-sm">
            {{ row.symbol.name }}
          </p>
        </AppLink>
        <span v-else>
          {{ row.symbol.name }}
        </span>
      </template>

      <template
        #field(dayPLChange)="{ row }"
      >
        <AssetPriceChange
          v-if="row.lastPrice"
          :compare-from="row.lastPrice.previousClose"
          :compare-to=" row.lastPrice.price"
        />
        <span v-else>
          --
        </span>
      </template>

      <template
        #actions="{row}"
      >
        <div
          class="cursor-pointer hover:text-red-600 text-gray-300"
          @click="remove(row)"
        >
          <GoIcons
            name="Trash"
            class="h-6 w-6"
          />
        </div>
      </template>
    </DataTable>
  </template>
</template>

<script lang="ts">
import { Watchlist, WatchlistItem } from '/@common/models'
import { Holding } from '/@common/models/Holding'
import { Query } from '/@common/Query'
import AssetPriceChange from '/@components/AssetPriceChange.vue'
import AssetSearch from '/@components/AssetSearch.vue'
import DataTable from '/@components/DataTable.vue'
import AppLink from '/@components/router/AppLink.vue'
import { useAssetPriceStore } from '/@store/index'
import { Screens } from '/@utils/screens'
import { defineComponent, onBeforeMount, onUnmounted, reactive, ref, shallowReactive, toRef, toRefs, watch } from 'vue'


export default defineComponent({
  components : {AssetPriceChange, AssetSearch, AppLink, DataTable},
  props      : {
    id: {
      type     : String,
      required : true,
    },
  },
  setup (props) {
    let liveSubscription  = null
    let liveSubscription2 = null
    const selectedAsset   = ref(null)
    const watchlistId     = toRef(props, 'id')
    const watchlistItems  = shallowReactive([])
    const priceStore      = useAssetPriceStore()

    const data = reactive({
      watchlist   : null,
      items       : [],
      sortedItems : [],
      config      : {
        fields: {
          name      : {},
          ticker    : {},
          createdAt : {
            format: 'date',
          },
          dayPLChange: {
            format : 'percent',
            value  : (row : Holding) => {
              if (!row.lastPrice || row.lastPrice.price === 0) {
                return null
              }

              return (row.lastPrice.previousClose / row.lastPrice.price) - 1
            },
          },
        },
        tableLayout: {
          [Screens.DEFAULT]: [
            [
              'ticker', 'name',
            ],
            'createdAt',
            'dayPLChange',
          ],
        },
        settings: {
          actions           : true,
          translationPrefix : 'watchlist.table',
        },
      },
    })

    async function remove (watchlistItem : WatchlistItem) {
      watchlistItem.destroy()
    }

    onBeforeMount(async () => {
      await priceStore.subscribe()

      const q          = Query.create(Watchlist)
      data.watchlist   = await q.get(watchlistId.value)
      liveSubscription = await q.liveQuery(null, async wl => {
        data.watchlist = wl
      })

      const q2          = Query.create(WatchlistItem)
      q2.equalTo('watchlist', data.watchlist)
      q2.include('symbol')
      liveSubscription2 = await q2.liveQuery(watchlistItems)
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
      if (liveSubscription2) {
        await liveSubscription2.unsubscribe()
      }
    })

    watch(selectedAsset, async () => {
      if (!selectedAsset.value) {
        return
      }
      if (data.items.find(item => item.symbol.id === selectedAsset.value.id)) {
        console.warn('Symbol already exists')
        selectedAsset.value = null
        return
      }

      const wi = new WatchlistItem()

      wi.watchlist = data.watchlist
      wi.symbol    = selectedAsset.value

      await wi.save()
      //data.items.push(await wi.save())

      selectedAsset.value = null
    })


    watch(watchlistItems, async () => {

      data.sortedItems = watchlistItems

      const symbols = watchlistItems.map(item => item.symbol)

      await priceStore.watch(symbols, assetPrice => {

        const item = data.sortedItems.find(item => {
          return item.symbol && item.symbol.id === assetPrice.symbol.id
        })

        item.lastPrice = assetPrice
      })

    }, {immediate: true})


    return {
      remove,
      selectedAsset,
      ...toRefs(data),
    }
  },
})
</script>
