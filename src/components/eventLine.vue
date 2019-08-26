<template>
  <div class="eventLine ma-2">
    <transition name="eventAnimation" tag="div">
      <div class="event eventItem elevation-4" v-show="loading" key="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </transition>

    <transition name="eventAnimation">
      <div class="event onlineContainer eventItem elevation-4" v-show="!onLine || showBackOnline">
        <v-icon
          class="onLine"
          :class="onLine ? 'isOnline': 'isOffline'"
          :color="onLine ? 'success': 'error'"
        >{{onLine ? "mdi-access-point-network": "mdi-access-point-network-off"}}</v-icon>
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
    },
    onLine: {
      get() {
        return this.$store.state.onLine;
      },
      set(v) {
        this.$store.commit("setOnLineStatus", v);
      }
    },
    showBackOnline() {
      return this.$store.state.showBackOnline;
    }
  },
  methods: {
    updateOnlineStatus(e) {
      this.onLine = navigator.onLine;
    }
  },
  mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  }
};
</script>

<style lang="scss" scoped>
.event {
  background-color: white;
  border-radius: 50%;
  padding: 5px;
}

.onlineContainer {
  display: flex;
  align-items: center;
  text-align: center;
  width: 40px;
  height: 40px;
}

.onLine {
  animation-name: online;
  animation-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);
  animation-direction: alternate;
  animation-iteration-count: infinite;
  animation-delay: 0.5s;
  animation-duration: 2s;
  transform: scale(0.9);
  opacity: 0.7;
}

@keyframes online {
  0% {
    transform: scale(0.9);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.isOnline {
  transition: color 0.5s;
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