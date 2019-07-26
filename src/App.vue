<template>
  <v-app>
    <div id="vueApp">
      <div class="topBar elevation-3">
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

        <h1 class="heading">{{ currentTitle }}</h1>

        <div class="logout" v-if="loginFeature">
          <v-btn v-if="loggedIn" @click="logout" text medium color="error">Logg ut</v-btn>
          <v-btn v-if="!loggedIn" @click="login" text medium color="#3C5A99">Logg inn</v-btn>
        </div>
      </div>

      <div class="loading">
        <v-progress-linear indeterminate rounded color="primary" :active="loading"></v-progress-linear>
      </div>

      <div id="contentContainer">
        <div class="cookieContainer" v-if="!acceptedCookies && !hiddenCookies && !loggedIn">
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
        <router-view />
      </div>
    </div>
  </v-app>
</template>


<script>
import * as firebase from "firebase/app";

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
    }
  },
  data() {
    return {
      hiddenCookies: false
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.account.loggedIn;
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
      return this.$store.state.activeFeatures.login;
    }
  },
  created() {
    console.log("Checking status");
    var user = firebase.auth().currentUser;
    if (user) {
      this.$store.commit("addUserInfo", user);
      this.$store.commit("stopLoading");
    } else {
      this.$store.commit("showWelcome");
    }
    this.$store.commit("stopLoading");
    let cookieAccept = this.$cookies.get("cookieAccept");
    if (cookieAccept == "true") {
      this.hideCookies();
    }
  }
};
</script>


<style lang="scss">
#vueApp {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas:
    "bar bar bar"
    "loading loading loading"
    "content content content";
}

.topBar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "logoCont title logout";
  z-index: 50;
  grid-area: bar;
  background-color: rgba(255, 255, 255, 0.8);
  position: sticky;
  padding: 5px;
  top: 0;
  left: 0;

  #logoNew {
    width: 100px;
    max-height: 100px;
    transition: max-height 0.25s ease-in;
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

  .logout {
    grid-area: logout;
    text-align: right;
    display: flex;
    align-items: center;
    justify-self: right;
    margin-right: 10px;
  }
}

.loading {
  grid-area: loading;
  width: 100%;
  margin: 0;
  padding: 0;
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
  width: 100%;
  text-align: center;
  margin-top: 0;
}

html:not([data-scroll="0"]) {
  #logoNew {
    max-height: 50px;
    transition: max-height 0.25s ease-out;
  }
  .topBar {
    background-color: #fff;
  }
}

@media only screen and (max-width: 800px) {
}
</style>
