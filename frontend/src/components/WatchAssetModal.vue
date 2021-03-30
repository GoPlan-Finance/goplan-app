<template>
  <Modal
    title="Add to Watchlist"
  >
    <template #button>
      <ButtonDefault
        label="Watch"
      >
        <template #before>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clip-rule="evenodd"
            />
          </svg>
        </template>
      </ButtonDefault>
    </template>
    <template #content>
      <div
        v-for="(watchlist, index) in watchlists"
        :key="index"
      >
        <div
          class="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-300"
          @click="addToWatchlist(watchlist)"
        >
          {{ watchlist.get('name') }}
        </div>
      </div>
    </template>
    <template #actions="slotProps">
      <ButtonDefault
        label="Close"
        @click="slotProps.close()"
      />
    </template>
  </Modal>
</template>

<script lang="ts">

import {defineComponent, toRefs, onBeforeMount, onUnmounted, reactive} from 'vue'
import {AssetSymbol} from '../../../common/models'
import ButtonDefault from './base/ButtonDefault.vue'
import Modal from './Modal.vue'
import {Watchlist} from '../../../common/models/Watchlist'


export default defineComponent({
  components : {Modal, ButtonDefault},
  props      : {
    assetSymbol: {
      type     : AssetSymbol,
      required : true,
    },
  },
  setup (props) {
    let liveSubscription = null

    const data: {
      watchlists: Watchlist[],
    }                    = reactive({
      watchlists: []
    })

    const addToWatchlist = async watchlist => {
      watchlist.relation('symbols').add(props.assetSymbol)
      await watchlist.save()
      alert('added')
    }

    onBeforeMount(async () => {
      const q          = new Parse.Query(Watchlist)
      liveSubscription = await Watchlist.liveQuery(q, data.watchlists)
    })

    onUnmounted(async () => {
      if (liveSubscription) {
        await liveSubscription.unsubscribe()
      }
    })


    return {
      ...toRefs(data),
      addToWatchlist
    }
  }


})
</script>
