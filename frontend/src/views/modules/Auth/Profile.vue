<template>
  <div>
    <h3 class="text-gray-700 text-3xl font-semibold">Forms</h3>

    <div class="mt-4">
      <h4 class="text-gray-600">Model Form</h4>

      <div class="mt-4">
        <div class="max-w-sm w-full bg-white shadow-md rounded-lg overflow-hidden border">
          <form>
            <div class="flex justify-between items-center px-5 py-3 text-gray-700 border-b">
              <h3 class="text-sm">Add Category</h3>
              <button>
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </button>
            </div>

            <div class="px-5 py-6 bg-gray-200 text-gray-700 border-b">
              <label class="text-xs">Name</label>

              <div class="mt-2 relative rounded-lg shadow-sm">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </span>

                <input
                  class="form-input w-full px-12 py-2 appearance-none rounded-lg focus:border-blue-600"
                  type="text"
                />
              </div>
            </div>

            <div class="flex justify-between items-center px-5 py-3">
              <button
                class="px-3 py-1 text-gray-700 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                class="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500 focus:outline-none"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <h4 class="text-gray-600">Forms</h4>

      <div class="mt-4">
        <div class="p-6 bg-white rounded-lg shadow-md">
          <h2 class="text-lg text-gray-700 font-semibold capitalize">Account settings</h2>

          <form class="mt-4" @submit.prevent="save">
            <label class="block">
              <span class="text-gray-700 text-sm">Email</span>
              <input
                v-model="email"
                class="form-input mt-1 block w-full rounded-md focus:border-blue-600"
                type="email"
              />
            </label>

            <label class="block">
              <span class="text-gray-700 text-sm">First Name</span>
              <input
                v-model="firstName"
                class="form-input mt-1 block w-full rounded-md focus:border-blue-600"
                type="text"
              />
            </label>

            <label class="block">
              <span class="text-gray-700 text-sm">Last Name</span>
              <input
                v-model="lastName"
                class="form-input mt-1 block w-full rounded-md focus:border-blue-600"
                type="text"
              />
            </label>

            <label class="block">
              <span class="text-gray-700 text-sm">What year are you born ?</span>
              <input
                v-model="yearBorn"
                :max="2030"
                :min="1900"
                class="form-input mt-1 block w-full rounded-md focus:border-blue-600"
                type="number"
              />
            </label>

            <label class="block">
              <span class="text-gray-700 text-sm">At what age would you like to retire ?</span>
              <input
                v-model="plannedRetirementAge"
                :max="130"
                :min="18"
                class="form-input mt-1 block w-full rounded-md focus:border-blue-600"
                type="number"
              />
            </label>

            <br />
            <h2 style="font-size: larger">Data source</h2>

            <p class="text-gray-700 text-sm">We use Tingo as a data source for the stock prices.</p>
            <p class="text-gray-700 text-sm">
              When the project will officially release, we will handle it ourself, but for now you
              need to follow theses steps to obtain your FREE api Key
            </p>

            <ol class="ml-4" style="list-style-type: decimal">
              <li>
                Go to <a href="https://tingo.com" target="_blank">tingo.com</a> and sign up for an
                account
              </li>
              <li>
                Once your account activated, go to your Profile, then under <b>Your API token</b>
              </li>
              <li>Copy your token here</li>
            </ol>

            <label class="block">
              <input
                v-model="apiToken"
                class="form-input mt-1 block w-full rounded-md focus:border-blue-600"
                type="text"
              />
            </label>

            <div class="mt-6">
              <button
                class="py-2 px-4 text-center bg-blue-600 rounded-md w-full text-white text-sm hover:bg-blue-500"
                type="submit"
              >
                Save
                <!--                @todo click -> Spinner -> Save-->
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { User } from '@common/models';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  setup() {
    let user: Parse.User | null = null;

    const email = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const plannedRetirementAge = ref(60);
    const yearBorn = ref(1990);

    // const getApiTokenProvider = async (): Promise<ExternalDataProvider | null> => {
    //
    //   const q = new Query('ExternalDataProvider')
    //   q.equalTo('name', 'tingo')
    //   const provider = await q.first()
    //
    //   if (!provider) {
    //     return null
    //   }
    //
    //   return provider
    // }

    // const saveApiToken = async () => {
    //
    //   let apiProvider = await getApiTokenProvider()
    //
    //   if (!apiProvider) {
    //     apiProvider = new ExternalDataProvider()
    //     apiProvider.set('name', 'tingo')
    //     apiProvider.set('isActive', true)
    //   }
    //
    //   apiProvider.set('credentials', apiToken.value)
    //   await apiProvider.save()
    // }

    const save = async () => {
      // if (apiToken.value.length) {
      //   await saveApiToken()
      // }

      if (!user) {
        return;
      }

      user.set('profileInfo', {
        firstName: firstName.value,
        lastName: lastName.value,
        plannedRetirementAge: plannedRetirementAge.value,
        yearBorn: yearBorn.value,
      });
      await user.save();
    };
    onMounted(async () => {
      user = await User.currentAsync();

      if (!user) {
        return;
      }

      email.value = user.get('email');

      const profileInfo = user.get('profileInfo') || {};

      firstName.value = ref(profileInfo.firstName || 'test');
      lastName.value = ref(profileInfo.lastName || 'test');
      plannedRetirementAge.value = ref(profileInfo.plannedRetirementAge || 60);
      yearBorn.value = ref(profileInfo.yearBorn || 1990);
    });

    // const tingo = await getApiTokenProvider()
    // if (tingo) {
    //   apiToken.value = tingo.get('credentials')
    // }

    return {
      // apiToken,
      yearBorn,
      plannedRetirementAge,
      save,
      email,
      firstName,
      lastName,
    };
  },
});
</script>
<style></style>
