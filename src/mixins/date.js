var dateMixin = {
  methods: {
    makeDateString(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();

      if (diff < 60 * 1000) {
        return "Akkurat nå";
      } else if (diff < 60 * 60 * 1000) {
        let minutes = Math.round(diff / (1000 * 60));
        return `For ${minutes} minutt${minutes != 1 ? "er" : ""} siden`;
      } else if (diff < 24 * 60 * 60 * 1000) {
        let hours = Math.round(diff / (1000 * 60 * 60));
        return `For ${hours} time${hours != 1 ? "r" : ""} siden`;
      } else if (diff < 7 * 24 * 60 * 60 * 1000) {
        let days = Math.round(diff / (1000 * 60 * 60 * 24));
        return `For ${days} dag${days != 1 ? "er" : ""} siden`;
      } else {
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        let dateString = day < 9 ? `0${day + 1}` : day + 1;
        let monthString = month < 9 ? `0${month + 1}` : month + 1;
        return `${dateString}.${monthString}.${year}`;
      }
    }
  }
};

export default dateMixin;
