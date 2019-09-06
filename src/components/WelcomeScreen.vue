<template>
  <div class="welcomeContainer">
    <div class="header white--text">
      <p
        :style="showText ? 'opacity: 1': 'opacity: 0'"
        class="mb-8 smallText"
      >En samleplass for oppskrifter</p>
      <transition appear name="headline" v-on:after-appear="displayText">
        <div class="headline1Container">
          <h1>Velkommen til</h1>
        </div>
      </transition>
      <div :style="showText ? 'opacity: 1': 'opacity: 0'" class="headline2Container">
        <h1>
          <span class="primary--text text--lighten-3 dineSpan">Dine</span> Oppskrifter
        </h1>
      </div>
    </div>
    <v-btn color="secondary" v-if="isRecipeListFeature" class="my-4" text>Gå til oppskrifter</v-btn>
    <feature-list></feature-list>
    <h3 class="info--text mt-6">Få tilgang til alle funksjoner:</h3>
    <facebook-login-button loginText="Fortsett"></facebook-login-button>
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
}

.dineSpan {
  // background: rgba($color: #000, $alpha: 0.8);
}

.header {
  background-image: linear-gradient(
    to top,
    var(--v-primary-darken1),
    var(--v-primary-base)
  );
  background-repeat: repeat-y;
  background-position: center;
  background-size: contain;
  position: relative;
  top: -106px;
  margin-bottom: -56px;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  clip-path: polygon(100% 0, 100% 90%, 50% 100%, 0 90%, 0 51%, 0 0);

  animation-name: headerDown;
  animation-delay: 3s;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

@keyframes headerDown {
  from {
    top: -106px;
  }
  to {
    top: -56px;
  }
}

.smallText {
  opacity: 0;
  transition: opacity 0.5s ease-out;
  transition-delay: 3s;
}

.headline1Container {
  position: relative;
  top: 0;
}

.headline2Container {
  transition: opacity 0.5s ease-in-out;
  margin-bottom: 40px;
}

.headline-enter-active,
.headline-leave-active {
  transition: opacity 0.5s ease-in, top 1s ease-out;
  transition-delay: 0.5s;
}

.headline-enter,
.headline-leave-to {
  opacity: 0;
  top: -30px;
}
</style>