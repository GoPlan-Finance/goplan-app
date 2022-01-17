<template>
  <h2 class="font-bold">Asset Allocation</h2>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { ref, provide, computed } from 'vue';
import { useHoldingStore } from '@/store';

use([SVGRenderer, PieChart, TooltipComponent, LegendComponent]);

const holdingStore = useHoldingStore();
await holdingStore.subscribe();

const data = computed(() =>
  holdingStore.typeAllocations.map(allocation => ({
    name: allocation.type,
    value: allocation.currentValue,
  }))
);

provide(THEME_KEY, 'light');

const option = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'horizontal',
    bottom: '0',
    data: holdingStore.types,
  },
  series: [
    {
      name: 'Type Allocation',
      type: 'pie',
      radius: ['45%', '75%'],
      top: '-5%',
      data,
      labelLine: {
        show: false,
      },
      label: {
        show: false,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
