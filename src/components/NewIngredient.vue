<template>
  <v-layout justify-center>
    <v-dialog :value="open" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline secondary--text">{{ !editing ? "Ny ": "" }}Ingrediens</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-text-field
              label="Navn på ingrediens*"
              counter="50"
              v-model="name"
              :rules="[rules.required, rules.counter50]"
            ></v-text-field>

            <v-text-field
              label="Mengde*"
              persistent-hint
              type="number"
              v-model="amount"
              :rules="[rules.required, rules.onlyNumber, rules.counter5]"
              counter="5"
              hint="Hvor mye av ingrediensen trengs, må være et tall"
            ></v-text-field>

            <v-text-field
              label="Enhet"
              v-model="unit"
              counter="10"
              autocapitalize="none"
              :rules="[rules.counter10]"
              hint="Hvilken enhet som skal brukes. For eksempel dl for desiliter, eller ss for spiseskjeer"
              persistent-hint
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="close">Avbryt</v-btn>
          <v-btn
            color="success"
            :disabled="!valid"
            text
            @click="save"
          >{{ editing ? "Lagre": "Legg til" }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: "new-ingredient-dialog",
  props: ["open"],
  data() {
    return {
      name: "",
      amount: "",
      unit: "",
      editing: false,
      index: undefined,
      valid: false,
      rules: {
        required: value => !!value || "Kan ikke være tom",
        onlyNumber: v =>
          !isNaN(v) || "Må være et tall, bruk punktum i stedet for komma",
        counter10: v => v.length <= 10 || "Kan ikke innholde mer enn 10 tegn",
        counter50: v => v.length <= 50 || "Kan ikke innholde mer enn 50 tegn",
        counter5: v => v.length <= 5 || "Kan ikke innholde mer enn 5 tegn"
      }
    };
  },
  methods: {
    save() {
      if (this.editing) {
        this.$emit("saveEdit", {
          ingredient: {
            name: this.name,
            amount: this.amount,
            unit: this.unit
          },
          index: this.index
        });
      } else {
        this.$emit("save", {
          name: this.name,
          amount: this.amount,
          unit: this.unit
        });
      }
    },
    close() {
      this.$emit("close");
    },
    edit(ingredient, index) {
      this.name = ingredient.name;
      this.amount = ingredient.amount;
      this.unit = ingredient.unit;
      this.editing = true;
      this.index = index;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>