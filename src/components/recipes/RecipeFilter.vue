<template>
  <v-expansion-panels class="recipeFilter" v-model="expanded" popout>
    <v-expansion-panel>
      <v-expansion-panel-header>
        Filter
        <template v-slot:actions>
          <v-icon color="primary">$vuetify.icons.expand</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div id="filter">
          <v-select
            v-model="categorySelected"
            :items="categoriesList"
            clearable
            :menu-props="{offsetY: true, closeOnClick: true}"
            label="Kategori"
          ></v-select>
          <v-select
            clearable
            :items="difficultyList"
            v-model="difficultySelected"
            :menu-props="{offsetY: true, closeOnClick: true}"
            label="Vanskelighetsgrad"
          ></v-select>
          <v-divider class="mb-2"></v-divider>
          <p class="body-2 font-weight-light mb-0 text-left">Tid det tar å lage</p>
          <div class="mx-0 d-flex">
            <v-text-field
              :rules="[rules.onlyNumber]"
              name="timeFrom"
              clearable
              label="Fra"
              class="mr-2"
              v-model="filterTimeFrom"
              counter="3"
            ></v-text-field>
            <v-text-field
              :rules="[rules.onlyNumber]"
              counter="3"
              clearable
              class="ml-2"
              name="timeTo"
              label="Til"
              v-model="filterTimeTo"
            ></v-text-field>
          </div>
          <v-divider class="my-2"></v-divider>
          <v-select
            :items="sortByList"
            :menu-props="{offsetY: true, closeOnClick: true}"
            v-model="sortBySelected"
            label="Sorter etter"
          ></v-select>
          <v-btn color="primary" :loading="recipesLoading" @click="applyFilter">Filtrer</v-btn>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "recipe-filter",
  data() {
    return {
      filterLoading: false,
      categoriesList: [
        "Frokost",
        "Lunch",
        "Middag",
        "Tilbehør",
        "Bakverk",
        "Småretter",
        "Dessert"
      ],
      difficultyList: ["Enkel", "Middels", "Vanskelig"],
      filterTotalTimeList: [
        "Under 20 min",
        "20-40 min",
        "40-60 min",
        "60-90 min",
        "Over 90 min"
      ],
      sortByList: [
        "Mest Likt",
        "Nyeste først",
        "Eldste først",
        "Kortest Tid",
        "Lengst Tid"
      ],
      filterError: false,
      rules: {
        onlyNumber: v =>
          !isNaN(v) || "Må være et tall, bruk punktum i stedet for komma"
      }
    };
  },
  computed: {
    expanded: {
      get() {
        return this.$store.state.recipesModule.filter.open;
      },
      set(v) {
        this.$store.commit("setFilterOpen", v);
      }
    },
    recipesLoading() {
      return this.$store.state.loading;
    },
    categorySelected: {
      get() {
        return this.$store.state.recipesModule.filter.category;
      },
      set(v) {
        this.$store.commit("setCategory", v);
      }
    },
    difficultySelected: {
      get() {
        return this.$store.state.recipesModule.filter.difficulty;
      },
      set(v) {
        this.$store.commit("setDifficulty", v);
      }
    },
    filterTimeFrom: {
      get() {
        return this.$store.state.recipesModule.filter.timeFrom;
      },
      set(v) {
        this.$store.commit("setFilterTimeFrom", v);
      }
    },
    filterTimeTo: {
      get() {
        return this.$store.state.recipesModule.filter.timeTo;
      },
      set(v) {
        this.$store.commit("setFilterTimeTo", v);
      }
    },
    sortBySelected: {
      get() {
        return this.$store.state.recipesModule.filter.sortBy;
      },
      set(v) {
        this.$store.commit("setSortBy", v);
      }
    }
  },
  methods: {
    applyFilter() {
      this.$store.dispatch("retrieveRecipes");
    }
  },
  watch: {
    expanded(newValue, oldValue) {
      if (oldValue == 0 && newValue == undefined) {
        this.applyFilter();
      }
    },
    filterTimeFrom(newValue, oldValue) {
      if (
        (newValue == "" || newValue == null) &&
        (this.filterTimeTo == "" || this.filterTimeTo == null)
      ) {
        this.sortByList = [
          "Mest Likt",
          "Nyeste først",
          "Eldste først",
          "På vei opp",
          "Kortest Tid",
          "Lengst Tid"
        ];
      } else {
        this.sortByList = ["Kortest Tid", "Lengst Tid"];
        if (
          this.sortBySelected != "Kortest Tid" &&
          this.sortBySelected != "Lengst Tid"
        ) {
          this.sortBySelected = "Kortest Tid";
        }
      }
    },
    filterTimeTo(newValue, oldValue) {
      if (
        (newValue == "" || newValue == null) &&
        (this.filterTimeFrom == "" || this.filterTimeFrom == null)
      ) {
        this.sortByList = [
          "Mest Likt",
          "Nyeste først",
          "Eldste først",
          "På vei opp",
          "Kortest Tid",
          "Lengst Tid"
        ];
      } else {
        this.sortByList = ["Kortest Tid", "Lengst Tid"];
        if (
          this.sortBySelected != "Kortest Tid" &&
          this.sortBySelected != "Lengst Tid"
        ) {
          this.sortBySelected = "Kortest Tid";
        }
      }
    }
  },
  created() {
    // Sets the sorting options based on if timeTo and timeFrom is set or not
    if (
      (this.filterTimeFrom == "" || this.filterTimeFrom == null) &&
      (this.filterTimeTo == "" || this.filterTimeTo == null)
    ) {
      this.sortByList = [
        "Mest Likt",
        "Nyeste først",
        "Eldste først",
        "På vei opp",
        "Kortest Tid",
        "Lengst Tid"
      ];
    } else {
      this.sortByList = ["Kortest Tid", "Lengst Tid"];
      if (
        this.sortBySelected != "Kortest Tid" &&
        this.sortBySelected != "Lengst Tid"
      ) {
        this.sortBySelected = "Kortest Tid";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>