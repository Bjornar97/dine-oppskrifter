<template>
  <v-container class="main">
    <v-row class="pa-3">
      <h2 class="headline text-left primary--text">
        Dine
        <span class="black--text">Oppskrifter</span>
      </h2>
    </v-row>

    <v-btn color="info" @click="$router.push('ny-oppskrift')" id="newRecipeBtn" fab fixed right>
      <v-icon class="btnIcon">mdi-plus</v-icon>
    </v-btn>
    <v-container class="pl-0" v-if="drafts.length != 0">
      <h3 class="title text-left secondary--text">Ikke ferdige</h3>
      <draft-card
        v-for="(draft, index) in drafts"
        :recipe="draft"
        @delete-recipe="deleteDraft(draft.id, index)"
        :key="draft.id"
      ></draft-card>
    </v-container>
    <v-container class="pl-0" v-if="published.length != 0">
      <h3 class="title text-left secondary--text">Publisert</h3>
      <recipe-card v-for="recipe in published" :key="recipe.id" :recipe="recipe"></recipe-card>
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
    "recipe-card": () => import("@/components/recipes/RecipeCard")
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
    }
  },
  methods: {
    retrieveDrafts() {
      this.$store.commit("startLoading");
      this.recipesRef = db.collection("recipes");
      let query = this.recipesRef
        .where("status", "==", "draft")
        .where("authorID", "==", this.uid)
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
        .where("authorID", "==", this.uid);
      publishedQuery.get().then(snapshot => {
        this.published = [];
        snapshot.forEach(doc => {
          console.log("Got published: ");
          console.dir(doc);
          this.published.push({ ...doc.data(), id: doc.id });
          this.$store.commit("stopLoading");
        });
      });
    },
    deleteDraft(id, index) {
      this.recipesRef
        .doc(id)
        .delete()
        .then(() => {});
    }
  },
  created() {
    this.retrieveDrafts();
    this.retrievePublished();
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  min-height: 90vh;
}

#newRecipeBtn {
  bottom: 90px;

  .btnIcon {
    font-size: 2.4em;
  }
}
</style>