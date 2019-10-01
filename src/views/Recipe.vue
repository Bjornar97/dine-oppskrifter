<template>
  <div>
    <v-expand-transition>
      <v-card v-if="error" class="mb-8 mt-12 mx-auto errorCard">
        <v-icon color="error" class="mt-2" size="56">{{errorIcon}}</v-icon>
        <v-card-title primary-title>
          <span>{{errorMessage}}</span>
        </v-card-title>
        <v-card-text></v-card-text>
        <v-card-actions>
          <v-btn color="info" class="mx-2" v-if="tryAgain" @click="getRecipe">Prøv igjen</v-btn>

          <facebook-login-button class="mx-2" loginText="Logg inn" v-if="!loggedIn"></facebook-login-button>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
    <v-container fluid class="mainContainer pt-0 mt-2" v-if="recipe != null">
      <img src="@/assets/ShorterLogo.svg" width="150px" height="150px" id="printLogo" />
      <img
        v-if="recipe.id"
        :src="`https://api.qrserver.com/v1/create-qr-code/?data=${shortUrl}&size=100x100`"
        id="qrCode"
      />
      <v-img
        class="mx-auto recipeImage"
        :class="!printImage ? 'recipeImageNone': ''"
        :src="recipeImageURL"
        max-height="500px"
        max-width="800px"
      ></v-img>

      <div class="my-4 labelRow">
        <v-chip
          label
          color="error"
          v-if="recipe.favourites && recipe.favourites > 0"
          class="mx-4 d-print-none my-2 label"
        >
          <v-icon left>mdi-heart</v-icon>
          {{recipe.favourites}} har favorisert
        </v-chip>

        <v-chip label :color="difficultyColor" class="mx-4 my-2 label font-weight-bold">
          <v-icon left>mdi-chef-hat</v-icon>
          {{recipe.difficulty}}
        </v-chip>

        <v-chip label color="secondary" class="mx-4 my-2 label font-weight-bold">
          <v-icon left>mdi-label</v-icon>
          {{recipe.category}}
        </v-chip>

        <v-chip label color="accent" class="mx-4 my-2 label font-weight-bold">
          <v-icon left>mdi-clock-outline</v-icon>
          {{recipe.totalTime}} min
        </v-chip>
        <v-chip
          label
          v-if="recipe.visibility == 'Private'"
          color="grey darken-1"
          text-color="white"
          class="mx-4 my-2 label d-print-none font-weight-bold"
        >
          <v-icon left>mdi-lock</v-icon>Privat
        </v-chip>
      </div>
      <div class="author">
        <v-chip pill class="mx-2 my-1 d-print-none" color="primary lighten-2 black--text">
          <v-avatar color="accent" left>
            <v-icon color="white">mdi-clock-outline</v-icon>
          </v-avatar>
          {{dateCreated}}
        </v-chip>
        <v-chip pill class="mx-2 my-1" color="primary">
          <v-avatar left>
            <v-img :src="recipe.author.profilePictureUrl"></v-img>
          </v-avatar>
          {{recipe.author.name}}
        </v-chip>
      </div>

      <h1 class="my-4 recipeTitle" :class="small ? 'display-1': 'display-2'">{{recipe.title}}</h1>
      <p class="recipeDescription">{{recipe.description}}</p>

      <v-dialog
        v-model="shareLinkOpen"
        persistent
        light
        max-width="500px"
        transition="dialog-transition"
      >
        <v-card class="pa-4">
          <v-text-field name="Link" label="Link" id="LinkTextField" solo readonly v-model="url">
            <v-btn icon color="black" @click="copyLink" slot="append">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-text-field>

          <p class="subtitle-1" v-if="copySuccess">
            <v-icon color="success" class="mr-1">mdi-check</v-icon>Kopiert!
          </p>

          <v-btn text color="warning" @click="shareLinkOpen = false; copySuccess = false">Lukk</v-btn>
        </v-card>
      </v-dialog>

      <div class="buttonRow my-4 d-print-none">
        <v-btn
          v-if="user.loggedIn"
          :disabled="favourited == null"
          text
          color="red"
          @click="favourited ? unFavourise(): favourise()"
        >
          <v-icon class="mr-2">{{favourited ? "mdi-heart":"mdi-heart-outline"}}</v-icon>
          {{favourited ? "Ikke favoriser": "Favoriser"}}
        </v-btn>

        <v-menu offset-y close-on-click>
          <template v-slot:activator="{ on }">
            <v-btn text color="info" @click="shareNative" v-on="on">
              <v-icon class="mr-2">mdi-share</v-icon>Del
            </v-btn>
          </template>
          <v-list v-show="shareOpen && recipe.visibility != 'Private'">
            <v-list-item @click="shareFacebook">
              <v-list-item-title class="d-flex">
                <v-icon class="mr-2" color="#3C5A99">mdi-facebook-box</v-icon>
                <p class="my-auto body-1 font-weight-medium">Facebook</p>
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="shareLink">
              <v-list-item-title class="d-flex">
                <v-icon class="mr-2" color="#3C5A99">mdi-link</v-icon>
                <p class="my-auto body-1 font-weight-medium">Link</p>
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <v-list v-show="recipe.visibility == 'Private'">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Privat</v-list-item-title>
                <v-list-item-subtitle>Du kan ikke dele en privat oppskrift</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              color="primary"
              @click="printRecipe(null)"
              :loading="printLoading"
              v-on="on"
            >
              <v-icon class="mr-2">mdi-printer</v-icon>Skriv ut
            </v-btn>
          </template>
          <v-list v-show="printMenuShow" class="d-print-none">
            <v-list-item @click="printRecipe(true)">
              <v-list-item-title>
                <v-icon color="primary">mdi-image</v-icon>Med bilde
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="printRecipe(false)">
              <v-list-item-title>
                <v-icon color="warning">mdi-image-off</v-icon>Uten bilde
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn color="warning" :to="'/endre-oppskrift/' + recipe.id" text v-if="personal">
          <v-icon>mdi-pencil</v-icon>Rediger
        </v-btn>
        <v-btn
          color="error"
          :to="'/tilbakemelding/rapportere/oppskrift/' + recipe.id"
          text
          v-if="!personal"
        >
          <v-icon>mdi-flag</v-icon>Rapporter
        </v-btn>
      </div>

      <div class="ingredients">
        <v-card
          class="pa-2 ingredientsCard text-left"
          :class="[$vuetify.breakpoint.mdAndUp ? 'ingredientsFloat': 'ingredientsNotFloat']"
          width="max-content"
          max-width="300px"
        >
          <v-list subheader>
            <v-subheader>Ingredienser</v-subheader>
            <v-row class="mb-8" dense>
              <div class="ml-4 portionsTextFieldContainer">
                <v-text-field
                  class="portionsTextField"
                  name="Porsjoner"
                  id="portionsField"
                  :rules="[rules.onlyNumber]"
                  type="number"
                  outlined
                  v-model="portions"
                ></v-text-field>
              </div>

              <label for="portionsField" class="my-auto px-2">
                <p class="my-auto subtitle-1 font-weight-medium">Porsjoner</p>
              </label>
            </v-row>
            <v-list-item v-for="(ingredient, index) in recipe.ingredients" :key="index">
              <v-list-item-content>{{+(Math.round(((ingredient.amount / recipe.portions)*portions) + "e+2") + "e-2")}} {{ingredient.unit}} {{ingredient.name}}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <div class="steps text-left">
        <h2 class="headline">Slik gjør du</h2>
        <v-divider class="mb-2"></v-divider>
        <p v-for="(paragraph, index) in recipeSteps" :key="index">{{paragraph}}</p>
      </div>
      <div class="clearfix"></div>
    </v-container>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
