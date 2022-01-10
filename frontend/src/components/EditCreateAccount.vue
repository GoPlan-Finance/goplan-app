<template>
  <Modal
    v-model="isModalOpen"
    :title="account?.id ? t('Edit Account') : t('Create Account')"
    @opened="modalOpened"
  >
    <template #button>
      <slot name="button">
        <ButtonDefault :label="account?.id ? t('Edit') : t('Create Account')">
          <template v-if="!account?.id" #before>
            <PlusCircleIcon class="h-6 w-6" />
          </template>
        </ButtonDefault>
      </slot>
    </template>
    <template #content>
      <div class="grid grid-cols-1 gap-x-3 gap-y-5">
        <GFormItem :label="t('Name')" :error="errors.name">
          <input v-model="accountInternal.name" class="rounded w-full" type="text" />
        </GFormItem>
        <GFormItem :label="t('Currency')" :error="errors.currency">
          <CurrencySelect v-model:value="accountInternal.currency" />
        </GFormItem>
      </div>
    </template>
    <template #actions>
      <template v-if="account?.id">
        <ButtonDefault :label="t('Save')" @click="save">
          <template #before>
            <SaveIcon class="h-6 w-6" />
          </template>
        </ButtonDefault>
        <ButtonDefault type="secondary" :label="t('Delete')" @click="remove">
          <template #before>
            <TrashIcon class="h-6 w-6" />
          </template>
        </ButtonDefault>
      </template>
      <template v-else>
        <ButtonDefault :label="t('Create')" @click="save">
          <template #before>
            <PlusCircleIcon class="h-6 w-6" />
          </template>
        </ButtonDefault>
      </template>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Account } from '@common/models';
import { Query } from '@goplan-finance/utils';
import Modal from '@components/base/GoModal.vue';
import { computed, reactive, ref } from 'vue';
import ButtonDefault from './base/ButtonDefault.vue';
import { PlusCircleIcon, TrashIcon, SaveIcon } from '@heroicons/vue/outline';
import { useI18n } from 'vue-i18n';
import GFormItem from '@components/base/GFormItem.vue';
import CurrencySelect from '@components/CurrencySelect.vue';

const { t } = useI18n();

const props = defineProps<{
  account?: Account;
}>();

const emit = defineEmits<{
  (e: 'update:account', account: Account);
}>();

const createAccount = (): Account => {
  const newAccount = new Account();
  newAccount.currency = 'USD';
  return newAccount;
};

const errors = reactive({
  name: null,
  currency: null,
});
const accountInternal = ref<Account>(props.account ?? createAccount());
const isModalOpen = ref(false);

const reset = () => {
  accountInternal.value = createAccount();
  isModalOpen.value = false;
};

const isValid = computed<boolean>(() => {
  if (!accountInternal.value.name) {
    errors.name = t('Please input a name');
  } else {
    errors.name = null;
  }

  if (!accountInternal.value.currency) {
    errors.currency = t('Please provide a currency');
  } else {
    errors.currency = null;
  }

  return Object.values(errors).filter(error => error !== null).length <= 0;
});

const save = async () => {
  if (!isValid.value) {
    return;
  }

  try {
    await accountInternal.value.save();
    emit('update:account', accountInternal.value);
    reset();
  } catch (e) {
    alert(e);
  }
};

const modalOpened = async () => {
  if (props.account) {
    accountInternal.value = await Query.create(Account).getObjectById(props.account.id);
  }
};

const remove = () => {
  if (confirm(t('Do you really want to remove this account?'))) {
    accountInternal.value.destroy();
    isModalOpen.value = false;
  }
};
</script>
