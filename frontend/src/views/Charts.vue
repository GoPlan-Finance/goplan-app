<template>
  <h3 class="text-gray-700 text-3xl font-bold mb-6">
    Charts
  </h3>

  <div class="rounded-lg bg-white overflow-hidden shadow-lg p-6 mb-6">
    <h2 class="text-gray-700 text-xl font-bold mb-6">
      Bar Chart
    </h2>
    <BarChart />
  </div>

  <div class="rounded-lg bg-white overflow-hidden shadow-lg p-6 mb-6">
    <h2 class="text-gray-700 text-xl font-bold mb-6">
      Candlestick Chart
    </h2>
    <CandlestickChart />
  </div>

  <div class="rounded-lg bg-white overflow-hidden shadow-lg p-6 mb-6">
    <h2 class="text-gray-700 text-xl font-bold mb-6">
      Donut Chart
    </h2>
    <DonutChart />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import DonutChart from '../components/Charts/DonutChart.vue'
import BarChart from '../components/Charts/BarChart.vue'
import CandlestickChart from '../components/Charts/CandlestickChart.vue'

export default defineComponent({
  components: {
    DonutChart,
    BarChart,
    CandlestickChart
  },
})

</script>
