<template>
  <div>
    <div @click="open">
      <slot name="button" />
    </div>

    <div
      :class="`modal ${
        !opened && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"
        @click="close(true)"
      />
      <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
          <svg
            class="fill-current text-white"
            height="18"
            viewBox="0 0 18 18"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
            />
          </svg>
          <span class="text-sm">(Esc)</span>
        </div>

        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold">
              {{ title }}
            </p>
            <div
              class="modal-close cursor-pointer z-50"
              @click="close"
            >
              <svg
                class="fill-current text-black"
                height="18"
                viewBox="0 0 18 18"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!--Body-->
          <slot
            :close="close"
            name="content"
          />

          <!--Footer-->
          <div class="flex justify-end pt-2 gap-4 flex-wrap">
            <slot
              :close="close"
              name="actions"
            >
              <ButtonDefault
                label="Close"
                @click="close"
              />
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import ButtonDefault from '/@components/base/ButtonDefault.vue'


export default defineComponent({
  components: {
    ButtonDefault,
  },
  props: {
    title: {
      type     : String,
      required : true,
    },
    canClickOutside: {
      type    : Boolean,
      default : true,
    },
  },
  emits: [
    'opened', 'closed',
  ],
  setup (props, {emit}) {
    const opened = ref(false)

    function close (isBackdrop = false) {
      if (!props.canClickOutside && isBackdrop) {
        return
      }

      opened.value = false
      emit('closed')
    }

    function open () {
      opened.value = true
      emit('opened')
    }

    return {
      ...toRefs(props),
      open,
      close,
      opened,
    }
  },
})
</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>
