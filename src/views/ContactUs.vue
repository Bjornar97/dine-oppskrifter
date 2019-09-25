<template>
  <v-container class="my-8 text-left">
    <h2 class="headline primary--text mb-6">Kontakt Oss</h2>
    <h4 class="subtitle-1 mr-4">
      Dersom du har forslag til forbedringer eller noe ikke er helt som det skal, send oss først tilbakemelding:
      <br />
      <v-btn class="my-2" color="primary" to="/tilbakemelding">Send tilbakemelding</v-btn>
    </h4>

    <h3 class="headline secondary--text mt-6 mb-4">Messenger</h3>
    <v-btn color="#0078FF" class="white--text" href="https://m.me/DineOppskrifter" target="_blank">
      <v-icon color="white" class="mr-2">mdi-facebook-messenger</v-icon>Send melding
    </v-btn>

    <h3 class="headline secondary--text mt-6 mb-4">Epost</h3>
    <v-btn
      text
      color="primary"
      href="mailto:brukerstotte@dine-oppskrifter.no"
      target="_blank"
    >brukerstotte@dine-oppskrifter.no</v-btn>

    <h3 class="headline secondary--text mt-6 mb-4">Facebook-siden vår</h3>
    <v-btn
      color="#3C5A99"
      class="white--text"
      href="https://www.facebook.com/DineOppskrifter/"
      target="_blank"
    >
      <v-icon color="white" class="mr-2">mdi-facebook-box</v-icon>Facebook-siden
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: "contact-us"
};
</script>

<style lang="scss" scoped>
</style>