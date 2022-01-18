<template>
  <GHeadline class="mb-4">{{ t('Asset Allocations') }}</GHeadline>
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
import { useI18n } from 'vue-i18n';

use([SVGRenderer, PieChart, TooltipComponent, LegendComponent]);

const { t } = useI18n();

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
