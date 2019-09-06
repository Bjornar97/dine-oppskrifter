// vue.config.js

module.exports = {
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 8080, // CHANGE YOUR PORT HERE!
    https: true,
    hotOnly: false
  },
  transpileDependencies: ["vuetify", "vuex-persist"],
  pwa: {
    name: "Dine Oppskrifter",
    themeColor: "#49A84D",
    msTileColor: "49A84D",
    assetsVersion: "v2",
    manifestOptions: {
      name: "Dine Oppskrifter",
      short_name: "Dine Oppskrifter",
      start_url: "/",
      display: "standalone",
      themeColor: "#49A84D"
    },
    workboxOptions: {
      skipWaiting: true
    }
  }
};
