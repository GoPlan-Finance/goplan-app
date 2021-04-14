<template>
  <div class="min-w-full sm:grid sm:grid-cols-2 sm:gap-4">
    <dt class="text-sm font-medium text-gray-500">
      {{ label }}
    </dt>
    <dd
      class="mt-1 text-sm text-gray-900 sm:mt-0"
      v-html="formattedValue"
    />
  </div>
</template>

<script lang="ts">
import * as dayjs from 'dayjs'
import { localizedFormat } from 'dayjs/plugin/localizedFormat'
import { defineComponent, onBeforeMount, ref, watch } from 'vue'


export default defineComponent({
  props: {
    label: {
      type     : String,
      required : true,
    },
    data: {
      type: [
        String, Array, Number,
      ],
      required: true,
    },
    type: {
      type    : String,
      default : 'string',
      validator (value : string) {
        // The value must match one of these strings
        return [
          'percent', 'string', 'moneyChange', 'moneyRange', 'money', 'number', 'url', 'date', 'datetime',
        ].indexOf(value) !== -1
      },
    },
  },
  setup (props) {

    dayjs.extend(localizedFormat)

    const formattedValue = ref('')

    const redGreen = (val, suffix) => {
      const style = val >= 0 ? 'green' : 'red'
      return `<span class="text-${style}-500"> ${val} ${suffix}</span>`
    }

    const getValue = () => {

      switch (props.type) {
        case 'string':
          return props.data

        case 'number':
          return Number(props.data).toLocaleString()

        case 'percent':
          return redGreen(parseFloat(props.data).toFixed(2), ' %')

        case 'money':
          return `${props.data} $` /* @todo set currency */

        case 'moneyChange':
          return redGreen(props.data, ' $')

        case 'date':
          return dayjs(props.data).format('ll')

        case 'datetime':
          return dayjs(props.data).format('lll')

        case 'url':
          return `<a target="_blank" href="${props.data}">${props.data}</a>`

        case 'moneyRange':
          return `${props.data[0]} $` /* @todo set currency */
                 + ' - '
                 + `${props.data[1]} $` /* @todo set currency */

        default:
          throw `Unknown type ${props.type}`
      }
    }

    onBeforeMount(() => {
      formattedValue.value = getValue()
    })

    watch(
      () => props,
      () => {
        formattedValue.value = getValue()
      },
    )

    return {
      formattedValue,

    }
  },
})
</script>
