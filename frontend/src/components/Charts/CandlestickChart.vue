<template>
  <label
    v-for="(label, days) in timeScales"
    :key="days"
    :class="currentScale === days ? 'bg-gray-300' : ''"
    class="inline-flex items-center px-2 mr-1 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
  >
    <input
      v-model="currentScale"
      class="hidden"
      :value="days"
      name="radio"
      type="radio"
    >
    <span class="py-1 px-2 text-sm text-gray-700">{{ label }}</span>
  </label>
  <apexchart
    ref="theChart"
    :options="chartOptions"
    :series="series"
    height="350"
    type="candlestick"
  />
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from 'vue'
import {AssetSymbol} from '../../../../common/models'
import * as dayjs from 'dayjs'

export type CandlestickSeries = {
  x: Date,
  y: [open: number, high: number, low: number, close: number]
}

export default defineComponent({
  props: {
    assetSymbol: {
      type     : AssetSymbol,
      required : true
    }
  },
  async setup (props) {
    const theChart     = ref(null)
    const currentScale = ref(30)

    const chartOptions = reactive({
      chart: {
        type   : 'candlestick',
        height : 350
      },
      xaxis: {
        type: 'category',
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    })

    const series = ref(
      [
        {
          name : 'series-1',
          data : []
        }
      ]
    )

    const updateSeriesLine = (data) => {
      console.log(theChart.value)

      series.value[0].data = data
      //   theChart.value.$forceUpdate()


    }

    const loadData = async () => {
      const eod = await Parse.Cloud.run('Assets--GetEndOfDay', {

        from        : dayjs().subtract(currentScale.value, 'days').toISOString(),
        to          : dayjs().toISOString(),
        assetSymbol : props.assetSymbol.toPointer()
      })

      const ohlc: CandlestickSeries[] = eod.map(elem => {
        return {
          x : elem.date,
          y : [
            elem.open.toFixed(2), elem.open.toFixed(2), elem.low.toFixed(2), elem.close.toFixed(2)
          ]
        } as CandlestickSeries
      })

      series.value = [
        {
          name : 'series-1',
          data : ohlc
        }
      ]

      console.log(series.value[0].data)
      //  updateSeriesLine(data)
    }


    watch(currentScale, () => loadData())
    watch(() => props.assetSymbol, () => loadData())

    // onMounted(async () => {
    await loadData()
    //});


    const timeScales = reactive({
      1     : 'Today',
      7     : 'Week',
      30    : 'Month',
      90    : '3 M',
      365   : '1 Y',
      1400  : '3 Y',
      3650  : '10 Y',
      36500 : 'Max',
    })

    return {
      chartOptions,
      series,
      theChart,
      timeScales,
      currentScale,
    }
  },
})

</script>
