import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

// Modules from modules folder
import accountModule from "./modules/accountModule";
import featuresModule from "./modules/featuresModule";
import currentRecipeModule from "./modules/currentRecipeModule";

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({
    accountModule: {
      loggedIn: state.accountModule.loggedIn,
      name: state.accountModule.name,
      email: state.accountModule.email,
      uid: state.accountModule.uid,
      profilePictureUrl: state.accountModule.profilePictureUrl,
      facebookAccessToken: state.accountModule.facebookAccessToken
    },
    currentRecipeModule: state.currentRecipeModule,
    hideBrowserWarning: state.hideOldBrowserWarning,
    acceptCookies: state.acceptedCookies
  })
});

export default new Vuex.Store({
  modules: {
    accountModule,
    featuresModule,
    currentRecipeModule
  },
  plugins: [vuexLocal.plugin],
  state: {
    underConstruction: false,
    loading: true,
    onLine: navigator.onLine,
    showBackOnline: false,
    hideOldBrowserWarning: false,
    acceptedCookies: null,
    closedCookies: false,
    currentTitle: "Utforsk"
  },
  mutations: {
    acceptCookies(state) {
      state.acceptedCookies = true;
    },
    denyCookies(state) {
      state.acceptedCookies = false;
    },
    closeCookies(state) {
      state.closedCookies = true;
    },
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    },
    setOnLineStatus(state, v) {
      state.onLine = v;
      if (v) {
        state.showBackOnline = true;
        setTimeout(() => {
          state.showBackOnline = false;
        }, 4000);
      }
    },
    hideBrowserWarning(state) {
      state.hideOldBrowserWarning = true;
    }
  },
  actions: {}
});
