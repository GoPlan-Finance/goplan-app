<template>
  <header
    class="flex items-center py-4 px-6 xl:container xl:mx-auto"
  >
    <div class="flex items-center flex-1">
      <button
        class="text-gray-500 focus:outline-none lg:hidden"
        @click="isOpen = true"
      >
        <GoIcons
          name="Menu"
          class="h-6 w-6"
        />
      </button>

      <SearchBar class="mx-4 lg:mx-0 sm:w-96 active:w-full" />
    </div>

    <div class="flex items-center gap-4">
      <div
        class="hover:text-gray-500 cursor-pointer"
        @click="setPrivateMode(!privateMode)"
      >
        <GoIcons
          v-if="privateMode !== true"
          name="Eye"
          type="outline"
          class="h-7 w-7"
        />
        <GoIcons
          v-if="privateMode === true"
          name="EyeOff"
          type="outline"
          class="h-7 w-7"
        />
      </div>

      <GoIcons
        name="Bell"
        type="outline"
        class="h-7 w-7 hover:text-gray-500 cursor-pointer"
      />

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
          class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20"
        >
          <router-link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
            to="profile"
          >
            Profile
          </router-link>
          <router-link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
            to="/styleguide"
          >
            Styleguide
          </router-link>
          <a
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
            href="#"
          >Products</a>
          <a
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white"
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
import { defineComponent, computed, inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSidebar } from '../hooks/useSidebar'
import { AuthStore, useUserStore } from '../store'
import SearchBar from './SearchBar.vue'


export default defineComponent({
  components: {
    SearchBar
  },
  // eslint-disable-next-line no-unused-vars
  setup () {
    const userStore          = useUserStore()
    const {push : pushRoute} = useRouter()
    const authStore          = inject(('$authStore')) as AuthStore
    const dropdownOpen       = ref(false)
    const {isOpen}           = useSidebar()

    const signOut = async () => {
      await authStore.signOut()
      await pushRoute('auth')
    }


    return {
      setPrivateMode : userStore.setPrivateMode,
      privateMode    : computed(() => userStore.privateMode),
      signOut,
      authStore,
      isOpen,
      dropdownOpen,
    }
  },
})
</script>
