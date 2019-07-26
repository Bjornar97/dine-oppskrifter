<template>
  <div>
    <v-sheet elevation="2" class="notLoggedIn">
      <div class="head">
        <p>Velkommen til</p>
        <h1>
          <span class="primary--text">Dine</span> Oppskrifter
        </h1>
      </div>
      <p class="text">
        For å ta nytte av alle funksjonene på sidene våre kan du logge på med ett trykk.
        Når du er innlogget kan du lage dine egne oppskrifter, dele dem med offentligheten (hvis du vil),
        velge dine favoritter blant de offentlige oppskriftene og mye mer.
      </p>
      <!-- <p class="terms">
        <v-checkbox v-model="checked" class="checkBox"></v-checkbox>
        <span class="mt-3 pt-1">
          <span>Jeg har lest og akseptert</span>
          <router-link to="/personvernerklaering">
            <span>Personvernærklæringen</span>
          </router-link>
          <span>og</span>
          <router-link to="/vilkarforbruk">
            <span>Vilkår for bruk</span>
          </router-link>
        </span>
      </p>-->
      <facebook-login-button class="facebookBtn"></facebook-login-button>

      <v-btn @click="close" text icon class="closeIcon">
        <v-icon>close</v-icon>
      </v-btn>
    </v-sheet>
  </div>
</template>

<script>
import FacebookLogin from "./FacebookLoginButton.vue";
export default {
  name: "notLoggedIn",
  components: {
    "facebook-login-button": FacebookLogin
  },
  data() {
    return {
      checked: false
    };
  },
  methods: {
    close() {
      this.$store.commit("closeWelcome");
      this.$cookies.set("closedWelcome", true, "1d");
    }
  }
};
</script>

<style lang="scss" scoped>
.notLoggedIn {
  display: grid;
  text-align: left;
  max-width: 800px;
  grid-template-columns: min-content 1fr min-content;
  grid-template-areas:
    "head head icon"
    "text text text"
    "check terms terms"
    "face face face";
  padding: 20px 25px;
  margin: 20px;
}

.head {
  grid-area: head;
  font-family: "Montserrat", sans-serif;
}

.closeIcon {
  grid-area: icon;
}

.text {
  grid-area: text;
}

.checkBox {
  grid-area: check;
}

.terms {
  grid-area: terms;
  display: flex;
  text-align: left;
}

.facebookBtn {
  grid-area: face;
}

p {
  text-align: left;
  margin-bottom: 5px;
}

h1 {
  margin-bottom: 20px;
  text-align: left;
}
</style>