<template>
  <v-card class="featureList">
    <v-list three-line disabled>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon color="primary">mdi-file-plus</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Lage Oppskrifter</v-list-item-title>
          <v-list-item-subtitle>Du kan lage nye oppskrifter på nettsiden</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-avatar>
          <v-icon color="secondary">mdi-share</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Dele Oppskrifter</v-list-item-title>
          <v-list-item-subtitle>Oppskriftene du har laget på nettsiden kan du dele med hvem som helst</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-avatar>
          <v-icon color="info">mdi-eye</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Se gjennom alle oppskrifter</v-list-item-title>
          <v-list-item-subtitle>Du kan se alle offentlige oppskrifter som ligger på nettsiden</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-avatar>
          <v-icon color="accent">mdi-filter</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Filtrere oppskrifter</v-list-item-title>
          <v-list-item-subtitle>Du kan filtrere oppskriftene slik at du finner nye oppskrifter du liker</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-avatar>
          <v-icon color="warning">mdi-account-switch</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Velge antall porsjoner</v-list-item-title>
          <v-list-item-subtitle>Velg antall porsjoner og mengden ingredienser oppdateres automatisk</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "Feature-list"
};
</script>

<style lang="scss" scoped>
</style>