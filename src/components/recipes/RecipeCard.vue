<template>
  <v-card class="card my-4" @click="$router.push(`oppskrift/${recipe.id}`)">
    <v-card-title primary-title>{{recipe.title}}</v-card-title>
  </v-card>
</template>

<script>
export default {
  name: "recipe-card",
  props: ["recipe"]
};
</script>

<style lang="scss" scoped>
.card {
  max-width: 300px;
}
</style>