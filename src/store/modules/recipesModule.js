import * as firebase from "firebase/app"; // Required for side-effects
import "firebase/firestore";

const recipesModule = {
  state: {
    recipes: [],
    filter: {
      category: "",
      difficulty: "",
      timeFrom: "",
      timeTo: "",
      sortBy: "Mest Likt",
      open: false
    },
    sort: "",
    sortDirection: "",
    lastFilterDate: null,
    limit: 15,
    lastDoc: null,
    end: true,
    error: false,
    ref: undefined,
    loading: false
  },
  mutations: {
    openFilter(state) {
      state.filter.open = true;
    },
    closeFilter(state) {
      state.filter.open = false;
    },
    setFilterOpen(state, value) {
      state.filter.open = value;
    },
    setCategory(state, category) {
      state.filter.category = category;
    },
    setDifficulty(state, difficulty) {
      state.filter.difficulty = difficulty;
    },
    setFilterTimeFrom(state, timeFrom) {
      state.filter.timeFrom = timeFrom;
    },
    setFilterTimeTo(state, timeTo) {
      state.filter.timeTo = timeTo;
    },
    setSortBy(state, sortBy) {
      state.filter.sortBy = sortBy;
    },
    startRecipeLoading(state) {
      state.loading = true;
    },
    stopRecipeLoading(state) {
      state.loading = false;
    },
    setFilterDate(state) {
      state.lastFilterDate = Date.now();
    },
    getRecipeSorting(state) {
      let sort = "dateCreated";
      let direction = "asc";
      let filter = state.filter;

      if (filter.sortBy == "Lengst Tid") {
        sort = "totalTime";
        direction = "desc";
      } else if (filter.sortBy == "Kortest Tid") {
        sort = "totalTime";
        direction = "asc";
      } else if (filter.sortBy == "Nyeste først") {
        sort = "dateCreated";
        direction = "desc";
      } else if (filter.sortBy == "Eldste først") {
        sort = "dateCreated";
        direction = "asc";
      } else if (filter.sortBy == "Mest Likt") {
        sort = "favourites";
        direction = "desc";
      }
      state.sort = sort;
      state.sortDirection = direction;
    }
  },
  actions: {
    setFilter({ state, commit, dispatch }, filter) {
      //commit("startRecipeLoading");
      commit("setCategory", filter.category);
      commit("setDifficulties", filter.difficulties);
      commit("setTime", filter.time);
      commit("setSortBy", filter.sortBy);
      dispatch("retrieveRecipes");
      //commit("stopRecipeLoading");
    },
    clearFilter({ state, commit }) {
      state.filter = {
        category: "",
        difficulty: "",
        timeFrom: "",
        timeTo: "",
        sortBy: "Mest Likt",
        open: state.filter.open
      };
    },
    retrieveRecipes({ state, commit }) {
      commit("startLoading");
      commit("setFilterDate");
      let filter = state.filter;
      let db = firebase.firestore();
      state.ref = db
        .collection("recipes")
        .where("status", "==", "published")
        .where("visibility", "==", "Public");

      commit("getRecipeSorting");

      let sort = state.sort;
      let direction = state.sortDirection;

      if (
        filter.category == "" &&
        filter.difficulty == "" &&
        filter.timeFrom == "" &&
        filter.timeTo == ""
      ) {
        state.ref
          .orderBy(sort, direction)
          .limit(state.limit)
          .get()
          .then(snapshot => {
            state.recipes = [];
            snapshot.forEach(doc => {
              state.recipes.push({ ...doc.data(), id: doc.id });
            });
            state.lastDoc = snapshot.docs[snapshot.docs.length - 1];

            if (snapshot.docs.length < state.limit) {
              state.end = true;
            } else {
              state.end = false;
            }
            state.error = false;
            filter.open = false;
            commit("stopLoading");
          })
          .catch(error => {
            console.log("An error occured");
            console.dir(error);
            state.error = true;
            commit("stopLoading");
          });
      } else {
        if (filter.category) {
          state.ref = state.ref.where("category", "==", filter.category);
        }

        if (filter.difficulty) {
          state.ref = state.ref.where("difficulty", "==", filter.difficulty);
        }

        if (filter.timeFrom || filter.timeTo) {
          if (!filter.timeFrom) filter.timeFrom = 0;
          else filter.timeFrom = parseInt(filter.timeFrom);
          if (!filter.timeTo) filter.timeTo = 999;
          else filter.timeTo = parseInt(filter.timeTo);

          state.ref = state.ref
            .where("totalTime", "<=", filter.timeTo)
            .where("totalTime", ">=", filter.timeFrom);
        }
        // ref = ref.orderBy(sort, direction);
        state.ref
          .orderBy(sort, direction)
          .limit(state.limit)
          .get()
          .then(snapshot => {
            state.recipes = [];
            snapshot.forEach(doc => {
              state.recipes.push({ ...doc.data(), id: doc.id });
            });
            state.error = false;
            filter.open = false;
            state.lastDoc = snapshot.docs[snapshot.docs.length - 1];

            if (snapshot.docs.length < state.limit) {
              state.end = true;
            } else {
              state.end = false;
            }
            commit("stopLoading");
          })
          .catch(error => {
            console.log("An error occured");
            console.dir(error);
            state.error = true;
            commit("stopLoading");
          });
      }
    },
    getNextRecipeBatch({ state, commit }) {
      commit("startLoading");
      if (state.lastDoc != null) {
        state.ref
          .limit(state.limit)
          .orderBy(state.sort, state.sortDirection)
          .startAfter(state.lastDoc)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              if (state.recipes[0].id != doc.id) {
                state.recipes.push({ ...doc.data(), id: doc.id });
              }
            });
            if (snapshot.docs.length < state.limit) {
              state.end = true;
            } else {
              state.end = false;
            }
            state.lastDoc = snapshot.docs[snapshot.docs.length - 1];
            commit("stopLoading");
          })
          .catch(error => {
            console.log("An error occured");
            console.dir(error);
            state.error = true;
            commit("stopLoading");
          });
      }
    }
  }
};

export default recipesModule;
