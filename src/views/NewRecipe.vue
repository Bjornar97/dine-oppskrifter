<template>
  <div>
    <h2 class="headline ma-4 text-left primary--text" v-if="!editing">Ny Oppskrift</h2>
    <h2
      class="headline ma-4 text-left primary--text"
      v-if="editing"
    >Endre Oppskriften "{{recipeTitle}}"</h2>

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
          <v-file-input
            label="Bilde"
            v-model="inputImage"
            :loading="imageLoading"
            :success="imageSuccess"
            :success-messages="imageSuccess ? 'Bildet er lagt til': ''"
            :error="imageError"
            accept="image/png, image/jpeg"
            placeholder="Legg til Bilde"
            :error-messages="imageErrorMessage"
            prepend-icon="mdi-camera"
          ></v-file-input>
          <v-btn v-if="editing" @click="resetImage" class="mt-2" color="info">Hent bilde</v-btn>
          <p
            class="caption mb-8"
          >Tilbakestiller bildet til det som var før du begynte å redigere oppskriften</p>
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
              <v-list-item v-for="(step, index) in recipeSteps" :key="index">
                <v-list-item-content class="listItem">
                  <v-flex class="pr-2" xs1>{{index + 1}}.</v-flex>
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
    <p class="mt-6">Sist lagret: TODO: Legg til klokkeslett</p>
    <p class="error--text" v-if="error">{{errorMessage}}</p>
    <v-btn :disabled="loading" @click="openDeleteRecipe" color="error" class="mt-2 mx-2">Slett</v-btn>
    <v-btn :disabled="loading" v-if="!editing" color="info" class="mt-2 mx-2">Lagre</v-btn>
    <v-btn
      :disabled="loading"
      @click="resetRecipeOriginal"
      v-if="editing"
      color="info"
      class="mt-2 mx-2"
    >Tilbakestill</v-btn>
    <v-btn
      :disabled="loading && !publishing"
      :loading="loading && publishing"
      v-if="!editing"
      @click="publishRecipe"
      color="success"
      class="mt-2 mx-2"
    >Publiser</v-btn>
    <v-btn
      :disabled="loading && !publishing"
      :loading="loading && publishing"
      v-if="editing"
      @click="publishRecipe(true)"
      color="success"
      class="mt-8 mx-2"
    >Lagre endringer</v-btn>
    <p v-if="publishing">{{publishMessage}}</p>
    <v-progress-linear
      v-model="imageUploadProgress"
      class="mt-4"
      v-if="publishing"
      rounded
      color="primary"
    ></v-progress-linear>
  </div>
</template>

<script>
import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";
var db = firebase.firestore();

import "firebase/storage";
var storage = firebase.storage();

import imageCompression from "browser-image-compression";
import { Promise } from "q";

