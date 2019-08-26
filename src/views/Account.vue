<template>
  <div>
    <v-btn @click="logout" v-if="loggedIn" color="error">Logg ut</v-btn>
    <facebook-login-button v-if="!loggedIn"></facebook-login-button>
  </div>
</template>

<script>
export default {
  name: "account",
  components: {
    "facebook-login-button": () => import("@/components/FacebookLoginButton")
  },
  computed: {
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>