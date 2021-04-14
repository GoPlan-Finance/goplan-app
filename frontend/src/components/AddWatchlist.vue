<template>
  <Modal
    title="Add Watchlist"
  >
    <template #button>
      <ButtonDefault
        label="New Watchlist"
      >
        <template #before>
          <svg
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              fill-rule="evenodd"
            />
          </svg>
        </template>
      </ButtonDefault>
    </template>
    <template #content="{close}">
      <label>
        <div class="text-gray-400 ml-2 mb-1">
          Name
        </div>
        <input
          v-model="newWatchlistName"
          class="rounded w-full"
          placeholder="Name"
          type="text"
          @keypress.enter="createList() && close()"
        >
      </label>
    </template>
    <template #actions="{close}">
      <ButtonDefault
        class="inline-flex items-center px-2 mr-1 bg-green-400 rounded-xl cursor-pointer hover:bg-gray-300 select-none"
        label="Save"
        @click="createList() && close()"
      />
    </template>
  </Modal>
</template>

<script lang="ts">

import { Watchlist } from '/@common/models'
import { defineComponent, ref } from 'vue'
import ButtonDefault from '/@components/base/ButtonDefault.vue'
import Modal from '/@components/base/GoModal.vue'


export default defineComponent({
  components: {Modal, ButtonDefault},
  setup () {
    const newWatchlistName = ref('')

    const createList = async () => {
      const watchlist        = new Watchlist()
      watchlist.set('name', newWatchlistName.value)
      await watchlist.save()
      newWatchlistName.value = ''
    }

    return {
      newWatchlistName,
      createList,
    }
  },


})
</script>
