<template>
  <v-container class="feedbackContainer">
    <v-card v-if="!user.loggedIn" class="text-left pa-2">
      <v-card-title>For å gi tilbakemelding må du være logget inn</v-card-title>
      <v-card-text>Dersom du har problemer med innlogging, kontakt oss</v-card-text>
      <v-btn class="mx-2" color="primary" to="/kontakt-oss">Kontakt oss</v-btn>
      <v-card-actions>
        <facebook-login-button loginText="Logg inn"></facebook-login-button>
      </v-card-actions>
    </v-card>
    <div class="text-left" v-else>
      <v-form v-model="valid" ref="feedbackForm">
        <h2 class="headline accent--text my-4">Tilbakemelding</h2>
        <v-select
          :items="typeList"
          :menu-props="{offsetY: true, closeOnClick: false}"
          class="Field"
          v-model="type"
          outlined
          hint="Hvilken type tilbakemelding vil du sende. Dersom du er usikker, velg den du tror er mest rett, eller velg annet"
          persistent-hint
          :rules="[rules.required]"
          label="Type tilbakemelding"
        ></v-select>

        <!-- For proposals -->
        <v-select
          v-if="type == 'Forslag'"
          :items="proposalTypeList"
          v-model="proposalType"
          outlined
          label="Type Forslag"
          :rules="[rules.required]"
          :menu-props="{offsetY: true, closeOnClick: false}"
        ></v-select>

        <!-- For problems -->
        <v-select
          v-if="type == 'Problem'"
          :items="problemTypeList"
          class="Field"
          v-model="problemType"
          :menu-props="{offsetY: true, closeOnClick: false}"
          :rules="[rules.required]"
          label="Problemområde"
          persistent-hint
          outlined
          hint="Hvor ligger problemet. Dersom du er usikker, velg annet."
        ></v-select>

        <!-- For reporting -->
        <v-select
          v-if="type == 'Rapportere'"
          :items="reportTypeList"
          v-model="reportType"
          class="Field"
          :menu-props="{offsetY: true, closeOnClick: false}"
          :rules="[rules.required]"
          outlined
          label="Rapport av"
        ></v-select>
        <v-text-field
          v-if="showUserName"
          :rules="[rules.required]"
          name="Navn"
          class="Field"
          label="Navnet til brukeren"
          outlined
          v-model="reportUserName"
        ></v-text-field>

        <!-- For multiple things -->
        <v-text-field
          v-if="showRecipeId"
          name="OppskriftID"
          class="Field"
          label="Oppskrift ID"
          :disabled="containedRecipeId"
          v-model="recipeId"
          hint="IDen til oppskriften problemet ligger i. Det skal være 20 tegn og vises i adresselinja når du er på siden til oppskriften. Er ikke nødvendig for å sende rapport."
          persistent-hint
          outlined
        ></v-text-field>

        <v-text-field
          name="Tittel"
          hint="En kort oppsummering"
          label="Tittel"
          v-if="showTitle"
          outlined
          class="Field"
          :rules="[rules.required]"
          v-model="title"
        ></v-text-field>

        <v-textarea
          label="Beskrivelse"
          name="Beskrivelse"
          class="Field"
          outlined
          v-if="showDescription"
          v-model="description"
          :rules="[rules.required]"
          hint="Forklar så godt du kan"
        ></v-textarea>

        <v-checkbox label="Dine Oppskrifter kan kontakte meg for mer informasjon" v-model="contact"></v-checkbox>

        <v-text-field
          v-if="contact"
          name="epost"
          outlined
          class="mt-0 pt-0 mb-2"
          label="Eposten din"
          v-model="email"
        ></v-text-field>

        <div class="d-flex" v-if="sent">
          <v-icon color="success">mdi-comment-check-outline</v-icon>
          <p class="subtitle-1 my-auto ml-2">Takk for tilbakemeldingen</p>
        </div>
        <div class="d-flex">
          <v-btn
            color="success"
            class="my-2 mx-1"
            v-if="sent"
            @click="newFeedback"
          >Ny Tilbakemelding</v-btn>
          <v-btn color="info" class="my-2 mx-1" v-if="sent" @click="$router.push('/')">Forsiden</v-btn>
        </div>

        <v-btn
          class="my-4"
          color="success"
          v-if="!sent"
          :disabled="!valid"
          @click="sendFeedback"
        >Send</v-btn>
        <p class="error--text" v-if="error">{{errorMessage}}</p>
        <p class="caption error--text" v-if="!valid && !sent">Du må fylle ut alle nødvendige felter</p>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/firestore";

var db = firebase.firestore();

