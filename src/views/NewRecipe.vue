<template>
  <div>
    <h2 class="headline ma-4 text-left primary--text">Ny Oppskrift</h2>
    <v-stepper @change="changedStep" v-model="activeStep" vertical class="pb-4">
      <p class="mt-8 mb-0">Felt markert med * er påkrevd</p>
      <v-stepper-step
        editable
        :rules="[rules.generalInformation]"
        lazy-validation
        :complete="visitedSteps[1]"
        step="1"
        id="step1"
      >Generell informasjon</v-stepper-step>

      <v-stepper-content step="1">
        <v-form v-model="stepFormValid[1]" ref="step1">
          <v-text-field
            :disabled="loading"
            name="title"
            class="mb-4"
            v-model="recipeTitle"
            label="Tittel*"
            :rules="[rules.required, rules.counter100]"
            counter="100"
          ></v-text-field>
          <v-textarea
            :disabled="loading"
            outlined
            auto-grow
            name="description"
            v-model="recipeDescription"
            label="Kort Beskrivelse"
            :rules="[rules.counter500]"
            counter="500"
            hint="En kort beskrivelse av hva oppskriften er. Skal ikke inneholde fremgangsmåte eller ingrediensliste"
          ></v-textarea>
          <v-select
            :disabled="loading"
            :items="categoryList"
            :rules="[rules.required]"
            v-model="recipeCategory"
            label="Kategori*"
          ></v-select>
          <v-text-field
            :disabled="loading"
            name="portions"
            class="mb-4"
            v-model="recipePortions"
            label="Antall porsjoner*"
            :rules="[rules.required, rules.onlyNumber, rules.counter2]"
            hint="Hvor mange porsjoner denne oppskriften gir"
            persistent-hint
            counter="2"
            suffix="porsjoner"
          ></v-text-field>
          <h3 class="ml-2 subtitle-1 text-left grey--text">Visning</h3>
          <v-radio-group
            row
            hint="Ved privat vil ingen andre enn deg kunne se oppskriften. Ved offentlig kan alle se oppskriften"
            mandatory
            v-model="visibility"
            class="ml-2"
            name="visibility"
            persistent-hint
          >
            <v-radio color="primary" value="Private" label="Privat" ripple></v-radio>
            <v-radio color="primary" label="Offentlig" value="Public" ripple></v-radio>
          </v-radio-group>
          <v-btn class="nextButton mb-2 mt-4" @click="nextSection(1)" color="success">Videre</v-btn>
        </v-form>
      </v-stepper-content>

      <v-stepper-step
        editable
        :rules="[rules.ingredientsRules]"
        :complete="visitedSteps[2]"
        step="2"
        id="step2"
      >
        Ingredienser
        <small v-if="ingredientsError">Du må ha minst en ingrediens</small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-form ref="step2" v-model="stepFormValid[2]">
          <v-card class="ma-1" v-if="recipeIngredients.length != 0">
            <v-list>
              <v-subheader>Ingrediensliste</v-subheader>
              <v-list-item v-for="(ingredient, index) in recipeIngredients" :key="index">
                <v-list-item-content class="listItem">
                  <v-flex xs8>
                    <p
                      align-center
                      class="ma-0 text-left ingredient"
                    >{{ ingredient.amount }} {{ingredient.unit}} {{ingredient.name}}</p>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn
                      :disabled="loading"
                      @click="editIngredient(index)"
                      small
                      icon
                      color="warning"
                      text
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn
                      :disabled="loading"
                      @click="deleteIngredient(index)"
                      small
                      icon
                      color="error"
                      text
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-flex>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>

          <v-btn :disabled="loading" color="info" class="mb-4" text @click="openNewIngredient">
            <v-icon class="mr-2">mdi-plus</v-icon>Legg til ingrediens
          </v-btn>

          <new-ingredient
            ref="newIngredient"
            :key="recipeIngredients.length"
            :open="newIngredientOpen"
            @save="saveNewIngredient"
            @close="closeIngredient"
            @saveEdit="saveEditedIngredient"
          ></new-ingredient>

          <v-btn
            class="nextButton mb-2"
            @click="nextSection(2)"
            :disabled="loading"
            color="success"
          >Videre</v-btn>
        </v-form>
      </v-stepper-content>

      <v-stepper-step
        editable
        step="3"
        id="step3"
        :rules="[rules.stepsRules]"
        :complete="visitedSteps[2]"
      >
        Fremgangsmåte
        <small v-if="stepsError">Du må ha minst en ingrediens</small>
      </v-stepper-step>
      <v-stepper-content step="3" class="pa-0 pl-4 ma-0">
        <v-form ref="step3">
          <v-card v-if="recipeSteps.length != 0" class="ma-2">
            <v-list>
              <v-subheader>Steg</v-subheader>
              <v-list-item v-for="(step, index) in recipeSteps" :key="step.number">
                <v-list-item-content class="listItem">
                  <v-flex class="pr-2" xs1>{{step.number}}.</v-flex>
                  <v-flex xs9>{{step.text}}</v-flex>
                  <v-flex xs2>
                    <v-btn
                      @click="editStep(index)"
                      :disabled="loading"
                      small
                      icon
                      color="warning"
                      text
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      @click="deleteStep(index)"
                      :disabled="loading"
                      small
                      icon
                      color="error"
                      text
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-divider class="mt-4" v-if="recipeSteps.length != index + 1"></v-divider>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>

          <v-btn :disabled="loading" color="info" @click="openStep" text>
            <v-icon class="mr-2">mdi-plus</v-icon>Legg til steg
          </v-btn>
          <new-step
            ref="newStep"
            :open="newStepOpen"
            :stepNumber="recipeStepNumber"
            :key="recipeSteps.length"
            @save="saveNewStep"
            @close="closeStep"
            @saveEdit="saveEditedStep"
          ></new-step>
        </v-form>
      </v-stepper-content>
    </v-stepper>
    <v-layout row justify-center>
      <v-dialog v-model="deleteDialogOpen" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Sikker på at du vil slette oppskriften?</v-card-title>
          <v-card-text>Dette vil slette oppskriften permanent.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click.native="closeDeleteDialog">Nei</v-btn>
            <v-btn color="primary" text @click.native="deleteRecipe">Ja</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <p class="mt-6">Sist lagret for {{Math.round(timeSinceLastSave / 1000)}} sekunder siden</p>
    <p class="error--text" v-if="error">{{errorMessage}}</p>
    <v-btn :disabled="loading" @click="openDeleteRecipe" color="error" class="mt-2 mx-2">Slett</v-btn>
    <v-btn :disabled="loading" color="info" class="mt-2 mx-2">Lagre</v-btn>
    <v-btn
      :disabled="loading && !publishing"
      :loading="loading"
      @click="publishRecipe"
      color="success"
      class="mt-2 mx-2"
    >Publiser</v-btn>
  </div>
