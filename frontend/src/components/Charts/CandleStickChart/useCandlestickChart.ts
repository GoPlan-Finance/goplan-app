/**
 *
 *
 *
 */
import { AssetSymbol } from '@models';
import * as duration from 'dayjs/plugin/duration';
import { Ref, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { TimeScaleInterface } from '@components/Charts/HoldingTimeSeriesChart';

export type CandleData = {
  date: dayjs.Dayjs | undefined;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCandleStickChart = (
  assetSymbol: AssetSymbol,
  currentScale: Ref<TimeScaleInterface>
) => {
  const candleData = ref<CandleData[]>();
  const loading = ref(false);

  function calculateMA(dayCount) {
    if (!candleData.value) {
      return [];
    }
    const result = [];
    for (let i = 0, len = candleData.value.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += +candleData.value[i - j].close;
      }
      result.push(+(sum / dayCount).toFixed(2));
    }
    return result;
  }

  const option = ref({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
    },
    xAxis: {
      type: 'category',
      data: [],
      scale: true,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      splitNumber: 20,
      min: 'dataMin',
      max: 'dataMax',
      formatter(param) {
        return 1;
      },
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true,
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        name: 'Data',
        type: 'candlestick',
        data: [],
        itemStyle: {
          // color: upColor,
          // color0: downColor,
          // borderColor: upBorderColor,
          // borderColor0: downBorderColor
        },
        markPoint: {
          label: {
            normal: {
              formatter(param) {
                return param !== null ? Math.round(param.value) : '';
              },
            },
          },
          data: [
            {
              name: 'highest value',
              type: 'max',
              valueDim: 'highest',
            },
            {
              name: 'lowest value',
              type: 'min',
              valueDim: 'lowest',
            },
            {
              name: 'average value on close',
              type: 'average',
              valueDim: 'close',
            },
          ],
          tooltip: {
            formatter(param) {
              return `${param.name}<br>${param.data.coord || ''}`;
            },
          },
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            [
              {
                name: 'from lowest to highest',
                type: 'min',
                valueDim: 'lowest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: false,
                  },
                },
              },
              {
                type: 'max',
                valueDim: 'highest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
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
              name: 'min line on close',
              type: 'min',
              valueDim: 'close',
            },
            {
              name: 'max line on close',
              type: 'max',
              valueDim: 'close',
              itemStyle: {
                color: '#6aff00',
                // color0: downColor,
                // borderColor: upBorderColor,
                // borderColor0: downBorderColor
              },
            },
          ],
        },
      },
      {
        name: 'MA50',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'MA200',
        type: 'line',
        data: [],
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
    ],
  });

  dayjs.extend(duration);

  const loadData = async (
    assetSymbol: AssetSymbol,
    currentScale: TimeScaleInterface,
    from?: dayjs.Dayjs,
    to?: dayjs.Dayjs
  ): Promise<CandleData[]> => {
    return Parse.Cloud.run('Assets--GetEndOfDay', {
      resolution: currentScale.resolution,
      from: from.toISOString(),
      to: to.toISOString(),
      assetSymbolId: assetSymbol.id,
    });
  };

  const reloadData = async (min?: Dayjs, max?: Dayjs) => {
    loading.value = true;
    const from = min ?? dayjs().subtract(currentScale.value.visible.asSeconds(), 'seconds');
    const to = max ?? dayjs();
    const data = await loadData(assetSymbol, currentScale.value, from, to);
    candleData.value = data;
    option.value.series[1].data = calculateMA(50);
    option.value.series[2].data = calculateMA(200);

    const categories: string[] = [];
    const candles: number[][] = [];
    data.forEach(elem => {
      categories.push(dayjs(elem.date).format('MM-DD-YYYY'));
      candles.push([elem.open, elem.close, elem.low, elem.high]);
    });
    option.value.xAxis.data = categories;
    option.value.series[0].data = candles;
    loading.value = false;
  };

  return {
    loading,
    option,
    reloadData,
    loadData,
  };
};
