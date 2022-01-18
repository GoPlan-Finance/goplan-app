<template>
  <div v-html="getValue" class="whitespace-nowrap" />
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { computed } from 'vue';
import { DataType } from '@/types';
import { CurrencyUtils } from '@goplan-finance/utils';

dayjs.extend(localizedFormat);

const props = withDefaults(
  defineProps<{
    data: string | string[] | number | Date;
    type?: DataType;
  }>(),
  { type: DataType.STRING }
);

const redGreen = (value: number, formattedValue: string) => {
  return `<span class="${value >= 0 ? 'text-green-600' : 'text-red-600'}">${formattedValue}</span>`;
};

const getValue = computed(() => {
  const positive = (props.data as number) > 0;
  const formattedPercent = `${parseFloat(props.data as string).toFixed(2)} %`;

  switch (props.type) {
    case DataType.STRING:
      return props.data;

    case DataType.NUMBER:
      return Number(props.data).toLocaleString();

    case DataType.PERCENT:
      const value = parseFloat(props.data as string);
      if (isNaN(Number(props.data))) {
        return;
      }
      return `${parseFloat(props.data as string).toFixed(2)} %`;

    case DataType.PERCENT_CHANGE:
      return redGreen(
        parseFloat(props.data as string),
        positive ? `+ ${formattedPercent}` : `- ${formattedPercent}`
      );

    case DataType.MONEY:
      return CurrencyUtils.formatCurrency(
        props.data as number,
        'USD',
        true
      ); /* @todo set currency */

    case DataType.MONEY_CHANGE:
      const formattedValue = CurrencyUtils.formatCurrency(props.data as number, 'USD', true);
      return redGreen(
        props.data as number,
        positive ? `+ ${formattedValue}` : formattedValue
      ); /* @todo set currency */

    case DataType.DATE:
      return dayjs(props.data as Date).format('ll');

    case DataType.DATETIME:
      return dayjs(props.data as Date).format('lll');

    case DataType.URL:
      return `<a target="_blank" href="${props.data}">${props.data}</a>`;

    case DataType.MONEY_RANGE:
      return `${props.data[0]} $ - ${props.data[1]} $`; /* @todo set currency */

    default:
      throw `Unknown type ${props.type}`;
  }
});
</script>
