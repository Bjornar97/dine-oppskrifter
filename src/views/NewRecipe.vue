<template>
  <v-container class="px-0 px-md-8 px-lg-12" id="main">
    <h2 class="headline ma-4 mb-8 text-left primary--text" v-if="!editing">Ny Oppskrift</h2>
    <h2
      class="headline ma-4 mb-8 text-left primary--text"
      v-if="editing"
    >Endre Oppskriften "{{recipeTitle}}"</h2>

    <v-banner
      sticky
      :icon="accessError.icon"
      v-if="accessError.error"
      icon-color="error"
      color="white"
      elevation="4"
      class="mb-4"
    >
      {{accessError.message}}
      <template v-slot:actions>
        <v-btn
          text
          color="success"
          v-if="accessError.errorType == 'goBack'"
          @click="router.go(-1)"
        >Gå tilbake</v-btn>
        <facebook-login-button v-if="accessError.type == 'notLoggedIn'" loginText="Logg inn"></facebook-login-button>
      </template>
    </v-banner>

    <v-stepper @change="changedStep" v-model="activeStep" vertical class="pb-4 stepper">
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
        <v-form v-model="stepFormValid[1]" class="generalForm" ref="step1">
          <div class="recipeInfo">
            <v-text-field
              :disabled="loading || disableAll"
              name="title"
              class="mb-4 recipeTitle recipeTextField"
              v-model="recipeTitle"
              label="Tittel*"
              :rules="[rules.required, rules.counter100]"
              counter="100"
            ></v-text-field>
            <v-textarea
              :disabled="loading || disableAll"
              outlined
              auto-grow
              name="description"
              class="recipeDescription recipeTextField"
              v-model="recipeDescription"
              label="Kort Beskrivelse"
              :rules="[rules.counter500]"
              counter="500"
              hint="En kort beskrivelse av hva oppskriften er. Skal ikke inneholde fremgangsmåte eller ingrediensliste"
            ></v-textarea>
          </div>

          <div class="recipeImageDiv">
            <v-file-input
              label="Bilde"
              class="recipeImage recipeTextField"
              v-model="inputImage"
              :disabled="loading || disableAll"
              :loading="imageLoading"
              :success="imageSuccess && !imageLoading"
              :success-messages="(imageSuccess && !imageLoading) ? 'Bildet er lagt til': ''"
              :error="imageError"
              accept="image/png, image/jpeg"
              placeholder="Legg til Bilde"
              :error-messages="imageErrorMessage"
              prepend-icon="mdi-camera"
            ></v-file-input>
            <v-btn
              v-if="editing"
              @click="resetImage"
              :disabled="loading || disableAll"
              class="mt-2"
              color="info"
            >Hent bilde</v-btn>
            <p
              class="caption mb-8"
              v-if="editing"
            >Tilbakestiller bildet til det som var før du begynte å redigere oppskriften</p>
          </div>
          <div class="recipeMoreInfo">
            <v-select
              :disabled="loading || disableAll"
              :items="categoryList"
              :rules="[rules.required]"
              v-model="recipeCategory"
              :menu-props="{offsetY: true, closeOnClick: true}"
              label="Kategori*"
              class="recipeCategory recipeTextField"
            ></v-select>
            <v-text-field
              :disabled="loading || disableAll"
              name="portions"
              class="mb-4 recipePortions recipeTextField"
              v-model="recipePortions"
              type="number"
              label="Antall porsjoner*"
              :rules="[rules.required, rules.onlyNumber, rules.counter2]"
              hint="Hvor mange porsjoner denne oppskriften gir"
              persistent-hint
              counter="2"
              suffix="porsjoner"
            ></v-text-field>
            <v-text-field
              :disabled="loading || disableAll"
              name="totalTime"
              class="mb-4 recipeTotalTime recipeTextField"
              v-model="recipeTotalTime"
              type="number"
              label="Tid*"
              :rules="[rules.required, rules.onlyNumber, rules.counter3]"
              hint="Cirka hvor lang tid tar det å lage retten i minutter"
              persistent-hint
              counter="3"
              suffix="minutter"
            ></v-text-field>
            <v-select
              :disabled="loading || disableAll"
              :items="['Enkel', 'Middels', 'Vanskelig']"
              :rules="[rules.required]"
              :menu-props="{offsetY: true, closeOnClick: true}"
              v-model="recipeDifficulty"
              label="Vannskelighetsgrad*"
              hint="Omtrent hvor vanskelig vil du si denne retten er å lage?"
              class="recipeDifficulty recipeTextField"
            ></v-select>
          </div>

          <div class="recipeVisibility">
            <h3 class="ml-2 subtitle-1 text-left grey--text">Visning</h3>
            <v-radio-group
              row
              :hint="visibilityText"
              mandatory
              :disabled="loading || disableAll"
              v-model="visibility"
              class="ml-2"
              name="visibility"
              persistent-hint
            >
              <v-radio color="primary" value="Private" label="Privat" ripple></v-radio>
              <v-radio color="primary" value="OnlyLink" label="Ikke Oppført" ripple></v-radio>
              <v-radio color="primary" label="Offentlig" value="Public" ripple></v-radio>
            </v-radio-group>
          </div>

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
          <v-card class="ma-1 recipeIngredientsCard" v-if="recipeIngredients.length != 0">
            <v-list>
              <v-subheader>Ingrediensliste</v-subheader>
              <v-list-item v-for="(ingredient, index) in recipeIngredients" :key="index">
                <v-list-item-content class="listItem">
                  <v-flex xs8 sm10>
                    <p
                      align-center
                      class="ma-0 text-left ingredient"
                    >{{ ingredient.amount }} {{ingredient.unit}} {{ingredient.name}}</p>
                  </v-flex>
                  <v-flex xs2 sm1>
                    <v-btn
                      :disabled="loading || disableAll"
                      @click="editIngredient(index)"
                      :small="$vuetify.breakpoint.smAndDown"
                      icon
                      color="warning"
                      text
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs2 sm1>
                    <v-btn
                      :disabled="loading || disableAll"
                      @click="deleteIngredient(index)"
                      :small="$vuetify.breakpoint.smAndDown"
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

          <v-btn
            :disabled="loading || disableAll"
            color="info"
            class="mb-4"
            text
            @click="openNewIngredient"
          >
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
            :disabled="loading || disableAll"
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
      >Fremgangsmåte</v-stepper-step>
      <v-stepper-content step="3">
        <v-form ref="step3">
          <v-textarea
            :disabled="loading || disableAll"
            outlined
            auto-grow
            name="recipeSteps"
            class="recipeSteps my-2"
            messages
            v-model="recipeSteps"
            label="Skriv fremgangsmåten her"
            hint="Skal være en fullstendig fremgangsmåte. Bruk gjerne tall og avsnitt for å gi leserne bedre oversikt"
          ></v-textarea>
        </v-form>
      </v-stepper-content>
    </v-stepper>
    <v-layout row justify-center>
      <v-dialog v-model="deleteDialogOpen" persistent max-width="290">
        <v-card>
          <v-card-title
            class="headline"
          >Sikker på at du vil {{editing ? "tilbakestille": "slette"}} oppskriften?</v-card-title>
          <v-card-text v-if="editing">Dette vil slette oppskriften permanent.</v-card-text>
          <v-card-text
            v-if="!editing"
          >Dette vil tilbakestille alle felt i oppskriften, og du må begynne på nytt</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click.native="closeDeleteDialog">Nei</v-btn>
            <v-btn color="primary" text @click.native="deleteRecipe">Ja</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-expand-transition>
      <p
        class="mt-6"
        v-if="$store.state.currentRecipeModule.lastSaveTime"
      >Sist lagret: {{lastSaveTime}}</p>
    </v-expand-transition>
    <v-expand-transition>
      <p class="error--text mt-4" v-if="error">{{errorMessage}}</p>
    </v-expand-transition>
    <v-btn
      :disabled="loading || disableAll"
      @click="openDeleteRecipe"
      v-if="editing"
      color="error"
      class="my-2 mx-2"
    >Slett</v-btn>
    <v-btn
      :disabled="loading || disableAll"
      @click="openDeleteRecipe"
      v-if="!editing"
      color="error"
      class="my-2 mx-2"
    >Tilbakestill</v-btn>
    <v-btn
      :disabled="loading || disableAll"
      @click="saveRecipe"
      v-if="!editing"
      color="info"
      class="my-2 mx-2"
    >Lagre utkast</v-btn>
    <v-btn
      :disabled="loading || disableAll"
      @click="resetRecipeOriginal"
      v-if="editing"
      color="warning"
      class="my-2 mx-2"
    >Tilbakestill til orginal</v-btn>
    <v-btn
      :disabled="(loading && !publishing) || disableAll"
      :loading="loading && publishing"
      v-if="!editing"
      @click="publishRecipe(false)"
      color="success"
      class="my-2 mx-2"
    >Publiser</v-btn>
    <v-btn
      :disabled="(loading && !publishing) || disableAll"
      :loading="loading && publishing"
      v-if="editing"
      @click="publishRecipe(true)"
      color="success"
      class="my-2 mx-2"
    >Lagre endringer</v-btn>
    <p v-if="publishing && !error">{{publishMessage}}</p>
    <v-progress-linear
      v-model="imageUploadProgress"
      class="my-4"
      v-if="(((publishing && !error) && (!editing || imageChanged))) && !disableAll"
      rounded
      color="primary"
    ></v-progress-linear>
  </v-container>
