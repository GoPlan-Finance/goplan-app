<template>
  <div class="min-w-full grid grid-cols-1">
    <dt class="text-sm font-medium text-gray-500">
      {{ label }}
    </dt>
    <dd class="mt-1 text-sm text-gray-900 sm:mt-0" v-html="getValue" />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { computed, defineComponent, h, onBeforeMount, ref, watch } from 'vue';

dayjs.extend(localizedFormat);

type DataType =
  | 'percent'
  | 'string'
  | 'moneyChange'
  | 'moneyRange'
  | 'money'
  | 'number'
  | 'url'
  | 'date'
  | 'datetime';

export interface DataFieldItem {
  label: string;
  data: string | string[] | number | Date;
  type?: DataType;
}

const props = withDefaults(defineProps<DataFieldItem>(), { type: 'string' });

const redGreen = (value, suffix) => {
  return `<span class="${
    value >= 0 ? 'text-green-500' : 'text-red-500'
  }"> ${value} ${suffix}</span>`;
};

const getValue = computed(() => {
  switch (props.type) {
    case 'string':
      return props.data;

    case 'number':
      return Number(props.data).toLocaleString();

    case 'percent':
      return redGreen(parseFloat(props.data).toFixed(2), ' %');

    case 'money':
      return `${props.data} $`; /* @todo set currency */

    case 'moneyChange':
      return redGreen(props.data, ' $');

    case 'date':
      return dayjs(props.data).format('ll');

    case 'datetime':
      return dayjs(props.data).format('lll');

    case 'url':
      return `<a target="_blank" href="${props.data}">${props.data}</a>`;

    case 'moneyRange':
      return `${props.data[0]} $ - ${props.data[1]} $`; /* @todo set currency */

    default:
      throw `Unknown type ${props.type}`;
  }
});
</script>
