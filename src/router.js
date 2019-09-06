import Vue from "vue";
import Router from "vue-router";
import VueMeta from "vue-meta";

Vue.use(VueMeta, {
  keyName: "metaInfo",
  attribute: "data-vue-meta",
  tagIDKeyName: "vmid",
  refreshOnceOnNavigation: true
});

Vue.use(Router);

export default new Router({
  mode: "history",
  base: "/",
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: "/",
      name: "discover",
      component: () =>
        import(/* webpackChunkName: "discover" */ "./views/Discover.vue")
    },
    {
      path: "/dine-oppskrifter",
      name: "yourRecipes",
      component: () =>
        import(/* webpackChunkName: "yourRecipes" */ "./views/YourRecipes.vue")
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
      path: "/oppskrift/:id",
      name: "recipe",
      component: () =>
        import(/* webpackChunkName: "recipe" */ "./views/Recipe.vue")
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
      path: "/konto",
      name: "account",
      component: () =>
        import(/* webpackChunkName: "account" */ "./views/Account.vue")
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
    },
    {
      path: "*",
      name: "404NotFound",
      component: () =>
        import(/* webpackChunkName: "404NotFound" */ "./views/404NotFound.vue")
    }
  ]
});
