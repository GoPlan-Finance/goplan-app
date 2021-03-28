<template>
  <div>
    <h1 class="text-gray-700 text-3xl font-medium mb-6">
      Watchlists
    </h1>

    Create list <input
      v-model="newWatchlistName"
      @keypress.enter="createList"
    > (press enter to save)
    <br>
    <br>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="watchlist of watchlists"
        :key="watchlist.id"
      >
        <div class="shadow-md overflow-hidden rounded-lg">
          <div class="bg-white px-6 py-4">
            <div class="text-gray-900 font-bold text-xl mb-1">
              {{ watchlist.get('name') }} <small class="font-normal text-xs">({{ watchlist.symbols.length }} stocks)</small>
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
          <router-link
            :href="'watchlists/' + watchlist.slug"
            :to="{name: 'watchlist', params:{watchlistId: watchlist.id}}"
            class="block px-6 py-4 bg-gray-50 text-gray-500"
          >
            {{ $t('watchlists.show_more') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onUnmounted, ref} from 'vue'
import dayjs from 'dayjs'
import {Watchlist} from '../../../common/models/Watchlist'

export type WatchlistItem = {
  title: string,
  slug: string,
  update: dayjs.DayJs,
  percentChange: number
}

export default defineComponent({
  setup () {
    const watchlists: Watchlist[] = ref([])
    const newWatchlistName        = ref('')
    let liveSubscription          = null

    const createList = async () => {

      const watchlist = new Watchlist()

      watchlist.set('name', newWatchlistName.value)
      await watchlist.save()
      newWatchlistName.value = ''
    }

    const show = async (watchlist: Watchlist) => {

      watchlist.percentChange = (Math.random() * 10) - 3.5
      watchlist.symbols       = await watchlist.relation('symbols').query().find()
    }


    onMounted(async () => {
      const q = new Parse.Query(Watchlist)

      liveSubscription = await Watchlist.liveQuery(q, watchlists.value,  show)
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })


    return {
      dayjs,
      watchlists,
      newWatchlistName,
      createList,
    }
  },
})
</script>
