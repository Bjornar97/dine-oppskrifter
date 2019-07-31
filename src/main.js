import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import * as firebase from "firebase/app";
import VueCookies from "vue-cookies";

Vue.config.productionTip = false;

import * as config from "@/firebaseConfig.js";
firebase.initializeApp(config.firebaseConfig);

Vue.use(VueCookies);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#mainApp");
