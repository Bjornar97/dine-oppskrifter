<template>
  <div class="eventLine ma-2">
    <transition name="eventAnimation" tag="div">
      <div class="event eventItem elevation-4" v-show="!loading" key="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </transition>

    <transition name="eventAnimation">
      <div class="eventItem" v-if="!loggedIn && $vuetify.breakpoint.smAndUp" key="login">
        <facebook-login-button loginText="Logg inn"></facebook-login-button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "event-line",
  data() {
    return {};
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    loggedIn() {
      return this.$store.state.accountModule.loggedIn;
    }
  }
};
</script>

<style lang="scss" scoped>
.event {
  background-color: white;
  border-radius: 50%;
  padding: 5px;
}
.eventItem {
  transition: all 1s;
  display: inline-block;
  margin: 5px;
}

.eventAnimation-enter,
.eventAnimation-leave-to {
  transform: translateY(-100px);
}
</style>