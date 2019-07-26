import Vue from "vue";
import Vuex from "vuex";
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    underContruction: true,
    activeFeatures: {
      login: false,
      ingredients: true
    },
    account: {
      loginProcess: null,
      loggedIn: null,
      name: "",
      email: "",
      uid: null,
      profilePictureUrl: "",
      facebookAccessToken: ""
    },
    loading: true,
    loginError: {
      error: false,
      errorCode: undefined,
      errorMessage: "",
      email: "",
      credential: ""
    },
    acceptedCookies: false,
    currentTitle: "Utforsk",
    showWelcome: null
  },
  getters: {
    getCurrentTitle(state) {
      return state.currentTitle;
    },
    getLoginStatus(state) {
      return state.account.loggedIn;
    }
  },
  mutations: {
    closeWelcome(state) {
      console.log("Closing welcome box");
      state.showWelcome = false;
    },
    showWelcome(state) {
      console.log("Opening welcome box");
      state.showWelcome = true;
    },
    addUserInfo(state, user) {
      state.account.email = user.email;
      state.account.loggedIn = true;
      state.account.loginProcess = false;
      state.account.name = user.displayName;
      state.account.profilePictureUrl = user.photoURL;
      state.account.uid = user.uid;
    },
    resetAccount(state) {
      state.account = {
        loginProcess: null,
        loggedIn: null,
        name: "",
        email: "",
        uid: null,
        profilePictureUrl: "",
        facebookAccessToken: ""
      };
    },
    setFacebookAccessToken(state, facebookAccessToken) {
      state.account.facebookAccessToken = facebookAccessToken;
    },
    setLoginError(state, error) {
      state.loginError.errorCode = error.code;
      state.loginError.errorMessage = error.message;
      state.loginError.email = error.email;
      state.loginError.credential = error.credential;
      state.loginError.error = true;
    },
    acceptCookies(state) {
      state.acceptedCookies = true;
    },
    denyCookies(state) {
      state.acceptedCookies = false;
    },
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    }
  },
  actions: {
    loginWithFacebook() {
      this.commit("startLoading");
      let provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("email");
      firebase.auth().languageCode = "nb_NO";
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          this.state.account.facebookAccessToken =
            result.credential.accessToken;
          // The signed-in user info.
          let user = result.user;
          console.log("Logged in user: ");
          console.dir(user);
          this.commit("addUserInfo", user);
          this.commit("stopLoading");
        })
        .catch(error => {
          // Handle Errors here.
          this.commit("setLoginError", error);
          this.commit("stopLoading");
          this.commit("resetAccount");
        });
    },
    logout() {
      console.log("Logging out");
      this.commit("startLoading");
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("Successfully logged out");
          this.state.account = {
            loginProcess: false,
            loggedIn: false,
            name: "",
            email: "",
            uid: null,
            profilePictureUrl: "",
            facebookAccessToken: ""
          };

          console.log("Logging out of facebook");
          this.commit("showWelcome");
          this.commit("stopLoading");
        })
        .catch(error => {
          console.log("Something bad happened: " + error);
          let errorObject = {
            code: error.code,
            message: error.message,
            email: error.email
          };
          this.commit("setLoginError", errorObject);
          this.commit("stopLoading");
        });
    }
  }
});
