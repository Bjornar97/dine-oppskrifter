<template>
  <v-container>
    <v-row>
      <h2 class="headline secondary--text text-left my-auto ml-4">Finn Oppskrifter</h2>
      <v-btn color="success" icon x-large class="ml-auto" @click="refresh">
        <v-icon id="refreshBtn">mdi-refresh</v-icon>
      </v-btn>
    </v-row>
    <recipe-filter></recipe-filter>
    <div id="mx-auto">
      <h4
        class="subtitle-2 mt-2"
        v-if="recipes.length == 0 && !recipesLoading && !recipeError"
      >Det finnes dessverre ingen oppskrifter etter disse kriteriene enda</h4>
      <h4
        class="subtitle-2 mt-2"
        v-if="recipes.length == 0 && !recipesLoading && recipeError"
      >Kunne ikke laste inn oppskriftenen, prøv igjen</h4>

      <!-- <v-progress-circular
        v-show="recipesLoading"
        size="50"
        width="5"
        class="mt-6"
        color="primary"
        indeterminate
      ></v-progress-circular>-->

      <div class="recipeList mt-4">
        <recipe-card v-for="recipe in recipes" :key="recipe.id" :recipe="recipe"></recipe-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";
var db = firebase.firestore();

export default {
  name: "recipe-list",
  components: {
    "recipe-filter": () => import("@/components/recipes/RecipeFilter"),
    "recipe-card": () => import("@/components/recipes/RecipeCard")
  },
  methods: {
    like(recipe) {
      if (this.loggedIn) {
        return;
      }
      if (recipe.liked) {
        // TODO: Remove like from firebase
        recipe.liked = false;
        recipe.likes--;
      } else {
        // TODO: Send a like to firebase
        recipe.liked = true;
        recipe.likes++;
      }
    },
    refresh() {
      this.$store.dispatch("retrieveRecipes");
      let refreshBtn = document.querySelector("#refreshBtn");
      refreshBtn.classList.add("refreshing");
      setTimeout(() => {
        refreshBtn.classList.remove("refreshing");
      }, 1600);
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    },
    recipes() {
      return this.$store.state.recipesModule.recipes;
    },
    recipesLoading() {
      return this.$store.state.loading;
    },
    recipeError() {
      return this.$store.state.recipesModule.error;
    }
  },
  created() {
    this.$store.dispatch("retrieveRecipes");
  }
};
</script>

<style lang="scss" scoped>
.refreshing {
  animation-name: spin;
  animation-duration: 1.5s;
  animation-play-state: running;
  animation-delay: 0ms;
  animation-timing-function: ease;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@supports (display: grid) {
  .recipeList {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
  }
}
</style>