<template>
  <v-container fluid class="text-left pa-4 Container404">
    <v-img src="@/assets/undraw_empty.svg" max-width="800px" max-height="50vh" contain></v-img>
    <div class="textContainer mx-auto my-4">
      <h2 class="heading secondary--text">404 - Ikke funnet</h2>
      <h2 class="display-1 primary--text">Denne siden finnes ikke</h2>
      <v-btn class="my-4" color="primary" to="/">Til forsiden</v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "not-found",
  metaInfo() {
    return {
      title: "Ikke funnet - Dine Oppskrifter"
    };
  }
};
</script>

<style lang="scss" scoped>
.Container404 {
  width: max-content;
}

.textContainer {
  width: max-content;
  max-width: 100%;
}
</style>