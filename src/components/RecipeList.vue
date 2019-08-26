<template>
  <div>
    <h2 class="headline secondary--text">Finn Oppskrifter</h2>
    <v-expansion-panels class="recipeFilter mx-auto" v-model="expanded" popout>
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
              v-model="categoriesSelected"
              :items="categoriesList"
              chips
              label="Kategori"
              multiple
            ></v-select>
            <v-select
              :items="difficultyList"
              v-model="difficultySelected"
              multiple
              chips
              label="Vanskelighetsgrad"
            ></v-select>
            <v-select
              :items="filterTotalTimeList"
              multiple
              chips
              v-model="filterTotalTimeSelected"
              label="Tid"
            ></v-select>
            <v-select :items="sortByList" v-model="sortBySelected" label="Sorter etter"></v-select>
            <v-btn color="primary" :loading="filterLoading" @click="applyFilter">Filtrer</v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <div id="recipeList">
      <h4
        class="subtitle-2"
        v-if="recipes.length == 0"
      >Det finnes dessverre ingen oppskrifter med dette filteret enda</h4>
      <v-card
        v-for="recipe in recipes"
        :key="recipe.id"
        class="mx-auto recipeCard"
        :to="`/oppskrift/${recipe.id}`"
      >
        <v-img class="white--text" height="150px" src="@/assets/BakingPhoto.jpg"></v-img>
        <v-card-title>{{recipe.title}}</v-card-title>

        <v-card-text>{{recipe.description}}</v-card-text>
        <v-card-actions @click.prevent>
          <v-tooltip v-model="recipe.showLikeTooltip" v-if="loggedIn" bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon color="secondary lighten-1">mdi-heart-outline</v-icon>
                <span class="ml-1">{{recipe.likes}}</span>
              </v-btn>
            </template>
            <span>Du må være logget inn for å favorisere en oppskrift</span>
          </v-tooltip>
          <v-btn icon v-else>
            <v-icon
              @click="like(recipe)"
              color="secondary lighten-1 mr-1"
            >{{ recipe.liked ? 'mdi-heart': 'mdi-heart-outline' }}</v-icon>
            <span class>{{recipe.likes}}</span>
          </v-btn>
          <div class="recipeInfo">
            <div class="text-center">
              <v-icon color="info">mdi-clock-outline</v-icon>
              <p>ca. {{recipe.totalTime}} min</p>
            </div>
            <div class="text-center">
              <v-icon color="accent">mdi-chef-hat</v-icon>
              <p>{{recipe.difficulty}}</p>
            </div>
            <div class="text-center tools">
              <v-icon color="info" v-if="recipe.tools.includes('grill')">mdi-grill</v-icon>
              <img
                src="@/assets/oven/OverUnderVarme.svg"
                v-if="recipe.tools.includes('overUnderVarme')"
              />
              <img src="@/assets/oven/OverVarme.svg" v-if="recipe.tools.includes('overVarme')" />
              <img src="@/assets/oven/UnderVarme.svg" v-if="recipe.tools.includes('underVarme')" />
              <img src="@/assets/oven/VarmLuft.svg" v-if="recipe.tools.includes('varmLuft')" />
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "recipe-list",
  data() {
    return {
      expanded: [],
      filterLoading: false,
      categoriesList: [
        "Frokost",
        "Lunch",
        "Middag",
        "Tilbehør",
        "Småretter",
        "Dessert"
      ],
      categoriesSelected: [],
      difficultyList: ["Enkel", "Middels", "Vanskelig"],
      difficultySelected: [],
      filterTotalTimeList: [
        "Under 20 min",
        "20-40 min",
        "40-60 min",
        "60-90 min",
        "Over 90 min"
      ],
      filterTotalTimeSelected: [],
      sortByList: ["Mest Likt", "Nyeste først", "Eldste først", "På vei opp"],
      sortBySelected: "Mest Likt",
      filterError: false,
      recipes: [
        {
          id: 0,
          title:
            "Ad non consequat nulla est ut consectetur dolor commodo ea mollit quis.",
          description:
            "Magna nulla cupidatat dolore excepteur. Officia commodo anim aliqua ipsum dolor aute nulla sunt. Occaecat officia sint minim aliqua minim magna adipisicing excepteur magna proident fugiat commodo. Id tempor esse quis esse sit fugiat aute consectetur aliquip veniam sit quis id commodo.",
          totalTime: 50,
          difficulty: "Middels",
          tools: [
            "grill",
            "overUnderVarme",
            "overVarme",
            "underVarme",
            "varmLuft"
          ],
          likes: 49,
          liked: false,
          showLikeTooltip: false
        }
      ]
    };
  },
  methods: {
    applyFilter() {
      this.filterLoading = true;
      try {
        // TODO: Fetch from firebase with the new filter
        setTimeout(() => {
          this.filterLoading = false;
          this.expanded = [];
        }, 1000);
      } catch (error) {
        this.filterLoading = false;
      }
    },
    like(recipe) {
      if (this.loggedIn) {
        return;
      }

      if (recipe.liked) {
        // TODO: Remove like from firebase
        recipe.liked = false;
        recipe.likes--;
      } else {
        // TODO: Send a like to firebase
        recipe.liked = true;
        recipe.likes++;
      }
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  text-align: left;
}

h2,
h3 {
  margin: 10px;
}

#filter {
  display: flex;
  flex-direction: column;
}

#recipeList {
  margin-top: 20px;

  .recipeInfo {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-flow: row-reverse;
    flex-wrap: wrap;

    div {
      margin: 0 10px;
    }

    .tools {
      flex-basis: 100%;
      display: flex;
      flex-flow: row-reverse;
      justify-content: right;

      img,
      v-icon {
        margin: 0 5px;
      }
      img {
        max-width: 24px;
        max-height: 24px;
      }
    }
  }

  .recipeCard {
    max-width: 300px;
  }
}

.recipeFilter {
  max-width: 350px !important;
}
</style>