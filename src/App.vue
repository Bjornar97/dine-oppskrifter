<template>
  <v-app class="appMe">
    <v-expand-x-transition>
      <div
        class="goBackBtn elevation-4 d-print-none"
        :class="$vuetify.breakpoint.smAndDown ? 'goBackSmall':''"
        v-if="canGoBack"
        @click="goBack"
      >
        <v-btn aria-label="Tilbake" color="black" icon small>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </div>
    </v-expand-x-transition>

    <v-app-bar
      class="topBar d-print-none"
      :class="canGoBack ? 'appBarShift': ''"
      app
      elevation="4"
      collapse
    >
      <router-link to="/" id="logoLink">
        <div class="logoContainer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="2 14 34 38"
            id="logoNew"
          >
            <defs>
              <clipPath id="clip-path">
                <rect width="44" height="69.016" fill="none" />
              </clipPath>
            </defs>
            <g id="ShorterLogo" clip-path="url(#clip-path)">
              <text
                id="O"
                transform="translate(9 49)"
                font-size="40"
                font-family="Roboto-Regular, Roboto"
              >
                <tspan x="0" y="0">O</tspan>
              </text>
              <text
                id="D"
                transform="translate(0 43)"
                fill="#49A84D"
                font-size="40"
                font-family="Roboto-Regular, Roboto"
              >
                <tspan x="0" y="0">D</tspan>
              </text>
              <path
                id="Subtraction"
                data-name="Subtraction"
                d="M-75.295,89h-5.352a10.187,10.187,0,0,1,2.411-2.158,10.869,10.869,0,0,1,5.967-1.67,11.074,11.074,0,0,1,6.025,1.651A9.991,9.991,0,0,1-63.81,89l-5.366,0a7.586,7.586,0,0,0-3.093-.606A7.315,7.315,0,0,0-75.295,89Z"
                transform="translate(95 -65)"
                stroke="rgba(0,0,0,0)"
                stroke-width="1"
              />
            </g>
          </svg>
        </div>
      </router-link>
    </v-app-bar>

    <event-line class="eventLine d-print-none"></event-line>

    <terms-accept></terms-accept>

    <v-container class="oldBrowserWarning d-print-none">
      <v-banner
        v-if="!hideOldBrowserWarning"
        elevation="2"
        icon="mdi-alert"
        icon-color="warning"
        max-width="95%"
      >
        Vi ser at du bruker en eldre nettleser. Siden fungerer greit, men for å få den beste opplevelsen anbefaler vi å bruke en nyere nettleser, som for eksempel chrome eller firefox.
        Eldre enheter fra Apple kan dessverre ikke oppgradere nettleseren (gjelder blant annet iPad 3 og eldre).
        <template
          v-slot:actions
        >
          <v-btn text @click="hideBrowserWarning" color="error">Lukk</v-btn>
        </template>
      </v-banner>
    </v-container>

    <v-bottom-navigation
      style="position: fixed;"
      class="d-print-none"
      app
      id="bottomNav"
      :value="activeRoute"
      color="primary"
    >
      <v-btn to="/" exact>
        <span>Utforsk</span>
        <v-icon>mdi-compass</v-icon>
      </v-btn>

      <v-btn to="/favoritter">
        <span>Favoritter</span>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn color="white" to="/dine-oppskrifter">
        <span>Dine Oppskrifter</span>
        <v-icon>mdi-book-open-page-variant</v-icon>
      </v-btn>
      <v-btn color="white" to="/konto">
        <span>Konto</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-content class="contentContainer">
      <div id="contentContainer">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </v-content>

    <v-footer color="white" class="elevation-4 mt-8 footer d-print-none" padless>
      <v-layout justify-center wrap>
        <v-btn to="/" exact color="primary darken-2" text rounded class="my-2">Forsiden</v-btn>

        <v-btn
          href="https://facebook.com/DineOppskrifter"
          target="_blank"
          color="primary darken-2"
          text
          rounded
          class="my-2"
        >Besøk Facebook-siden vår</v-btn>
        <v-btn
          to="/ingrediens-kalkulator"
          color="primary darken-2"
          text
          rounded
          class="my-2"
        >Ingredienskalkulator</v-btn>
        <v-btn color="primary darken-2" text rounded class="my-2" to="/kontakt-oss">Kontakt oss</v-btn>

        <div class="footerDev py-8 text-center">
          <p class="devText secondary--text text--darken-2 ma-0 mr-4">Utviklet av</p>
          <v-chip pill color="secondary darken-2">
            <v-avatar left class="devAvatar">
              <v-img src="@/assets/dev-profile-pic.jpg"></v-img>
            </v-avatar>Bjørnar Hetlesæther
          </v-chip>
        </div>

        <v-btn
          v-if="!construction"
          color="primary darken-2"
          to="/personvern-erklaering"
          text
          rounded
          class="my-2"
        >Personvernerklæring</v-btn>
        <v-btn
          v-if="!construction"
          color="primary darken-2"
          text
          rounded
          class="my-2"
          to="/vilkaar-for-bruk"
        >Vilkår for bruk</v-btn>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