export default {
  name: "feedback-box",
  props: ["feedbackData"],
  data() {
    return {
      valid: true,
      sent: false,
      error: false,
      errorMessage: "",
      proposalTypeList: ["Forbedring", "Ny funksjon", "Annet"],
      typeList: ["Forslag", "Problem", "Rapportere", "Annet"],
      problemTypeList: [
        "En oppskrift",
        "Ny oppskrift",
        "Forsiden",
        "Favoritt(er)",
        "Konto",
        "Annet"
      ],
      contact: true,
      email: "",
      reportTypeList: ["Oppskrift", "Bruker", "Annet"],
      rules: {
        required: v => !!v || "Kan ikke være tom"
      }
    };
  },
  components: {
    "facebook-login-button": () => import("@/components/FacebookLoginButton")
  },
  computed: {
    user() {
      return this.$store.state.accountModule;
    },
    type: {
      get() {
        return this.$store.state.feedbackModule.type;
      },
      set(v) {
        this.$store.commit("setFeedbackType", v);
      }
    },
    proposalType: {
      get() {
        return this.$store.state.feedbackModule.proposalType;
      },
      set(v) {
        this.$store.commit("setFeedbackProposalType", v);
      }
    },
    problemType: {
      get() {
        return this.$store.state.feedbackModule.problemType;
      },
      set(v) {
        this.$store.commit("setFeedbackProblemType", v);
      }
    },
    title: {
      get() {
        return this.$store.state.feedbackModule.title;
      },
      set(v) {
        this.$store.commit("setFeedbackTitle", v);
      }
    },
    description: {
      get() {
        return this.$store.state.feedbackModule.description;
      },
      set(v) {
        this.$store.commit("setFeedbackDescription", v);
      }
    },
    recipeId: {
      get() {
        return this.$store.state.feedbackModule.recipeId;
      },
      set(v) {
        this.$store.commit("setFeedbackRecipeId", v);
      }
    },
    reportType: {
      get() {
        return this.$store.state.feedbackModule.reportType;
      },
      set(v) {
        this.$store.commit("setFeedbackReportType", v);
      }
    },
    reportUserName: {
      get() {
        return this.$store.state.feedbackModule.reportUserName;
      },
      set(v) {
        this.$store.commit("setFeedbackUserName", v);
      }
    },
    containedRecipeId() {
      return this.$store.state.feedbackModule.containedRecipeId;
    },
    showRecipeId() {
      return (
        (this.type == "Problem" && this.problemType == "En oppskrift") ||
        (this.type == "Rapportere" && this.reportType == "Oppskrift")
      );
    },
    showUserName() {
      return this.type == "Rapportere" && this.reportType == "Bruker";
    },
    showTitle() {
      switch (this.type) {
        case "Forslag":
          if (this.proposalType == "" || this.proposalType == undefined)
            return false;
          else return true;
          break;

        case "Problem":
          if (this.problemType == "Annet") return true;
          else return false;

        case "Rapportere":
          if (this.reportType == "Annet") return true;
          else return false;
          break;

        case "" || undefined:
          return false;
          break;

        default:
          return true;
          break;
      }
    },
    showDescription() {
      if (this.type == "" || this.type == undefined) return false;
      else return true;
    }
  },
  methods: {
    sendFeedback() {
      let valid = this.$refs.feedbackForm.validate();
      if (!valid) {
        this.valid = false;
        this.error = true;
        this.errorMessage = "";
        return;
      }

      let data;

      if (this.type == "Forslag") {
        data = {
          type: this.type,
          proposalType: this.proposalType,
          title: this.title,
          description: this.description
        };
      } else if (this.type == "Problem") {
        data = {
          type: this.type,
          problemType: this.problemType,
          recipeId: this.recipeId,
          title: this.title ? this.title : "",
          description: this.description
        };
      } else if (this.type == "Rapportere") {
        data = {
          type: this.type,
          reportType: this.reportType,
          recipeId: this.recipeId,
          userName: this.reportUserName,
          title: this.title ? this.title : "",
          description: this.description
        };
      } else {
        data = {
          title: this.title,
          description: this.description
        };
      }

      if (this.contact && this.user.uid && this.email) {
        data = {
          ...data,
          sender: {
            uid: this.user.uid,
            email: this.email
          }
        };
      }

      db.collection("feedback").add(data);
      this.sent = true;
    },
    newFeedback() {
      this.$refs.feedbackForm.reset();
      this.sent = false;
    }
  },
  mounted() {
    if (this.feedbackData) {
      this.$store.dispatch("addFeedbackData", this.feedbackData);
    }

    this.email = this.user.email;
  }
};
</script>

<style lang="scss" scoped>
.feedbackContainer {
  max-width: 800px;
}

.Field {
  margin: 10px 0;
}
</style>