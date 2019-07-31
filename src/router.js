import Vue from "vue";
import Router from "vue-router";
import Discover from "./views/Discover.vue";
import Construction from "./views/Construction.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "discover",
      component: Construction
    },
    {
      path: "/ny",
      name: "newRecipe",
      component: () =>
        import(/* webpackChunkName: "newRecipe" */ "./views/NewRecipe.vue")
    }
  ]
});
