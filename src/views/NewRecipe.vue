<template>
  <div>
    <h1 class="heading">
      <span class="greenWord">Ny</span> Oppskrift
    </h1>
    <div class="gridContainer">
      <div class="newRecipePanel">
        <v-expansion-panel v-model="panelInformation" expand>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="panelHeader">Informasjon</div>
            </template>
            <v-card>
              <div class="card">
                <v-form>
                  <div>
                    <v-text-field v-model="title" :counter="50" label="Tittel" required></v-text-field>
                  </div>
                  <div class="formField">
                    <v-text-field label="Kort Beskrivelse" name="Description" textarea></v-text-field>
                  </div>
                </v-form>
              </div>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>

      <div class="newRecipePanel">
        <v-expansion-panel v-model="panelIngredients" expand>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="panelHeader">Ingredienser</div>
            </template>
            <v-card>
              <div class="card">
                <h1>test</h1>
              </div>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>

      <div class="newRecipePanel">
        <v-expansion-panel v-model="panelApproach" expand>
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="panelHeader">Fremgangsmåte</div>
            </template>
            <v-card>
              <div class="card">
                <h1>test</h1>
              </div>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <!-- <div class="dropdown" v-bind:class="{ open: expanded[0] }">
      <h3 class="subtitle">Informasjon</h3>
    </div>
    <div class="dropdown" v-bind:class="{ open: expanded[1] }">
      <h3 class="subtitle">Ingredienser</h3>
    </div>
    <div class="dropdown" v-bind:class="{ open: expanded[2] }">
      <h3 class="subtitle">Fremgangsmåte</h3>
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "new-recipe",
  data() {
    return {
      panelInformation: [false],
      panelIngredients: [false],
      panelApproach: [false],
      title: ""
    };
  },
  created() {
    // If the browser is wide enough so all 3 divs is in its own column, they start opened.
    let windowWidth = window.innerWidth;
    if (windowWidth >= 1216) {
      this.expanded = [true, true, true];
    }
  }
};
</script>

<style lang="scss" scoped>
.heading {
  grid-column: 1/3;
  margin: 5px 40px;
  text-align: center;
}

.newRecipePanel {
  width: 100%;
}

.card {
  background-color: #eeeeee;
  padding: 5px 20px;
}

.dropdown {
  overflow: hidden;

  transition: all 0.4s ease-in-out;

  :hover {
    cursor: pointer;
  }
}

.formField {
  margin-top: 10px;
}

.open {
  overflow: visible;
  transition: all 0.4s ease-in-out;
}

.gridContainer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-column-gap: 10px;
  padding: 10px;
}
</style>