<template>
  <v-layout justify-center>
    <v-dialog :value="open" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline secondary--text">{{ !editing ? "Nytt s": "S" }}teg</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-form v-model="valid">
              <v-flex xs12>
                <v-textarea
                  label="Skriv her*"
                  counter="1000"
                  v-model="stepText"
                  :rules="[rules.required, rules.counter1000]"
                ></v-textarea>
              </v-flex>
            </v-form>
          </v-container>
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
  name: "new-step",
  props: ["open"],
  data() {
    return {
      stepText: "",
      valid: undefined,
      editing: false,
      index: undefined,
      cookAlternativeList: [
        "Ingen",
        "Over/Undervarme",
        "Overvarme",
        "Undervarme",
        "Varmluft",
        "Stekepanne",
        "Grill",
        "Kjøkkenmaskin",
        "Blender",
        "Annet"
      ],
      cookAlternativeSelected: "Ingen",
      cookTime: undefined,
      rules: {
        required: value => !!value || "Kan ikke være tom",
        onlyNumber: v =>
          !isNaN(v) || "Må være et tall, bruk punktum i stedet for komma",
        counter1000: v =>
          v.length <= 1000 || "Kan ikke innholde mer enn 1000 tegn",
        cookingTimeRequired: v => {
          if (this.cookAlternativeSelected == "Ingen") {
            return true;
          } else if (isNaN(this.cookTime)) {
            return "Kan ikke være tom når du har lagt inn et koke/stekeapparat";
          } else {
            return true;
          }
        }
      }
    };
  },
  methods: {
    save() {
      if (this.editing) {
        this.$emit("saveEdit", {
          step: {
            text: this.stepText
          },
          index: this.index
        });
      } else {
        this.$emit("save", {
          text: this.stepText
        });
      }
    },
    edit(step, index) {
      this.editing = true;
      this.index = index;
      this.stepText = step.text;
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>