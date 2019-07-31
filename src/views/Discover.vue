<template>
  <div></div>
</template>

<script>
export default {
  name: "Discover",
  computed: {
    loggedIn() {
      return this.$store.state.account.loggedIn;
    },
    showWelcome() {
      return this.$store.state.showWelcome;
    },
    name() {
      return this.$store.state.account.name;
    },
    email() {
      return this.$store.state.account.email;
    },
    loading() {
      return this.$store.state.loading;
    },
    loginFeature() {
      return this.$store.state.activeFeatures.login;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>