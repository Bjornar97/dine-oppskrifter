import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";

const accountModule = {
  state: {
    loginProcess: null,
    loginSuccess: false,
    loggedIn: null,
    wasLoggedIn: null,
    name: "",
    email: "",
    uid: null,
    profilePictureUrl: "",
    facebookAccessToken: "",
    loginError: {
      error: false,
      errorCode: undefined,
      errorMessage: "",
      email: "",
      credential: ""
    }
  },
  getters: {
    getLoginStatus(state) {
      return state.loggedIn;
    }
  },
  mutations: {
    addUserInfo(state, user) {
      state.email = user.email;
      state.loggedIn = true;
      state.loginProcess = false;
      state.name = user.displayName;
      state.profilePictureUrl = user.photoURL;
      state.uid = user.uid;
    },
    loginSuccess(state) {
      state.loginSuccess = true;
      setTimeout(() => {
        state.loginSuccess = false;
      }, 5000);
    },
    closeLoginSuccess(state) {
      state.loginSuccess = false;
    },
    closeLoginError(state) {
      state.loginError.error = false;
    },
    setWasLoggedIn(state, value) {
      state.wasLoggedIn = value;
    },
    resetAccount(state) {
      state.loginProcess = null;
      state.loggedIn = null;
      state.name = "";
      state.email = "";
      state.uid = null;
      state.profilePictureUrl = "";
      state.facebookAccessToken = "";
    },
    setFacebookAccessToken(state, facebookAccessToken) {
      state.facebookAccessToken = facebookAccessToken;
    },
    setLoginError(state, error) {
      state.loginError.errorCode = error.code;
      state.loginError.errorMessage = error.message;
      state.loginError.email = error.email;
      state.loginError.credential = error.credential;
      state.loginError.error = true;
    },
    setLoginProcess(state, status) {
      state.loginProcess = status;
    }
  },
  actions: {
    loginWithFacebook({ _, commit }) {
      commit("startLoading");
      let provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("email");
      firebase.auth().languageCode = "nb_NO";

      let screenWidth = screen.width;
      console.log("Screenwidth: " + screenWidth);
      if (screenWidth > 1024) {
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(result => {
            if (result.credential) {
              // This gives you a Facebook Access Token. You can use it to access the Facebook API.
              commit("setFacebookAccessToken", result.credential.accessToken);
            }

            // The signed-in user info.
            let user = result.user;
            if (user) {
              commit("addUserInfo", user);
              commit("loginSuccess");
              commit("setWasLoggedIn", true);
            }

            commit("stopLoading");
            commit("setLoginProcess", false);
          })
          .catch(error => {
            // Handle Errors here.
            console.log("Error: ");
            console.log(error);
            commit("setLoginError", error);
            commit("stopLoading");
            commit("setLoginProcess", false);
            commit("resetAccount");
          });
      } else {
        firebase.auth().signInWithRedirect(provider);
      }
    },
    logout({ _, commit, dispatch }) {
      console.log("Logging out");
      commit("startLoading");
      firebase
        .auth()
        .signOut()
        .then(() => {
          dispatch("loggedOut");
        })
        .catch(error => {
          console.log("Something bad happened: " + error);
          let errorObject = {
            code: error.code,
            message: error.message,
            email: error.email
          };
          commit("setLoginError", errorObject);
          commit("stopLoading");
          commit("setLoginProcess", false);
          dispatch("loggedOut");
        });
    },
    loggedOut({ _, commit }) {
      commit("resetAccount");
      commit("stopLoading");
      commit("setLoginProcess", false);
    }
  }
};

export default accountModule;
