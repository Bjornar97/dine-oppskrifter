import Vue from "vue";

import * as firebase from "firebase/app";
import "firebase/performance";
import "firebase/functions";
import "firebase/analytics";

import * as config from "@/firebaseConfig.js";
firebase.initializeApp(config.firebaseConfig);

var db = firebase.firestore();
var functions = firebase.functions();
// if (location.hostname === "localhost") {
//   console.log("This is localhost");
//   // Note that the Firebase Web SDK must connect to the WebChannel port
//   db.settings({
//     host: "localhost:5025",
//     ssl: false
//   });

//   console.log("Using localhost functions emulator");
//   functions.useFunctionsEmulator("http://localhost:5001");
// }

import "firebase/firestore";

const perf = firebase.performance();
firebase.analytics();
import "isomorphic-fetch";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import "./registerServiceWorker";
import vuetify from "./plugins/vuetify";
import VueCookies from "vue-cookies";
import VueClipboard from "vue-clipboard2";

Vue.use(VueClipboard);

Vue.config.productionTip = false;

Vue.use(VueCookies);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#mainApp");
