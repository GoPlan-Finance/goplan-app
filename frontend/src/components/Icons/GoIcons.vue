<template>
  <!--  @todo fix dynamic imports-->
  <!--  <component :is="icon" />-->
  <QuestionMarkCircleIcon />
</template>

<script>
import QuestionMarkCircleIcon from '@heroicons/vue/solid/QuestionMarkCircleIcon';
import { defineAsyncComponent, defineComponent } from 'vue';
import { icons } from './icons';

export default defineComponent({
  components: {
    // @todo fix dynamic imports
    QuestionMarkCircleIcon,
  },
  props: {
    name: {
      type: String,
      required: true,
      validator: value => Object.values(icons).includes(value),
    },
    type: {
      type: String,
      default: 'solid',
      validator: value => value === 'solid' || value === 'outline',
    },
  },
  setup(props) {
    // @todo fix dynamic imports
    return {};

    return {
      icon: defineAsyncComponent({
        loader: () =>
          import(`../../../node_modules/@heroicons/vue/${props.type}/esm/${props.name}Icon.js`),
        suspensible: false,
      }),
    };
  },
});
</script>
