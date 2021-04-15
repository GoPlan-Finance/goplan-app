<template>
  <Modal
    title="Buy/Sell Asset"
  >
    <template #button>
      <ButtonDefault
        :label="transaction?.id ? 'Edit' : 'Buy/Sell'"
      >
        <template
          v-if="!transaction?.id"
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
          <asset-search
            v-if="typeof symbol !== 'string'"
            v-model="symbol"
            class="w-full"
            search-field-class="border"
          />
          <span v-else>
            {{ symbol }}
          </span>
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
          :disabled="!valid"
          class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
          label="Buy"
          @click="save('buy')"
        />
        <ButtonDefault
          :disabled="!valid"
          class="bg-red-500"
          label="Sell"
          @click="save('sell')"
        />
      </template>
      <template
        v-else
      >
        <ButtonDefault
          :disabled="!valid"
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
import { CacheableQuery } from '/@common/Query/CacheableQuery'
import AccountSelect from '/@components/AccountSelect.vue'
import AssetSearch from '/@components/AssetSearch.vue'
import Modal from '/@components/base/GoModal.vue'
import { PlusCircleIcon } from '@heroicons/vue/solid'
import * as dayjs from 'dayjs'
import { defineComponent, ref } from 'vue'
import * as dayjs from 'dayjs'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import ButtonDefault from './base/ButtonDefault.vue'


export default defineComponent({
  components : {AccountSelect, AssetSearch, Modal, ButtonDefault, PlusCircleIcon},
  props      : {
    assetSymbol: {
      type    : AssetSymbol,
      default : null,
    },
    transaction: {
      type     : Transaction,
      required : false,
    },
  },
  setup (props) {
    const transactionInternal  = ref(props.transaction ? props.transaction : new Transaction())
    const symbol : AssetSymbol = ref(props.assetSymbol)
    const quantity             = ref(null)
    const price                = ref(null)
    const account : Account    = ref(null)
    const executedAt           = ref(dayjs().format('YYYY-MM-DD'))

    const save = async (type : 'buy' | 'sell') => {

      if (!transactionInternal.value.id) {
        transactionInternal.value.type = type
      }

      transactionInternal.value.symbol     = symbol.value
      transactionInternal.value.quantity   = quantity.value
      transactionInternal.value.price      = price.value
      transactionInternal.value.account    = account.value
      transactionInternal.value.quantity   = quantity.value
      transactionInternal.value.executedAt = dayjs(executedAt.value).toDate()
      transactionInternal.value.currency   = symbol.value.currency

      await t.save()
      //  alert('saved :)')

      quantity.value   = null
      price.value      = null
      executedAt.value = dayjs().format('YYYY-MM-DD')
    }

    const valid = computed(() => {
      return symbol.value
             && price.value
             && executedAt.value
             && quantity.value
             && account.value
    })

    onBeforeMount(async () => {

      if (props.assetSymbol) {
        symbol.value = await CacheableQuery.create(Account).getObjectById(props.assetSymbol)
      }

      if (!transactionInternal.value) {
        transactionInternal.value = new Transaction()
      } else {
        quantity.value   = transactionInternal.value.quantity
        price.value      = transactionInternal.value.price
        account.value    = transactionInternal.value.account ? await CacheableQuery.create(Account)
          .getObjectById(transactionInternal.value.account) : null
        quantity.value   = transactionInternal.value.quantity
        executedAt.value = dayjs().format('YYYY-MM-DD')

        if (transactionInternal.value.symbol) {
          symbol.value = await CacheableQuery.create(AssetSymbol).getObjectById(transactionInternal.value.symbol)
        } else {
          symbol.value = transactionInternal.value.getTickerName()
        }
      }


    })


    return {
      save,
      valid,
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
