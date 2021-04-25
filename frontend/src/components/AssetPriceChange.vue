<template>
  <div
    v-if="toPrice && fromPrice"
    class="flex flex-wrap overflow-hidden  bg-white rounded-lg"
  >
    <div
      :class="[
        isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
      ]"
      class=" rounded-lg font-bold p-1 ml-1"
    >
      <span v-if="isPositive">+</span> {{ (percent * 100).toFixed(2) }} %
    </div>
    <div
      :class="[
        isPositive ? 'text-green-800' : 'text-red-800',
      ]"
      class="flex items-center  rounded-lg font-bold"
    >
      <svg
        :class="isPositive ? '' : 'transform rotate-180'"
        class="mr-1"
        fill="none"
        height="24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="3"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="12"
          x2="12"
          y1="19"
          y2="5"
        />
        <polyline points="5 12 12 5 19 12" />
      </svg>
      <Private>
        {{ formatCurrency(change, currency, true) }}
      </Private>
    </div>
  </div>
</template>

<script lang="ts">
import { AssetPrice, AssetSymbol } from '/@common/models'
import { formatCurrency } from '/@common/utils'
import { defineComponent, onUnmounted, ref, watchEffect } from 'vue'


export default defineComponent({
  props: {
    compareFrom: {
      type: [
        String, Number,
      ],
      default   : 'previousClose',
      validator : value => {
        if (typeof value === 'number') {
          return true
        }

        return [
          'dayLow',
          'dayHigh',
          'yearHigh',
          'yearLow',
          'priceAvg50',
          'priceAvg200',
          'open',
          'previousClose',
        ].includes(value)
      },
    },
    compareTo: {
      type: [
        AssetSymbol, Number,
      ],
      required: true,
    },
  },
  setup (props) {

    let liveSubscription = null

    const currency = ref(null)

    const assetPrice = ref<AssetPrice>(null)

    const fromPrice = ref<number>(null)
    const toPrice   = ref<number>(null)

    const percent    = ref<number>(null)
    const change     = ref<number>(null)
    const isPositive = ref<boolean>(null)


    const update = (fromValue, toValue) => {
      if (fromValue === null || toValue === null) {
        return
      }

      fromPrice.value = fromValue // 1000
      toPrice.value   = toValue  // 300

      change.value     = toValue - fromValue // -700
      isPositive.value = fromValue < toValue // -

      percent.value    = toValue !== 0 ? (1 - (toValue / fromValue)) : 0 // -70
    }


    const init = async (compareFrom, compareTo) => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
        liveSubscription = null
      }

      if (compareTo instanceof AssetSymbol) {
        currency.value = compareTo.currency

        liveSubscription = await AssetPrice.liveQuery(compareTo, ap => {
          assetPrice.value = ap

          update(
            typeof compareFrom === 'string' ? ap[compareFrom] : compareFrom,
            ap.price,
          )
        })
      } else {
        if (compareFrom === 'number') {
          fromPrice.value = compareFrom
        }

        update(
          compareFrom,
          compareTo,
        )
      }
    }


    watchEffect(() => {
      init(props.compareFrom, props.compareTo)
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })


    return {
      formatCurrency,
      currency,
      toPrice,
      fromPrice,
      change,
      percent,
      isPositive,
    }
  },
})
</script>
