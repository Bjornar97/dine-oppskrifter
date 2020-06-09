<template>
  <div class="welcomeContainer mx-auto">
    <div class="text-left welcomeText pa-4">
      <h3 class="subtitle-1 welcomeToText">Velkommen til</h3>
      <h2 class="display-2 yourRecipes">
        <span class="primary--text mr-1">Dine</span> Oppskrifter
      </h2>
      <h4 class="subtitle-1 mt-10 mb-4 allFunctionsText">For å få alle funksjoner</h4>
      <facebook-login-button class="facebookButton" loginText="Fortsett"></facebook-login-button>
    </div>
    <div class="pa-2 pa-sm-4 featureBox">
      <h4 class="title mb-2 ml-3 secondary--text text-left">Funksjoner</h4>
      <feature-list class="featureList"></feature-list>
    </div>
    <div class="scrollDownArrow mx-auto">
      <p class="subtitle-1 mb-0">Bla ned for å se oppskrifter</p>
      <v-icon x-large class="scrollArrow">mdi-chevron-down</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "welcome-screen",
  data() {
    return {
      showText: false
    };
  },
  computed: {
    isRecipeListFeature() {
      return this.$store.state.featuresModule.recipeList;
    }
  },
  components: {
    "feature-list": () => import("@/components/FeatureList"),
    "facebook-login-button": () => import("@/components/FacebookLoginButton")
  },
  methods: {
    displayText() {
      this.showText = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.welcomeContainer {
  padding: 0;
  min-height: calc(100vh - 100px);
}

.welcomeText {
  min-height: 40vh;
  position: relative;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.scrollArrow {
  height: 50px;
  animation-name: arrow-animation;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-delay: 3.5s;
  animation-duration: 1.5s;
  animation-timing-function: ease-in-out;
}

@keyframes arrow-animation {
  0% {
    height: 50px;
    margin-top: 0;
  }
  25% {
    height: 50px;
    margin-top: 0;
  }
  100% {
    height: 30px;
    margin-top: 20px;
  }
}

.scrollDownArrow {
  min-width: 300px;
  width: max-content;
}

.featureBox {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@supports (display: grid) {
  .welcomeContainer {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas:
      "welcomeText"
      "features"
      "scrollArrow";
  }

  .welcomeText {
    grid-area: welcomeText;
  }

  .scrollDownArrow {
    grid-area: scrollArrow;
  }

  .featureBox {
    grid-area: features;
  }

  @media only screen and (min-width: 600px) {
    .welcomeContainer {
      grid-template-columns: 1fr 600px 1fr;
      grid-template-areas:
        ". welcomeText ."
        ". features ."
        ". scrollArrow .";
    }

    @media only screen and (min-width: 1000px) {
      .welcomeContainer {
        grid-template-columns: 1fr minmax(500px, 3fr) minmax(500px, 3fr) 1fr;
        grid-template-areas:
          ". welcomeText features ."
          ". scrollArrow scrollArrow .";
      }

      .scrollDownArrow {
        margin-top: 50px;
      }
    }
  }
}
</style>