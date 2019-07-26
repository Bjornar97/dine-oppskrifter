import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "discover",
      component: Discover
    },
    {
      path: "/ny",
      name: "newRecipe",
      component: () =>
        import(/* webpackChunkName: "newRecipe" */ "./views/NewRecipe.vue")
    }
  ]
});
