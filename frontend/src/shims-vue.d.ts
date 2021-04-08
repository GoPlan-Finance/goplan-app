declare module '*.vue' {
  import { defineComponent } from 'vue'

  // eslint-disable-next-line init-declarations
  const Component : ReturnType<typeof defineComponent>
  export default Component
}
