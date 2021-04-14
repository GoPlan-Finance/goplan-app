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
  <div>
    <v-chart
      :option="option"
      class="chart"
      @datazoom="onDataZoom"
    />
  </div>
</template>

<script lang="ts">
import { AssetSymbol } from '/@common/models'
import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'

import {
  BarChart,
  BoxplotChart,
  CandlestickChart,
  CustomChart,
  EffectScatterChart,
  FunnelChart,
  GaugeChart,
  GraphChart,
  HeatmapChart,
  LineChart,
  LinesChart,
  MapChart,
  ParallelChart,
  PictorialBarChart,
  PieChart,
  RadarChart,
  SankeyChart,
  ScatterChart,
  SunburstChart,
  ThemeRiverChart,
  TreeChart,
  TreemapChart,
} from 'echarts/charts'
import {
  AriaComponent,
  AxisPointerComponent,
  BrushComponent,
  CalendarComponent,
  DatasetComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  GeoComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  ParallelComponent,
  PolarComponent,
  SingleAxisComponent,
  TimelineComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  VisualMapPiecewiseComponent,
} from 'echarts/components' // -----------------
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CandleData, getScaleByLabel, getScaleForRange, loadData, timeScales } from './CandlestickChart'


dayjs.extend(duration)
use([
  LineChart, BarChart, PieChart, ScatterChart, RadarChart, MapChart, TreeChart, TreemapChart, GraphChart, GaugeChart, FunnelChart, ParallelChart, SankeyChart, BoxplotChart, CandlestickChart, EffectScatterChart, LinesChart, HeatmapChart, PictorialBarChart, ThemeRiverChart, SunburstChart, CustomChart,
  GridComponent, PolarComponent, GeoComponent, SingleAxisComponent, ParallelComponent, CalendarComponent, GraphicComponent, ToolboxComponent, TooltipComponent, AxisPointerComponent, BrushComponent, TitleComponent, TimelineComponent, MarkPointComponent, MarkLineComponent, MarkAreaComponent, LegendComponent, DataZoomComponent, DataZoomInsideComponent, DataZoomSliderComponent, VisualMapComponent, VisualMapContinuousComponent, VisualMapPiecewiseComponent, AriaComponent, DatasetComponent, TransformComponent,
  CanvasRenderer,
  PieChart,
  BarChart,
  CandlestickChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])