export default {
  name: "new-recipe",
  data() {
    return {
      timeSinceLastSave: undefined,
      editing: false,
      timeClosed: false,
      loading: false,
      publishing: false,
      publishMessage: "",
      imageLoading: false,
      imageError: false,
      imageErrorMessage: "",
      imageSuccess: false,
      imageChanged: false,
      imageUploadProgress: 0,
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
      inputImage: undefined,
      isCompressed: false,
      imageMaxSize: 500000, // bytes
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
    recipeId: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.recipeId;
      },
      set(id) {
        this.$store.commit("setRecipeId", id);
      }
    },
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
    imageCompressed() {
      return this.$store.state.currentRecipeModule.recipe.imageCompressed;
    },
    recipeImagePath: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.imagePath;
      },
      set(path) {
        this.$store.commit("setRecipeImagePath", path);
      }
    },
    originalImage: {
      get() {
        return this.$store.state.currentRecipeModule.originalImage;
      },
      set(image) {
        this.$store.commit("setRecipeOriginalImage", image);
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
    },
    user() {
      return this.$store.state.accountModule;
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
    displayError(errorMessage) {
      this.loading = false;
      this.error = true;
      this.errorMessage = errorMessage;
    },
    changedStep() {
      this.getValidator(this.prevStep)();
      this.$store.dispatch("switchStep", this.activeStep);
    },
    async uploadImage() {
      const imageRef = storage
        .ref()
        .child(`recipeImages/${this.recipeId}/${this.imageCompressed.name}`);

      const imageMeta = {
        recipe: this.recipeId,
        userID: this.user.uid,
        visibility: this.visibility
      };
      let imageUpload = imageRef.put(this.imageCompressed, imageMeta);
      this.publishMessage = "Laster opp bildet";

      imageUpload.on(
        "state_changed",
        snapshot => {
          this.imageUploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          console.log("Error in uploading of image");
          switch (error.code) {
            case "storage/unauthorized":
              this.displayError(
                "Du har ikke tilgang, sjekk at du er logget inn med riktig bruker"
              );
              break;

            case "storage/canceled":
              this.displayError("Opplastingen av bildet ble avbrutt");
              break;

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              this.displayError("En ukjent feil oppstod");
              console.log(error.serverResponse);
              break;

            case "quota-exceeded":
              this.displayError("Vi har høy pågang, prøv igjen senere");

            case "unauthenticated":
              this.displayError("Du er ikke logget in. Vennligst logg inn");

            case "retry-limit-exceeded":
              this.displayError("Kunne ikke laste opp bildet, prøv igjen");

            case "invalid-checksum":
              this.displayError(
                "Bildet ble ikke lastet opp skikkelig, prøv igjen"
              );

            case "invalid-argument":
              this.displayError(
                "Filen du valgte er ikke gyldig. Bildet må være av typen png eller jpg"
              );

            case "server-file-wrong-size":
              this.displayError(
                "En feil skjedde under opplasting av bildet, vennligst prøv igjen"
              );
          }
        },
        () => {
          this.error = false;
          this.recipeImagePath = imageRef.fullPath;
        }
      );
      await Promise.all([imageUpload]);
    },
    retrieveRecipe() {
      const route = this.$route;
      this.loading = true;
      this.$store.commit("startLoading");
      this.$store.dispatch("deleteRecipe");
      this.recipeId = route.params.recipeId;
      try {
        const recipeRef = db.collection("recipes").doc(route.params.recipeId);
        recipeRef.get().then(doc => {
          console.log("Got data, inserting...");
          const data = doc.data();
          this.$store.dispatch("editRecipe", data).then(() => {
            this.loading = false;
            this.$store.commit("stopLoading");
            if (data.imagePath != null) {
              this.imageLoading = true;
              this.recipeImagePath = data.imagePath;

              try {
                const storageRef = storage.ref(data.imagePath);
                storageRef.getDownloadURL().then(url => {
                  console.log("Url: " + url);
                  fetch(url, {
                    method: "GET"
                  })
                    .then(r => {
                      console.dir(r);
                      return r.blob();
                    })
                    .then(imageBlob => {
                      console.dir(imageBlob);
                      storageRef.getMetadata().then(meta => {
                        this.inputImage = new File([imageBlob], meta.name);
                        this.originalImage = this.inputImage;
                        this.imageSuccess = true;
                        this.isCompressed = true;
                        this.imageLoading = false;
                      });
                    });
                });
              } catch (error) {
                console.log("Error while getting image");
                console.dir(error);
                this.imageLoading = false;
                this.inputImage = undefined;
              }
            }
          });
        });

        this.$store.commit("visitStep", 1);
        this.$store.commit("visitStep", 2);
        this.$store.commit("visitStep", 3);
      } catch (error) {
        console.log("Error occured while getting recipe");
        console.dir(error);
        this.loading = false;
        this.$store.commit("stopLoading");
        this.displayError(
          "Noe gikk galt under henting av oppskriften, prøv å oppdatere siden"
        );
      }
    },
    async resetRecipeOriginal() {
      this.retrieveRecipe();
    },
    async saveRecipe() {
      console.log("Saving recipe");
      // TODO: Set oppskriften med nye verdier i firestore som draft
    },
    published(edit = false) {
      this.error = false;
      if (edit) {
        this.publishMessage = "Oppskriften ble endret";
        this.$store.dispatch("saveEditedRecipe");
      } else {
        this.publishMessage = "Oppskriften ble publisert";
        this.$store.dispatch("saveNewRecipe");
      }
      this.$router.go(-1);
    },
    async publishRecipe(edit = false) {
      console.log("Publishing recipe");
      this.loading = true;
      this.publishing = true;
      this.error = false;

      this.getValidator(1)();
      this.getValidator(2)();
      this.getValidator(3)();

      // Checking that the title is not empty
      if (this.recipeTitle.trim() == "") {
        this.displayError("Tittelen kan ikke være tom");
        this.$store.dispatch("switchStep", 1);
        return;
      }

      // Checking that a category is selected
      if (this.recipeCategory == "") {
        this.displayError("Du må velge en kategori for oppskriften");
        this.$store.dispatch("switchStep", 1);
        return;
      }

      // Checking that portions is not empty
      if (!this.recipePortions) {
        this.displayError("Du må legge til antall porsjoner");
        this.$store.dispatch("switchStep", 1);
        return;
      }

      // Checking that there is more than 0 ingredients
      if (this.recipeIngredients.length === 0) {
        this.displayError(
          "Du har ikke lagt til noen ingredienser. Legg til minst en ingrediens."
        );
        this.$store.dispatch("switchStep", 2);
        return;
      }

      // Checking that there is more than 0 steps in the recipe
      if (this.recipeSteps.length === 0) {
        this.displayError(
          "Du har ikke lagt til noen steg i fremgangsmåten. Legg til minst et steg."
        );
        this.$store.dispatch("switchStep", 3);
        return;
      }

      if (!this.stepFormValid[1]) {
        this.displayError(`Det er noe galt i ${this.stepNames[1]}`);
        this.$store.dispatch("switchStep", 1);
        return;
      }

      if (!edit) {
        // Checking that all steps has been visited
        for (let i = 1; i < 4; i++) {
          if (this.visitedSteps[i] === false) {
            if (i === 3 && this.activeStep == 3) {
              break;
            }
            this.displayError(
              `Du har glemt ${this.stepNames[i]}, gå til det steget og sjekk at du har lagt inn alt`
            );
            this.$store.dispatch("switchStep", i);
            return;
          }
        }
      }

      // Getting the currently signed in user from the store
      let user = this.user;

      // Checking if user is signed in
      if (user.loggedIn) {
        // User is signed in.
        // Uploading image
        let isImage = false;
        try {
          // Checks that there is an image, and that if it is an edit, it needs to have changed from the original
          if (this.imageCompressed && (!edit || this.imageChanged)) {
            if (edit && this.imageChanged) {
              const storageRef = storage.ref(this.recipeImagePath);
              await storageRef.delete();
            }
            await this.uploadImage().then(() => {
              isImage = true;
            });
          } else if (edit && this.originalImage) {
            isImage = true;
          }
        } catch (error) {
          console.log("An error occured while uploading image:");
          console.dir(error);
          this.displayError(
            "Noe gikk galt under opplasting av bilde, det må være av typen png eller jpg"
          );
        }

        if (this.error) {
          return;
        }
        console.log(this.visibility);
        const recipeData = {
          title: this.recipeTitle,
          description: this.recipeDescription,
          imagePath: isImage ? this.recipeImagePath : null, // Adds the path if isImage is true, else it will be null
          ingredients: this.recipeIngredients,
          steps: this.recipeSteps,
          visibility: this.visibility,
          status: "published",
          category: this.recipeCategory,
          portions: this.recipePortions,
          dateCreated: Date.now(),
          authorID: user.uid,
          authorName: user.name
        };
        console.dir(recipeData);

        // Adding the recipe to the firestore
        this.publishMessage = "Laster opp oppskrift";
        // Checks if the recipe has a recipeId on the firestore (has been uploaded before)
        //    If not, it will add it to firestore and get an id
        if (this.recipeId === undefined && !edit) {
          try {
            db.collection("recipes")
              .add(recipeData)
              .then(ref => {
                this.recipeId = ref.id;
                this.publishMessage = "Laster opp bilde";
                if (this.imageCompressed) {
                  try {
                    // Since there is no recipeId from before, the image needs to be uploaded after getting the recipeId
                    this.uploadImage().then(() => {
                      ref
                        .update({
                          imagePath: this.recipeImagePath
                        })
                        .then(() => {
                          this.published();
                        })
                        .catch(error => {
                          console.log("Error while adding imagePath to recipe");
                          this.displayError(
                            "Noe gikk galt under opplasting av bilde"
                          );
                        });
                    });
                  } catch (error) {
                    console.log("An error occured");
                    this.displayError(
                      "Noe gikk galt under opplasting av bilde, prøv igjen senere"
                    );
                  }
                } else {
                  this.published();
                }
              })
              .catch(err => {
                console.log("An error occured");
                this.displayError(
                  "Noe gikk galt under publisering, prøv igjen senere"
                );
              });
          } catch (error) {
            console.log("Something bad happened");
            console.dir(error);
            this.displayError("Noe gikk galt, prøv igjen");
          }
        } else if (this.recipeId) {
          // If it has an id on firestore, it updates that
          try {
            db.collection("recipes")
              .doc(this.recipeId)
              .set(recipeData)
              .then(() => {
                this.published(edit);
              });
          } catch (error) {
            console.log("Something bad happened: 2");
            console.dir(error);
            this.displayError("Noe gikk galt, prøv igjen");
          }
        } else {
          console.log(
            "Edited recipe does not have recipeId, somthing went horribly wrong"
          );
          this.displayError("Noe gikk galt under lagring, prøv igjen senere");
        }
      } else {
        // No user is signed in.
        console.log("Not signed in");
        this.displayError("Du er ikke logget inn, vennligst logg inn først");
      }
    },
    openDeleteRecipe() {
      this.deleteDialogOpen = true;
    },
    async deleteRecipe() {
      const doc = db.collection("recipes").doc(this.recipeId);
      await doc.delete().catch(error => {
        console.log("Error occured while deleting recipe");
        this.displayError("Noe galt skjedde under sletting av oppskrift");
      });
      this.$store.dispatch("deleteRecipe");
      this.deleteDialogOpen = false;
    },
    closeDeleteDialog() {
      this.deleteDialogOpen = false;
    },
    scrollToStep(step) {
      let scrollTo = document.getElementById("step" + step);
      this.$vuetify.goTo(scrollTo);
    },
    async compressImage(image) {
      const options = {
        maxSizeMB: this.imageMaxSize / 1000000,
        maxWidthOrHeight: 1000,
        useWebWorker: true
      };
      console.log(`Size before compress: ${image.size / 1000} KB`);

      return imageCompression(image, options);
    },
    resetImage() {
      this.inputImage = this.originalImage;
      this.isCompressed = true;
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
    },
    inputImage(newImage, oldImage) {
      if (this.isCompressed) {
        this.isCompressed = false;
        return;
      }
      if (newImage == undefined) {
        console.log("Image is undefined");
        this.$store.commit("removeRecipeImage");
        return;
      }

      this.imageLoading = true;

      this.compressImage(newImage)
        .then(compressedImage => {
          console.log(`Size after compress: ${compressedImage.size / 1000} KB`);

          this.$store.commit("setRecipeImage", compressedImage);
          this.imageLoading = false;
          this.imageSuccess = true;
          this.imageChanged = true;
          return compressedImage;
        })
        .catch(error => {
          console.log(error.message);
          this.imageError = true;
          this.imageLoading = false;
          this.imageErrorMessage =
            "Noe gikk galt under komprimering, prøv et annet bilde.";
          return;
        });
    }
  },
  created() {
    const route = this.$route;
    setInterval(() => {
      this.timeSinceLastSave = Date.now() - this.lastSaveTime;
    }, 1000);

    if (route.name == "newRecipe" && this.recipeId === undefined) {
      const user = this.$store.state.accountModule;
      console.log(user);
      const data = {
        title: this.recipeTitle || null,
        description: this.recipeDescription,
        ingredients: this.recipeIngredients,
        steps: this.recipeSteps,
        visibility: this.visibility,
        status: "draft",
        category: this.recipeCategory || null,
        portions: this.recipePortions || null,
        authorID: user.uid,
        authorName: user.name
      };

      console.dir(data);
      if (user.loggedIn) {
        db.collection("recipes")
          .add(data)
          .then(ref => {
            this.recipeId = ref.id;
            this.loading = false;
            this.error = false;
          })
          .catch(err => {
            console.log(err);
            console.log(
              "An error occured while creating the recipe in firestore"
            );
            this.displayError(
              "Noe gikk galt under oppretting av oppskriften, prøv igjen senere"
            );
          });
      } else {
        this.error = true;
        this.errorMessage = "Du er ikke logget inn, logg inn først";
      }
    } else if (route.name == "editRecipe") {
      this.editing = true;
      console.log(this.recipeId);
      this.retrieveRecipe();
    }
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