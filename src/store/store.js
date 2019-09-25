import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

// Modules from modules folder
import accountModule from "./modules/accountModule";
import featuresModule from "./modules/featuresModule";
import currentRecipeModule from "./modules/currentRecipeModule";
import recipesModule from "./modules/recipesModule";
import feedbackModule from "./modules/feedbackModule";

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
    acceptedTerms: state.acceptedTerms,
    feedbackModule: state.feedbackModule
  })
});

export default new Vuex.Store({
  modules: {
    accountModule,
    featuresModule,
    currentRecipeModule,
    recipesModule,
    feedbackModule
  },
  plugins: [vuexLocal.plugin],
  state: {
    underConstruction: false,
    loading: true,
    onLine: navigator.onLine,
    showBackOnline: false,
    hideOldBrowserWarning: false,
    acceptedTerms: false,
    showTerms: false,
    currentTitle: "Utforsk",
    multiTabs: false,
    persistence: false
  },
  mutations: {
    acceptTerms(state) {
      state.acceptedTerms = true;
    },
    multiTabs(state) {
      state.multiTabs = true;
    },
    noMultiTabs(state) {
      state.multiTabs = false;
    },
    persistenceOn(state) {
      state.persistence = true;
    },
    persistenceOff(state) {
      state.persistence = false;
    },
    setShowTerms(state, v) {
      state.showTerms = v;
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