export default defineComponent({
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'light',
  },
  props: {
    assetSymbol: {
      type     : AssetSymbol,
      required : true,
    },
  },
  setup (props) {
    const theChart          = ref(null)
    const currentScaleLabel = ref('Today')
    let currentScale        = reactive(getScaleByLabel('Today'))

    let currentData : CandleData[] = []

    const option = ref({
      tooltip: {
        trigger     : 'axis',
        axisPointer : {
          type: 'cross',
        },
      },
      grid: {
        left   : '10%',
        right  : '10%',
        bottom : '15%',
      },
      xAxis: {
        type        : 'category',
        data        : [],
        scale       : true,
        boundaryGap : false,
        axisLine    : {onZero: false},
        splitLine   : {show: false},
        splitNumber : 20,
        min         : 'dataMin',
        max         : 'dataMax',
      },
      yAxis: {
        scale     : true,
        splitArea : {
          show: true,
        },
      },
      dataZoom: [
        {
          type  : 'inside',
          start : 50,
          end   : 100,
        },
        {
          show  : true,
          type  : 'slider',
          top   : '90%',
          start : 50,
          end   : 100,
        },
      ],
      series: [
        {
          name      : 'Data',
          type      : 'candlestick',
          data      : [],
          itemStyle : {
            // color: upColor,
            // color0: downColor,
            // borderColor: upBorderColor,
            // borderColor0: downBorderColor
          },
          markPoint: {
            label: {
              normal: {
                formatter (param) {
                  return param !== null ? Math.round(param.value) : ''
                },
              },
            },
            data: [
              {
                name  : 'XX标点',
                coord : [
                  '2013/5/31', 2300,
                ],
                value     : 2300,
                itemStyle : {
                  color: 'rgb(41,60,85)',
                },
              },
              {
                name     : 'highest value',
                type     : 'max',
                valueDim : 'highest',
              },
              {
                name     : 'lowest value',
                type     : 'min',
                valueDim : 'lowest',
              },
              {
                name     : 'average value on close',
                type     : 'average',
                valueDim : 'close',
              },
            ],
            tooltip: {
              formatter (param) {
                return `${param.name}<br>${param.data.coord || ''}`
              },
            },
          },
          markLine: {
            symbol: [
              'none', 'none',
            ],
            data: [
              [
                {
                  name       : 'from lowest to highest',
                  type       : 'min',
                  valueDim   : 'lowest',
                  symbol     : 'circle',
                  symbolSize : 10,
                  label      : {
                    show: false,
                  },
                  emphasis: {
                    label: {
                      show: false,
                    },
                  },
                },
                {
                  type       : 'max',
                  valueDim   : 'highest',
                  symbol     : 'circle',
                  symbolSize : 10,
                  label      : {
                    show: false,
                  },
                  emphasis: {
                    label: {
                      show: false,
                    },
                  },
                },
              ],
              {
                name     : 'min line on close',
                type     : 'min',
                valueDim : 'close',
              },
              {
                name      : 'max line on close',
                type      : 'max',
                valueDim  : 'close',
                itemStyle : {
                  color: '#6aff00',
                  // color0: downColor,
                  // borderColor: upBorderColor,
                  // borderColor0: downBorderColor
                },
              },
            ],
          },
        },

      ],
    })


    const reloadData = async (
      min? : Dayjs,
      max? : Dayjs,
    ) => {
      // const from = min ? min : dayjs().subtract(currentScale.visible.asSeconds(), 'seconds')
      const to   = max ? max : dayjs()
      const data = await loadData(
        props.assetSymbol,
        currentScale,
        dayjs('1900-01-01'), //from,
        to,
      )

      const categories : string[] = []
      const candles : number[][]  = []
      for (const elem : CandleData of data) {

        categories.push(dayjs(elem.date).toISOString())

        candles.push([
          elem.open,
          elem.close,
          elem.low,
          elem.high,
        ])
      }


      option.value.xAxis.data     = categories
      option.value.series[0].data = candles
      currentData                 = data
    }


    const scaleClicked = async (label : string) => {
      currentScale            = reactive(getScaleByLabel(label))
      currentScaleLabel.value = currentScale.label

      await reloadData()
    }

    const onDataZoom = async (event) => {
      /// @see https://echarts.apache.org/en/api.html#echartsInstance.dispatchAction
      const {start, end} = Array.isArray(event.batch) ? event.batch.slice(-1).pop() : event

      const between = (idx, len) => {
        return Math.max(0,
          Math.min(
            idx,
            len === 0 ? 0 : len - 1, // Do not go negative if len = 0
          ),
        )
      }

      const firstIndex = between(Math.floor(currentData.length * start / 100.0), currentData.length)
      const lastIndex  = between(Math.ceil(currentData.length * end / 100.0), currentData.length)

      const min = dayjs(currentData[firstIndex].date)
      const max = dayjs(currentData[lastIndex].date)


      const scale = getScaleForRange(min, max)
      console.log(`Range  "${min} => ${max}`)
      console.log(`Scale  "${currentScale.label} => ${scale.label}`)

      if (scale.label !== currentScale.label) {
        currentScale            = reactive(scale)
        currentScaleLabel.value = currentScale.label
        // @todo add zoom logic
        //await reloadData(min, max)
      }


    }


    watch(() => props.assetSymbol, () => reloadData())

    onMounted(async () => {
      await reloadData()
    })


    return {
      theChart,
      timeScales,
      option,
      onDataZoom,
      scaleClicked,
      currentScale,
      currentScaleLabel,

    }
  },
})

</script>
<style scoped>
.chart {
  height: 500px;
}
</style>
