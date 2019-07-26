import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  theme: {
    themes: {
      light: {
        primary: "#49A84D",
        secondary: "#a849a3",
        accent: "#49a87d",
        anchor: "#49a3a8",
        info: "#4e49a8",
        success: "#74a849",
        error: colors.red.accent3,
        warning: "FFB300"
      }
    }
  }
});
