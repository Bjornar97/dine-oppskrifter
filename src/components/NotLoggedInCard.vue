<template>
  <v-banner
    sticky
    icon="mdi-account-alert"
    icon-color="error"
    color="white"
    elevation="4"
    class="mb-4 text-left"
  >
    Du er ikke logget inn. For å få tilgang til denne siden, vennligst logg inn
    <template
      v-slot:actions
    >
      <facebook-login-button></facebook-login-button>
    </template>
  </v-banner>
</template>

<script>
import FacebookLogin from "./FacebookLoginButton.vue";
export default {
  name: "notLoggedIn",
  components: {
    "facebook-login-button": FacebookLogin
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