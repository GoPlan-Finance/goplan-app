<template>
  <h1 class="text-gray-700 text-xl font-bold mb-6">
    Styleguide
  </h1>

  <GoIcons :name="icons.PENCIL" class="h-5 w-5"></GoIcons>
  <GoIcons :name="icons.TRASH" type="outline" class="h-5 w-5"></GoIcons>
  <GoIcons :name="icons.ACADEMIC_CAP" type="outline" class="h-10 w-10 transform rotate-180"></GoIcons>
</template>

<script lang="ts">
import GoIcons from '/@components/Icons/GoIcons.vue'
import { icons } from '/@components/Icons/icons'
import { defineComponent } from 'vue'

export default defineComponent({
  components : {GoIcons},
  setup() {
    return {
      icons
    }
  }
})
</script>
