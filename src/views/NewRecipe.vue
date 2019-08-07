<template>
  <div>
    <h2 class="headline ma-4 text-left primary--text">Ny Oppskrift</h2>
    <v-form ref="newRecipe">
      <v-stepper v-model="activeStep" vertical class="pb-4">
        <v-stepper-step editable :complete="activeStep > 1" step="1">Generell informasjon</v-stepper-step>
        <v-stepper-content step="1">
          <v-text-field name="title" v-model="recipe.title" label="Tittel" id="1"></v-text-field>
          <v-textarea
            outlined
            auto-grow
            name="description"
            v-model="recipe.description"
            label="Kort Beskrivelse"
            id="2"
            counter="500"
          ></v-textarea>
          <v-select :items="categoryList" v-model="recipe.categorySelected" label="Kategori"></v-select>
          <v-btn class="nextButton mb-2" @click="activeStep += 1" color="success">Videre</v-btn>
        </v-stepper-content>
        <v-stepper-step editable :complete="activeStep > 2" step="2">Ingredienser</v-stepper-step>
        <v-stepper-content step="2">
          <v-btn class="nextButton mb-2" @click="activeStep += 1" color="success">Videre</v-btn>
        </v-stepper-content>
        <v-stepper-step editable step="3">Fremgangsmåte</v-stepper-step>
        <v-stepper-content step="3">
          <v-btn class="nextButton mb-2" @click="activeStep += 1" color="success">Videre</v-btn>
        </v-stepper-content>
        <v-stepper-step step="4">Koke/Steketider</v-stepper-step>
        <v-stepper-content step="4"></v-stepper-content>
        <v-btn color="error" class="mt-6 mx-2">Slett</v-btn>
        <v-btn color="info" class="mt-6 mx-2">Lagre</v-btn>
        <v-btn color="success" class="mt-6 mx-2">Publiser</v-btn>
      </v-stepper>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "new-recipe",
  data() {
    return {
      activeStep: 0,
      categoryList: [
        "Frokost",
        "Lunch",
        "Middag",
        "Tilbehør",
        "Småretter",
        "Dessert"
      ],
      recipe: {
        title: "",
        description: ""
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.nextButton {
  text-align: left;
}
</style>