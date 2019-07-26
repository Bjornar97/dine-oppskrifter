<template>
  <div>
    <v-container v-if="ingredientsTool" elevation-4 class="white">
      <h2 class="subheader secondary--text">Ingredienskalkulator</h2>
      <v-expand-transition>
        <v-form class="ingredientsContainer" v-model="valid" v-show="!showResults">
          <h6 class="title">Navn på ingrediens</h6>
          <h6 class="title">Mengde</h6>
          <h6 class="title">Enhet</h6>
          <template v-for="ingredient in fields">
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
          <p class="subheading portions fullCol">Hvor mange porsjoner gir disse ingrediensene?</p>
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
          <v-btn @click="calculate" class="submit" :disabled="!valid" color="success">Regn ut</v-btn>
          <v-btn @click="reset" class="resetBtn" color="error">Tilbakestill</v-btn>
        </v-form>
      </v-expand-transition>
      <v-expand-transition>
        <div class="calculation" v-show="showResults">
          <ingredients-calculation :portions="portions" :ingredients="ingredients"></ingredients-calculation>
          <v-btn @click="showResults = false" color="warning" class="editBtn">Rediger</v-btn>
        </div>
      </v-expand-transition>
    </v-container>
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
        v => !isNaN(v) || "Må være et tall, bruk punktum i stedet for komma"
      ],
      ingredients: []
    };
  },
  computed: {
    ingredientsTool() {
      return this.$store.state.activeFeatures.ingredients;
    }
  },
  methods: {
    calculate() {
      console.log("Calculating");
      this.ingredients = [];
      this.fields.forEach(ingredient => {
        if (ingredient.show && ingredient.name.trim() != "") {
          this.ingredients.push({
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
.ingredientsContainer {
  display: grid;
  width: 100%;
  grid-gap: 10px;
  grid-template-columns: 7fr 1fr 2fr;
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

.divider {
  margin: 20px 0;
  height: 5px;
}

.portionsSlider {
  margin-top: 30px;
  max-width: 90%;
}

.submit {
  grid-column: span 2;
  justify-self: center;
}

.fullCol {
  grid-column: span 3;
}

.subheader {
  margin: 1em 0;
}

@media only screen and (max-width: 800px) {
  .resetBtn {
    grid-column: span 2;
  }

  .submit {
    grid-column: span 1;
  }
}
</style>