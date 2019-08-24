const currentRecipeModule = {
  state: {
    recipe: {
      recipeId: undefined,
      imagePath: undefined,
      title: "",
      description: "",
      status: "",
      imageCompressed: undefined,
      category: "",
      portions: "",
      totalTime: "",
      ingredients: [],
      steps: [],
      visibility: "Private"
    },
    recipeStepNumber: 1,
    newRecipe: null,
    lastSaveTime: undefined,
    prevStep: 1,
    activeStep: 1,
    visitedSteps: [undefined, false, false, false],
    originalImage: undefined
  },
  mutations: {
    setRecipeId(state, recipeId) {
      state.recipe.recipeId = recipeId;
    },
    setRecipeNew(state, newValue) {
      state.newRecipe = newValue;
    },
    setRecipeImagePath(state, imagePath) {
      state.recipe.imagePath = imagePath;
    },
    setRecipeTitle(state, title) {
      state.recipe.title = title;
    },
    setRecipeDescription(state, description) {
      state.recipe.description = description;
    },
    setRecipeStatus(state, status) {
      state.recipe.status = status;
    },
    setRecipeImage(state, image) {
      state.recipe.imageCompressed = image;
    },
    setRecipeOriginalImage(state, image) {
      state.originalImage = image;
    },
    removeRecipeImage(state) {
      state.recipe.imageCompressed = undefined;
    },
    setRecipeCategory(state, category) {
      state.recipe.category = category;
    },
    setRecipePortions(state, portions) {
      state.recipe.portions = portions;
    },
    setRecipeTotalTime(state, time) {
      state.recipe.totalTime = time;
    },
    setRecipeVisibility(state, visibility) {
      state.recipe.visibility = visibility;
    },
    setRecipeIngredients(state, ingredients) {
      state.recipe.ingredients = ingredients;
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
    setRecipeSteps(state, steps) {
      state.recipe.steps = steps;
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
    saveTime(state) {
      state.lastSaveTime = Date.now();
    },
    resetRecipe(state) {
      state.recipe = {
        recipeId: undefined,
        imagePath: undefined,
        title: "",
        description: "",
        imageCompressed: undefined,
        category: "",
        portions: "",
        ingredients: [],
        steps: [],
        visibility: "Private"
      };
    },
    resetSettings(state) {
      console.log("Resetting settings");
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
    },
    editRecipe({ _, commit }, data) {
      console.log("VueX currentRecipeModule: Editing recipe");
      commit("setRecipeTitle", data.title);
      commit("setRecipeDescription", data.description);
      commit("setRecipeStatus", data.status);
      commit("setRecipeIngredients", data.ingredients);
      commit("setRecipeSteps", data.steps);
      commit("setRecipeVisibility", data.visibility);
      commit("setRecipePortions", data.portions);
      commit("setRecipeCategory", data.category);
    },
    saveNewRecipe({ state, commit, dispatch }) {
      dispatch("deleteRecipe");
    },
    saveEditedRecipe({ state, commit, dispatch }) {
      dispatch("deleteRecipe");
    }
  }
};

export default currentRecipeModule;
