<template>
  <header
      class="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-indigo-600"
  >
    <div class="flex items-center">
      <button
          class="text-gray-500 focus:outline-none lg:hidden"
          @click="isOpen = true"
      >
        <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M4 6H20M4 12H20M4 18H11"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
          />
        </svg>
      </button>

      <div class="relative mx-4 lg:mx-0">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
          <svg
              class="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
          >
            <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
            />
          </svg>
        </span>

        <input
            class="form-input w-32 sm:w-64 rounded-md pl-10 pr-4 focus:border-indigo-600"
            placeholder="Search"
            type="text"
        >
      </div>
    </div>

    <div class="flex items-center">
      <button class="flex mx-4 text-gray-600 focus:outline-none">
        <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
          />
        </svg>
      </button>

      <div class="relative">
        <button
            class="relative z-10 block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none"
            @click="dropdownOpen = !dropdownOpen"
        >
          <img
              alt="Your avatar"
              class="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80"
          >
        </button>

        <div
            v-show="dropdownOpen"
            class="fixed inset-0 h-full w-full z-10"
            @click="dropdownOpen = false"
        />

        <div
            v-show="dropdownOpen"
            class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20"
        >
          <a
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
              href="#"
          >Profile</a>
          <a
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
              href="#"
          >Products</a>
          <a
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
              @click="signOut"
          >
            Log out
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import {defineComponent, inject, ref} from 'vue'
import {useSidebar} from '../hooks/useSidebar'
import {useRouter} from "vue-router";

export default defineComponent({
  // eslint-disable-next-line no-unused-vars
  setup(_, {emit}) {
    const { push: pushRoute } = useRouter()
    const authStore = inject(('$authStore'))
    const dropdownOpen = ref(false)
    const {isOpen} = useSidebar()

    const signOut = async () => {
      await authStore.signOut()
      await pushRoute('auth')
    }


    return {
      signOut,
      authStore,
      isOpen,
      dropdownOpen,
    }
  },
})
</script>
