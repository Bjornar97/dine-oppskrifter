<template>
  <v-app>
    <v-app-bar class="topBar" app elevate-on-scroll collapse>
      <router-link to="/">
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

    <div class="logout" v-if="!$vuetify.breakpoint.smAndDown && loginFeature">
      <v-btn v-if="loggedIn" @click="logout" text medium color="error">Logg ut</v-btn>
      <facebook-login-button loginText="Logg inn" v-if="!loggedIn"></facebook-login-button>
    </div>

    <div class="loading">
      <v-progress-linear indeterminate rounded fixed color="primary" :active="loading"></v-progress-linear>
    </div>

    <v-container class="oldBrowserWarning">
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
      v-if="loginFeature"
      style="position: fixed;"
      app
      :value="activeRoute"
      color="primary"
    >
      <v-btn to="/">
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

    <v-content>
      <div id="contentContainer">
        <div
          class="cookieContainer"
          v-if="!acceptedCookies && !hiddenCookies && !loggedIn && loginFeature"
        >
          <v-sheet elevation="2" class="cookieSheet">
            <div class="cookieAccept">
              <h2 class="title">Akseptere bruk av informasjonskapsler?</h2>
              <p class="cookieText">
                For å gi deg den beste opplevelsen, ønsker vi å bruke infomasjonskapsler til å holde deg innlogget og huske valg du tar på dine-oppskrifter.no.
                Aksepterer du bruk av informasjonskapsler? Du kan ikke logge inn dersom du ikke akspeterer.
              </p>
              <v-btn @click="acceptCookies" color="success">Ja</v-btn>
              <v-btn @click="hideCookies" color="error">Nei</v-btn>
            </div>
          </v-sheet>
        </div>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </v-content>

    <v-footer color="white" class="elevation-4 mt-8" padless>
      <v-layout justify-center wrap>
        <v-btn to="/" color="primary darken-2" text rounded class="my-2">Forsiden</v-btn>

        <v-btn
          v-if="isFacebookPage"
          href="https://www.facebook.com/DineOppskrifter"
          target="_blank"
          color="primary darken-2"
          text
          rounded
          class="my-2"
        >Besøk Facebook-siden vår</v-btn>
        <v-btn
          v-if="!construction"
          to="/ingrediens-kalkulator"
          color="primary darken-2"
          text
          rounded
          class="my-2"
        >Ingredienskalkulator</v-btn>
        <v-btn
          v-if="construction"
          color="primary darken-2"
          href="mailto:brukerstotte@dine-oppskrifter.no"
          text
          rounded
          class="my-2"
        >Send epost</v-btn>
        <v-btn
          v-if="!construction"
          color="primary darken-2"
          text
          rounded
          class="my-2"
          to="/kontakt"
        >Kontakt oss</v-btn>

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

        <v-flex grey lighten-4 py-4 text-center black--text xs12>
          {{ new Date().getFullYear() }} —
          <strong>Dine Oppskrifter</strong>
        </v-flex>
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
      this.$cookies.set("cookieAccept", true, new Date("2099"));
    },
    hideCookies() {
      this.hiddenCookies = true;
    },
    hideBrowserWarning() {
      this.$store.commit("hideBrowserWarning");
    }
  },
  data() {
    return {
      hiddenCookies: false
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    },
    currentTitle() {
      return this.$store.state.currentTitle;
    },
    acceptedCookies() {
      return this.$store.state.acceptedCookies;
    },
    loading() {
      return this.$store.state.loading;
    },
    loginFeature() {
      return this.$store.state.featuresModule.login;
    },
    hideOldBrowserWarning() {
      return this.$store.state.hideOldBrowserWarning;
    },
    activeRoute() {
      return this.$router.currentRoute;
    },
    construction() {
      return this.$store.state.underConstruction;
    },
    isFacebookPage() {
      return this.$store.state.featuresModule.facebookPage;
    }
  },
  components: {
    "facebook-login-button": FacebookLoginButton
  },
  created() {
    console.log("Checking status");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        this.$store.commit("addUserInfo", user);
        this.$store.commit("stopLoading");
      } else {
        // No user is signed in.
        this.$store.commit("showWelcome");
      }
    });

    this.$store.commit("stopLoading");
    let cookieAccept = this.$cookies.get("cookieAccept");
    if (cookieAccept == "true") {
      this.hideCookies();
    }
  }
};
</script>

<style lang="scss">
.topBar {
  #logoNew {
    width: 50px;
    margin-top: 10px;
    max-height: 100px;
    margin-left: 10px;
  }

  .logoContainer {
    width: min-content;
    grid-area: logoCont;
    justify-self: center;
  }

  .heading {
    grid-area: title;
    font-family: "Montserrat", sans-serif;
    align-self: center;
    justify-self: center;
    font-size: 1.4em;
  }
}

.loading {
  grid-area: loading;
  width: 100%;
  margin: 0;
  padding: 0;
}

.logout {
  position: fixed;
  top: 0;
  right: 0;
  text-align: right;

  margin-right: 10px;
  margin-top: -10px;
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

.cookieContainer {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.cookieAccept {
  padding: 20px;
}

.cookieSheet {
  max-width: 800px;
}

.cookieText {
  margin: 10px;
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
</style>
