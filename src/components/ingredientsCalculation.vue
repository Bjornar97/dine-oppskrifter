<template>
  <div>
    <p class="subheading portions fullCol">Hvor mange porsjoner ønsker du?</p>
    <v-slider
      class="portionsSlider fullCol"
      color="secondary"
      thumb-color="secondary"
      track-color="primary"
      v-model="portions"
      :thumb-size="36"
      thumb-label="always"
      max="24"
      min="1"
    ></v-slider>

    <v-simple-table>
      <thead>
        <tr>
          <th class="text-xs-left">Ingrediens</th>
          <th class="text-xs-left">Mengde</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in ingredients" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ +(Math.round((item.unitAmount * portions) + "e+2") + "e-2") }} {{ item.unit }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: "ingredients-calculation",
  props: ["ingredients", "portions"],
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.subheading {
  margin-bottom: 50px;
}

.portionsSlider {
  max-width: 90%;
}
</style>