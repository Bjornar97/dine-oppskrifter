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
      component: () =>
        import(/* webpackChunkName: "discover" */ "./views/Discover.vue")
    },
    {
      path: "/ny-oppskrift",
      name: "newRecipe",
      component: () =>
        import(/* webpackChunkName: "newRecipe" */ "./views/NewRecipe.vue")
    },
    {
      path: "/ingrediens-kalkulator",
      name: "ingredientsCalculator",
      component: () =>
        import(
          /* webpackChunkName: "ingredientsCalculator" */ "./components/IngredientsCalculator.vue"
        )
    },
    {
      path: "/personvern-erklaering",
      name: "privacyPolicy",
      component: () =>
        import(
          /* webpackChunkName: "privacyPolicy" */ "./views/PrivacyPolicy.vue"
        )
    },
    {
      path: "/vilkaar-for-bruk",
      name: "termsOfService",
      component: () =>
        import(
          /* webpackChunkName: "termsOfService" */ "./views/TermsOfService.vue"
        )
    }
  ]
});
