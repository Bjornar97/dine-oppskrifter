<template>
  <div v-if="isIngredientsTool" class="white ingredientsTool mb-8 pa-6 elevation-4">
    <div class="titleContainer black--text">
      <h2 class="subheader secondary--text" :class="showTutorial ? ' ml-5': ''">Ingredienskalkulator</h2>
      <v-btn
        color="info"
        class="tutorialBtn"
        @click="showTutorial = true"
        v-if="!showTutorial"
        small
      >Vis tips</v-btn>
      <v-btn
        color="info"
        class="tutorialBtn"
        @click="showTutorial = false"
        v-if="showTutorial"
        small
      >Gjem tips</v-btn>
    </div>
    <v-expand-transition>
      <div class="howTo" v-if="showTutorial">
        <p>Lurer du på hvor mye av hver ingrediens du trenger for 5, 3 eller 8 personer når oppskriften din kun passer til 4?</p>
        <p>Da kan du prøve vår Ingredienskalkulator. Du legger inn ingrediensene og hvor mange posjoner oppskriften din er beregnet for, og voila, så kan du finne ut hvor mye du trenger for antallet personere dere blir.</p>
        <p>Slik gjør du:</p>
        <ol>
          <li>Skriv inn ingrediens, mengde og enhet for hver ingrediens i oppskriften din</li>
          <li>Velg antall porsjoner oppskriften din er beregnet for</li>
          <li>Trykk Videre</li>
          <li>Velg hvor mange porsjoner du trenger</li>
          <li>Se hvor mye du trenger</li>
        </ol>

        <p class="mt-2">Resultatet kommer frem i en tabell, med navn på ingrediens og mengde.</p>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <v-container v-show="!showResults">
        <div class="ingredientsContainer">
          <v-form class="ingredientsForm elevation-2 pa-4" v-model="valid">
            <p class="exampleIngredientText">Eksempel på ingrediens:</p>
            <v-text-field label="Ingrediens" value="Hvetemel" disabled></v-text-field>

            <v-text-field label="Mengde" value="4" :rules="amountRules" disabled></v-text-field>

            <v-text-field label="Enhet" value="dl" disabled></v-text-field>
          </v-form>
        </div>
        <div class="ingredientsContainer mt-8">
          <v-form class="ingredientsForm elevation-2 pa-6" v-model="valid">
            <h3 class="headline mb-4 primary--text writeHere">Skriv ingrediensene her</h3>
            <h6 class="title">Navn på ingrediens</h6>
            <h6 class="title">Mengde</h6>
            <h6 class="title">Enhet</h6>
            <template v-for="ingredient in fields">
              <div class="flexBreak" :key="'flex' + ingredient.id"></div>
              <v-text-field
                :name="'name' + ingredient.id"
                :id="'ingredient' + ingredient.id"
                @change="changeEvent(ingredient)"
                label="Ingrediens"
                v-model="ingredient.name"
                v-if="ingredient.show"
                :key="ingredient.id"
              ></v-text-field>

              <v-text-field
                :name="'amount' + ingredient.id"
                label="Mengde"
                v-model="ingredient.amount"
                v-if="ingredient.show"
                :rules="amountRules"
                :key="'amount' + ingredient.id"
              ></v-text-field>

              <v-text-field
                :name="'unit' + ingredient.id"
                label="Enhet"
                v-model="ingredient.unit"
                v-if="ingredient.show"
                :key="'unit' + ingredient.id"
              ></v-text-field>
            </template>
            <div class="flexBreak"></div>
            <p class="subheading portions fullCol">Hvor mange porsjoner gir disse ingrediensene?</p>
            <div class="flexBreak"></div>
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
            <div class="flexBreak"></div>
            <v-btn @click="calculate" class="submit" :disabled="!valid" color="success">Videre</v-btn>
            <v-btn @click="reset" class="resetBtn" color="error">Tilbakestill</v-btn>
          </v-form>
        </div>
      </v-container>
    </v-expand-transition>
    <v-expand-transition>
      <div class="calculation" v-show="showResults">
        <div class="flexBreak"></div>
        <v-divider v-if="showTutorial" class="fullCol"></v-divider>
        <div class="flexBreak"></div>
        <ingredients-calculation :portions="portions" :ingredients="ingredients"></ingredients-calculation>
        <v-btn @click="showResults = false" color="warning" class="editBtn">Endre Oppskrift</v-btn>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import ingredientsCalculation from "@/components/ingredientsCalculation.vue";
