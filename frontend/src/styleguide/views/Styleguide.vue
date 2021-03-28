<template>
  <h3 class="text-gray-700 text-xl font-bold mb-6">
    Asset Price
  </h3>
  <AssetPrice
    :current-price="currentPrice"
    :previous-price="previousPrice"
    class="mb-2"
  />
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import ButtonDefault, {ButtonType} from '../../components/base/ButtonDefault.vue'
import SearchBar from '../../components/SearchBar.vue'
import DataField from '../../components/base/DataField.vue'
import Modal from '../../components/Modal.vue'
import AssetPrice from '../../components/AssetPrice.vue'
import {Currencies, Money} from 'ts-money'


export default defineComponent({
  components: {AssetPrice, Modal, DataField, SearchBar, ButtonDefault},
  setup () {
    return {
      currentPrice  : Money.fromDecimal(18, Currencies.USD),
      previousPrice : Money.fromDecimal(19, Currencies.USD),
      ButtonType
    }
  }
})
</script>
