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
        value   : '',
        display : 'All Types',
      },
      {
        value   : 'BUY',
        display : 'Buy',
      },
      {
        value   : 'SELL',
        display : 'Sell',
      },
      {
        value   : 'DIVIDENDS',
        display : 'Dividends',
      },
      {
        value   : 'FEES',
        display : 'Fees',
      },
      {
        value   : 'TRANSFER',
        display : 'Transfers',
      },
    ]

    return {
      value,
      options
    }
  },
})
</script>
