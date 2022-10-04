<template>
  <header class="flex items-center py-4 px-6 xl:container xl:mx-auto">
    <div class="flex items-center flex-1">
      <button class="text-gray-500 focus:outline-none lg:hidden" @click="isOpen = true">
        <MenuIcon class="h-6 w-6" />
      </button>

      <SearchBar class="mx-4 lg:mx-0 sm:w-96 active:w-full" />
    </div>
    <div class="flex items-center gap-4">
      <div class="hover:text-gray-500 cursor-pointer h-7 w-7" @click="togglePrivateMode">
        <EyeIcon v-if="state.privateMode !== true" />
        <EyeOffIcon v-else class="text-red-600" />
      </div>

      <GDropdown>
        <template #button="{ toggle }">
          <button @click="toggle()" class="h-8">
            <CogIcon class="h-7" />
          </button>
        </template>
        <template #default="{ toggle }">
          <router-link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
            to="settings"
          >
            {{ t('Settings') }}
          </router-link>
          <router-link
            v-if="isDevMode"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
            to="/styleguide"
          >
            {{ t('Styleguide') }}
          </router-link>
          <a
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
            @click="signOut"
          >
            {{ t('Logout') }}
          </a>
        </template>
      </GDropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useSidebar } from '@/hooks/useSidebar';
import { AuthStore, useUserStore } from '@/store';
import SearchBar from './SearchBar.vue';
import { CogIcon, EyeIcon, EyeOffIcon, MenuIcon } from '@heroicons/vue/outline';
import GDropdown from '@components/base/GDropdown.vue';
import { useI18n } from 'vue-i18n';

const { state, togglePrivateMode } = useUserStore();
const router = useRouter();
const authStore = inject('$authStore') as AuthStore;
const { isOpen } = useSidebar();
const { t } = useI18n();

const signOut = async () => {
  await authStore.signOut();
  await router.push('auth');
};

const isDevMode = computed(() => import.meta.env.DEV);
</script>
