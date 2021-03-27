<template>
  <form
    @submit.prevent="createKey"
  >
    <p
      class="text-gray-700 text-sm mb-4"
    >
      Its now time to create your Master Key. All your data will be encrypted with this key.
    </p>
    <label class="block mb-4">
      <span
        class="text-gray-700 text-sm font-bold"
      >Your Master Key</span>
      <input
        v-model="masterKey"
        class="form-input mt-2 bg-gray-100 border-1 border-gray-300 block w-full rounded-md focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
        type="password"
      >
    </label>

    <label class="block">
      <span class="text-gray-700 text-sm font-bold">Confirm your key</span>
      <input
        v-model="masterKey2"
        class="form-input mt-2 bg-gray-100 border-1 border-gray-300 block w-full rounded-md focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
        type="password"
      >
    </label>

    <div class="flex justify-between items-center mt-6">
      <div>
        <label class="inline-flex items-center cursor-pointer">
          <input
            v-model="acceptTesting"
            class="form-checkbox text-blue-600"
            type="checkbox"
          >
          <span class="mx-3 text-gray-600 text-sm">I understand that this project is still a prototype and i accept all risks!</span>
        </label>
      </div>
    </div>

    <div class="mt-8">
      <button
        id="acceptTestingBtn"
        :disabled="!acceptTesting || masterKey.length < 7 || masterKey !== masterKey2"
        class="py-2 px-4 text-center font-bold bg-blue-600 rounded-md w-full text-white text-sm hover:bg-blue-500"
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
  setup (props, {emit}) {
    const authStore = inject < AuthStore >('$authStore') as AuthStore

    const acceptTesting = ref(false)
    const masterKey     = ref('')
    const masterKey2    = ref('')


    const createKey = async () => {
      const user      = await User.currentAsync() as Parse.User

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
