<template>
  <div v-html="getValue" class="whitespace-nowrap" />
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { computed } from 'vue';
import { DataType } from '@/types';
import { CurrencyUtils } from '@goplan-finance/utils';
import { useNumberFormat } from '@/hooks/useNumberFormat';

dayjs.extend(localizedFormat);
const { formatNumber, formatPercent, formatCurrency } = useNumberFormat();

const props = withDefaults(
  defineProps<{
    data: string | string[] | number | Date;
    type?: DataType;
    currency?: string;
  }>(),
  { type: DataType.STRING }
);

const redGreen = (value: number, formattedValue: string) => {
  return `<span class="${value >= 0 ? 'text-green-600' : 'text-red-600'}">${formattedValue}</span>`;
};

const getValue = computed(() => {
  const positive = (props.data as number) > 0;
  const formattedPercent = formatPercent(Number(props.data));
  const formattedCurrency = formatCurrency(Number(props.data), props.currency);

  switch (props.type) {
    case DataType.STRING:
      return props.data;

    case DataType.NUMBER:
      return formatNumber(Number(props.data));

    case DataType.PERCENT:
      return formattedPercent;

    case DataType.PERCENT_CHANGE:
      return redGreen(
        parseFloat(props.data as string),
        positive ? `+ ${formattedPercent}` : `- ${formattedPercent}`
      );

    case DataType.MONEY:
      return formattedCurrency;

    case DataType.MONEY_CHANGE:
      return redGreen(
        props.data as number,
        positive ? `+ ${formattedCurrency}` : formattedCurrency
      );

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
