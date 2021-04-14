<template>
  <select
    class="rounded-lg border-0"
    name="type"
    :value="$props.modelValue?.id"
    @input="update('id', $event.target.value)"
  >
    <option
      v-for="account in accountStore.accounts"
      :key="account.id"
      :value="account.id"
    >
      {{ account.name }}
    </option>
  </select>
</template>

<script lang="ts">

import { Account } from '/@common/models'
import { useAccountStore } from '/@store/index'
import { defineComponent, onBeforeMount } from 'vue'


export default defineComponent({
  props: {
    modelValue: {
      type     : Object as Account,
      required : true,
    },
  },
  emits: [
    'update:modelValue',
  ],
  setup (props, {emit}) {
    const accountStore = useAccountStore()

    onBeforeMount(async () => {
      await accountStore.subscribe()
    })

    function update (key, value) {
      emit('update:modelValue', accountStore.accounts.find(account => account.id === value))
    }

    return {
      update,
      accountStore
    }
  },


})
</script>