</template>

<script>
import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";
var db = firebase.firestore();

import "firebase/storage";
var storage = firebase.storage();

import imageCompression from "browser-image-compression";
import "isomorphic-fetch";

export default {
  name: "new-recipe",
  data() {
    return {
      editing: false,
      timeClosed: false,
      loading: false,
      disableAll: false,
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
      accessError: {
        error: false,
        type: "",
        message: "",
        icon: ""
      },
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
        counter3: v => v.length <= 3 || "Kan ikke innholde mer enn 3 tegn",

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
            this.ingredientsError = false;
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
        "Bakverk",
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
    recipeNew: {
      get() {
        return this.$store.state.currentRecipeModule.newRecipe;
      },
      set(newValue) {
        this.$store.commit("setRecipeNew", newValue);
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
    imageCompressed: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.imageCompressed;
      },
      set(v) {
        this.$store.commit("setRecipeImage", v);
      }
    },
    imageJson() {
      return this.$store.state.currentRecipeModule.imageJson;
    },
    recipeDateCreated: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.dateCreated;
      },
      set(v) {
        this.$store.commit("setRecipeDateCreated", v);
      }
    },
    recipeImagePath: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.imagePath;
      },
      set(path) {
        this.$store.commit("setRecipeImagePath", path);
      }
    },
    recipeImageURL: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.imageURL;
      },
      set(imageURL) {
        this.$store.commit("setRecipeImageURL", imageURL);
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
    visibilityText() {
      if (this.visibility == "Public") {
        return "Offentlig: Alle kan se oppskriften din, også de som ikke er logget inn.";
      } else if (this.visibility == "OnlyLink") {
        return "Ikke Oppført: Alle med linken til oppskriften kan se den, men den vises ikke på forsiden.";
      } else if (this.visibility == "Private") {
        return "Privat: Kun du kan se oppskriften.";
      } else {
        return "";
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
    recipeTotalTime: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.totalTime;
      },
      set(time) {
        this.$store.commit("setRecipeTotalTime", time);
      }
    },
    recipeDifficulty: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.difficulty;
      },
      set(difficulty) {
        this.$store.commit("setRecipeDifficulty", difficulty);
      }
    },
    recipeStatus() {
      return this.$store.state.currentRecipeModule.recipe.status;
    },
    recipeSteps: {
      get() {
        return this.$store.state.currentRecipeModule.recipe.steps;
      },
      set(v) {
        this.$store.commit("setRecipeSteps", v);
      }
    },
    recipeIngredients() {
      return this.$store.state.currentRecipeModule.recipe.ingredients;
    },
    recipeData() {
      return {};
    },
    lastSaveTime() {
      const timeMilliseconds = this.$store.state.currentRecipeModule
        .lastSaveTime;
      let date = new Date(timeMilliseconds);
      let hours = date.getHours();
      hours < 10 ? (hours = `0${hours}`) : hours;
      let minutes = date.getMinutes();
      minutes < 10 ? (minutes = `0${minutes}`) : minutes;
      return `${hours}:${minutes}`;
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
      const user = this.$store.state.accountModule;
      this.userChanged(user);
      return user;
    }
  },
  components: {
    "new-ingredient": () => import("@/components/NewIngredient"),
    "facebook-login-button": () => import("@/components/FacebookLoginButton")
  },
  methods: {
    saveNewIngredient(ingredient) {
      this.$store.commit("addRecipeIngredient", ingredient);
      this.newIngredientOpen = false;
    },
    userChanged(user) {
      if (user.loggedIn) {
        this.disableAll = false;
        this.accessError.error = false;
      } else if (!user.loggedIn) {
        this.disableAll = true;
        this.accessError.error = true;
        this.accessError.type = "notLoggedIn";
        this.accessError.icon = "mdi-account-alert";
        this.accessError.message =
          "Du er for øyeblikket ikke logget inn, vennligst logg inn";
      }
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
        this.$store.dispatch("nextRecipeSection");
      } else {
        this.scrollToStep(currentStep);
      }
    },
    displayError(errorMessage) {
      this.$store.commit("stopLoading");
      this.loading = false;
      this.error = true;
      this.errorMessage = errorMessage;
    },
    displayAccessError(errorMessage, errorType) {
      this.disableAll = true;
      this.$store.commit("stopLoading");
      this.accessError.type = errorType;
      this.accessError.errorMessage = errorMessage;
      switch (errorType) {
        case "notLoggedIn":
          this.accessError.icon = "mdi-account-alert";
          break;
        case "noPermission":
          this.accessError.icon = "mdi-cancel";
          break;

        default:
          this.accessError.icon = "mdi-circle-outline";
          break;
      }
    },
    changedStep() {
      this.getValidator(this.prevStep)();
      this.$store.dispatch("switchStep", this.activeStep);
    },
    saved() {
      this.$store.commit("saveTime");
      this.publishMessage = "Lagret";
      this.loading = false;
      this.error = false;
      setTimeout(() => {
        this.publishing = false;
      }, 2000);
    },
    async uploadImage() {
      const imageRef = storage
        .ref()
        .child(
          `recipeImages/${this.user.uid}/${this.recipeId}/${this.imageCompressed.name}`
        );

      const imageMeta = {
        customMetadata: {
          recipe: this.recipeId,
          userID: this.user.uid,
          visibility: this.visibility
        }
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
        recipeRef
          .get()
          .then(doc => {
            const data = doc.data();
            if (data.status === "draft") {
              this.editing = false;
              this.recipeNew = true;
            } else {
              this.editing = true;
            }
            this.$store.dispatch("editRecipe", data).then(() => {
              this.loading = false;
              this.$store.commit("stopLoading");
              if (data.imagePath != null) {
                this.imageLoading = true;
                this.recipeImagePath = data.imagePath;

                try {
                  const storageRef = storage.ref(data.imagePath);
                  storageRef.getDownloadURL().then(url => {
                    fetch(url, {
                      method: "GET"
                    })
                      .then(r => {
                        return r.blob();
                      })
                      .then(imageBlob => {
                        storageRef.getMetadata().then(meta => {
                          function blobToFile(theBlob, fileName) {
                            let b = theBlob;
                            b.lastModified = new Date();
                            b.name = fileName;
                            return b;
                          }
                          if (!navigator.msSaveBlob) {
                            this.inputImage = new File([imageBlob], meta.name);
                          } else {
                            let file;
                            file = new Blob([imageBlob], {
                              type: document.mimeType
                            });
                            file = blobToFile(imageBlob, meta.name);
                            this.inputImage = file;
                          }

                          this.originalImage = this.inputImage;
                          this.imageSuccess = true;
                          this.isCompressed = true;
                          this.imageLoading = false;
                        });
                      });
                  });
                } catch (error) {
                  console.log("Error while getting image");
                  this.$store.commit("stopLoading");
                  console.dir(error);
                  this.imageLoading = false;
                  this.inputImage = undefined;
                }
              }
            });
          })
          .catch(error => {
            console.log(`Error code: ${error}`);
            this.$store.commit("stopLoading");
            switch (error.code) {
              case "unauthenticated":
                this.displayAccessError(
                  "Du er ikke logget inn, vennligst logg inn før du kan redigere oppskriften",
                  "notLoggedIn"
                );
                break;

              case "permission-denied":
                this.displayAccessError(
                  "Du har ikke tilgang til å endre denne oppskriften. Du kan bare endre dine egne oppskrifter",
                  "noAccess"
                );
                break;

              default:
                this.displayAccessError(
                  "Noe galt skjedde under henting av oppskriften, prøv igjen senere",
                  "unspecified"
                );
                break;
            }
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
      const user = this.user;
      this.loading = true;

      this.publishing = true;
      this.publishMessage = "Lagrer";

      let author = this.$store.state.currentRecipeModule.recipe.author;
      if (author == null) {
        author = {
          id: user.uid,
          name: user.name,
          profilePictureUrl: user.profilePictureUrl || ""
        };
      }

      const recipeData = {
        title: this.recipeTitle,
        description: this.recipeDescription,
        imagePath: this.recipeImagePath ? this.recipeImagePath : null, // Adds the path if there is an image, else it will be null
        ingredients: this.recipeIngredients,
        steps: this.recipeSteps,
        visibility: this.visibility,
        difficulty: this.recipeDifficulty,
        status: "draft",
        favourites: 0,
        category: this.recipeCategory,
        portions: this.recipePortions,
        totalTime: parseInt(this.recipeTotalTime),
        author: author
      };
      const setData = ref => {
        ref
          .set(recipeData)
          .then(() => {
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
                      this.saved();
                    })
                    .catch(error => {
                      console.log("Error while adding imagePath to recipe");
                      console.dir(error);
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
              this.saved();
            }
          })
          .catch(err => {
            console.dir(err);
            console.log("An error occured");
            this.displayError(
              "Noe gikk galt under opplasting, prøv igjen senere"
            );
          });
      };
      if (this.recipeId) {
        const ref = db.collection("recipes").doc(this.recipeId);
        setData(ref);
      } else {
        const ref = db
          .collection("recipes")
          .add(recipeData)
          .then(ref => {
            this.recipeId = ref.id;
            setData(ref);
          })
          .catch(error => {
            this.displayError(
              "Noe gikk galt under opplasting, prøv igjen senere"
            );
          });
      }
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
      this.$router.push("/dine-oppskrifter");
    },
    async publishRecipe(edit = false) {
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
          if (
            (this.imageCompressed && (!edit || this.imageChanged)) ||
            typeof this.originalImage == "file"
          ) {
            if (edit && this.imageChanged && this.recipeImagePath) {
              const storageRef = storage.ref(this.recipeImagePath);
              await storageRef.delete();
            }
            if (!this.imageCompressed) {
              this.imageCompressed = this.originalImage;
            }
            await this.uploadImage().then(() => {
              isImage = true;
            });
          } else if (this.originalImage && !this.imageCompressed) {
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

        let author = this.$store.state.currentRecipeModule.recipe.author;
        if (author == null) {
          author = {
            id: user.uid,
            name: user.name,
            profilePictureUrl: user.profilePictureUrl
          };
          this.$store.commit("setRecipeAuthor", author);
        }

        let recipeData = {
          title: this.recipeTitle,
          description: this.recipeDescription,
          imagePath:
            isImage && this.recipeImagePath ? this.recipeImagePath : null, // Adds the path if isImage is true, else it will be null
          ingredients: this.recipeIngredients,
          steps: this.recipeSteps,
          visibility: this.visibility,
          difficulty: this.recipeDifficulty,
          status: "published",
          category: this.recipeCategory,
          portions: parseInt(this.recipePortions),
          totalTime: parseInt(this.recipeTotalTime),
          author: author
        };

        if (edit) {
          let dateCreated = this.$store.state.currentRecipeModule.recipe
            .dateCreated;
          if (dateCreated == undefined) {
            dateCreated = Date.now();
            this.recipeDateCreated = dateCreated;
          }
          recipeData = {
            ...recipeData,
            dateUpdated: Date.now(),
            dateCreated: dateCreated
          };
        } else {
          recipeData = {
            ...recipeData,
            dateCreated: Date.now(),
            favourites: 0
          };
        }

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
              .update(recipeData)
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
      if (this.recipeId) {
        const doc = db.collection("recipes").doc(this.recipeId);
        await doc.delete().catch(error => {
          console.log("Error occured while deleting recipe");
          this.displayError("Noe galt skjedde under sletting av oppskrift");
        });
      }
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
        this.$store.commit("removeRecipeImage");
        return;
      }

      this.imageLoading = true;

      this.compressImage(newImage)
        .then(compressedImage => {
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
    },
    user(newData, oldData) {}
  },
  created() {
    const route = this.$route;
    if (route.name == "newRecipe" && this.recipeId === undefined) {
      if (this.recipeNew === false) {
        this.$store.dispatch("deleteRecipe");
        this.recipeNew = true;
      }
      const user = this.user;
      let author = null;
      if (user.loggedIn) {
        author = {
          id: user.uid,
          name: user.name,
          profilePictureUrl: user.profilePictureUrl
        };
        this.$store.commit("setRecipeAuthor", author);
      }

      const data = {
        title: this.recipeTitle || null,
        description: this.recipeDescription,
        ingredients: this.recipeIngredients,
        steps: this.recipeSteps,
        visibility: this.visibility,
        status: "draft",
        category: this.recipeCategory || null,
        difficulty: this.recipeDifficulty || null,
        favourites: 0,
        portions: this.recipePortions || null,
        totalTime: this.recipeTotalTime || null,
        author: author
      };

      if (user.loggedIn) {
        db.collection("recipes")
          .add(data)
          .then(ref => {
            this.recipeId = ref.id;
            this.loading = false;
            this.error = false;
            this.$store.commit("stopLoading");
          })
          .catch(err => {
            console.log(err);
            this.$store.commit("stopLoading");
            console.log(
              "An error occured while creating the recipe in firestore"
            );
            this.displayError(
              "Noe gikk galt under oppretting av oppskriften, prøv igjen senere"
            );
          });
      } else {
        this.$store.commit("stopLoading");
        this.disableAll = true;
        this.accessError.error = true;
        this.accessError.type = "notLoggedIn";
        this.accessError.icon = "mdi-account-alert";
        this.accessError.message =
          "Du er for øyeblikket ikke logget inn, vennligst logg inn";
      }
      this.$store.commit("setRecipeImage", undefined);
    } else if (route.name == "editRecipe") {
      if (this.recipeNew === true) {
        this.$store.dispatch("deleteRecipe");
        this.recipeNew = false;
      }
      this.retrieveRecipe();
    } else {
      if (this.recipeNew === false) {
        this.$store.dispatch("deleteRecipe");
        this.recipeNew = true;
      }
      this.$store.commit("stopLoading");
      this.$store.commit("setRecipeImage", undefined);
    }
  }
};
</script>

<style lang="scss" scoped>
.nextButton {
  text-align: left;
}

.headline {
  margin-top: 50px !important;
}

v-container {
  max-width: 1100px;
}

.ingredient {
  overflow: hidden;
  min-height: 1.1em;
}

.recipeIngredientsCard {
  max-width: 700px;
}

.recipeStepsCard {
  max-width: 1000px;
}

.editBtnRow {
  float: right;
  width: 50px;
}

@supports (display: grid) {
  .generalForm {
    display: grid;
    max-width: 500px;
    margin: 0 auto;
    justify-self: center;
    grid-template-columns: 1fr;
    grid-template-areas:
      "info"
      "image"
      "moreInfo"
      "visibility";
  }
  .recipeTextField {
    max-width: 500px;
  }

  .recipeInfo {
    grid-area: info;
  }

  .recipeMoreInfo {
    grid-area: moreInfo;
  }

  .recipeImage {
    grid-area: image;
  }

  .recipeVisibility {
    grid-area: visibility;
  }

  @media only screen and (min-width: 1000px) {
    .recipeIngredientsCard {
      margin: 10px auto !important;
    }

    .recipeStepsCard {
      margin: 10px auto !important;
    }

    .recipeVisibility,
    .recipeImage {
      margin-right: 30px;
    }

    .generalForm {
      max-width: 800px;
      grid-gap: 10px;
      grid-template-columns: 2fr 1fr;
      grid-template-areas:
        "info image"
        "moreInfo visibility"
        "moreInfo visibility"
        "nextButton nextButton";

      @supports (width: max-content) {
        max-width: max-content;
      }

      @media only screen and (max-width: 1600px) {
        margin: 0 auto;
      }

      @media only screen and (min-width: 1265px) {
        grid-template-columns: 3fr 2fr;
      }

      .nextButton {
        grid-area: nextButton;
        max-width: 80px;
        justify-self: center;
      }
    }
  }
}
</style>