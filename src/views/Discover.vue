<template>
  <div>
    <welcome-screen v-if="!loggedIn"></welcome-screen>
    <v-divider v-if="!loggedIn" class="mt-8"></v-divider>
    <v-btn text color="primary">
      <v-icon>mdi-plus</v-icon>Lag en ny oppskrift
    </v-btn>
    <recipe-list></recipe-list>
  </div>
</template>

<script>
export default {
  name: "Discover",
  computed: {
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    },
    name() {
      return this.$store.state.accountModule.name;
    },
    email() {
      return this.$store.state.accountModule.email;
    },
    loading() {
      return this.$store.state.loading;
    },
    loginFeature() {
      return this.$store.state.activeFeatures.login;
    }
  },
  components: {
    "welcome-screen": () => import("@/components/WelcomeScreen"),
    "recipe-list": () => import("@/components/RecipeList")
  }
};
</script>

<style lang="scss" scoped>
</style>