<template>
  <Modal
    :can-click-outside="false"
    title="Import Transactions"
    @closed="closed"
    @opened="opened"
  >
    <template #button>
      <ButtonDefault
        :type="ButtonType.SECONDARY"
        label="Import CSV"
      >
        <template #before>
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              clip-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              fill-rule="evenodd"
            />
          </svg>
        </template>
      </ButtonDefault>
    </template>
    <template #content>
      <template
        v-if="currentStep === ImportStepEnum.Instructions"
      >
        <p class="text-sm">
          You can import directly your transaction from your brooker. We currently only accept CSV format, and we plan to expand in the future
        </p>


        <div class="min-w-full sm:grid sm:grid-cols-2 sm:gap-4 mb-2 mt-5 text-sm">
          <dt>date</dt>
          <dd>
            The transaction date <br>
            <small>2020-03-19 08:03:41</small>
          </dd>

          <dt>type</dt>
          <dd>
            The type of transaction
            <br>
            <small>transfer, buy, sell, dividends, fees</small>
          </dd>

          <dt>symbol</dt>
          <dd>
            The symbol that was traded
            <br>
            Mandatory for <b>buy</b>, <b>sell</b> and <b>dividend</b>
          </dd>

          <dt>quantity</dt>
          <dd>
            The number of asset bougth or sold
            <br>
            Mandatory for <b>buy</b> and <b>sell</b>
          </dd>

          <dt>price</dt>
          <dd>
            The unit price
            <br>
            Mandatory for <b>buy</b> and <b>sell</b>
          </dd>

          <dt>fees</dt>
          <dd>
            The fees associated with the transaction
            <br>
          </dd>

          <dt>totalExcludingFees</dt>
          <dd>
            The total of the transaction, excluding any fees
            <br>
          </dd>

          <dt>currency</dt>
          <dd>
            3 Letter currency code
            <br>
            USD, CAD, EUR, GBP
          </dd>

          <dt>accountName</dt>
          <dd>
            The name of the related account
            <br>
          </dd>

          <dt>description</dt>
          <dd>
            Any description or notes that can be relevant to you
          </dd>
        </div>
      </template>
      <template
        v-if="currentStep === ImportStepEnum.PrepareImport"
      >
        <p>
          Select the file to import
        </p>

        <div class="mt-5">
          <input
            accept=".csv"
            class="input-file"
            type="file"
            @change="fileSelected"
          >
        </div>
        <div class="mt-5">
          <p>Validation logs</p>
          <ol
            style="    height: 300px;overflow: scroll;"
            class="border-blue-100 border-2"
          >
            <li
              v-for="(line,index) in logs"
              :key="index"
              class="text-sm"
            >
              {{ line }}
            </li>
          </ol>
          <span
            v-if="logs.length"
            class="text-green-600"
          >You can still import even if there is warnings above</span>
        </div>
      </template>
      <template
        v-if="currentStep === ImportStepEnum.DoImport"
      />
    </template>
    <template #actions="slotProps">
      <template
        v-if="currentStep === ImportStepEnum.Instructions"
      >
        <ButtonDefault
          label="Back"
          @click="currentStep--"
        />
        <ButtonDefault
          label="Next"
          @click="currentStep++"
        />
      </template>
      <template
        v-if="currentStep === ImportStepEnum.PrepareImport"
      >
        <ButtonDefault
          label="Back"
          @click="currentStep--"
        />
        <ButtonDefault
          :disabled="validRows.length === 0"
          :label="`Import ${validRows.length} rows`"
          @click="doImport"
        />
      </template>
      <template
        v-if="currentStep === ImportStepEnum.DoImport"
      />


      <ButtonDefault
        label="Close"
        @click="slotProps.close()"
      />
    </template>
  </Modal>
</template>

<script lang="ts">

import { defineComponent, reactive, toRefs } from 'vue'
import ButtonDefault, { ButtonType } from '../base/ButtonDefault.vue'
import Modal from '../Modal.vue'
import { DefaultCSVImporter } from './DefaultCSVImporter'


enum ImportStepEnum {
  Instructions,
  PrepareImport,
  DoImport,
}


export default defineComponent({
  components : {Modal, ButtonDefault},
  props      : {},
  setup (props) {
    const data = reactive({
      currentStep : ImportStepEnum.Instructions,
      opened      : false,
      logs        : [],
      validRows   : [],
    })

    const csvImporter = new DefaultCSVImporter()

    const reset = () => {
      data.validRows = []
      data.logs      = []
    }

    const opened = () => {
      reset()
    }
    const closed = () => {
      reset()
    }

    const logger = (i : number, msg : string) => {
      data.logs.unshift(`Line ${Number.parseInt(i) + 1}: ${msg}`)
    }

    const fileSelected = async ({target}) => {
      data.logs      = []
      data.validRows = await csvImporter.validateCSV(target.files[0], logger)
    }


    const doImport = async () => {
      data.logs      = []
      const rows     = data.validRows
      data.validRows = []

      await csvImporter.importCSV(rows, logger)

      data.logs.push('Completed')

    }

    // onBeforeMount(async () => {
    //
    // })
    //
    // onUnmounted(async () => {
    //
    // })


    return {
      ImportStepEnum,
      ...toRefs(data),
      fileSelected,
      doImport,
      ButtonType,
      opened,
      closed,
    }
  },


})
</script>
