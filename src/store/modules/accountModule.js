import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";

const accountModule = {
  state: {
    loginProcess: null,
    loggedIn: null,
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
    resetAccount(state) {
      state = {
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
      console.log("logging in");
      commit("startLoading");
      let provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("email");
      firebase.auth().languageCode = "nb_NO";
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          commit("setFacebookAccessToken", result.credential.accessToken);
          // The signed-in user info.
          let user = result.user;
          console.log("Logged in user: ");
          console.dir(user);
          commit("addUserInfo", user);
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
    },
    logout({ _, commit }) {
      console.log("Logging out");
      commit("startLoading");
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("Successfully logged out");
          commit("resetAccount");

          console.log("Logging out of facebook");
          commit("showWelcome");
          commit("stopLoading");
          commit("setLoginProcess", false);
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
        });
    }
  }
};

export default accountModule;