export default {
  name: "ingredients-calculator",
  components: {
    "ingredients-calculation": ingredientsCalculation
  },
  data() {
    return {
      showTutorial: true,
      valid: true,
      lastId: 0,
      empty: [true],
      portions: 4,
      showResults: false,
      fields: [
        {
          id: 0,
          name: "",
          amount: 0,
          unit: "",
          show: true
        }
      ],
      amountRules: [
        // Checks if it is a number
        v => !isNaN(v) || "Må være et tall, bruk punktum i stedet for komma"
      ],
      ingredients: []
    };
  },
  computed: {
    isIngredientsTool() {
      return this.$store.state.featuresModule.ingredients;
    }
  },
  methods: {
    calculate() {
      console.log("Calculating");
      this.ingredients = [];
      this.fields.forEach(ingredient => {
        if (ingredient.show && ingredient.name.trim() != "") {
          this.ingredients.push({
            id: ingredient.id,
            name: ingredient.name,
            unitAmount: ingredient.amount / this.portions,
            unit: ingredient.unit
          });
        }
      });
      this.showResults = true;
    },
    reset() {
      this.ingredients = [];
      this.fields = [
        {
          id: 0,
          name: "",
          amount: 0,
          unit: "",
          show: true
        }
      ];
      this.portions = 4;
      this.empty = [true];
      this.lastId = 0;
    },
    changeEvent(ingredient) {
      console.log("Checking");

      if (ingredient.name.trim() != "") {
        this.empty[ingredient.id] = false;
      } else {
        this.empty[ingredient.id] = true;
      }

      if (ingredient.id != this.lastId) {
        console.log("id is wrong");
      } else {
        console.dir(ingredient);
        if (ingredient.name.trim() != "") {
          console.log("Pushing new");
          this.fields.push({
            id: this.lastId + 1,
            name: "",
            amount: 0,
            unit: "",
            show: true
          });
          this.empty[this.lastId + 1] = true;
          this.lastId += 1;
        }
      }

      this.fields.forEach(ingredient => {
        if (ingredient.id != 0) {
          if (this.empty[ingredient.id] && this.empty[ingredient.id - 1]) {
            ingredient.show = false;
          } else {
            ingredient.show = true;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ingredientsTool {
  max-width: 1000px;
}

.ingredientsContainer {
  display: flex;
  width: 100%;
}

.ingredientsForm {
  display: flex;
  flex-wrap: wrap;

  .exampleIngredientText {
    width: 100%;
  }

  .writeHere {
    width: 100%;
  }
}

.howTo {
  margin-left: 20px;
}

.flexBreak {
  height: 0;
  flex-basis: 100%;
}

.titleContainer {
  display: flex;
}

.tutorialBtn {
  margin-left: 5%;
  align-self: center;
  font-size: 0.7em;
}

.editBtn {
  align-self: center;
  width: min-content;
  margin-top: 50px;
}

.calculation {
  display: flex;
  flex-direction: column;
}

.portionsSlider {
  margin-top: 30px;
  width: 100%;
}

.submit {
  justify-self: center;
  margin: 0 50px;
}

.subheader {
  margin: 1em 0;
}

// For browsers that doesnt support css grid
.title {
  width: 33.334%;
}

.resetBtn {
  margin-left: 50%;
}

@supports (display: grid) {
  .ingredientsForm {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 7fr 1fr 2fr;
    max-width: 1000px;
  }

  .ingredientsContainer {
    justify-content: center;
  }

  .exampleIngredientText {
    grid-column: span 3;
    width: unset;
  }

  .writeHere {
    grid-column: span 3;
  }

  .flexBreak {
    display: none;
  }

  .title {
    width: unset;
  }

  .submit {
    grid-column: span 1;
  }

  .fullCol {
    grid-column: span 3;
  }

  .resetBtn {
    grid-column: span 2;
    margin-left: unset;
  }
}

@media only screen and (min-width: 800px) {
  .ingredientsTool {
    margin: 100px 10%;
  }

  .resetBtn {
    grid-column: span 1;
  }

  .submit {
    grid-column: span 2;
  }

  .calculation {
  }
}
</style>