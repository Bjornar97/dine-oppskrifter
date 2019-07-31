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
    }
  },
  actions: {
    loginWithFacebook({ state, commit }) {
      commit("startLoading");
      let provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("email");
      firebase.auth().languageCode = "nb_NO";
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          state.account.facebookAccessToken = result.credential.accessToken;
          // The signed-in user info.
          let user = result.user;
          console.log("Logged in user: ");
          console.dir(user);
          commit("addUserInfo", user);
          commit("stopLoading");
        })
        .catch(error => {
          // Handle Errors here.
          commit("setLoginError", error);
          commit("stopLoading");
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
        });
    }
  }
};

export default accountModule;
