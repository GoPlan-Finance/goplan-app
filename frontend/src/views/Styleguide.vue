<template>
  <h1 class="text-gray-700 text-3xl font-bold mb-6">
    Styleguide
  </h1>
  <h2 class="text-gray-700 text-2xl font-bold mb-6 border-solid border-gray-300 border-b-2">
    Base Components
  </h2>

  <h3 class="text-gray-700 text-xl font-bold mb-6">
    Typography
  </h3>

  <h3 class="text-gray-700 text-xl font-bold mb-6">
    Buttons
  </h3>
  <ButtonDefault
    label="Primary Button"
    class="mb-4"
  />
  <ButtonDefault
    label="Secondary Button"
    :type="ButtonType.SECONDARY"
    class="mb-4"
  />
  <ButtonDefault
    label="Button with Icon"
    class="mb-4"
  >
    <template #before>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </template>
  </ButtonDefault>
  <ButtonDefault
    label="Button with Icon"
    class="mb-4"
  >
    <template #after>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </template>
  </ButtonDefault>
  <h3 class="text-gray-700 text-xl font-bold mb-6">
    Forms
  </h3>
  <h3 class="text-gray-700 text-xl font-bold mb-6">
    Modal
  </h3>
  <Modal
    title="Modal Title goes here"
  >
    <template #button>
      <ButtonDefault
        label="Open Modal"
      />
    </template>
    <template #content>
      Modal Content goes here
    </template>
  </Modal>

  <h2 class="text-gray-700 text-2xl font-bold my-6 border-solid border-gray-300 border-b-2">
    Advanced Components
  </h2>
  <h3 class="text-gray-700 text-xl font-bold mb-6">
    SearchBar
  </h3>
  <SearchBar class="mb-6" />

  <h3 class="text-gray-700 text-xl font-bold mb-6">
    Data Field
  </h3>
  <DataField
    data="Data"
    label="Label"
    class="mb-2"
  />
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
import ButtonDefault, {ButtonType} from '../components/base/ButtonDefault.vue'
import SearchBar from '../components/SearchBar.vue'
import DataField from '../components/base/DataField.vue'
import Modal from '../components/Modal.vue'
import AssetPrice from '../components/AssetPrice.vue'
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
