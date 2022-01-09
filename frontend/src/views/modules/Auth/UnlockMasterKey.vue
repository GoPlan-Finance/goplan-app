<template>
  <form class="mt-4" @submit.prevent="unlockMasterKey">
    <span v-if="keyState === KeyState.INVALID" style="color: red; font-weight: bold">
      The key you entered is invalid
    </span>

    <label class="block">
      <span class="text-gray-700 text-sm">Enter your master key</span>
      <input
        v-model="masterKey"
        class="form-input mt-1 block w-full rounded-md focus:border-blue-600"
        type="password"
      />
    </label>

    <div class="flex justify-between items-center mt-4">
      <div>
        <label class="inline-flex items-center">
          <input v-model="acceptTesting" class="form-checkbox text-blue-600" type="checkbox" />
          <span class="mx-2 text-gray-600 text-sm"
            >I understand that this project is still a prototype and i accept all risks!</span
          >
        </label>
      </div>
    </div>

    <div class="mt-6">
      <button
        id="acceptTestingBtn"
        :disabled="!acceptTesting || masterKey.length < 7"
        class="py-2 px-4 text-center bg-blue-600 rounded-md w-full text-white text-sm hover:bg-blue-500"
        type="submit"
      >
        Sign in
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { AuthStore } from '@/store';

enum KeyState {
  UNKNOWN,
  INVALID,
  VALID,
}

export default defineComponent({
  emits: ['keyValid'],
  setup(props, { emit }) {
    const authStore = inject<AuthStore>('$authStore');
    const masterKey = ref('');
    const keyState = ref(KeyState.UNKNOWN);
    const acceptTesting = ref(false);

    const unlockMasterKey = async () => {
      try {
        await authStore.decryptClientKey(masterKey.value);

        keyState.value = KeyState.VALID;
        emit('keyValid');
        return;
      } catch (err) {
        keyState.value = KeyState.INVALID;
      }
    };

    return {
      acceptTesting,
      masterKey,
      unlockMasterKey,
      keyState,
      KeyState,
    };
  },
});
</script>
<style>
#acceptTestingBtn:disabled {
  background-color: #cbd5e0;
  cursor: default;
}
</style>
