<template>
  <HeadlineActions :headline="t('Settings')" />
  <div class="grid xl:grid-cols-2 gap-4">
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
import { useUserStore } from '@/store';
import { computed } from 'vue';

const { t } = useI18n();
const userStore = useUserStore();
await userStore.loadUser();

const defaultCurrency = computed({
  get: () => userStore.state.user?.defaultCurrency,
  set: currency => {
    userStore.setDefaultCurrency(currency);
  },
});

const locale = computed({
  get: () => userStore.state.user?.locale,
  set: locale => {
    userStore.setLocale(locale);
  },
});
</script>
