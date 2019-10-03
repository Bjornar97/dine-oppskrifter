<template>
  <v-dialog
    v-model="showTerms"
    overlay
    max-width="800px"
    transition="dialog-transition"
    class="d-print-none"
  >
    <v-card class="pa-4 pa-sm-8">
      <h2 class="title">Godta vilkårene, personvernerklæringen og informasjonskapsler</h2>
      <p class="terms">
        Les gjennom
        <router-link to="/personvern-erklaering" class="mr-1" target="_blank">Personvernerklæringen</router-link>og
        <router-link to="/vilkaar-for-bruk" target="_blank">Vilkår for bruk</router-link>
      </p>
      <p
        class="cookieText"
      >For å gi deg den beste opplevelsen, ønsker vi å bruke infomasjonskapsler til å holde deg innlogget og huske valg du tar på dine-oppskrifter.no.</p>
      <p>Ved å trykke godta, godtar du personvernerklæringen, vilkår for bruk og bruk av informasjonskapsler</p>
      <v-btn @click="showTerms = false" class="mx-sm-4" color="warning">Avbryt</v-btn>
      <v-btn @click="accept" class="mx-sm-4 float-right" color="success">Jeg godtar</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "cookie-accept",
  computed: {
    loggedIn() {
      return this.$store.accountModule.loggedIn;
    },
    acceptedCookies() {
      return this.$store.acceptedTerms;
    },
    showTerms: {
      get() {
        return this.$store.state.showTerms;
      },
      set(v) {
        this.$store.commit("setShowTerms", v);
      }
    },
    loginProcess() {
      return this.$store.state.accountModule.loginProcess;
    }
  },
  methods: {
    accept() {
      this.$store.commit("acceptTerms");
      this.$store.commit("setShowTerms", false);
      if (!this.loginProcess) {
        this.$store.commit("setLoginProcess", true);
        this.$store.dispatch("loginWithFacebook");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>