var db = firebase.firestore();
var storage = firebase.storage();

import dateMixin from "@/mixins/date.js";

export default {
  name: "recipe",
  metaInfo() {
    if (this.recipe && this.url) {
      return {
        title: `${this.recipe.title} - Dine Oppskrifter`,
        meta: [
          {
            property: "og:url",
            content: this.url ? this.url : ""
          },
          {
            property: "og:type",
            content: "article"
          },
          {
            property: "title",
            content: this.recipe ? this.recipe.title : ""
          },
          {
            property: "description",
            content: this.recipe ? this.recipe.description : ""
          },
          {
            property: "og:image",
            content: this.recipeImage
              ? this.recipeImage
              : import("@/assets/ShorterLogo.svg")
          },
          {
            property: "og:locale",
            content: "nb_NO"
          }
        ]
      };
    }
  },
  mixins: [dateMixin],
  data() {
    return {
      recipe: null,
      recipeImageURL: "",
      shareOpen: false,
      printImage: true,
      printLoading: false,
      printMenuShow: true,
      portions: "",
      shareLinkOpen: false,
      error: false,
      copySuccess: false,
      tryAgain: false,
      favourited: null,
      favoriteDocId: null,
      favUnsubscribe: undefined,
      errorMessage: "En ukjent feil oppstod",
      errorIcon: "mdi-cancel",
      rules: {
        onlyNumber: v => !isNaN(v) || ""
      }
    };
  },
  components: {
    "facebook-login-button": () => import("@/components/FacebookLoginButton")
  },
  computed: {
    recipeId() {
      return this.$route.params.id;
    },
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    },
    difficultyColor() {
      if (this.recipe.difficulty == "Enkel") {
        return "primary";
      } else if (this.recipe.difficulty == "Middels") {
        return "warning";
      } else if (this.recipe.difficulty == "Vanskelig") {
        return "error";
      } else {
        return "grey";
      }
    },
    recipeSteps() {
      const steps = this.recipe.steps;
      if (typeof steps == "object") {
        let stepsString = "";
        steps.forEach((step, index) => {
          stepsString += `${index + 1}. ${step.text}\n`;
        });
        return stepsString.split("\n");
      } else if (typeof steps == "string") {
        return this.recipe.steps.split("\n");
      } else {
        return "";
      }
    },
    user() {
      return this.$store.state.accountModule;
    },
    personal() {
      if (this.recipe.author) {
        return this.recipe.author.id === this.user.uid;
      } else {
        return false;
      }
    },
    small() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    url() {
      return "https://dine-oppskrifter.no/oppskrift/" + this.recipe.id;
    },
    shortUrl() {
      return "https://dine-oppskrifter.no/o/" + this.recipe.id;
    },
    dateCreated() {
      if (this.recipe.dateCreated) {
        try {
          let date = new Date(this.recipe.dateCreated);
          return this.makeDateString(date);
        } catch {
          return "Ugyldig dato";
        }
      } else {
        return "Ugyldig dato";
      }
    }
  },
  methods: {
    getImage() {
      if (this.recipe.imagePath) {
        if (this.recipe.imagePath != "") {
          storage
            .ref(this.recipe.imagePath)
            .getDownloadURL()
            .then(url => {
              this.recipeImageURL = url;
            })
            .catch(error => {
              return;
            });
        }
      }
    },
    getRecipe() {
      this.error = false;
      let vueObject = this;
      this.$store.commit("startLoading");
      if (this.recipeId) {
        db.collection("recipes")
          .doc(this.recipeId)
          .onSnapshot(
            doc => {
              this.recipe = { ...doc.data(), id: doc.id };
              this.portions = doc.data().portions;
              this.getImage();
              this.$store.commit("stopLoading");
            },
            error => {
              console.log("Error occured");
              this.$store.commit("stopLoading");
              console.dir(error);
              switch (error.code) {
                case "not-found":
                  vueObject.error = true;
                  vueObject.errorMessage = "Oppskriften eksisterer ikke";
                  vueObject.errorIcon = "mdi-file-excel";
                  vueObject.tryAgain = false;
                  break;

                case "permission-denied":
                  vueObject.recipe = undefined;
                  vueObject.error = true;
                  vueObject.errorMessage =
                    "Oppskriften eksisterer ikke, eller så har du ikke tilgang til oppskriften. \n";

                  if (!vueObject.user.loggedIn) {
                    vueObject.errorMessage +=
                      "For å få tilgang til dine private oppskrifter må du være logget inn";
                  }
                  vueObject.errorIcon = "mdi-account-alert";
                  vueObject.tryAgain = false;
                  break;

                case "unavailable":
                  vueObject.error = true;
                  vueObject.errorMessage = "Kunne ikke hente oppskrift";
                  vueObject.errorIcon = "mdi-target";
                  vueObject.tryAgain = true;
                  break;

                case "unauthenticated":
                  vueObject.error = true;
                  vueObject.errorMessage =
                    "Du har ikke tilgang til denne oppskriften";
                  vueObject.errorIcon = "mdi-account-alert";
                  vueObject.tryAgain = false;
                  break;

                case "unknown":
                  vueObject.error = true;
                  vueObject.errorMessage = "En ukjent feil oppstod";
                  vueObject.errorIcon = "mdi-cancel";
                  vueObject.tryAgain = true;
                  break;

                default:
                  vueObject.error = true;
                  vueObject.errorMessage = "En ukjent feil oppstod";
                  vueObject.errorIcon = "mdi-cancel";
                  vueObject.tryAgain = true;
                  break;
                  break;
              }
            }
          );

        // Check if user has favourised this recipe
        this.favUnsubscribe = db
          .collection("favourites")
          .where("recipeId", "==", this.recipeId)
          .where("user.id", "==", this.user.uid)
          .onSnapshot(snapshot => {
            if (snapshot.docs.length > 0) {
              let done = false;
              snapshot.forEach(doc => {
                if (!done) {
                  this.favouriteDocId = doc.id;
                  this.favourited = true;
                  done = true;
                }
              });
            } else {
              this.favourited = false;
            }
          });
      }
    },
    favourise() {
      let favouriteData = {
        user: {
          id: this.user.uid,
          name: this.user.name,
          profilePictureUrl: this.user.profilePictureUrl
        },
        recipeId: this.recipe.id
      };
      db.collection("favourites")
        .add(favouriteData)
        .then(ref => {
          this.favouriteDocId = ref.id;
          this.favourited = true;
        });

      this.recipe.favourites++;
    },
    unFavourise() {
      if (this.favouriteDocId != null) {
        db.collection("favourites")
          .doc(this.favouriteDocId)
          .delete()
          .then(() => {
            this.favourited = false;
            this.favouriteDocId = null;
          });
      } else {
        this.favourited = false;
      }
      this.recipe.favourites--;
    },
    shareNative() {
      if (navigator.share && this.recipe.visibility != "Private") {
        navigator.share({
          url: this.url,
          title: window.title,
          text: this.recipe.title
        });
      } else {
        this.shareOpen = true;
      }
    },
    shareFacebook() {
      FB.ui(
        {
          method: "share",
          href: this.url,
          quote: `Oppskrift fra Dine Oppskrifter: ${this.recipe.title}`
        },
        response => {}
      );
    },
    shareLink() {
      this.copySuccess = false;
      this.shareLinkOpen = true;
    },
    copyLink() {
      /* Get the text field */
      var copyText = document.getElementById("LinkTextField");

      /* Select the text field */
      copyText.select();
      copyText.setSelectionRange(0, 99999); /*For mobile devices*/

      /* Copy the text inside the text field */
      document.execCommand("copy");
      this.copySuccess = true;
    },
    copyFail: function(e) {
      console.log("Error occured white copying");
      console.dir(e);
    },
    async printRecipe(image) {
      if (image === null) {
        if (!this.recipe.imagePath) {
          image = false;
          this.printMenuShow = false;
        } else {
          this.printMenuShow = true;
          return;
        }
      }

      if (image) {
        this.printImage = true;
        let logo = document.querySelector("#printLogo");
        logo.style.gridRow = "1/2";
      } else {
        this.printImage = false;
        let logo = document.querySelector("#printLogo");
        logo.style.gridRow = "2/3";
      }

      setTimeout(() => {
        window.print();
      }, 500);
    }
  },
  created() {
    this.getRecipe();
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  },
  beforeDestroy() {
    this.favUnsubscribe();
  },
  watch: {
    loggedIn(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.getRecipe();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
.errorCard {
  width: max-content;
  max-width: 800px;
}

.mainContainer {
  max-width: 1500px;
}

.portionsTextFieldContainer {
  width: 55px;
  height: 55px;
}

.favourite {
  width: max-content;
}

.favouritesCount {
  text-align: center;
  width: max-content;
}

.ingredientsFloat {
  float: left;
  margin-right: 30px !important;
}

.ingredientsNotFloat {
  width: 80% !important;
  margin-left: auto;
  margin-right: auto;
}

.ingredientsCard {
  margin-bottom: 30px;
}

.steps {
  width: max-content;
  max-width: 80%;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
}

.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

@media only screen and (max-width: 540px) {
  .recipeTitle,
  .recipeDescription {
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    width: max-content;
    max-width: 100%;
  }
  .steps {
    max-width: 95%;
  }
}

@media only screen and (min-width: 700px) {
  .mainContainer {
    padding-left: 40px;
    padding-right: 40px;
  }
}

@supports (display: grid) {
  .ingredientsFloat {
    float: none;
    margin-left: auto;
    margin-right: auto !important;
  }

  .recipeImage {
    max-width: 100% !important;
  }

  @media only screen and (min-width: 700px) {
    .mainContainer {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      grid-template-rows: repeat(7, max-content);
      grid-gap: 10px;
      grid-template-areas:
        "image image image"
        "labelRow labelRow labelRow"
        "author author author"
        "title title title"
        "description description description"
        "ingredients buttonRow buttonRow"
        "ingredients steps steps";
    }

    .recipeImage {
      grid-area: image;
    }

    .labelRow {
      grid-area: labelRow;
    }

    .author {
      grid-area: author;
    }

    .recipeTitle {
      grid-area: title;
    }

    .recipeDescription {
      grid-area: description;
    }

    .buttonRow {
      grid-area: buttonRow;
      margin-left: 15px !important;
      text-align: left !important;
    }

    .ingredients {
      grid-area: ingredients;
    }

    .steps {
      grid-area: steps;
      max-width: 80%;
      margin-left: 30px !important;
      margin-right: 30px !important;
    }

    .ingredients {
      justify-self: right;
      margin-left: unset;
    }

    .ingredientsCard {
      position: sticky;
      display: block;
      top: 100px;
    }

    @media only screen and (min-width: 1000px) {
      .mainContainer {
        grid-template-areas:
          "image image image"
          "labelRow labelRow labelRow"
          "author author author"
          "title title title"
          "description description description"
          "ingredients buttonRow ."
          "ingredients steps steps";
      }

      .recipeTitle,
      .recipeDescription {
        margin-left: 50px;
        margin-right: 50px;
      }

      .ingredients {
        margin-right: 0;
        margin-top: 20px;
      }

      .buttonRow {
        margin-left: auto !important;
        margin-right: auto !important;
        text-align: center !important;
      }
    }
  }
}

#printLogo {
  display: none;
}

#qrCode {
  display: none;
}

