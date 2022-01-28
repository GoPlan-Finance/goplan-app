<template>
  <Modal
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    :can-click-outside="false"
    title="Import Transactions"
    @closed="closed"
  >
    <template #content>
      <template v-if="currentStep === ImportStepEnum.Instructions">
        <p class="text-sm">
          You can import directly your transaction from your brooker. We currently only accept CSV
          format, and we plan to expand in the future
        </p>

        <div class="min-w-full sm:grid sm:grid-cols-2 sm:gap-4 mb-2 mt-5 text-sm">
          <dt>date</dt>
          <dd>
            The transaction date <br />
            <small>2020-03-19 08:03:41</small>
          </dd>

          <dt>type</dt>
          <dd>
            The type of transaction
            <br />
            <small>transfer, buy, sell, dividends, fees</small>
          </dd>

          <dt>symbol</dt>
          <dd>
            The symbol that was traded
            <br />
            Mandatory for <b>buy</b>, <b>sell</b> and <b>dividend</b>
          </dd>

          <dt>quantity</dt>
          <dd>
            The number of asset bougth or sold
            <br />
            Mandatory for <b>buy</b> and <b>sell</b>
          </dd>

          <dt>price</dt>
          <dd>
            The unit price
            <br />
            Mandatory for <b>buy</b> and <b>sell</b>
          </dd>

          <dt>fees</dt>
          <dd>
            The fees associated with the transaction
            <br />
          </dd>

          <dt>totalExcludingFees</dt>
          <dd>
            The total of the transaction, excluding any fees
            <br />
          </dd>

          <dt>currency</dt>
          <dd>
            3 Letter currency code
            <br />
            USD, CAD, EUR, GBP
          </dd>

          <dt>accountName</dt>
          <dd>
            The name of the related account
            <br />
          </dd>

          <dt>description</dt>
          <dd>Any description or notes that can be relevant to you</dd>
        </div>
      </template>
      <template v-if="currentStep === ImportStepEnum.PrepareImport">
        <p>Select the file to import</p>

        <div class="mt-5">
          <input accept=".csv" class="input-file" type="file" @change="fileSelected" />
        </div>
        <div class="mt-5">
          <p>Validation logs</p>
          <ol style="height: 300px; overflow: scroll" class="border-blue-100 border-2">
            <li v-for="(line, index) in logs" :key="index" class="text-sm">
              {{ line }}
            </li>
          </ol>
          <span v-if="logs.length" class="text-green-600">
            You can still import even if there is warnings above
          </span>
        </div>
      </template>
      <template v-if="currentStep === ImportStepEnum.DoImport" />
    </template>
    <template #actions="slotProps">
      <template v-if="currentStep === ImportStepEnum.Instructions">
        <ButtonDefault label="Back" @click="currentStep--" />
        <ButtonDefault label="Next" @click="currentStep++" />
      </template>
      <template v-if="currentStep === ImportStepEnum.PrepareImport">
        <ButtonDefault label="Back" @click="currentStep--" />
        <ButtonDefault
          :disabled="validRows.length === 0"
          :label="`Import ${validRows.length} rows`"
          @click="doImport"
        />
      </template>
      <template v-if="currentStep === ImportStepEnum.DoImport" />

      <ButtonDefault label="Close" @click="slotProps.close()" />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ButtonDefault from '../base/ButtonDefault.vue';
import Modal from '@components/base/GoModal.vue';
import { BaseCSVImporter } from './CustomImporters/BaseCSVImporter';
import { UploadIcon } from '@heroicons/vue/outline';
import { DefaultCSVImporter } from '@components/Transactions/CustomImporters/DefaultCSVImporter';
import { Canada_NationalBank_CDBN } from '@components/Transactions/CustomImporters/Canada_NationalBank_CDBN';

enum ImportStepEnum {
  Instructions,
  PrepareImport,
  DoImport,
}

const props = defineProps<{
  show: boolean;
}>();

const currentStep = ref<ImportStepEnum>(ImportStepEnum.Instructions);
const logs = ref([]);
const validRows = ref([]);

const csvImporter = new Canada_NationalBank_CDBN();

const reset = () => {
  validRows.value = [];
  logs.value = [];
};

const closed = () => {
  reset();
};

const logger = (i: number, msg: string) => {
  logs.value.unshift(`Line ${Number.parseInt(i) + 1}: ${msg}`);
};

const fileSelected = async ({ target }) => {
  logs.value = [];
  validRows.value = await csvImporter.validateCSV(target.files[0], logger);
};

const doImport = async () => {
  logs.value = [];
  const rows = validRows.value;
  validRows.value = [];

  await csvImporter.importCSV(rows, logger);

  logs.value.push('Completed');
};
</script>
