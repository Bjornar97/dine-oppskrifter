const feedbackModule = {
  state: {
    title: "",
    type: "",
    proposalType: "",
    problemType: "",
    recipeId: "",
    reportType: "",
    userName: "",
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
      }

      if (data.recipeId) {
        state.recipeId = data.recipeId;
      }

      if (data.reportType) {
        state.reportType = data.reportType;
      }

      if (data.userName) {
        state.userName = data.userName;
      }
    }
  }
};

export default feedbackModule;
