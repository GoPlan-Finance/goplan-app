<template>
  <div>
    <h1 class="text-gray-700 text-3xl font-medium mb-6">
      Watchlists
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="watchlist of watchlists"
        :key="watchlist.slug"
      >
        <div class="shadow-md overflow-hidden rounded-lg">
          <div class="bg-white px-6 py-4">
            <div class="text-gray-900 font-bold text-xl mb-1">
              {{ watchlist.title }}
            </div>
            <div class="text-gray-500  text-sm mb-2">
              {{ $t('watchlists.updated') }} {{ watchlist.update.fromNow() }}
            </div>


            <div
              class="min-w-min p-3 text-xl rounded-lg font-bold"
              :class="watchlist.percentChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              <span v-if="watchlist.percentChange >= 0">+</span>{{ watchlist.percentChange.toFixed(2) }} %
            </div>
          </div>
          <a
            :href="'watchlists/' + watchlist.slug"
            class="block px-6 py-4 bg-gray-50 text-gray-500"
          >
            {{ $t('watchlists.show_more') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import dayjs from 'dayjs'

export type WatchlistItem = {
  title: string,
  slug: string,
  update: dayjs.DayJs,
  percentChange: number
}

export default defineComponent({
  setup () {
    const watchlists: WatchlistItem[] = ref([
      {
        title         : 'Test Watchlist',
        slug          : 'test-watchlist',
        update        : dayjs(new Date).subtract('10', 'days'),
        percentChange : 2.4,
      },
      {
        title         : 'Big Tech Watchlist',
        slug          : 'big-tech-watchlist',
        update        : dayjs(new Date).subtract('10', 'weeks'),
        percentChange : -12.52,
      },
      {
        title         : 'Test Watchlist',
        slug          : 'test-watchlist',
        update        : dayjs(new Date).subtract('10', 'months'),
        percentChange : 2.4,
      },
      {
        title         : 'Big Tech Watchlist',
        slug          : 'big-tech-watchlist',
        update        : dayjs(new Date).subtract('1', 'year'),
        percentChange : -12.52,
      },
      {
        title         : 'Test Watchlist',
        slug          : 'test-watchlist',
        update        : dayjs(new Date).subtract('3', 'years'),
        percentChange : 2.4,
      },
      {
        title         : 'Big Tech Watchlist',
        slug          : 'big-tech-watchlist',
        update        : dayjs(new Date).subtract('3', 'month'),
        percentChange : -12.52,
      },
    ])
    return {
      watchlists
    }
  },
})
</script>
