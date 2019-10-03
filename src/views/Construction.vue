<template>
  <div id="main">
    <v-container class="construction">
      <img
        class="constructionImage"
        src="@/assets/undraw_under_construction_46pa.svg"
        alt="Under kontruksjon"
      />
      <h3 :class="mediumSize ? 'headline ma-0': 'display-2 ma-8'">
        <span class="primary--text">Dine</span> Oppskrifter er under konstruksjon
      </h3>
      <p class="constuctionText">
        Når
        <span class="primary--text">Dine</span> Oppskrifter er ferdig vil du kunne lage oppskrifter, se oppskrifter og dele oppskrifter
      </p>
      <v-btn color="primary mb-6" @click="toReadMore">Les mer</v-btn>
      <p
        class="constructionText"
        v-if="isIngredientsTool"
      >I mellomtiden kan du bruke verktøyet for å regne ut ingredienser under</p>
      <v-btn color="secondary" @click="toIngredients">Ingredienskalkulator</v-btn>
    </v-container>

    <v-parallax
      dark
      src="@/assets/ingredientBackground.jpg"
      :height="mediumSize ? '1000': '750' "
      class="mt-8 mb-0 black--text"
    >
      <v-sheet id="readMore" class="pa-6" color="white" elevation="2">
        <v-layout :column="mediumSize" align-center justify-center>
          <v-container class="about mr-6">
            <h5 class="headline ml-0 pl-0 font-weight-medium">
              Om
              <span class="primary--text">Dine</span> Oppskrifter
            </h5>
            <p class="body-1">
              Målet med
              <span class="primary--text text--darken-1">Dine</span> Oppskrifter er å ha en samleplass for oppskrifter,
              hvor hvem som helst kan legge ut oppskrifter, og velge hva de vil gjøre med dem.
              Vi ønsker å gjøre det så enkelt som mulig å lage oppskrifter, og enkelt å finne nye oppskrifter fra andre personer.
            </p>
            <h6 class="subtitle-1">Dette skal du kunne gjøre når nettsiden er ferdig:</h6>
          </v-container>
          <feature-list></feature-list>
        </v-layout>
      </v-sheet>
    </v-parallax>

    <ingredients-calculator class="Ingredients"></ingredients-calculator>
  </div>
</template>

<script>
import ingredientsCalculator from "@/components/IngredientsCalculator.vue";
import FeatureList from "@/components/FeatureList.vue";

export default {
  name: "Construction",
  components: {
    "ingredients-calculator": ingredientsCalculator,
    "feature-list": FeatureList
  },
  data() {
    return {};
  },
  computed: {
    isIngredientsTool() {
      return this.$store.state.featuresModule.ingredients;
    },
    mediumSize() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    smallSize() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  },
  methods: {
    toIngredients() {
      let ingredients = document.getElementById("ingredientsContainer");
      this.$vuetify.goTo(ingredients, {
        duration: 600,
        offset: -100,
        easing: "easeInOutCubic"
      });

      if (window.scrollY === undefined) {
        ingredients.scrollIntoView(true);
      }
    },
    toReadMore() {
      let offset = 100;
      if (this.mediumSize) {
        offset = 0;
      }
      let readMore = document.getElementById("readMore");
      this.$vuetify.goTo(readMore, {
        duration: 400,
        offset: offset,
        easing: "easeInOutCubic"
      });

      if (window.scrollY === undefined) {
        readMore.scrollIntoView(true);
      }
    }
  },
  created() {}
};
</script>

<style lang="scss" scoped>
.construction {
  min-height: 100vh;
}

.about {
  color: #000;
}

#readMore {
  text-align: left;
  max-width: 1000px;
  align-self: center;
}

.featureList {
  min-width: 350px;
}
.constructionImage {
  width: 80%;
  max-width: 800px;
}

.headline {
  margin: 20px;
  padding: 20px;
}
</style>