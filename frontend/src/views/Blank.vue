<template>
  <h3 class="text-gray-700 text-3xl font-medium">Test Page</h3>

  <div v-if="isLoading">still loading...</div>
  <div v-if="error">{{ error }}</div>
  <div class="mt-6">
    <div class="bg-white shadow rounded-lg overflow-hidden my-6">
      <table class="text-left w-full border-collapse">
        <thead class="border-b">
        <tr>
          <th
              class="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100"
          >
            Date
          </th>
          <th
              class="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100"
          >
            High
          </th>
          <th
              class="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100"
          >
            Low
          </th>
          <th
              class="py-3 px-5 bg-indigo-800 font-medium uppercase text-sm text-gray-100"
          >
            Volume
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(price, index) in data.prices"
            :key="index"
            class="hover:bg-gray-200"
        >
          <td class="py-4 px-6 border-b text-gray-700 text-lg">
            {{ formatDate(price.date) }}
          </td>
          <td class="py-4 px-6 border-b text-gray-500">
            {{ price.high}}
          </td>
          <td class="py-4 px-6 border-b text-gray-500">
            {{ price.low}}
          </td>
          <td class="py-4 px-6 border-b text-gray-500">
            {{ price.volume}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import {TiingoApiAdapter} from "../hooks/api/adapters/tiingo/tiingo-api";
import {PriceHistoryItem} from "../hooks/api/interfaces/goplan-interfaces";

interface apiPrices {
  prices: PriceHistoryItem[] | null
}

export default defineComponent({
  setup() {
    const isLoading = ref(false);
    const error = ref(null);
    const data: apiPrices = reactive({
      prices: null
    });

    onMounted(async () => {
      isLoading.value = true;
      try {
        let adapter = new TiingoApiAdapter();
        let response = await adapter.getPrices('AAPL');
        data.prices = adapter.resolveApiResponse(response);
      } catch (e) {
        console.error(e);
        error.value = e;
      } finally {
        isLoading.value = false;
      }
    })

    function formatDate(date: string): string {
      let object = new Date(date);
      return object.toLocaleDateString();
    }

    return {
      isLoading,
      error,
      data,
      formatDate
    };
  },
});

</script>
