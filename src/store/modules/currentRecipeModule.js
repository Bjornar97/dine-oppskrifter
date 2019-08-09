const currentRecipeModule = {
  state: {
    recipe: {
      title: "",
      description: "",
      category: "",
      portions: "",
      ingredients: [],
      steps: [],
      visibility: "Private"
    },
    recipeStepNumber: 1,
    lastSaveTime: undefined,
    prevStep: 1,
    activeStep: 1,
    visitedSteps: [undefined, false, false, false]
  },
  mutations: {
    setRecipeTitle(state, title) {
      state.recipe.title = title;
    },
    setRecipeDescription(state, description) {
      state.recipe.description = description;
    },
    setRecipeCategory(state, category) {
      state.recipe.category = category;
    },
    setRecipePortions(state, portions) {
      state.recipe.portions = portions;
    },
    setRecipeVisibility(state, visibility) {
      state.recipe.visibility = visibility;
    },
    addRecipeIngredient(state, ingredient) {
      state.recipe.ingredients.push(ingredient);
    },
    editRecipeIngredient(state, { index, ingredient }) {
      state.recipe.ingredients.splice(index, 1, ingredient);
    },
    removeRecipeIngredient(state, index) {
      state.recipe.ingredients.splice(index, 1);
    },
    addRecipeStep(state, step) {
      state.recipe.steps.push(step);
    },
    editRecipeStep(state, { index, step }) {
      state.recipe.steps.splice(index, 1, step);
    },
    removeRecipeStep(state, index) {
      state.recipe.steps.splice(index, 1);
    },
    setActiveStep(state, newStep) {
      state.activeStep = newStep;
    },
    setPrevStep(state, prevStep) {
      state.prevStep = prevStep;
    },
    incrementStep(state) {
      if (state.activeStep <= 3) {
        state.activeStep++;
      }
    },
    setRecipeStep(state, newStep) {
      state.recipeStepNumber = newStep;
    },
    visitStep(state, recipeStepNumber) {
      state.visitedSteps[recipeStepNumber] = true;
    },
    saveRecipe(state) {
      state.lastSaveTime = Date.now();
    },
    resetRecipe(state) {
      state.recipe = {
        title: "",
        description: "",
        category: "",
        portions: "",
        ingredients: [],
        steps: []
      };
    },
    resetSettings(state) {
      state.recipeStepNumber = 1;
      state.lastSaveTime = undefined;
      state.prevStep = 1;
      state.activeStep = 1;
      state.visitedSteps = [undefined, false, false, false];
    }
  },
  actions: {
    nextRecipeSection({ _, commit }) {
      commit("incrementStep");
    },
    switchStep({ _, commit }, newStep) {
      commit("setActiveStep", newStep);
    },
    deleteRecipe({ _, commit }) {
      commit("resetRecipe");
      commit("resetSettings");
    }
  }
};

export default currentRecipeModule;
