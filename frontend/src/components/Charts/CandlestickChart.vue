<template>
  <label
      v-for="(scale) in timeScales"
      :key="scale.label"
      class="inline-flex items-center px-2"
  >
    <input
        v-model="currentScaleLabel"
        :class="`form-radio h-5 w-5 text-green-600`"
        :value="scale.label"
        name="radio"
        type="radio"
        @click="scaleClicked(scale.label)"
    >
    <span class="ml-2 text-gray-700">{{ scale.label }}</span>
  </label>

  <apexchart
      ref="theChart"
      :options="chartData.chartOptions"
      :series="chartData.series"
      height="350"
      type="candlestick"
  />

  <!--  @todo If you remove this, charts wont update-->
  <small>{{ chartData.series }}</small>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from 'vue'
import {AssetSymbol} from '../../../../common/models'
import * as dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'
import {getScaleByLabel, getScaleForRange, loadData, timeScales} from './CandlestickChart'

dayjs.extend(duration)

export default defineComponent({
  props: {
    assetSymbol: {
      type: AssetSymbol,
      required: true
    }
  },
  async setup(props) {
    const theChart = ref(null)
    const currentScaleLabel = ref('3 Months')


    const chartData = reactive({
      chartOptions: {
        chart: {
          type: 'candlestick',
          height: 350,
          events: {
            beforeZoom: (chartContext, {xaxis}) => {
              return {
                xaxis: {
                  min: xaxis.min,
                  max: Math.min(xaxis.max, dayjs().valueOf()) // block future time
                }
              }
            },
            zoomed: async (chartContext, {xaxis, yaxis}) => {
              console.log(xaxis)
              console.log(yaxis)

              const scale = getScaleForRange({
                max: xaxis.max,
                min: xaxis.min,
              })
              currentScaleLabel.value = scale.label
            }

          },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeFormatter: {
              year: 'yyyy',
              month: 'yyyy-MM',
              day: 'yyyy-MM-dd',
              hour: 'HH:mm'
            }
          }
        },
        yaxis: {
          tooltip: {
            enabled: true
          }

        },
      },
      series: [
        {
          name: 'series-1',
          data: []
        },
      ],

    })

    const reloadData = async (
        min: dayjs.Dayjs = undefined,
        max: dayjs.Dayjs = undefined,
    ) => {

      const scale = getScaleByLabel(currentScaleLabel.value)
      const from = min ? min : dayjs().subtract(scale.visible.asDays(), 'days')
      const to = max ? max : dayjs()

      chartData.series[0].data = await loadData(
          props.assetSymbol,
          scale,
          from,
          to,
      )

    }
    const scaleClicked = async (label: string) => {
      currentScaleLabel.value = label
      await reloadData()
    }

    //watch(currentScaleLabel, () => reloadData())
    watch(() => props.assetSymbol, () => reloadData())

    // onMounted(async () => {
    await reloadData()
    //});


    return {
      theChart,
      timeScales,
      scaleClicked,
      currentScaleLabel,
      chartData,
    }
  },
})

</script>
