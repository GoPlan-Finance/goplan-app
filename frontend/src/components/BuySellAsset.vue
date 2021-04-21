<template>
  <Modal
    title="Buy/Sell Asset"
  >
    <template #button>
      <ButtonDefault
        :label="transactionInternal?.id ? 'Edit' : 'Buy/Sell'"
      >
        <template
          v-if="!transactionInternal?.id"
          #before
        >
          <PlusCircleIcon
            class="h-6 w-6"
          />
        </template>
      </ButtonDefault>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-5">
        <label class="col-span-1 md:col-span-2">
          <div class="text-gray-400 ml-2 mb-1">
            Asset
          </div>

          <!-- Leave :allow-text="false" until we add a way to set Currencies -->
          <asset-search
            v-model="symbol"
            :allow-text="false"
            class="w-full"
            search-field-class="border"
          />
        </label>
        <label class="col-start-1">
          <div class="text-gray-400 ml-2 mb-1">
            Account
          </div>
          <AccountSelect
            v-model="account"
            class="w-full"
          />
        </label>
        <label>
          <div class="text-gray-400 ml-2 mb-1">
            Date
          </div>
          <input
            v-model="executedAt"
            class="rounded w-full"
            placeholder="QTY"
            type="date"
          >
        </label>
        <label class="col-start-1">
          <div class="text-gray-400 ml-2 mb-1">
            Quantity
          </div>
          <input
            v-model="quantity"
            class="rounded w-full"
            min="0"
            type="number"
          >
        </label>
        <label>
          <div class="text-gray-400 ml-2 mb-1">
            Price
          </div>
          <input
            v-model="price"
            class="rounded w-full"
            min="0"
            step="0.01"
            type="number"
          >
        </label>
      </div>
    </template>
    <template #actions>
      <template
        v-if="!transactionInternal?.id"
      >
        <ButtonDefault
          :disabled="!isValid"
          class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
          label="Buy"
          @click="save('buy')"
        />
        <ButtonDefault
          :disabled="!isValid"
          class="bg-red-500"
          label="Sell"
          @click="save('sell')"
        />
      </template>
      <template
        v-else
      >
        <ButtonDefault
          :disabled="!isValid"
          class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
          label="Save"
          @click="save()"
        />
      </template>
    </template>
  </Modal>
</template>

<script lang="ts">

import { AssetSymbol, Transaction } from '/@common/models'
import AccountSelect from '/@components/AccountSelect.vue'
import AssetSearch from '/@components/AssetSearch.vue'
import Modal from '/@components/base/GoModal.vue'
import { PlusCircleIcon } from '@heroicons/vue/solid'
import * as dayjs from 'dayjs'
import { computed, defineComponent, onBeforeMount, ref, reactive, toRef, watch } from 'vue'
import ButtonDefault from './base/ButtonDefault.vue'


export default defineComponent({
  components : {AccountSelect, AssetSearch, Modal, ButtonDefault, PlusCircleIcon},
  props      : {
    assetSymbol: {
      type    : AssetSymbol,
      default : null,
    },
    transaction: {
      type    : Transaction,
      default : null,
    },
  },
  setup (props) {
    const transaction2      = toRef(props, 'transaction')
    let transactionInternal = reactive(transaction2.value ? transaction2.value : new Transaction())
    const isValid           = ref(false)

    const symbol = computed({
      get () {
        return transactionInternal.symbolName
      },
      set (value : AssetSymbol | string | null) {

        if (value instanceof AssetSymbol) {
          transactionInternal.symbol     = value
          transactionInternal.symbolName = null
          transactionInternal.currency   = value.currency
        } else {
          transactionInternal.symbolName = value
          transactionInternal.symbol     = null
        }
      },
    })

    const quantity = computed({
      get () {
        return transactionInternal.quantity
      },
      set (value) {
        transactionInternal.quantity = parseFloat(value)
      },
    })

    const price = computed({
      get () {
        return transactionInternal.price
      },
      set (value) {
        transactionInternal.price = parseFloat(value)
      },
    })

    const account = computed({
      get () {
        return transactionInternal.account
      },
      set (value) {
        transactionInternal.account = value
      },
    })

    const executedAt = computed({
      get () {
        return dayjs(transactionInternal.executedAt).format('YYYY-MM-DD')
      },
      set (value) {
        transactionInternal.executedAt = dayjs(value).toDate()
      },
    })


    const save = async (type : 'buy' | 'sell') => {
      if (!transactionInternal.id) {
        transactionInternal.type = type
      }

      await transactionInternal.save()
      alert('saved :)')
      transactionInternal = new Transaction()
    }

    onBeforeMount(() => {

      if (!transactionInternal) {
        transactionInternal = new Transaction()
      }

      if (props.assetSymbol) {
        transactionInternal.symbol = props.assetSymbol
      }

      if (!transactionInternal.executedAt) {
        transactionInternal.executedAt = new Date()
      }
    })

    watch(transactionInternal, () => {
      isValid.value = transactionInternal
                      && !!transactionInternal.symbolName
                      && !isNaN(transactionInternal.price)
                      && !isNaN(transactionInternal.quantity)
                      && dayjs(transactionInternal.executedAt).isValid()
                      && transactionInternal.account

    }, {immediate: true})


    return {
      save,
      isValid,
      symbol,
      executedAt,
      quantity,
      price,
      account,
      transactionInternal,
    }
  },


})
</script>
