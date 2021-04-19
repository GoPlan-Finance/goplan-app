<template>
  <div>
    <HeadlineActions
      :headline="$t('watchlists.headline')"
    >
      <AddWatchlist />
    </HeadlineActions>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="watchlist of watchlists"
        :key="watchlist.id"
      >
        <div class="shadow-md overflow-hidden rounded-lg">
          <div class="bg-white px-6 py-4">
            <div class="text-gray-900 font-bold text-xl mb-1">
              {{ watchlist.get('name') }}
              <small
                v-if="watchlist.symbolsCount"
                class="font-normal text-xs"
              >({{ watchlist.symbolsCount }} stocks)</small>
            </div>

            <div class="text-gray-500  text-sm mb-2">
              {{ $t('watchlists.updated') }} {{ dayjs(watchlist.get('updatedAt')).fromNow() }}
            </div>


            <div
              :class="watchlist.percentChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="min-w-min p-3 text-xl rounded-lg font-bold"
            >
              <span v-if="watchlist.percentChange >= 0">+</span>{{ watchlist.percentChange.toFixed(2) }} %
            </div>
          </div>
          <div
            class="flex justify-between px-6 py-4 bg-gray-50 text-gray-500"
          >
            <AppLink
              :id="watchlist.id"
              class="hover:text-blue-500"
              to="watchlist"
            >
              {{ $t('watchlists.show_more') }}
            </AppLink>
            <div
              class="cursor-pointer hover:text-red-600"
              @click="remove(watchlist)"
            >
              <svg
                class="h-6 w-6 stroke-1 stroke-current"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Watchlist, WatchlistItem } from '/@common/models'
import { Query } from '/@common/Query'
import AddWatchlist from '/@components/AddWatchlist.vue'
import HeadlineActions from '/@components/HeadlineActions.vue'
import dayjs from 'dayjs'
import { defineComponent, onBeforeMount, onUnmounted, ref } from 'vue'


export default defineComponent({
  components: {HeadlineActions, AddWatchlist},
  setup () {
    const watchlists     = ref<Watchlist[]>([])
    let liveSubscription = null

    const show = async (watchlist : Watchlist) => {
      watchlist.percentChange = (Math.random() * 10) - 3.5
      watchlist.symbolsCount  = await Query.create(WatchlistItem).equalTo('watchlist', watchlist).count()
    }

    async function remove (watchlist : Watchlist) {
      watchlist.destroy()
    }

    onBeforeMount(async () => {
      const q          = new Query(Watchlist)
      liveSubscription = await q.liveQuery(watchlists.value, show)
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })

    return {
      dayjs,
      watchlists,
      remove,
    }
  },
})
</script>
