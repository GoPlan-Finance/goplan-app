<template>
  <div v-if="!loading" class="flex flex-wrap overflow-hidden p-6 mb-6 bg-white rounded-lg">
    <div class="min-w-full sm:grid sm:grid-cols-6 sm:gap-4 mb-2">
      <dt class="text-sm font-medium text-gray-500">
        <img v-if="assetProfile.image" :src="assetProfile.image" />
      </dt>
      <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
        <h2 class="text-xl font-semibold text-gray-700 leading-tight">
          {{ assetProfile.companyName }}
        </h2>
      </dd>
    </div>

    <h3 class="mb-4 font-bold">
      {{ $t('details.company_information') }}
    </h3>

    <template v-for="(detail, index) in details">
      <DataField
        v-if="detail && detail.data"
        :key="index"
        :data="detail.data"
        :label="$t('details.' + detail.label)"
        :type="detail.type"
        class="mb-2"
      />
    </template>

    <h3 class="mt-4 mb-2 font-bold">
      {{ $t('details.description') }}
    </h3>
    <p class="text-sm text-gray-500">
      {{ assetProfile.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { AssetProfile, AssetSymbol } from '@common/models';
import { onBeforeMount, ref } from 'vue';
import DataField from './base/DataField.vue';
import { DataFieldItem } from '@components/base/DataField.vue';

const props = defineProps<{
  assetSymbol: AssetSymbol;
}>();

const assetProfile = ref<AssetProfile>();
const loading = ref(true);
const details = ref<DataFieldItem[]>([]);

onBeforeMount(async () => {
  assetProfile.value = await AssetProfile.fetchProfile(props.assetSymbol);
  loading.value = false;
  details.value = [
    {
      label: 'company_name',
      data: assetProfile.value.name,
    },
    {
      label: 'symbol',
      data: assetProfile.value.symbol.tickerName,
    },
    // {
    //   label : 'isin',
    //   data  : info.isin
    // },
    {
      label: 'exchange',
      data: assetProfile.value.exchange.name,
    },
    {
      label: 'sector',
      data: assetProfile.value.sector.name,
    },
    {
      label: 'industry',
      data: assetProfile.value.industry.name,
    },
    {
      label: 'country',
      data: assetProfile.value.country,
    },
    {
      label: 'address',
      data: `${assetProfile.value.address}, ${assetProfile.value.zip} ${assetProfile.value.city}`,
    },
    {
      type: 'number',
      label: 'full_time_employees',
      data: assetProfile.value.fullTimeEmployees,
    },
    // {
    //   label : 'ceo',
    //   data  : assetProfile.value.ceo,
    // },
    {
      type: 'url',
      label: 'website',
      data: assetProfile.value.website,
    },
    {
      type: 'date',
      label: 'ipo_date',
      data: assetProfile.value.ipoDate,
    },
  ];
});
</script>
