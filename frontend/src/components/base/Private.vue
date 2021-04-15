<template>
  <template v-if="privateMode && hide">
    *****
  </template>
  <template v-else>
    <slot />
  </template>
</template>

<script lang="ts">
import { useUserStore } from '../../store'
import { defineComponent, computed } from 'vue'


export enum ButtonType {
  PRIMARY   = 'primary',
  SECONDARY = 'secondary',
}


export default defineComponent({
  props: {
    hide: {
      default : true,
      type    : Boolean
    },
  },
  setup (props) {
    const userStore          = useUserStore()

    return {
      privateMode: computed(() => userStore.privateMode),
    }
  },
})
</script>
