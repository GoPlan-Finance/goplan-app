<template>
  <div class="min-w-full sm:grid sm:grid-cols-2 sm:gap-4">
    <dt class="text-sm font-medium text-gray-500">
      {{ label }}
    </dt>
    <dd
      class="mt-1 text-sm text-gray-900 sm:mt-0"
      v-html="data"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {AssetSymbol} from '../../../common/models'

export default defineComponent({
  props: {
    label: {
      type     : String,
      required : true
    },
    data: {
      type     : String,
      required : true
    },
  },
})
</script>
