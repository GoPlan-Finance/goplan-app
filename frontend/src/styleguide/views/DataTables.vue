<template>
  <h1 class="text-gray-700 text-3xl font-medium mb-6">
    Data Tables
  </h1>
  <DataTable :config="data">
    <template #actions="slotProps">
      <Modal
        title="Buy Asset"
      >
        <template #button>
          <svg
            class="w-8 h-8 text-gray-500 stroke-1 stroke-current cursor-pointer hover:text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >

            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
        <template #content>
          {{ slotProps.row }}
        </template>
      </Modal>
    </template>
  </DataTable>
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue'
import DataTable, {TableCellType, TableConfig} from '../../components/DataTable.vue'
import Modal from '../../components/Modal.vue'

export default defineComponent({
  components: {Modal, DataTable},
  setup () {
    const data: TableConfig = reactive({
      headers:
        [
          [
            {
              classes : 'w-10 h-10',
              type    : TableCellType.IMAGE
            }
          ],
          [
            {
              label   : 'Company Name',
              classes : 'font-bold'
            },
            {
              label   : 'Symbol',
              classes : 'lg:text-gray-500'
            },
          ],
          [
            {
              label   : 'Shares',
              justify : 'right',
              classes : 'lg:text-right'
            },
            {
              label   : 'Last Purchase',
              justify : 'right',
              classes : 'lg:text-gray-500 lg:font-medium '
            },
          ],
          [

            {
              label   : 'Initial Value',
              justify : 'right',
            },

            {
              label   : 'Average Price',
              justify : 'right',
              classes : 'lg:text-gray-500 lg:font-medium '
            },
          ],
          [
            {
              label   : 'Current Value',
              justify : 'right',
              classes : ' font-bold'
            },
            {
              label   : 'Current Price',
              justify : 'right',
              classes : 'lg:text-gray-500 lg:font-medium '
            },
          ],
          [
            {
              label   : 'Change Absolute',
              justify : 'right',
              classes : 'font-bold text-green-500'
            },
            {
              label   : 'Change Relative',
              justify : 'right',
              classes : 'lg:font-medium  text-green-500'
            },
          ],
          [
            {
              label   : 'Portfolio Weight',
              justify : 'right',
            },
          ]
        ],      
      rows:
        [
          [
            [
              'https://financialmodelingprep.com/image-stock/AAPL.jpg'
            ],
            [
              'Apple Inc.',
              'AAPL'
            ],
            [
              '500',
              '12.02.2021'
            ],
            [
              '10,543.92 $',
              '189.12 $'
            ],
            [
              '83,123.94 $',
              '423.32 $'
            ],
            [
              '+ 73,123.94 $',
              '+ 354.23 %'
            ],
            [
              '4.6 %'
            ]
          ],
          [
            [
              'https://financialmodelingprep.com/image-stock/MSFT.jpg'
            ],
            [
              'Microsoft Inc.',
              'MSFT'
            ],
            [
              '200',
              '15.02.2021'
            ],
            [
              '12,543.92 $',
              '14.12 $'
            ],
            [
              '21,123.94 $',
              '43.32 $'
            ],
            [
              '+ 13,123.94 $',
              '+ 54.23 %'
            ],
            [
              '1.6 %'
            ]
          ]
        ]
    })
    return {
      data,
    }
  }
})
</script>
