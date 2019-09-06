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
      sortBy: "Tid",
      open: false
    },
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
    retrieveRecipes({ state, commit }) {
      commit("startLoading");
      let filter = state.filter;
      console.log("Retrieving recipes");
      let db = firebase.firestore();
      let ref = db
        .collection("recipes")
        .where("status", "==", "published")
        .where("visibility", "==", "Public");

      console.log("Made initial query");
      let sort = "dateCreated";
      let direction = "asc";

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
        // TODO: Change to favourites
        sort = "totalTime";
        direction = "desc";
      }

      console.log(`Found sorting. Sort: ${sort}, Direction: ${direction}`);

      if (
        filter.category == "" &&
        filter.difficulty == "" &&
        filter.timeFrom == "" &&
        filter.timeTo == ""
      ) {
        console.log("No filter activated");
        ref
          .orderBy(sort, direction)
          .limit(15)
          .get()
          .then(snapshot => {
            state.recipes = [];
            console.log("Got snapshot");
            console.dir(snapshot);
            snapshot.forEach(doc => {
              console.log("Got a doc:");
              console.dir(doc.data());
              state.recipes.push({ ...doc.data(), id: doc.id });
              console.log(new Date(doc.data().dateCreated).toString());
            });
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
        console.log("Filter is activated");
        if (filter.category) {
          ref = ref.where("category", "==", filter.category);
        }

        if (filter.difficulty) {
          ref = ref.where("difficulty", "==", filter.difficulty);
        }

        if (filter.timeFrom || filter.timeTo) {
          if (!filter.timeFrom) filter.timeFrom = 0;
          else filter.timeFrom = parseInt(filter.timeFrom);
          if (!filter.timeTo) filter.timeTo = 999;
          else filter.timeTo = parseInt(filter.timeTo);

          ref = ref
            .where("totalTime", "<=", filter.timeTo)
            .where("totalTime", ">=", filter.timeFrom);
        }

        ref
          .orderBy(sort, direction)
          .limit(15)
          .get()
          .then(snapshot => {
            state.recipes = [];
            console.log("Got snapshot");
            console.dir(snapshot);
            snapshot.forEach(doc => {
              console.log("Got a doc:");
              console.dir(doc.data());
              state.recipes.push({ ...doc.data(), id: doc.id });
              console.log(new Date(doc.data().dateCreated).toString());
            });
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
      }
    }
  }
};

export default recipesModule;
