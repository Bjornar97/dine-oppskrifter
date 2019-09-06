<template>
  <div class="recipeCardDiv">
    <v-card max-width="350px" width="100%" class="card my-4 mx-auto" :loading="loading">
      <v-img
        @click="goToRecipe"
        class="link"
        max-height="150px"
        :src="imageSrc"
        alt="Bilde av oppskriften"
      ></v-img>
      <v-card-title>
        <div class="titleDiv link">
          <h3 @click="goToRecipe" class="headline">{{recipe.title}}</h3>
          <v-menu transition="scroll-y-transition" offset-y v-if="personal">
            <template v-slot:activator="{ on }">
              <v-btn class="menuDots" icon small v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="editRecipe">
                <v-list-item-title>Rediger</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteDialogOpen = true">
                <v-list-item-title>Slett</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-card-title>
      <v-card-text @click="goToRecipe" class="text-left link">{{recipe.description}}</v-card-text>
      <v-card-actions class="link">
        <div class="infoRow">
          <div class="favorite" v-if="true">
            <v-icon color="red">mdi-heart-outline</v-icon>
            <p class="caption">432</p>
          </div>
          <div class="visibility infoElement" v-if="personal" @click="goToRecipe">
            <v-icon>{{recipe.visibility == 'Public'? 'mdi-earth': "mdi-lock"}}</v-icon>
            <p class="caption" v-if="recipe.visibility == 'Public'">Offentlig</p>
            <p class="caption" v-if="recipe.visibility == 'Private'">Privat</p>
          </div>
          <div class="difficulty infoElement" @click="goToRecipe">
            <v-icon :color="difficultyColor">mdi-chef-hat</v-icon>
            <p class="caption">{{recipe.difficulty}}</p>
          </div>
          <div class="category infoElement" @click="goToRecipe">
            <v-icon color="secondary">mdi-tag</v-icon>
            <p class="caption">{{recipe.category}}</p>
          </div>
          <div class="time infoElement" @click="goToRecipe">
            <v-icon :color="timeColor">mdi-clock-outline</v-icon>
            <p class="caption">{{recipe.totalTime}} min</p>
          </div>
        </div>
      </v-card-actions>

      <v-snackbar v-model="error" multi-line>
        Kunne ikke slette oppskriften akkurat nå, prøv igjen senere
        <v-btn text color="primary" @click.native="error = false">Lukk</v-btn>
      </v-snackbar>
      <v-dialog v-model="deleteDialogOpen" max-width="500px" transition="dialog-transition">
        <v-card>
          <v-card-title>Slette oppskriften {{recipe.title}}</v-card-title>
          <v-card-text>
            Er du sikker på at du vil slette denne oppskriften?
            Dette vil slette den permanent.
          </v-card-text>
          <v-card-actions>
            <v-btn text color="warning" @click="deleteDialogOpen = false">Avbryt</v-btn>
            <div class="yesNoBtns">
              <v-btn text color="success" @click="deleteDialogOpen = false">Nei</v-btn>
              <v-btn text color="error" @click="deleteRecipe">Ja</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";
var db = firebase.firestore();
import "firebase/storage";
var storage = firebase.storage();

export default {
  name: "recipe-card",
  props: ["recipe"],
  data() {
    return {
      isImage: false,
      imageSrc: "",
      deleteDialogOpen: false,
      loading: false,
      error: false
    };
  },
  computed: {
    user() {
      return this.$store.state.accountModule;
    },
    personal() {
      return this.user.uid == this.recipe.author.id;
    },
    difficultyColor() {
      if (this.recipe.difficulty == "Enkel") {
        return "success";
      } else if (this.recipe.difficulty == "Medium") {
        return "warning";
      } else if (this.recipe.difficulty == "Vanskelig") {
        return "error";
      } else {
        return "grey";
      }
    },
    timeColor() {
      let totalTime = parseInt(this.recipe.totalTime);
      if (totalTime <= 30) {
        return "success";
      } else if (totalTime <= 60) {
        return "warning";
      } else {
        return "error";
      }
    }
  },
  methods: {
    getImageSrc(path) {
      if (path) {
        storage
          .ref(path)
          .getDownloadURL()
          .then(url => {
            this.imageSrc = url;
            this.isImage = true;
          })
          .catch(error => {
            console.log("Some error happened:");
            console.dir(error);
          });
      }
    },
    goToRecipe() {
      this.$store.commit("startLoading");
      this.$router.push(`oppskrift/${this.recipe.id}`);
    },
    deleteRecipe() {
      this.deleteDialogOpen = false;
      this.loading = true;
      db.collection("recipes")
        .doc(this.recipe.id)
        .delete()
        .then(() => {
          this.loading = false;
          this.$emit("deletedRecipe");
        })
        .catch(error => {
          this.error = true;
          console.log("An error occured while deleting recipe");
          console.dir(error);
        });
    },
    editRecipe() {
      this.loading = true;
      this.$store.commit("startLoading");
      this.$router.push(`endre-oppskrift/${this.recipe.id}`);
    }
  },
  created() {
    console.dir(this.recipe);
    this.getImageSrc(this.recipe.imagePath);
  }
};
</script>

<style lang="scss" scoped>
.infoElement {
  margin: 0 5px;
  width: max-content;
}

.link {
  :hover {
    cursor: pointer;
  }
}

.infoRow {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.menuDots:hover {
  cursor: pointer;
}

.yesNoBtns {
}

.titleDiv {
  display: flex;
  width: 100%;

  h3.headline {
    width: 100%;
    text-align: left;
    align-self: center;
  }
}
</style>