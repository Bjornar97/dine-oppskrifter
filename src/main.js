import Vue from "vue";

import * as firebase from "firebase/app";
import "firebase/performance";

import * as config from "@/firebaseConfig.js";
firebase.initializeApp(config.firebaseConfig);

const perf = firebase.performance();

import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import VueCookies from "vue-cookies";

Vue.config.productionTip = false;

Vue.use(VueCookies);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#mainApp");
