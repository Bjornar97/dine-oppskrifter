<template>
  <v-container id="main" class="pt-2 px-4">
    <v-row class="pa-3">
      <h2 class="headline text-left primary--text my-auto">
        Dine
        <span class="black--text">Oppskrifter</span>
      </h2>
      <v-btn color="success" icon x-large class="ml-auto" @click="refresh">
        <v-icon id="refreshBtn">mdi-refresh</v-icon>
      </v-btn>
    </v-row>
    <not-logged-in-card v-if="!user.loggedIn"></not-logged-in-card>
    <v-btn color="info" @click="$router.push('ny-oppskrift')" id="newRecipeBtn" fixed right>
      Ny Oppskrift
      <v-icon class="btnIcon">mdi-plus</v-icon>
    </v-btn>
    <v-container class="pl-0" v-if="drafts.length != 0">
      <h3 class="title text-left secondary--text">Ikke Publisert</h3>
      <v-divider></v-divider>
      <div class="recipeList">
        <draft-card
          v-for="(draft, index) in drafts"
          :recipe="draft"
          @delete-recipe="deleteDraft(draft.id, index)"
          :key="draft.id"
        ></draft-card>
      </div>
    </v-container>
    <v-container class="pl-0" v-if="published.length != 0">
      <h3 class="title text-left secondary--text">Publisert</h3>
      <v-divider></v-divider>
      <div class="recipeList">
        <recipe-card v-for="recipe in published" :key="recipe.id" :recipe="recipe"></recipe-card>
      </div>
    </v-container>
  </v-container>
</template>

<script>
import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";
var db = firebase.firestore();

export default {
  name: "your-recipes",
  components: {
    "draft-card": () => import("@/components/recipes/DraftCard"),
    "recipe-card": () => import("@/components/recipes/RecipeCard"),
    "not-logged-in-card": () => import("@/components/NotLoggedInCard")
  },
  data() {
    return {
      drafts: [],
      draftLoading: [],
      draftLimit: 5,
      published: [],
      recipesRef: undefined,
      unsubscribe: undefined
    };
  },
  computed: {
    uid() {
      return this.$store.state.accountModule.uid;
    },
    user() {
      return this.$store.state.accountModule;
    },
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    }
  },
  methods: {
    retrieveDrafts() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.$store.commit("startLoading");
      let query = this.recipesRef
        .where("status", "==", "draft")
        .where("author.id", "==", this.uid)
        .limit(5);
      this.unsubscribe = query.onSnapshot(snapshot => {
        this.drafts = [];
        snapshot.forEach(doc => {
          this.drafts.push({ ...doc.data(), id: doc.id, loading: false });
          console.log(`Got draft ${doc.data().title}:`);
          console.dir({ ...doc.data(), docID: doc.id });
          this.$store.commit("stopLoading");
        });
      });
    },
    retrievePublished() {
      this.$store.commit("startLoading");
      let publishedQuery = this.recipesRef
        .where("status", "==", "published")
        .where("author.id", "==", this.uid)
        .limit(10);
      publishedQuery
        .get()
        .then(snapshot => {
          this.published = [];
          snapshot.forEach(doc => {
            console.log("Got published: ");
            console.dir(doc);
            this.published.push({ ...doc.data(), id: doc.id });
            this.$store.commit("stopLoading");
          });
        })
        .catch(error => {
          // Error handling
          console.log("Error:");
          console.dir(error);
        });
    },
    deleteDraft(id, index) {
      this.recipesRef
        .doc(id)
        .delete()
        .then(() => {
          if (this.$store.state.currentRecipeModule.recipe.recipeId == id) {
            this.$store.dispatch("deleteRecipe");
          }
        });
    },
    refresh() {
      this.retrieveDrafts();
      this.retrievePublished();
      let refreshBtn = document.querySelector("#refreshBtn");
      refreshBtn.classList.add("refreshing");
      setTimeout(() => {
        refreshBtn.classList.remove("refreshing");
      }, 1600);
    }
  },
  created() {
    this.recipesRef = db.collection("recipes");
    if (this.user.loggedIn) {
      this.retrieveDrafts();
      this.retrievePublished();
    }
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  watch: {
    loggedIn(newValue, oldValue) {
      console.log("user changed");
      console.dir(newValue);
      if (newValue == true) {
        this.$store.commit("startLoading");
        this.drafts = [];
        this.retrieveDrafts();
        this.published = [];
        this.retrievePublished();
      } else {
        this.drafts = [];
        this.published = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#main {
  min-height: calc(100vh - 100px);
}

#newRecipeBtn {
  bottom: 90px;
  border-radius: 100px;
  z-index: 10;

  .btnIcon {
    font-size: 2em;
  }
}

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