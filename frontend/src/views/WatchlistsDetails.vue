<template>
  <template v-if="watchlist">
    <h1 class="text-gray-700 text-3xl font-medium mb-6">
      {{ watchlist.get('name') }}
    </h1>

    <DataTable :config="data">
      <template #name="{row}">
        <app-Link
          :ticker="row.symbol"
          to="ticker_details"
        >
          {{ row.name }}
        </app-Link>
      </template>
    </DataTable>
  </template>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeMount, onUnmounted, ref} from 'vue'
import dayjs from 'dayjs'
import {Watchlist} from '../../../common/models/Watchlist'
import DataTable, {TableCellType, TableConfig} from '../components/DataTable.vue'
import {AssetSymbol} from '../../../common/models'

enum Column {
  NAME = 'name',
  SYMBOL = 'symbol'
}

export default defineComponent({
  components : {DataTable},
  props      : {
    id: {
      type     : String,
      required : true,
    },
  },
  setup (props) {
    const watchlist      = ref(null)
    const symbols        = ref<AssetSymbol[]>([])
    let liveSubscription = null

    onBeforeMount(async () => {
      const q = new Parse.Query(Watchlist)
      q.get(props.id)

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

    const data: TableConfig = computed(() => {
      const rows = symbols.value.map(symbol => {
        return {
          [Column.NAME]   : symbol,
          [Column.SYMBOL] : symbol.symbol
        }
      })

      return {
        headers:
            [
              [
                {
                  key  : Column.NAME,
                  type : TableCellType.CUSTOM
                },
                {
                  key     : Column.SYMBOL,
                  classes : 'lg:text-gray-500'
                }
              ],
            ],
        rows,
        settings: {
          actions           : false,
          translationPrefix : 'watchlist.table'
        }
      }
    })

    return {
      dayjs,
      watchlist,
      symbols,
      data,
    }
  },
})
</script>
