<template>
  <v-container class="mt-4 text-left">
    <v-row>
      <h2 class="headline error--text pa-4">Favoritter</h2>
      <v-btn color="success" icon x-large class="ml-auto" @click="refresh">
        <v-icon id="refreshBtn">mdi-refresh</v-icon>
      </v-btn>
    </v-row>
    <p v-if="error" class="warning--text">Kan ikke laste inn favoritter akkurat nå</p>
    <not-logged-in-card v-if="!user.loggedIn"></not-logged-in-card>

    <v-container class="pl-0" v-if="favouritesList.length != 0">
      <div class="recipeList">
        <recipe-card v-for="recipe in favouritesList" :key="recipe.recipeId" :recipe="recipe"></recipe-card>
      </div>
    </v-container>
    <div class="text-center">
      <p v-if="end" class="font-weight-bold">Ingen flere oppskrifter å vise</p>
      <v-btn
        v-if="!end && !loading"
        @click="getNextBatch"
        color="success"
        class="mt-4"
        rounded
      >Last flere</v-btn>
    </div>
  </v-container>
</template>
<script>
import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";
var db = firebase.firestore();

export default {
  name: "favourites",
  data() {
    return {
      favouritesList: [],
      recipesRef: undefined,
      error: false,
      lastDoc: null,
      limit: 15,
      end: false
    };
  },
  components: {
    "recipe-card": () => import("@/components/recipes/RecipeCard")
  },
  computed: {
    user() {
      return this.$store.state.accountModule;
    },
    loading() {
      return this.$store.state.loading;
    }
  },
  methods: {
    getFavourites() {
      this.$store.commit("startLoading");
      db.collection("favourites")
        .where("user.id", "==", this.user.uid)
        .limit(this.limit)
        .get()
        .then(snapshot => {
          this.favouritesList = [];
          snapshot.forEach(doc => {
            db.collection("recipes")
              .doc(doc.data().recipeId)
              .get()
              .then(recipeDoc => {
                this.favouritesList.push({
                  ...recipeDoc.data(),
                  id: recipeDoc.id
                });
              })
              .catch(error => {
                console.log("Error: ");
                console.dir(error);
              });
          });
          this.lastDoc = snapshot.docs[snapshot.docs.length - 1];

          if (snapshot.docs.length < this.limit) {
            this.end = true;
          } else {
            this.end = false;
          }
          this.$store.commit("stopLoading");
          this.error = false;
        })
        .catch(error => {
          console.log("Error: ");
          console.dir(error);
          this.error = true;
          this.$store.commit("stopLoading");
        });
    },
    getNextBatch() {
      if (this.lastDoc) {
        this.$store.commit("startLoading");
        db.collection("favourites")
          .where("user.id", "==", this.user.uid)
          .limit(this.limit)
          .startAfter(this.lastDoc)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              db.collection("recipes")
                .doc(doc.data().recipeId)
                .get()
                .then(recipeDoc => {
                  this.favouritesList.push({
                    ...recipeDoc.data(),
                    id: recipeDoc.id
                  });
                })
                .catch(error => {
                  this.error = true;
                  console.log("Error: ");
                  console.dir(error);
                });
            });
            this.error = false;
            this.lastDoc = snapshot.docs[snapshot.docs.length - 1];

            if (snapshot.docs.length < this.limit) {
              this.end = true;
            } else {
              this.end = false;
            }
            this.$store.commit("stopLoading");
          })
          .catch(error => {
            console.log("Error: ");
            console.dir(error);
          });
      }
    },
    refresh() {
      this.getFavourites();
      let refreshBtn = document.querySelector("#refreshBtn");
      refreshBtn.classList.add("refreshing");
      setTimeout(() => {
        refreshBtn.classList.remove("refreshing");
      }, 1600);
    }
  },
  created() {
    if (this.user.loggedIn) {
      this.getFavourites();
    }
  }
};
</script>

<style lang="scss" scoped>
@supports (display: grid) {
  .recipeList {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
</style>