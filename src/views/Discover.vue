<template>
  <div id="main">
    <not-logged-in class="loginBox" v-if="!loggedIn && !loading && showWelcome && loginFeature"></not-logged-in>
    <v-container class="construction">
      <img
        class="constructionImage"
        src="@/assets/undraw_under_construction_46pa.svg"
        alt="Under kontruksjon"
      />
      <h3 class="headline">
        Nettsiden
        <span class="primary--text">Dine</span> Oppskrifter er under konstruksjon
      </h3>
      <p
        class="constuctionText"
      >Når nettsiden er ferdig kan du nyte de mange funksjonene nettsiden får</p>
      <p
        class="constructionText"
        v-if="ingredientsTool"
      >I mellomtiden kan du bruke verktøyet for å regne ut ingredienser under</p>
      <v-btn color="secondary" @click="toIngredients">Ingredienskalkulator</v-btn>
    </v-container>
    <div id="ingredientsContainer" class="grey lighten-3">
      <ingredients-calculator class="Ingredients"></ingredients-calculator>
    </div>
  </div>
</template>

<script>
import notLoggedIn from "../components/NotLoggedInCard.vue";
import ingredientsCalculator from "@/components/IngredientsCalculator.vue";
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";

export default {
  name: "Discover",
  components: {
    "not-logged-in": notLoggedIn,
    "ingredients-calculator": ingredientsCalculator
  },
  data() {
    return {};
  },
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
    },
    ingredientsTool() {
      return this.$store.state.activeFeatures.ingredients;
    }
  },
  methods: {
    toIngredients() {
      let ingredients = document.querySelector("#ingredientsContainer");
      this.$vuetify.goTo(ingredients, {
        duration: 600,
        offset: 40,
        easing: "easeInOutCubic"
      });
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.loginBox {
  display: flex;
  justify-content: center;
}

.construction {
  min-height: 100vh;
}

#ingredientsContainer {
  text-align: left;
  padding-top: 50px;
  min-height: 90vh;
}

.constructionImage {
  width: 80%;
  max-width: 800px;
}

.tes {
  height: 5000px;
}

.headline {
  margin: 20px;
  padding: 20px;
}
</style>