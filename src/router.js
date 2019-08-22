import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: "/",
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
      path: "/endre-oppskrift/:recipeId",
      name: "editRecipe",
      component: () =>
        import(/* webpackChunkName: "editRecipe" */ "./views/NewRecipe.vue")
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
      beforeEnter(to, from, next) {
        console.log(`Came from ${from.name} and going to ${to.name}`);
        next();
      },
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
