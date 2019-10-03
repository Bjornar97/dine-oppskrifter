const feedbackModule = {
  state: {
    title: "",
    type: "",
    proposalType: "",
    problemType: "",
    recipeId: "",
    reportType: "",
    userName: "",
    userReportId: "",
    description: "",
    anonymous: false,
    containedRecipeId: false
  },
  mutations: {
    setFeedbackTitle(state, title) {
      state.title = title;
    },
    setFeedbackDescription(state, description) {
      state.description = description;
    },
    setFeedbackType(state, type) {
      state.type = type;
    },
    setFeedbackProposalType(state, proposalType) {
      state.proposalType = proposalType;
    },
    setFeedbackProblemType(state, problemType) {
      state.problemType = problemType;
    },
    setFeedbackRecipeId(state, recipeId) {
      state.recipeId = recipeId;
    },
    setFeedbackReportType(state, reportType) {
      state.reportType = reportType;
    },
    setFeedbackUserName(state, userName) {
      state.userName = userName;
    },
    setFeedbackAnonymous(state, value) {
      state.anonymous = value;
    },
    resetFeedback(state) {
      state.title = "";
      state.description = "";
      state.type = "";
      state.proposalType = "";
      state.problemType = "";
      state.reportType = "";
      state.recipeId = "";
      state.userName = "";
      state.containedRecipeId = false;
    }
  },
  actions: {
    addFeedbackData({ state, commit }, data) {
      if (data.type) {
        state.type = data.type;
      }

      if (data.proposalType) {
        state.proposalType = data.proposalType;
      }

      if (data.problemType) {
        state.problemType = data.problemType;

        if (data.id && data.problemType == "En Oppskrift") {
          state.recipeId = data.recipeId;
        }
      }

      if (data.reportType) {
        state.reportType = data.reportType;
        if (data.id && data.reportType == "Oppskrift") {
          state.recipeId = data.id;
        } else if (data.id && data.reportType == "Bruker") {
          state.userReportId = data.id;
        }
      }

      if (data.userName) {
        state.userName = data.userName;
      }
    }
  }
};

export default feedbackModule;
