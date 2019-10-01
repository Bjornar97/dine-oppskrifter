<template>
  <v-container>
    <feedback-box :feedbackData="feedbackData"></feedback-box>
  </v-container>
</template>

<script>
export default {
  name: "feedback",
  metaInfo() {
    return {
      title: "Tilbakemelding - Dine Oppskrifter"
    };
  },
  data() {
    return {
      feedbackData: null
    };
  },
  components: {
    "feedback-box": () => import("@/components/FeedbackBox")
  },
  created() {
    let type = this.$route.params.type;
    let secondType = this.$route.params.secondType;
    let id = this.$route.params.thingId;

    let secondString = "";
    if (secondType) {
      let secondSplitString;
      if (secondType.split("-").length != 1) {
        secondSplitString =
          secondType.split("-")[0] + " " + secondType.split("-")[1];
      } else {
        secondSplitString = secondType;
      }

      secondString =
        secondSplitString.split("")[0].toUpperCase() +
        secondSplitString.slice(1);
    }

    if (type.toLowerCase() == "problem") {
      this.feedbackData = {
        type: "Problem",
        problemType: secondString,
        id: id
      };
    } else if (type.toLowerCase() == "forslag") {
      this.feedbackData = {
        type: "Forslag",
        proposalType: secondString
      };
    } else if (type.toLowerCase() == "rapportere") {
      this.feedbackData = {
        type: "Rapportere",
        reportType: secondString,
        id: id
      };
    }
  }
};
</script>

<style lang="scss" scoped>
</style>