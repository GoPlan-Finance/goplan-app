<template>
  <Modal :title="t('New Watchlist')">
    <template #button>
      <ButtonDefault :label="t('New Watchlist')">
        <template #before>
          <PlusCircleIcon class="w-6 h-6" />
        </template>
      </ButtonDefault>
    </template>
    <template #content="{ close }">
      <GFormItem :label="t('Name')" :error="validationError">
        <input
          v-model="newWatchlistName"
          class="rounded w-full"
          type="text"
          @keypress.enter="createList(close)"
        />
      </GFormItem>
    </template>
    <template #actions="{ close }">
      <ButtonDefault
        class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
        :label="t('Save')"
        @click="createList(close)"
      />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Watchlist } from '@common/models';
import { computed, ref } from 'vue';
import ButtonDefault from '@components/base/ButtonDefault.vue';
import Modal from '@components/base/GoModal.vue';
import GFormItem from '@components/base/GFormItem.vue';
import { useI18n } from 'vue-i18n';
import { PlusCircleIcon } from '@heroicons/vue/solid';

const { t } = useI18n();

const newWatchlistName = ref('');
const validationError = ref(null);

const isValid = computed(() => {
  if (newWatchlistName.value.length < 1) {
    validationError.value = t('Please enter a name');
    return false;
  }
  return true;
});

const createList = async (close: CallableFunction) => {
  if (!isValid.value) {
    return;
  }

  try {
    const watchlist = new Watchlist();
    watchlist.set('name', newWatchlistName.value);
    await watchlist.save();
    newWatchlistName.value = '';
    close();
  } catch (e) {
    alert(e);
  }
};
</script>
