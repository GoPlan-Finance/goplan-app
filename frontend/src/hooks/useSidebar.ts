import { reactive, toRefs } from 'vue'

const state = reactive({
  isOpen: false,
})

export function useSidebar () :void {
  return {
    ...toRefs(state),
  }
}
