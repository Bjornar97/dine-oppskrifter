<template>
  <v-layout justify-center>
      <v-dialog :value="open" persistent max-width="600px">
        <v-expand-transition>
          <v-card v-if="!loading && !success">
            <v-card-title primary-title>
              Ta bilde av fremgangsmåten
            </v-card-title>
            <v-card-text>
              <p>Dersom du har oppskriften kan du enkelt ta bilde av fremgangsmåten og teksten blir automatisk lagt inn.</p>
              <h5>Pass på følgende: </h5>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Beskjær bilde slik at kun fremgangsmåten vises, ettersom all tekst i bilde blir lagt til. Alternativt kan du slette uønsket tekst etterpå</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Prøv å ta bildet et sted det er mye lys, eller bruk blits</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-file-input
                label="Ta bilde"
                @change="getTextFromImage"
                :disabled="loading"
                :success="imageSuccess"
                :error="imageError"
                :readonly="false"
                accept="image/png, image/jpeg"
                placeholder="Ta bilde"
                :error-messages="imageErrorMessage"
                prepend-icon="mdi-camera"
              ></v-file-input>
            </v-card-text>
          </v-card>
          <v-card v-if="loading">
            <v-card-title primary-title>
              Behandler
            </v-card-title>
            <v-card-text>
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
              ></v-progress-circular>  
            </v-card-text>
          </v-card>
          <v-card v-if="success">
            <v-card-title primary-title>
              Success
            </v-card-title>
            <v-card-text>
              {{text}}
            </v-card-text>
          </v-card>
        </v-expand-transition>
      </v-dialog>
  </v-layout>
</template>

<script>
import * as firebase from "firebase/app"; // Required for side-effects
var functions = firebase.functions();
export default {
  name: "welcome-screen",
  props: ["open"],
  data() {
    return {
      imageError: false,
      imageSuccess: false,
      loading: false,
      inputImage: undefined,
      imageErrorMessage: "",
      text: "",
      success: false
    };
  },
  computed: {
    
  },
  methods: {
    toBase64: file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    }),
    getTextFromImage: async function(image) {
      console.log("New Image");
      if (image) {
        try {
          console.log("New image is not undefined");
          console.log(image);
          this.loading = true;
          const pictureSteps = functions.httpsCallable('pictureSteps');
          const base64Image = await this.toBase64(image);
          console.dir(base64Image);
          const result = await pictureSteps({image: base64Image})
          if (result === null) {
            console.log("Result is null");
            this.loading = false;
            this.imageError = true;
            this.imageErrorMessage = "Noe gikk galt, prøv igjen senere.";
          } else {
            console.log("Success, probably");
            this.loading = false;
            this.text = result.data.text;
            if (typeof this.text === "string") {
              this.success = true;
            } else {
              this.success = false;
              this.imageError = true;
              this.imageErrorMessage = "noe gikk galt, prøv igjen senere";
            }
          }  
        } catch (error) {
          this.loading = false;
          this.success = false;
          this.imageError = true;
          this.imageErrorMessage = "Noe gikk galt, prøv igjen senere";
        }
      }
    }
  },
  watch: {
    inputImage: async function(oldImage, newImage) {
          }
  }
};
</script>

<style lang="scss" scoped>

</style>