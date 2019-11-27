<template>
  <v-container fluid class="recipeListContainer">
    <v-row>
      <h2 class="headline secondary--text mx-auto text-left my-auto ml-4">
        Finn Oppskrifter
      </h2>
      <v-btn color="success" icon x-large class="ml-auto" @click="refresh">
        <v-icon id="refreshBtn">mdi-refresh</v-icon>
      </v-btn>
    </v-row>
    <recipe-filter class="recipeFilter mx-auto"></recipe-filter>
    <div id="mx-auto">
      <h4
        class="subtitle-2 mt-2"
        v-if="recipes.length == 0 && !recipesLoading && !recipeError"
      >
        Det finnes ingen oppskrifter etter disse kriteriene enda
      </h4>
      <h4
        class="subtitle-2 mt-2 warning--text"
        v-if="recipes.length == 0 && !recipesLoading && recipeError"
      >
        Kunne ikke laste inn oppskriftene, prøv å oppdatere med den grønne
        rundingen
      </h4>

      <div class="recipeList mt-4">
        <recipe-card
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
          v-on:deletedRecipe="recipeDeleted"
        ></recipe-card>
      </div>
      <p
        v-if="end && !recipesLoading && !recipeError && recipes.length > 0"
        class="mt-4 subtitle-2"
      >
        Ikke flere oppskrifter å vise
      </p>
      <v-btn
        v-if="!end && !recipesLoading"
        @click="getNextBatch"
        color="success"
        class="mt-4"
        rounded
        >Last flere</v-btn
      >
    </div>
    <v-snackbar v-model="deleteSuccess" bottom class="mb-12">
      Oppskriften ble slettet
      <v-btn text color="primary" @click.native="error = false">Lukk</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";
var db = firebase.firestore();

export default {
  name: "recipe-list",
  data() {
    return {
      deleteSuccess: false
    };
  },
  components: {
    "recipe-filter": () => import("@/components/recipes/RecipeFilter"),
    "recipe-card": () => import("@/components/recipes/RecipeCard")
  },
  methods: {
    refresh() {
      this.$store.dispatch("retrieveRecipes");
      let refreshBtn = document.querySelector("#refreshBtn");
      refreshBtn.classList.add("refreshing");
      setTimeout(() => {
        refreshBtn.classList.remove("refreshing");
      }, 1600);
    },
    getNextBatch() {
      this.$store.dispatch("getNextRecipeBatch");
    },
    recipeDeleted() {
      this.refresh();
      this.deleteSuccess = true;
      setTimeout(() => {
        this.deleteSuccess = false;
      }, 5000);
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
      return this.$store.state.recipesModule.loading;
    },
    recipeError() {
      return this.$store.state.recipesModule.error;
    },
    end() {
      return this.$store.state.recipesModule.end;
    },
    lastFilterDate() {
      return this.$store.state.recipesModule.lastFilterDate;
    }
  },
  created() {
    // If the filter hasnt been used the last hour, it resets it to default values
    if (Date.now() - this.lastFilterDate > 60 * 60 * 1000) {
      this.$store.dispatch("clearFilter");
    }
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

.recipeListContainer {
  max-width: 1230px;
}

.recipeFilter {
  max-width: 800px;
  margin-bottom: 40px;
  margin-top: 20px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media only screen and (min-width: 600px) {
  .recipeListContainer {
    padding-left: 50px !important;
    padding-right: 50px !important;
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
