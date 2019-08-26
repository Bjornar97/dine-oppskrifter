<template>
  <v-card class="card my-4">
    <v-img height="150px" v-if="image" :src="imageSrc"></v-img>
    <v-card-title primary-title>{{recipe.title || "Uten tittel"}}</v-card-title>
    <v-card-text class="text-left">{{recipe.description}}</v-card-text>
    <v-card-actions>
      <v-btn text @click="deleteRecipe" color="error">Slett</v-btn>
      <v-btn text @click="$router.push(`endre-oppskrift/${recipe.id}`)" color="success">Fortsett</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/storage";
var storage = firebase.storage();

export default {
  name: "draft-card",
  props: ["recipe", "loading"],
  data() {
    return {
      image: false,
      imageSrc: ""
    };
  },
  methods: {
    deleteRecipe() {
      this.$emit("delete-recipe");
    }
  },
  created() {
    if (this.recipe.imagePath) {
      storage
        .ref(this.recipe.imagePath)
        .getDownloadURL()
        .then(url => {
          this.imageSrc = url;
          this.image = true;
        })
        .catch(error => {
          console.log("Some error happened:");
          console.dir(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  max-width: 300px;
}
</style>