<template>
  <div>
    <v-expand-transition>
      <v-container v-if="!wasLoggedIn" fluid>
        <welcome-screen></welcome-screen>
      </v-container>
    </v-expand-transition>

    <v-divider v-if="!loggedIn" class="mt-8"></v-divider>
    <v-btn class="mt-12 mb-4" color="primary" v-if="loggedIn" @click="goToNewRecipe">
      <v-icon>mdi-plus</v-icon>Lag en ny oppskrift
    </v-btn>
    <recipe-list></recipe-list>
  </div>
</template>

<script>
export default {
  name: "Discover",
  metaInfo() {
    return {
      title: "Forsiden - Dine Oppskrifter"
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    },
    wasLoggedIn() {
      return this.$store.state.accountModule.wasLoggedIn;
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
    },
    loginProcess() {
      return this.$store.state.accountModule.loginProcess;
    }
  },
  methods: {
    goToNewRecipe() {
      this.$store.commit("startLoading");
      this.$router.push("ny-oppskrift");
    }
  },
  components: {
    "welcome-screen": () => import("@/components/WelcomeScreen"),
    "recipe-list": () => import("@/components/recipes/RecipeList")
  }
};
</script>

<style lang="scss" scoped>
</style>