@media print {
  #printLogo {
    display: flex;
    z-index: 50;
  }

  .contentContainer {
    padding-top: 0 !important;
    margin-top: -150px;
  }

  .recipeImageNone {
    display: none;
  }

  .recipeImage {
    margin-top: -130px;
    max-height: 400px !important;
  }

  .mainContainer {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 0 !important;
  }

  .ingredients {
    float: left;
  }

  #printLogo {
    margin-left: -25px;
    margin-top: -30px;
  }

  .recipeDescription {
    font-size: 0.8em !important;
    text-align: left;
    margin-bottom: 0;
  }

  .recipeTitle {
    text-align: left;
    margin: 5px 0 !important;
    font-size: 1.5em !important;
    line-height: 1.5em !important;
  }

  .author {
    //font-size: 0.7em;
    margin: auto !important;
  }

  .ingredients {
    margin-top: -30px !important;
    transform: scale(0.8);
    margin-right: -20px !important;
    margin-left: -30px !important;
  }

  .ingredientsCard {
    max-width: 250px !important;
  }

  .labelRow {
    display: flex;
    flex-wrap: nowrap;
    margin: auto !important;
  }

  .label {
    width: max-content;
    margin: 0 0 !important;
    transform: scale(0.9);
  }

  .steps {
    margin: 10px;
    margin-bottom: 0;
    width: 400px !important;

    h2 {
      font-size: 1.2em !important;
    }

    p {
      font-size: 0.8em;
    }
  }

  @supports (display: grid) {
    .mainContainer {
      display: grid;
      padding: 10px;
      grid-template-columns: 80px max-content 1fr max-content max-content;
      grid-template-rows: min-content 80px repeat(4, max-content);
      grid-gap: 10px;
      grid-template-areas:
        "image image image image image"
        ". labelRow labelRow author author"
        "title title title title QRCode"
        "description description description description QRCode"
        "ingredients ingredients steps steps steps"
        ". . steps steps steps";
    }

    #printLogo {
      grid-column: 1/2;
      grid-row: 1/2;
    }

    #qrCode {
      display: block;
      grid-area: QRCode;
      margin-right: 10px;
      margin-left: 10px;
    }

    .recipeImage {
      grid-area: image;
    }

    .labelRow {
      grid-area: labelRow;
    }

    .author {
      grid-area: author;
    }

    .recipeTitle {
      grid-area: title;
    }

    .recipeDescription {
      grid-area: description;
    }

    .buttonRow {
      grid-area: buttonRow;
    }

    .ingredients {
      grid-area: ingredients;
      margin-left: -20px !important;
    }

    .ingredientsNotFloat {
      width: unset !important;
    }

    .steps {
      grid-area: steps;
      width: 100% !important;
      max-width: 100%;
    }
  }
}
</style>