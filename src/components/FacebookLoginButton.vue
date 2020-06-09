<template>
  <div id="mainDiv">
    <div>
      <v-btn id="theButton" :disabled="disabled" @click="login" color="#3C5A99" :loading="loading">
        <v-icon color="#FFF" class="fabButton">mdi-facebook</v-icon>
        <span id="facebookText">{{ loginText || "Fortsett" }} med Facebook</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "FacebookLogin",
  props: ["disabled", "loginText"],
  data() {
    return {};
  },
  computed: {
    loading: {
      get() {
        return this.$store.state.accountModule.loginProcess;
      },
      set(loadingStatus) {
        this.$store.commit("setLoginProcess", loadingStatus);
      }
    },
    showTerms: {
      get() {
        return this.$store.state.showTerms;
      },
      set(v) {
        this.$store.commit("setShowTerms", v);
      }
    },
    acceptedTerms() {
      return this.$store.state.acceptedTerms;
    }
  },
  methods: {
    login() {
      if (this.acceptedTerms) {
        this.loading = true;
        this.$store.dispatch("loginWithFacebook");
      } else {
        this.showTerms = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#facebookText {
  color: #fff;
  margin-left: 10px;
  text-transform: none;
}

.fabButton {
  fill: #fff;
}

#theButton {
  margin-left: 0;
}
</style>