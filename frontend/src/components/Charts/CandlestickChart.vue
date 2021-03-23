<template>
  <label
    v-for="(scale) in timeScales"
    :key="scale.label"
    :class="currentScaleLabel === scale.label ? 'bg-gray-300' : ''"
    class="inline-flex items-center px-2 mr-1 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
  >
    <input
      v-model="currentScaleLabel"
      :value="scale.label"
      class="hidden"
      name="radio"
      type="radio"
      @click="scaleClicked(scale.label)"
    >
    <span class="py-1 px-2 text-sm text-gray-700">{{ scale.label }}</span>
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
import {defineComponent, onMounted, reactive, ref, watch} from 'vue'
import {AssetSymbol} from '../../../../common/models'
import * as dayjs from 'dayjs'
import * as duration from 'dayjs/plugin/duration'
import {getScaleByLabel, getScaleForRange, loadData, timeScales} from './CandlestickChart'

dayjs.extend(duration)

export default defineComponent({
  props: {
    assetSymbol: {
      type     : AssetSymbol,
      required : true
    }
  },
  setup (props) {
    const theChart          = ref(null)
    const currentScaleLabel = ref('Today')
    let currentScale        = reactive(getScaleByLabel('Today'))

    const series       = ref(
      [
        {
          name : 'series-1',
          data : []
        }
      ]
    )

    const reloadData   = async (
      min: dayjs.Dayjs = undefined,
      max: dayjs.Dayjs = undefined,
    ) => {
      const from = min ? min : dayjs().subtract(currentScale.visible.asSeconds(), 'seconds')
      const to   = max ? max : dayjs()

      series.value = [
        {
          data: await loadData(
            props.assetSymbol,
            currentScale,
            from,
            to,
          )
        }
      ]
    }
    const scaleClicked = async (label: string) => {
      currentScale            = reactive(getScaleByLabel(label))
      currentScaleLabel.value = currentScale.label

      await reloadData()
    }

    const handleZoom = async (min, max) => {
      const scale             = getScaleForRange({
        max,
        min,
      })
      currentScale            = reactive(scale)
      currentScaleLabel.value = currentScale.label
      await reloadData(dayjs(min), dayjs(max))
    }

    const chartOptions = reactive({
      chart: {
        animations: {
          enabled: false,
        },
        type   : 'candlestick',
        height : 350,
        events : {
          beforeZoom: (chartContext, {xaxis}) => {
            return {
              xaxis: {
                min : xaxis.min,
                max : Math.min(xaxis.max, dayjs().valueOf()) // block future time
              }
            }
          },
          scrolled: async (chartContext, {xaxis}) => {
            await handleZoom(xaxis.min, xaxis.max)
          },

          zoomed: async (chartContext, {xaxis}) => {
            await handleZoom(xaxis.min, xaxis.max)
          }
        },
      },
      xaxis: {
        type   : 'category',
        labels : {
          formatter (value /*, timestamp, opts*/) {
            return value
            // return dayjs(value).toISOString()
          }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    })


    watch(() => props.assetSymbol, () => reloadData())

    onMounted(async () => {
      await reloadData()
    })


    return {
      theChart,
      timeScales,
      scaleClicked,
      currentScale,
      currentScaleLabel,

      chartOptions,
      series,
    }
  },
})

</script>
