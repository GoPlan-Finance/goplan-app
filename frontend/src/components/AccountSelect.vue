<template>
  <select class="rounded" name="type" :value="modelValue?.id" @input="update($event.target.value)">
    <option v-for="account in accountStore.accounts" :key="account.id" :value="account.id">
      {{ account.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { Account } from '@common/models';
import { useAccountStore } from '@/store';
import { computed } from 'vue';

const props = defineProps<{
  modelValue?: Account;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', fn): void;
}>();

const accountStore = useAccountStore();
await accountStore.subscribe();

const update = (value: string) => {
  emit(
    'update:modelValue',
    accountStore.accounts.find(account => account.id === value)
  );
};
</script>