/* eslint-disable */
import * as firebase from "firebase/app";
import FacebookLoginButton from "./components/FacebookLoginButton.vue";

// Add the Firebase services that you want to use
import "firebase/auth";

export default {
  name: "App",
  methods: {
    login() {
      this.$store.commit("showWelcome");
    },
    logout() {
      this.$store.dispatch("logout");
    },
    acceptCookies() {
      this.$store.commit("acceptCookies");
    },
    denyCookies() {
      this.$store.commit("denyCookies");
    },
    hideCookies() {
      this.$store.commit("closeCookies");
    },
    hideBrowserWarning() {
      this.$store.commit("hideBrowserWarning");
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    },
    activeRoute() {
      return this.$route.path;
    },
    loading() {
      return this.$store.state.loading;
    },
    hideOldBrowserWarning() {
      return this.$store.state.hideOldBrowserWarning;
    },
    construction() {
      return this.$store.state.underConstruction;
    },
    canGoBack() {
      const routeName = this.$route.name;
      if (window.history.length > 0) {
        if (
          routeName != "discover" &&
          routeName != "yourRecipes" &&
          routeName != "favourites" &&
          routeName != "account"
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  components: {
    "facebook-login-button": FacebookLoginButton,
    "event-line": () => import("@/components/EventLine"),
    "terms-accept": () => import("@/components/TermsAccept")
  },
  created() {
    // Event listner for login and logout
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.$store.commit("addUserInfo", user);
      } else {
        // No user is signed in.
        this.$store.dispatch("loggedOut");
      }
    });

    firebase
      .firestore()
      .enablePersistence({ synchronizeTabs: true })
      .then(() => {
        this.$store.commit("noMultiTabs");
        this.$store.commit("persistenceOn");
      })
      .catch(err => {
        this.$store.commit("persistenceOff");
        if (err.code == "failed-precondition") {
          this.$store.commit("multiTabs");
        } else if (err.code == "unimplemented") {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
        }
      });
  },
  mounted() {
    this.$store.commit("stopLoading");
  }
};
</script>

<style lang="scss">
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.topBar {
  z-index: 30;
  #logoNew {
    width: 50px;
    margin-top: 10px;
    max-height: 100px;
    margin-left: 10px;
  }
}

.eventLine {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 12;
}

#logoLink {
  text-decoration: none !important;
}

#bottomNav {
  z-index: 50;
}

.goBackBtn {
  position: fixed;
  z-index: 30;
  width: 50px;
  height: 64px;
  top: 0;
  left: 0;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;

  &.goBackSmall {
    height: 56px;
  }
}

.appBarShift {
  left: 50px !important;
}

.footer {
  z-index: 20;
  margin-bottom: 56px;
}

.fb_dialog {
  width: 100% !important;
  max-width: 600px;
}

.fb_dialog_content {
  width: 100% !important;
}

.FB_UI_Dialog {
  width: 100% !important;
}

.footerDev {
  display: flex;
  width: 100%;
  justify-content: center;
}

.devAvatar {
  margin-left: 30px;
}

.devText {
  margin-right: 15px;
  font-size: 14px;
  font-weight: 500;
  align-self: center;
  text-transform: uppercase;
}

#contentContainer {
  grid-area: content;
  text-align: center;
  margin-top: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.oldBrowserWarning {
  margin-top: 80px;
}

@supports (display: grid) {
  .oldBrowserWarning {
    display: none;
  }
}

@media only screen and (min-width: 800px) {
}

@media print {
  #contentContainer {
    margin-top: -40px !important;
  }

  .appMe {
    background-color: white !important;
  }
}

html,
body {
  height: 100%;
  width: 100%;
  color-adjust: exact !important;
}
</style>
