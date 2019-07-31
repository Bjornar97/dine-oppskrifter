import Vue from "vue";
import Vuex from "vuex";

// Modules from modules folder
import accountModule from "./modules/accountModule";
import featuresModule from "./modules/featuresModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    accountModule,
    featuresModule
  },
  state: {
    underConstruction: true,
    loading: true,
    hideOldBrowserWarning: false,
    acceptedCookies: null,
    currentTitle: "Utforsk",
    showWelcome: null
  },
  getters: {
    getCurrentTitle(state) {
      return state.currentTitle;
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
    },
    hideBrowserWarning(state) {
      state.hideOldBrowserWarning = true;
    }
  },
  actions: {}
});
