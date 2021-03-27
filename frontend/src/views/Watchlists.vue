<template>
  <div>
    <h1 class="text-gray-700 text-3xl font-medium">
      Watchlists
    </h1>

    <div
      v-for="watchlist in watchlists"
      class="mt-4 mb-3"
    >
      <div class="shadow-lg max-w-sm overflow-hidden mt-6">
        <div class="rounded-t-lg bg-white px-6 py-4">
          <div class="text-gray-900 font-bold text-xl mb-1">
            {{ watchlist.title }}
          </div>
          <div class="text-gray-500  text-sm mb-2">
            updated {{ watchlist.update }}
          </div>


          <div
            class="min-w-min p-3 text-xl rounded-lg font-bold"
            :class="changeIsPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            <span v-if="changeIsPositive">+</span> {{ percent.toFixed(2) }} %
          </div>
        </div>
        <div class="rounded-b-lg bg-white px-6 py-4 bg-gray-50 text-blue-500">
          <a href="">Show More</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import dayjs, {DayJs} from 'dayjs'

type WatchlistItem = {
  title: string,
  slug: string,
  update: DayJs,
  percentChange: number,
}

export default defineComponent({
  setup () {
    const watchlists: WatchlistItem[] = ref([
      {
        title         : 'Test Watchlist',
        slug          : 'test-watchlist',
        update        : dayjs(new Date),
        percentChange : 2.4
      }
    ])
    const changeIsPositive            = true
    const percent                     = ref(2)
    return {
      watchlists,
      changeIsPositive,
      percent
    }
  },
})
</script>
