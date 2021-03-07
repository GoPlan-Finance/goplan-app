<template>
  <div class="flex justify-center items-center h-screen bg-gray-200 px-6">
    <div class="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
      <div class="flex justify-center items-center">
        <svg
            class="h-10 w-10"
            fill="none"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
              fill="#4C51BF"
              stroke="#4C51BF"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
          />
          <path
              d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
              fill="white"
          />
        </svg>
        <span class="text-gray-700 font-semibold text-2xl">V-Dashboard</span>
      </div>
      <b>@todo insert nice &lt;vue-form-flow&gt;</b>
      <form
          class="mt-4"
          @submit.prevent="login"
      >
        <label class="block">
          <span class="text-gray-700 text-sm">Email</span>
          <input
              v-model="email"
              class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
              type="email"
          >
        </label>

        <label class="block">
          <span class="text-gray-700 text-sm">First Name</span>
          <input
              v-model="firstName"
              class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
              type="text"
          >
        </label>

        <label class="block">
          <span class="text-gray-700 text-sm">Last Name</span>
          <input
              v-model="lastName"
              class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
              type="text"
          >
        </label>

        <label class="block">
          <span class="text-gray-700 text-sm">What year are you born ?</span>
          <input
              v-model="yearBorn"
              :max="2030"
              :min="1900"
              class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
              type="number"
          >
        </label>

        <label class="block">
          <span class="text-gray-700 text-sm">At what age would you like to retire ?</span>
          <input
              v-model="plannedRetirementAge"
              :max="130"
              :min="18"
              class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
              type="number"
          >
        </label>

        <br>
        <label class="block">
          <span class="text-gray-700 text-sm">Master Key. All your data will be encrypted with this key.</span>
          <span v-if="isMasterKeyValid" style="color:lightgreen;font-size: xx-large">VALID!</span>
          <input
              v-model="masterKey"
              :max="130"
              :min="18"
              class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
              type="password"
          >
        </label>

        <br>
        <h2 style="font-size: larger">Data source</h2>
        <label class="block">
          <p class="text-gray-700 text-sm">We use Tingo as a data source for the stock prices.</p>
          <p class="text-gray-700 text-sm">When the project will officially release, we will handle it ourself, but for now you need to follow theses steps to obtain your FREE api Key</p>

          <ol class="ml-4" style="list-style-type: decimal ">
            <li>Go to <a href="https://tingo.com" target="_blank">tingo.com</a> and sign up for an account</li>
            <li>Once your account activated, go to your Profile, then under <b>Your API token</b></li>
            <li>Copy your token here</li>
          </ol>
          <input
              v-model="apiToken"
              class="form-input mt-1 block w-full rounded-md focus:border-indigo-600"
              type="text"
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
              <span class="mx-2 text-gray-600 text-sm">I understand that this project is still a prototype and i accpet all risks!</span>
            </label>
          </div>

        </div>

        <div class="mt-6">
          <button
              id="acceptTestingBtn"
              :disabled="!acceptTesting || apiToken.length < 30 || apiToken.length > 50 || masterKey.length < 7"
              class="py-2 px-4 text-center bg-indigo-600 rounded-md w-full text-white text-sm hover:bg-indigo-500"
              type="submit"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, inject, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ExternalDataProvider, User} from '../../../models'
import {AuthStore} from '../../../store'

export default defineComponent({
  async setup() {
    const router = useRouter()

    const authStore = inject<AuthStore>('$authStore')
    const user = await User.currentAsync()

    const email = ref(user.get('email') || 'test@test.com')

    const profileInfo = user.get('profileInfo') || {}

    const apiToken = ref('')
    const masterKey = ref('')
    const isMasterKeyValid = ref(false)
    const firstName = ref(profileInfo.firstName || 'test')
    const lastName = ref(profileInfo.lastName || 'test')
    const acceptTesting = ref(profileInfo.acceptTesting || false)
    const plannedRetirementAge = ref(profileInfo.plannedRetirementAge || 60)
    const yearBorn = ref(profileInfo.yearBorn || 1990)


    const getApiTokenProvider = async (): Promise<ExternalDataProvider | null> => {

      const q = new Parse.Query('ExternalDataProvider')
      q.equalTo('name', 'tingo')
      const provider = await q.first()

      if (!provider) {
        return null
      }
      return provider
    }


    const saveApiToken = async () => {

      let apiProvider = await getApiTokenProvider()

      if (!apiProvider) {
        apiProvider = new ExternalDataProvider()
        apiProvider.set('name', 'tingo')
        apiProvider.set('isActive', true)
      }

      apiProvider.set('credentials', {
        ct: 'test! / not the real token!' + (new Date()).toISOString(),
        iv: 'asdf',
        s: 'asdf'
      })
      await apiProvider.save()
    }

    const login = async () => {
      user.set('profileInfo', {
        firstName: firstName.value,
        lastName: lastName.value,
        acceptTesting: acceptTesting.value,
        plannedRetirementAge: plannedRetirementAge.value,
        yearBorn: yearBorn.value,
      })

      if (!await authStore.hasClientKey()) {
        const clientKey = await authStore.createMasterKey(masterKey.value)
        user.set('clientKey', clientKey)
        await user.save()

        await saveApiToken()
        //router.push({name: 'dashboard'})

        return
      } else {
        isMasterKeyValid.value = await authStore.isMasterKeyValid(masterKey.value)
        console.log('key valid?', isMasterKeyValid.value)

        if (isMasterKeyValid.value) {
          await saveApiToken()
          const apiProvider = await getApiTokenProvider()

          apiToken.value = apiProvider ? apiProvider.get('credentials').ct || 'not set' : 'not in DB'
        }
      }
    }

    // watch(masterKey, async key => {
    // })


    return {
      acceptTesting,
      apiToken,
      yearBorn,
      plannedRetirementAge,
      masterKey,
      login,
      isMasterKeyValid,
      email,
      firstName,
      lastName,
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
