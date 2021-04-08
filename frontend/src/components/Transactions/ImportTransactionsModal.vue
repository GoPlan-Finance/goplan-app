<template>
  <Modal
    title="Import Transactions"
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
      <input
        accept=".csv"
        class="input-file"
        type="file"
        @change="fileSelected"
      >

      <p>Validation logs</p>
      <ol style="    height: 400px;overflow: scroll;">
        <li
          v-for="(line,index) in logs"
          :key="index"
        >
          {{ line }}
        </li>
      </ol>
    </template>
    <template #actions="slotProps">
      <ButtonDefault
        :disabled="validRows.length === 0"
        :label="`Import ${validRows.length} rows`"
        @click="doImport"
      />

      <ButtonDefault
        label="Close"
        @click="slotProps.close()"
      />
    </template>
  </Modal>
</template>

<script lang="ts">

import {defineComponent, onBeforeMount, onUnmounted, reactive, toRefs} from 'vue'
import { DefaultCSVImporter }                                          from './DefaultCSVImporter'
import ButtonDefault, {ButtonType}                                     from '../base/ButtonDefault.vue'
import Modal                                                           from '../Modal.vue'

export default defineComponent({
  components : {Modal, ButtonDefault},
  props      : {},
  setup (props) {
    const data: string[] = reactive({
      logs      : [],
      validRows : [],
    })

    const csvImporter = new DefaultCSVImporter()


    const logger = (i: number, msg: string) => {
      data.logs.push(`Line ${Number.parseInt(i) + 1}: ${msg}`)
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
      ...toRefs(data),
      fileSelected,
      doImport,
      ButtonType
    }
  }


})
</script>
