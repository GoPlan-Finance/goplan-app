<template>
  <template v-if="watchlist">
    <h1 class="text-gray-700 text-3xl font-medium mb-6">
      {{ watchlist.name }}
    </h1>

    <DataTable
      :config="config"
      :rows="sortedRows"
    >
      <template
        #symbol="{ row }"
      >
        <AppLink
          :ticker="row.symbol"
          to="ticker_details"
        >
          <p class="mr-3 font-bold">
            {{ row.symbol }}
          </p>
          <p class="font-normal text-sm">
            {{ row.name }}
          </p>
        </AppLink>
      </template>
    </DataTable>
  </template>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeMount, onUnmounted, reactive, toRefs} from 'vue'
import dayjs from 'dayjs'
import {AssetSymbol, Watchlist} from '../../../common/models'
import DataTable from '../components/DataTable.vue'
import AppLink from '../components/router/AppLink.vue'


export default defineComponent({
  components : {AppLink, DataTable},
  props      : {
    id: {
      type     : String,
      required : true,
    },
  },
  setup (props) {
    let liveSubscription = null

    const data = reactive({
      watchlist : null,
      items     : [],
      config    : {
        headers: {
          symbol: {},
        },
        settings: {
          actions           : false,
          translationPrefix : 'watchlist.table'
        }
      }
    })


    onBeforeMount(async () => {
      const q = new Parse.Query(Watchlist)
      q.get(props.id)

      liveSubscription = await Watchlist.liveQuery(q, null, async wl => {
        data.items     = await wl.relation('symbols').query().find()
        data.watchlist = wl
      })
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })

    const sortedRows = computed(() => {
      return data.items.filter(row => {

        return true
      })
    })


    return {
      dayjs,
      ...toRefs(data),
      sortedRows,
    }
  },
})
</script>
