<template>
  <TimeScales @change="scaleClicked($event)" :selected="currentScale" />
  <div v-if="loading">
    <GSkeleton style="height: 500px" class="mt-3" />
  </div>
  <v-chart v-else :option="option" style="height: 500px" />
</template>

<script setup lang="ts">
import { AssetSymbol } from '@models';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { CandlestickChart } from 'echarts/charts';
import { use } from 'echarts/core';
import { ref, watch } from 'vue';
import VChart from 'vue-echarts';
import { useCandleStickChart } from './useCandlestickChart';
import TimeScales from '@components/Charts/CandleStickChart/TimeScales/TimeScales.vue';
import {
  TimeScaleInterface,
  useTimeScales,
} from '@components/Charts/CandleStickChart/TimeScales/useTimeScales';
import GSkeleton from '@components/base/GSkeleton.vue';

dayjs.extend(duration);
use([CandlestickChart]);

const { getScaleByLabel, getScaleForRange } = useTimeScales();

const props = defineProps<{
  assetSymbol: AssetSymbol;
}>();
const currentScale = ref(getScaleByLabel('1 Y'));

const { option, reloadData, loading } = useCandleStickChart(props.assetSymbol, currentScale);

const scaleClicked = async (scale: TimeScaleInterface) => {
  currentScale.value = scale;

  await reloadData();
};

watch(
  () => props.assetSymbol,
  () => reloadData()
);

await reloadData();

// const onDataZoom = async event => {
//   /// @see https://echarts.apache.org/en/api.html#echartsInstance.dispatchAction
//   const { start, end } = Array.isArray(event.batch) ? event.batch.slice(-1).pop() : event;
//
//   const between = (idx, len) => {
//     return Math.max(
//       0,
//       Math.min(
//         idx,
//         len === 0 ? 0 : len - 1 // Do not go negative if len = 0
//       )
//     );
//   };
//
//   const firstIndex = between(Math.floor((currentData.length * start) / 100.0), currentData.length);
//   const lastIndex = between(Math.ceil((currentData.length * end) / 100.0), currentData.length);
//
//   const min = dayjs(currentData[firstIndex].date);
//   const max = dayjs(currentData[lastIndex].date);
//
//   const scale = getScaleForRange(min, max);
//   console.log(`Range  "${min} => ${max}`);
//   console.log(`Scale  "${currentScale.label} => ${scale.label}`);
//
//   if (scale.label !== currentScale.label) {
//     currentScale = reactive(scale);
//     currentScaleLabel.value = currentScale.label;
//     // @todo add zoom logic
//     await reloadData(min, max);
//   }
// };
</script>
