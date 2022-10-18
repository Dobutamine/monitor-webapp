<template>
  <q-card :class="classBox" style="max-width: 300px">
    <div class="q-ml-sm text-h6">
      {{ message }}
      <q-btn
        class="q-ma-xs q-ml-lg"
        @click="toggleTimer"
        float-right
        size="sm"
        :icon="pauseIcon"
      ></q-btn>
      <q-btn
        class="q-ma-xs"
        @click="resetTimer"
        size="sm"
        icon="autorenew"
      ></q-btn>
    </div>
  </q-card>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      visible: true,
      blackState: "q-ma-sm bg-black text-black",
      messageState: "q-ma-sm bg-secondary text-white",
      classBox: "q-ma-sm bg-black text-black",

      message: "tap to start timer",
      timer: null,
      timeSec: 0,
      timeMin: 0,
      pauseIcon: "pause"
    };
  },
  methods: {
    toggleTimer() {
      if (this.timer) {
        this.stopTimer();
        this.pauseIcon = "play_arrow";
      } else {
        this.startTimer();
        this.pauseIcon = "pause";
      }
    },
    startTimer() {
      this.timer = setInterval(() => {
        this.timeSec += 1;

        let timeSecString = "";
        let timeMinString = "";

        if (this.timeSec > 59) {
          this.timeMin += 1;
          this.timeSec = 0;
        }
        if (this.timeSec < 10) {
          timeSecString = `0${this.timeSec}`;
        } else {
          timeSecString = this.timeSec;
        }

        if (this.timeMin < 10) {
          timeMinString = `0${this.timeMin}`;
        } else {
          timeMinString = this.timeMin;
        }

        this.message = `TIME: ${timeMinString}:${timeSecString}`;
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    resetTimer() {
      this.stopTimer();
      this.timeMin = 0;
      this.timeSec = -1;
      this.startTimer();
    },
    displayTimer() {
      this.timeSec = 0;
      this.timeMin = 0;
      this.message = "TIME: 00:00";
      this.classBox = this.messageState;
    },
    hideTimer() {
      clearInterval(this.timer);
      this.classBox = this.blackState;
    }
  },
  mounted() {
    this.$root.$on("timeron", param => {
      this.startTimer();
      this.displayTimer();
    });

    this.$root.$on("timeroff", param => {
      this.hideTimer();
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    this.$root.$off("timeron");
    this.$root.$off("timeroff");
  }
};
</script>
<style></style>
