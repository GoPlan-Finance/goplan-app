<template>
  <h1 class="text-gray-700 text-3xl font-bold mb-6">
    Inputs
  </h1>
  <GoSelect
    v-model="value"
    :options="options"
  />
  <div>
    selected: {{ value ?? 'nothing' }}
  </div>
</template>

<script lang="ts">
import GoSelect, { SelectOption } from '/@components/base/GoSelect.vue'
import { defineComponent, ref } from 'vue'


export default defineComponent({
  components: {GoSelect},
  setup () {
    const value = ref('')

    const options: SelectOption[] = [
      {
        value : '',
        label : 'All Types',
      },
      {
        value : 'BUY',
        label : 'Buy',
      },
      {
        value : 'SELL',
        label : 'Sell',
      },
      {
        value : 'DIVIDENDS',
        label : 'Dividends',
      },
      {
        value : 'FEES',
        label : 'Fees',
      },
      {
        value : 'TRANSFER',
        label : 'Transfers',
      },
    ]

    return {
      value,
      options
    }
  },
})
</script>
