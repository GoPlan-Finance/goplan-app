<template>
  <button
    class="googleSignIn"
    @click="clicked"
  >
    <img
      alt="Google logo"
      src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/G-on-white.svg"
    >
    <span class="googleSignIn__text">Sign in with Google</span>
  </button>
</template>

<script>
export default {
  emits: [
    'clicked'
  ],
  methods: {
    clicked ()  {
      this.$emit('clicked')
    },
  },
}
</script>

<style scope>
.googleSignIn {
  width: 200px;
  border: none;
  border-radius: 2px;
  background-color: #4285f4;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12);
  border: none;
  display: flex;
  padding: 1px;
  color: #FFF;
}

.googleSignIn:hover {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12);
}

.googleSignIn:active {
  background: #3367D6;
}


.googleSignIn:disabled {
  background: rgba(0, 0, 0, 0.08);
  color: rgba(0, 0, 0, 0.4);
  box-shadow: none;
}

.googleSignIn__text {
  padding: 11px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Roboto', arial, sans-serif;
}
</style>
