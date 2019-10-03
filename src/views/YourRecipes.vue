<template>
  <v-container id="main" class="pt-2 px-4">
    <v-row class="pa-3 pb-0 mb-0">
      <h2 class="headline text-left primary--text my-auto">
        Dine
        <span class="black--text">Oppskrifter</span>
      </h2>
      <v-btn color="success" icon x-large class="ml-auto" @click="refresh">
        <v-icon id="refreshBtn">mdi-refresh</v-icon>
      </v-btn>
    </v-row>
    <not-logged-in-card v-if="!user.loggedIn"></not-logged-in-card>
    <v-btn
      color="info"
      v-if="loggedIn"
      @click="$router.push('ny-oppskrift')"
      id="newRecipeBtn"
      fixed
      right
    >
      Ny Oppskrift
      <v-icon class="btnIcon">mdi-plus</v-icon>
    </v-btn>

    <h4
      v-if="published.length == 0 && drafts.length == 0 && !loading && loggedIn"
      class="subtitle-1 ma-2 pt-4"
    >Du har ikke lagt noen oppskrifter enda</h4>
    <v-btn
      v-if="published.length == 0 && drafts.length == 0 && !loading && loggedIn"
      to="/ny-oppskrift"
      color="success"
      class="ma-2"
    >Lag en oppskrift nå!</v-btn>

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
        <recipe-card
          v-for="recipe in published"
          :key="recipe.id"
          :recipe="recipe"
          v-on:deletedRecipe="recipeDeleted"
        ></recipe-card>
      </div>
      <v-btn
        v-if="!publishedEnd && !loading"
        color="success"
        class="mt-4"
        rounded
        @click="getNextPublishedBatch"
      >Last flere</v-btn>
      <p v-if="publishedEnd && !loading" class="subtitle-2 mt-4">Ingen flere oppskrifter å vise</p>
    </v-container>
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
  name: "your-recipes",
  metaInfo() {
    return {
      title: "Dine Oppskrifter"
    };
  },
  components: {
    "draft-card": () => import("@/components/recipes/DraftCard"),
    "recipe-card": () => import("@/components/recipes/RecipeCard"),
    "not-logged-in-card": () => import("@/components/NotLoggedInCard")
  },
  data() {
    return {
      drafts: [],
      draftLoading: [],
      published: [],
      publishedLimit: 10,
      publishedEnd: true,
      lastPublishedDoc: null,
      recipesRef: undefined,
      unsubscribe: undefined,
      deleteSuccess: false
    };
  },
  computed: {
    uid() {
      return this.$store.state.accountModule.uid;
    },
    loading() {
      return this.$store.state.loading;
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
        .where("author.id", "==", this.uid);

      this.unsubscribe = query.onSnapshot(snapshot => {
        this.drafts = [];
        snapshot.forEach(doc => {
          this.drafts.push({ ...doc.data(), id: doc.id, loading: false });
        });
        this.$store.commit("stopLoading");
      });
    },
    retrievePublished() {
      this.$store.commit("startLoading");
      let publishedQuery = this.recipesRef
        .where("status", "==", "published")
        .where("author.id", "==", this.uid)
        .orderBy("dateCreated", "desc")
        .limit(this.publishedLimit);

      publishedQuery
        .get()
        .then(snapshot => {
          this.published = [];
          snapshot.forEach(doc => {
            this.published.push({ ...doc.data(), id: doc.id });

            this.lastPublishedDoc = snapshot.docs[snapshot.docs.length - 1];

            if (snapshot.docs.length < this.publishedLimit) {
              this.publishedEnd = true;
            } else {
              this.publishedEnd = false;
            }
          });
          this.$store.commit("stopLoading");
        })
        .catch(error => {
          // Error handling
          console.log("Error:");
          this.$store.commit("stopLoading");

          console.dir(error);
        });
    },
    recipeDeleted() {
      this.refresh();
      this.deleteSuccess = true;
      setTimeout(() => {
        this.deleteSuccess = false;
      }, 5000);
    },
    getNextPublishedBatch() {
      if (this.lastPublishedDoc) {
        this.$store.commit("startLoading");
        let publishedQuery = this.recipesRef
          .where("status", "==", "published")
          .where("author.id", "==", this.uid)
          .orderBy("dateCreated", "desc")
          .startAfter(this.lastPublishedDoc)
          .limit(this.publishedLimit);

        publishedQuery
          .get()
          .then(snapshot => {
            console.log("Got snapshot");
            snapshot.forEach(doc => {
              this.published.push({ ...doc.data(), id: doc.id });
            });

            this.lastPublishedDoc = snapshot.docs[snapshot.docs.length - 1];

            if (snapshot.docs.length < this.publishedLimit) {
              this.publishedEnd = true;
            } else {
              this.publishedEnd = false;
            }

            this.$store.commit("stopLoading");
          })
          .catch(error => {
            console.log("Error:");
            this.$store.commit("stopLoading");
            console.dir(error);
          });
      } else {
        this.publishedEnd = true;
      }
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