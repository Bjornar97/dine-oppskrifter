<template>
  <v-container class="mainContainer">
    <h3 v-if="!loggedIn" class="title">Du er ikke logget inn</h3>
    <facebook-login-button v-if="!loggedIn"></facebook-login-button>
    <v-btn
      @click="logout"
      v-if="small && loggedIn"
      color="error"
      class="ml-auto logoutButton"
    >Logg ut</v-btn>
    <div class="userBox d-flex mt-4 ml-sm-8" v-if="loggedIn">
      <img class="profilePicture" :src="account.profilePictureUrl" />
      <h4 class="title ml-2 userName">{{account.name}}</h4>
      <v-btn @click="logout" v-if="!small" color="error" class="ml-auto logoutButton">Logg ut</v-btn>
    </div>

    <div class="accountInfo" v-if="loggedIn">
      <div class="text-left ma-2 pa-4">
        <p class="subtitle-1">
          <span class="primary--text mr-1 userInfoSpan">Din BrukerID:</span>
          <span class="secondary--text userInfoSpan">{{account.uid}}</span>
        </p>
        <span class="primary--text mr-1 userInfoSpan" v-if="account.email">Din Epost:</span>
        <span class="secondary--text userInfoSpan">{{account.email}}</span>
      </div>

      <p
        class="text-left ma-2 pa-4"
      >All informasjon vi har om deg (bortsett fra oppskriftene dine og favorittene dine) vises på denne siden</p>

      <p class="text-left ma-2 pa-4">
        Dersom du ønsker å slette kontoen din, vennligst
        <router-link to="/kontakt-oss">kontakt oss</router-link>
      </p>

      <v-expansion-panels popout class="deletePanel" v-if="isAutoDeleteAccountFeature">
        <v-expansion-panel>
          <v-expansion-panel-header>Slett konto</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div id="sletteKonto" v-if="loggedIn" class="dangerBox">
              <h3 class="title error--text text-left pa-4">Faresone</h3>
              <v-btn @click="openConfirmDialog" color="error" class="ma-2">Slett meg</v-btn>
              <p
                class="error--text pa-2"
              >Sletter hele kontoen din og alle oppskrifter og favoritter du har lagt til</p>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-dialog v-model="confirmDialogOpen" v-if="isAutoDeleteAccountFeature" max-width="500">
        <v-card>
          <v-btn icon @click="confirmDialogOpen = false" class="dialogClose" color="black">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-card-title class="headline">Slette kontoen?</v-card-title>

          <v-card-text>
            <p>Dersom du trykker ja vil hele din konto og alt du har gjort inne på våre nettsider bli slettet permanent</p>
            <p class="error--text">Dette kan ikke gjøres om.</p>
            <p>For å gjøre dette må du først skrive ditt fulle navn i boksen under.</p>
            <v-text-field name="navn" outlined label="Navnet ditt" v-model="fullNameTextField"></v-text-field>
            <p
              v-if="fullNameWrong"
              class="error--text"
            >Du skrev ikke navnet ditt helt riktig, det må være stavet riktig.</p>
            <p
              class="error--text"
              v-if="deleteSuccess === false"
            >Noe gikk galt under sletting av kontoen din, prøv igjen senere</p>
            <p class="primary--text" v-if="deleteSuccess === true">Kontoen din er slettet</p>
          </v-card-text>

          <v-card-actions v-if="isAutoDeleteAccountFeature">
            <div class="flex-grow-1"></div>
            <v-btn
              color="warning"
              class="abortButton"
              text
              @click="confirmDialogOpen = false"
            >Avbryt</v-btn>
            <v-btn color="green darken-1" text @click="confirmDialogOpen = false">Nei</v-btn>
            <v-btn color="red darken-1" text @click="deleteAccount" :loading="deleteLoading">Ja</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/functions";

import "firebase/storage";
var storage = firebase.storage();

export default {
  name: "account",
  metaInfo() {
    return {
      title: "Konto - Dine Oppskrifter"
    };
  },
  data() {
    return {
      confirmDialogOpen: false,
      fullNameTextField: "",
      fullNameWrong: false,
      deleteLoading: false,
      deleteSuccess: null
    };
  },
  components: {
    "facebook-login-button": () => import("@/components/FacebookLoginButton")
  },
  computed: {
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    },
    account() {
      return this.$store.state.accountModule;
    },
    small() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    isAutoDeleteAccountFeature() {
      return this.$store.state.featuresModule.autoDeleteAccount;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
    openConfirmDialog() {
      this.confirmDialogOpen = true;
    },
    deleteAccount() {
      if (this.fullNameTextField != this.account.name) {
        this.fullNameWrong = true;
      } else {
        this.fullNameWrong = false;
        this.deleteLoading = true;
        let deleteAccount = firebase.functions().httpsCallable("deleteAccount");
        deleteAccount()
          .then(value => {
            this.deleteLoading = false;
            if (value == true) {
              this.deleteSuccess = true;
            } else {
              this.deleteSuccess = false;
            }
          })
          .catch(error => {
            console.log("An error occured");
            console.dir(error);
            this.deleteLoading = false;
            this.deleteSuccess = false;
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mainContainer {
  position: relative;
  min-height: 75vh;
  max-width: 1100px;
}

.userInfoSpan {
  display: inline-block;
}

.userName {
  align-self: center;
}

.logoutButton {
  align-self: center;
}

.profilePicture {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.dangerBox {
  width: 100%;
  bottom: 0;
  border: 2px solid red;
}

.deletePanel {
  margin-top: 50px;
  max-width: 500px;
}

.abortButton {
  position: absolute;
  bottom: 8px;
  left: 10px;
}

.dialogClose {
  position: absolute;
  right: 0;
}
</style>