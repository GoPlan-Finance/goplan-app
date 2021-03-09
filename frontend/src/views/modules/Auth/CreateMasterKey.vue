<template>
  <form
    class="mt-4"
    @submit.prevent="createKey"
  >
    <label class="block">
      <span
        class="text-gray-700 text-sm"
      >Its now time to create your Master Key. All your data will be encrypted with this key.</span>

      <input
        v-model="masterKey"
        class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
        type="password"
      >
    </label>

    <label class="block">
      <span class="text-gray-700 text-sm">Confirm your key</span>
      <input
        v-model="masterKey2"
        class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
        type="password"
      >
    </label>

    <div class="flex justify-between items-center mt-4">
      <div>
        <label class="inline-flex items-center">
          <input
            v-model="acceptTesting"
            class="form-checkbox text-indigo-600"
            type="checkbox"
          >
          <span class="mx-2 text-gray-600 text-sm">I understand that this project is still a prototype and i accept all risks!</span>
        </label>
      </div>
    </div>

    <div class="mt-6">
      <button
        id="acceptTestingBtn"
        :disabled="!acceptTesting || masterKey.length < 7 || masterKey !== masterKey2"
        class="py-2 px-4 text-center bg-indigo-600 rounded-md w-full text-white text-sm hover:bg-indigo-500"
        type="submit"
      >
        Sign in
      </button>
    </div>
  </form>
</template>

<script lang="ts">

import {defineComponent, inject, ref, } from 'vue'
import {User} from '../../../models'
import {AuthStore} from '../../../store'

export default defineComponent({
  emits: [
    'keyValid'
  ],
  async setup (props, {emit}) {
    const authStore = inject < AuthStore >('$authStore')
    const user      = await User.currentAsync()

    const acceptTesting = ref(false)
    const masterKey     = ref('')
    const masterKey2    = ref('')


    const createKey = async () => {
      const clientKey = await authStore.createMasterKey(masterKey.value)
      user.set('clientKey', clientKey)
      await user.save()

      try {
        await authStore.decryptClientKey(masterKey.value)

        emit('keyValid')
        return
      } catch (err) {
        throw 'tbd: The key you created cannot be decrypted :('
      }

    }


    return {
      acceptTesting,
      masterKey,
      masterKey2,
      createKey,
    }
  },
})
</script>
<style>
#acceptTestingBtn:disabled {
  background-color: #CBD5E0;
  cursor: default;
}
</style>
