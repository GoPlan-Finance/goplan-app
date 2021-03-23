<template>
  <label
    v-for="(label, days) in timeScales"
    :key="days"
    class="inline-flex items-center px-2"
  >
    <input
      v-model="currentScale"
      :class="`form-radio h-5 w-5 text-green-600`"
      :value="days"
      name="radio"
      type="radio"
    >
    <span class="ml-2 text-gray-700">{{ label }}</span>
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
        type: 'datetime'
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
          x : new Date(elem.date),
          y : [
            elem.open, elem.open, elem.low, elem.close
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
      90    : '3 Months',
      365   : '1 yr',
      1400  : '3 yr',
      3650  : '10 yr',
      36500 : 'All Time',
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