</template>

<script>
import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";
var db = firebase.firestore();

export default {
  name: "new-recipe",
  data() {
    return {
      timeSinceLastSave: undefined,
      timeClosed: false,
      loading: false,
      publishing: false,
      error: false,
      errorStep: undefined,
      errorMessage: "",
      stepNames: [
        undefined,
        "Generell informasjon",
        "Ingredienser",
        "Fremgangsmåte"
      ],
      rules: {
        required: value => !!value || "Kan ikke være tom",
        onlyNumber: v =>
          !isNaN(v) || "Må være et tall, bruk punktum i stedet for komma",
        counter2: v => v.length <= 2 || "Kan ikke innholde mer enn 2 tegn",
        counter100: v =>
          v.length <= 100 || "Kan ikke innholde mer enn 100 tegn",
        counter500: v =>
          v.length <= 500 || "Kan ikke innholde mer enn 500 tegn",
        counter1000: v =>
          v.length <= 1000 || "Kan ikke innholde mer enn 1000 tegn",
        generalInformation: () => {
          if (this.stepFormValid[1] || !this.visitedSteps[1]) {
            return true;
          } else {
            return false;
          }
        },
        ingredientsRules: () => {
          if (this.visitedSteps[2] && this.recipeIngredients.length == 0) {
            this.ingredientsError = true;
            return "Du må ha minst en ingrediens";
          } else {
            return true;
          }
        },
        stepsRules: () => {
          if (this.visitedSteps[3] && this.recipeSteps.length == 0) {
            this.stepsError = true;
            return "Du må ha minst et steg";
          } else {
            this.stepsError = false;
            return true;
          }
        }
      },
      ingredientsError: false,
      stepsError: false,
      stepFormValid: [undefined, false, false, false],
      categoryList: [
        "Frokost",
        "Lunch",
        "Middag",
        "Tilbehør",
        "Småretter",
        "Dessert"
      ],
      newIngredientOpen: false,
      newStepOpen: false,
      deleteDialogOpen: false
    };
  },
  computed: {
    recipeTitle: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.title;
      },
      set(title) {
        this.$store.commit("setRecipeTitle", title);
      }
    },
    recipeDescription: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.description;
      },
      set(description) {
        this.$store.commit("setRecipeDescription", description);
      }
    },
    recipeCategory: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.category;
      },
      set(category) {
        this.$store.commit("setRecipeCategory", category);
      }
    },
    visibility: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.visibility;
      },
      set(newValue) {
        this.$store.commit("setRecipeVisibility", newValue);
      }
    },
    recipeStepNumber: {
      get() {
        return this.$store.state.currentRecipeModule.recipeStepNumber;
      },
      set(newStep) {
        this.$store.commit("setRecipeStep", newStep);
      }
    },
    recipePortions: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.portions;
      },
      set(portions) {
        this.$store.commit("setRecipePortions", portions);
      }
    },
    recipeSteps() {
      return this.$store.state.currentRecipeModule.recipe.steps;
    },
    recipeIngredients() {
      return this.$store.state.currentRecipeModule.recipe.ingredients;
    },
    lastSaveTime() {
      return this.$store.state.currentRecipeModule.lastSaveTime;
    },
    prevStep() {
      return this.$store.state.currentRecipeModule.prevStep;
    },
    activeStep: {
      get() {
        return this.$store.state.currentRecipeModule.activeStep;
      },
      set(newStep) {
        this.$store.commit("setActiveStep", newStep);
      }
    },
    visitedSteps() {
      return this.$store.state.currentRecipeModule.visitedSteps;
    }
  },
  components: {
    "new-ingredient": () => import("@/components/NewIngredient"),
    "new-step": () => import("@/components/NewStep")
  },
  methods: {
    saveNewIngredient(ingredient) {
      this.$store.commit("addRecipeIngredient", ingredient);
      this.newIngredientOpen = false;
    },
    closeIngredient() {
      this.newIngredientOpen = false;
    },
    openNewIngredient() {
      this.newIngredientOpen = true;
    },
    editIngredient(index) {
      this.$refs.newIngredient.edit(this.recipeIngredients[index], index);
      this.newIngredientOpen = true;
    },
    saveEditedIngredient({ ingredient, index }) {
      this.$store.commit("editRecipeIngredient", { index, ingredient });
      this.newIngredientOpen = false;
    },
    deleteIngredient(index) {
      this.$store.commit("removeRecipeIngredient", index);
    },
    saveNewStep(step) {
      this.$store.commit("addRecipeStep", step);
      this.newStepOpen = false;
    },
    saveEditedStep({ step, index }) {
      this.$store.commit("editRecipeStep", { index, step });
      this.newStepOpen = false;
    },
    openStep() {
      this.newStepOpen = true;
      this.stepNumber = this.recipeSteps.length + 1;
    },
    editStep(index) {
      this.$refs.newStep.edit(this.recipeSteps[index], index);
      this.newStepOpen = true;
    },
    closeStep() {
      this.newStepOpen = false;
    },
    deleteStep(index) {
      this.$store.commit("removeRecipeStep", index);
    },
    getValidator(step) {
      if (step == 1) {
        return this.$refs.step1.validate;
      } else if (step == 2) {
        return this.$refs.step2.validate;
      } else if (step == 3) {
        return this.$refs.step3.validate;
      }
    },
    nextSection(currentStep) {
      this.$store.commit("setPrevStep", currentStep);
      if (currentStep == 2 && this.recipeIngredients.length == 0) {
        this.$store.commit("visitStep", 2);
        return;
      }

      if (this.getValidator(currentStep)()) {
        console.log("Validated");
        this.$store.dispatch("nextRecipeSection");
      } else {
        this.scrollToStep(currentStep);
      }
    },
    changedStep() {
      this.getValidator(this.prevStep)();
      this.$store.dispatch("switchStep", this.activeStep);
    },
    publishRecipe() {
      this.loading = true;
      this.publishing = true;
      this.error = false;

      this.getValidator(1)();
      this.getValidator(2)();
      this.getValidator(3)();

      if (this.recipeTitle.trim() == "") {
        this.error = true;
        this.loading = false;
        this.$store.dispatch("switchStep", 1);
        this.errorMessage = "Tittelen kan ikke være tom";
        return;
      }

      if (this.recipeCategory == "") {
        this.error = true;
        this.loading = false;
        this.$store.dispatch("switchStep", 1);
        this.errorMessage = "Du må velge en kategori for oppskriften";
        return;
      }

      if (!this.recipePortions) {
        this.error = true;
        this.loading = false;
        this.$store.dispatch("switchStep", 1);
        this.errorMessage = "Du må legge til antall porsjoner";
      }

      if (this.recipeIngredients.length === 0) {
        this.error = true;
        this.loading = false;
        this.$store.dispatch("switchStep", 2);
        this.errorMessage =
          "Du har ikke lagt til noen ingredienser. Legg til minst en ingrediens.";
        return;
      }

      if (this.recipeSteps.length === 0) {
        this.error = true;
        this.loading = false;
        this.$store.dispatch("switchStep", 3);
        this.errorMessage =
          "Du har ikke lagt til noen steg i fremgangsmåten. Legg til minst et steg.";
        return;
      }

      for (let i = 1; i < 4; i++) {
        if (this.visitedSteps[i] === false) {
          if (i === 3 && this.activeStep == 3) {
            break;
          }
          this.error = true;
          this.loading = false;
          this.$store.dispatch("switchStep", i);
          this.errorMessage = `Du har glemt ${this.stepNames[i]}, gå til det steget og sjekk at du har lagt inn alt`;
          return;
        }

        if (!this.stepFormValid[i]) {
          this.loading = false;
          this.$store.dispatch("switchStep", i);
          this.error = true;
          this.errorMessage = `Det er noe galt i ${this.stepNames[i]}`;
          return;
        }
      }

      // TODO: Publish to firestore
      var user = firebase.auth().currentUser;

      if (user) {
        // User is signed in.
        console.log(`User name: ${user.displayName}, uid: ${user.uid}`);
        db.collection("recipes")
          .add({
            title: this.recipeTitle,
            description: this.recipeDescription,
            ingredients: this.recipeIngredients,
            steps: this.recipeSteps,
            visibility: this.visibility,
            category: this.recipeCategory,
            portions: this.recipePortions,
            authorID: user.uid,
            authorName: user.displayName
          })
          .then(() => {
            console.log("Successfully uploaded recipe");
            this.loading = false;
            this.error = false;
            this.$store.commit("saveRecipe");
            this.$router.go(-1);
          })
          .catch(err => {
            console.log("An error occured");
            console.log(err);
            this.loading = false;
            this.error = true;
            this.errorMessage =
              "Noe gikk galt under opplasting, prøv igjen senere";
          });
      } else {
        // No user is signed in.
        console.log("Not signed in");
      }
    },
    openDeleteRecipe() {
      this.deleteDialogOpen = true;
    },
    deleteRecipe() {
      this.$store.dispatch("deleteRecipe");
      this.deleteDialogOpen = false;
    },
    closeDeleteDialog() {
      this.deleteDialogOpen = false;
    },
    scrollToStep(step) {
      let scrollTo = document.getElementById("step" + step);
      this.$vuetify.goTo(scrollTo);
    }
  },
  watch: {
    activeStep(newStep, oldStep) {
      this.$store.commit("visitStep", oldStep);
      if (oldStep == 1) {
        let scrollTo = document.getElementById("step" + 1);
        this.$vuetify.goTo(scrollTo, {
          duration: 0
        });
      }
      setTimeout(() => {
        let scrollTo = document.getElementById("step" + newStep);
        this.$vuetify.goTo(scrollTo, {
          offset: 100
        });
      }, 500);
    }
  },
  created() {
    this.$store.commit("saveRecipe");
    setInterval(() => {
      this.timeSinceLastSave = Date.now() - this.lastSaveTime;
    }, 1000);
  }
};
</script>

<style lang="scss" scoped>
.nextButton {
  text-align: left;
}

.ingredient {
  overflow: hidden;
  min-height: 1.1em;
}

.editBtnRow {
  float: right;
  width: 50px;
}
</style>