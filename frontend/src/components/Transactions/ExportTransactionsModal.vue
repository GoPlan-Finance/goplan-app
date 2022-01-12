<template>
  <Modal
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    :title="t('Export Transactions')"
  >
    <template #content>
      <GFormItem :label="t('Filename')">
        <input v-model="filename" class="rounded w-full" type="text" />
      </GFormItem>
    </template>
    <template #actions="slotProps">
      <ButtonDefault
        :disabled="transactionsStore.transactions.length === 0"
        :label="t('Export')"
        @click="downloadCSV()"
      />
      <ButtonDefault :label="t('Close')" @click="slotProps.close()" />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ButtonDefault from '../base/ButtonDefault.vue';
import Modal from '@components/base/GoModal.vue';
import { useTransactionStore } from '@/store';
import { useI18n } from 'vue-i18n';
import { CSVExporter } from '@components/Transactions/CSVExporter';
import GFormItem from '@components/base/GFormItem.vue';

const { t } = useI18n();
const transactionsStore = useTransactionStore();

const props = defineProps<{
  show: boolean;
}>();

const filename = ref('');

const downloadCSV = () => {
  const csvExporter = new CSVExporter();
  const json = csvExporter.mapTransactions(transactionsStore.transactions);
  const csv = csvExporter.exportCSV(json);
  csvExporter.downloadCSV(csv, filename.value);
};
</script>
