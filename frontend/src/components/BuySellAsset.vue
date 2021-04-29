<template>
  <Modal
    v-model="isModalOpen"
    title="Buy/Sell Asset"
    @opened="modalOpened"
  >
    <template #button>
      <slot name="button">
        <ButtonDefault
          :label="transaction?.id ? 'Edit' : 'Buy/Sell'"
        >
          <template
            v-if="!transaction?.id"
            #before
          >
            <GoIcons
              name="PlusCircle"
              class="h-6 w-6"
            />
          </template>
        </ButtonDefault>
      </slot>
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
        v-if="!transaction?.id"
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

import { Account, AssetSymbol, Transaction } from '/@common/models'
import { Query } from '/@common/Query'
import AccountSelect from '/@components/AccountSelect.vue'
import AssetSearch from '/@components/AssetSearch.vue'
import Modal from '/@components/base/GoModal.vue'
import * as dayjs from 'dayjs'
import { computed, defineComponent, ref, toRef } from 'vue'
import ButtonDefault from './base/ButtonDefault.vue'


export default defineComponent({
  components : {AccountSelect, AssetSearch, Modal, ButtonDefault},
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
    const transactionProp     = toRef(props, 'transaction')
    const transactionInternal = ref<Transaction>(new Transaction())
    const isModalOpen         = ref(false)

    const symbol = computed({
      get () {
        return transactionInternal.value.symbolName
      },
      set (value : AssetSymbol | string | null) {

        if (value instanceof AssetSymbol) {
          transactionInternal.value.symbol     = value
          transactionInternal.value.symbolName = null
          transactionInternal.value.currency   = value.currency
        } else {
          transactionInternal.value.symbolName = value
          transactionInternal.value.symbol     = null
        }
      },
    })

    const quantity = computed<string>({
      get () {
        return transactionInternal.value.quantity ? transactionInternal.value.quantity.toString() : ''
      },
      set (value) {
        transactionInternal.value.quantity = parseFloat(value)
      },
    })

    const price = computed<string>({
      get () {
        return transactionInternal.value.price ? transactionInternal.value.price.toString() : ''
      },
      set (value) {
        transactionInternal.value.price = parseFloat(value)
      },
    })

    const account = computed<Account>({
      get () {
        return transactionInternal.value.account
      },
      set (value) {
        transactionInternal.value.account = value
      },
    })

    const executedAt = computed<string>({
      get () {
        return dayjs(transactionInternal.value.executedAt).format('YYYY-MM-DD')
      },
      set (value) {
        transactionInternal.value.executedAt = dayjs(value).toDate()
      },
    })


    const isValid = computed<boolean>(() => transactionInternal.value
                                            && !!transactionInternal.value.symbolName
                                            && !isNaN(transactionInternal.value.price)
                                            && !isNaN(transactionInternal.value.quantity)
                                            && dayjs(transactionInternal.value.executedAt).isValid()
                                            && !!transactionInternal.value.account)

    const save = async (type : 'buy' | 'sell' | undefined) => {
      if (transactionInternal.value.isNew()) {
        transactionInternal.value.type = type
      }

      transactionInternal.value.totalExcludingFees = transactionInternal.value.quantity * transactionInternal.value.quantity

      await transactionInternal.value.save()
      transactionInternal.value = new Transaction()
      isModalOpen.value         = false
    }

    const modalOpened = async () => {

      if (transactionProp.value) {
        transactionInternal.value = await Query.create(Transaction).getObjectById(transactionProp.value.id)
      }

      if (props.assetSymbol) {
        transactionInternal.value.symbol = props.assetSymbol
      }

      if (!transactionInternal.value.executedAt) {
        transactionInternal.value.executedAt = new Date()
      }
    }


    return {
      save,
      isValid,
      isModalOpen,
      symbol,
      executedAt,
      quantity,
      price,
      account,
      transactionInternal,
      modalOpened,
    }
  },


})
</script>
