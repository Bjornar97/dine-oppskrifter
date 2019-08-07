<template>
  <div id="mainDiv">
    <div>
      <v-btn id="theButton" :disabled="disabled" @click="login" color="#3C5A99" :loading="loading">
        <v-icon color="#FFF" class="fabButton">{{svgFacebook}}</v-icon>
        <span id="facebookText">{{ loginText }} med Facebook</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
import { mdiFacebookBox } from "@mdi/js";

export default {
  name: "FacebookLogin",
  props: ["disabled", "loginText"],
  data() {
    return {
      svgFacebook: mdiFacebookBox,
      loading: false
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.$store.dispatch("loginWithFacebook");
    }
  }
};
</script>

<style lang="scss" scoped>
#mainDiv {
  margin-top: 20px;
}

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