<template>
  <apexchart
    type="candlestick"
    height="350"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'

export type CandlestickSeries = {
  x: Date,
  y: number[]
}

export default defineComponent({
  props: {
    series: {
      type     : Object as CandlestickSeries[],
      required : true
    }
  },
  setup (props) {
    const data = reactive({
      chartOptions: {
        chart: {
          type   : 'candlestick',
          height : 350
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        }
      },
      series: [
        {
          name : 'series-1',
          data : props.series
        },
      ],
    })

    return {
      ...toRefs(data),
    }
  },
})

</script>
