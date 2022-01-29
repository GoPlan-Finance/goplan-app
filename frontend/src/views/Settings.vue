<template>
  <HeadlineActions :headline="t('Settings')" />
  <div class="flex flex-col lg:flex-row gap-4">
    <GFormItem :label="t('Default Currency')">
      <CurrencySelect class="border-0" v-model:value="defaultCurrency" />
    </GFormItem>
    <GFormItem :label="t('Country/Locale')">
      <LocaleSelect v-model:value="locale" class="border-0" />
    </GFormItem>
  </div>
</template>

<script setup lang="ts">
import CurrencySelect from '@components/CurrencySelect.vue';
import { useI18n } from 'vue-i18n';
import GFormItem from '@components/base/GFormItem.vue';
import HeadlineActions from '@components/HeadlineActions.vue';
import LocaleSelect from '@components/LocaleSelect.vue';
import { AuthStore, useUserStore } from '@/store';
import { computed } from 'vue';

const { t } = useI18n();
const { state } = useUserStore();

const user = await AuthStore.currentUser();

const defaultCurrency = computed({
  get: () => user.profileInfo.defaultCurrency,
  set: v => {
    user.profileInfo.defaultCurrency = v;
    user.save();
  },
});

const locale = computed({
  get: () => user.profileInfo.locale,
  set: v => {
    user.profileInfo.locale = v;
    user.save();
  },
});
</script>
