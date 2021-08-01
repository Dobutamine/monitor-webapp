<template>
  <q-card class="q-mt-sm bg-dark">
    <div class="q-gutter-xs">
      <q-btn
        class="bg-warning"
        @click="silenceAlarms"
        style="height: 60px; width: 85px"
        >silence</q-btn
      >
      <q-btn
        class="bg-blue-grey-8"
        @click="pauseAlarms"
        style="height: 60px; width: 85px"
        >pause alarms</q-btn
      >
      <q-btn
        :class="nibdClass"
        style="height: 60px; width: 85px"
        @click="startNIBD"
        >{{ nibdtext }}</q-btn
      >
      <q-btn
        class="bg-blue-grey-8"
        style="height: 60px; width: 85px"
        @click="showImage"
        >imaging</q-btn
      >
      <q-btn
        class="bg-blue-grey-8"
        @click="showLabs"
        style="height: 60px; width: 85px"
        >labs</q-btn
      >
      <q-btn
        :class="timerBtnColor"
        style="height: 60px; width: 85px"
        @click="toggleTimer"
        >{{ timerBtnText }}</q-btn
      >
      <q-btn
        class="bg-blue-grey-8"
        style="height: 60px; width: 85px"
        @click="goToInstructor"
        >{{ barText }}</q-btn
      >
      <q-btn
        :class="connectedColor"
        style="height: 60px; width: 100px; font-size: 10px"
      >
        {{ connectedLabel }}
        <q-icon :name="icon" style="font-size: 32px"></q-icon>
      </q-btn>
      <q-btn
        :class="standbyColor"
        style="height: 60px; width: 85px"
        @click="standby"
        >{{ standbyText }}</q-btn
      >
    </div>
  </q-card>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      timerState: false,
      timerBtnText: "SHOW TIMER",
      timerBtnColor: "bg-blue-grey-8",
      gray: "bg-blue-grey-8",
      red: "bg-red-10",
      barText: "HIDE TOP",
      barVisibility: true,
      silenceState: false,
      silenceDuration: 30,
      trendsState: true,
      id: "YODA",
      show_icon: true,
      icon: "sentiment_very_dissatisfied",
      connected: false,
      connectedLabel: "OFFLINE",
      connectedColor: "bg-red-10",
      nibdtext: "nibd start",
      nibdClass: "bg-blue-grey-8",
      nibdCounter: 15,
      nibdTimer: null,
      checkConnectionTimer: null,
      id_unknown: true,
      ws: null,
      model_running: false,
      standbyColor: "bg-blue-10",
      standbyText: "MONITOR RUNNING",
      currentDataObject: {
        command: "",
        id: "",
        heartrate: 123,
        satPre: 97,
        satPost: 95,
        satVen: 80,
        respRate: 45,
        etco2: 55,
        abpSyst: 70,
        abpDiast: 50,
        pfi: 0.8,
        temp: 37.1,
        cvp: 4,
        papSyst: 40,
        papDiast: 20,
        rhythmType: 0,
        rhythmParameter: 0,
        compressionsFrequency: 0,
        alarmOverride: false,
        intubated: false
      }
    };
  },
  mounted() {
    this.id = this.$store.state.dataPool.id;
    this.model_running = true;
    this.standbyColor = "bg-blue-10";
    this.$root.$emit("rt_on");
    this.standbyText = "MONITOR RUNNING";
    this.connect();
  },
  beforeDestroy() {
    this.cleanUp();
    this.ws.close();
  },
  methods: {
    cleanUp() {
      clearTimeout(this.checkConnectionTimer);
      this.checkConnectionTimer = null;
      this.ws.send(JSON.stringify({ command: "close", id: this.id }));
      this.ws.close();
    },
    showLabs() {
      this.$root.$emit("showlabs");
    },
    toggleTimer() {
      this.timerState = !this.timerState;
      if (this.timerState) {
        this.$root.$emit("timeron");
        this.timerBtnText = "HIDE TIMER";
        this.timerBtnColor = this.red;
      } else {
        this.$root.$emit("timeroff");
        this.timerBtnText = "SHOW TIMER";
        this.timerBtnColor = this.gray;
      }
    },
    goToInstructor() {
      this.barVisibility = !this.barVisibility;
      if (this.barVisibility) {
        this.barText = "HIDE TOP";
      } else {
        this.barText = "SHOW TOP";
      }
      this.$root.$emit("barvisible", this.barVisibility);
    },
    showImage() {
      this.$root.$emit("showimage", this.currentDataObject.imageName);
    },
    startNIBD() {
      this.nibdTimer = setInterval(() => {
        if (this.nibdCounter <= 0) {
          this.nibdCounter = 15;
          this.nibdtext = "nibd start";
          (this.nibdClass = "bg-blue-grey-8"), clearInterval(this.nibdTimer);
          this.$root.$emit("shownibd");
        } else {
          this.nibdCounter -= 1;
          (this.nibdClass = "bg-red-10"),
            (this.nibdtext = "wait -" + this.nibdCounter + "-");
        }
      }, 1000);
    },
    standby() {
      this.model_running = !this.model_running;
      if (this.model_running) {
        this.standbyColor = "bg-blue-10";
        this.$root.$emit("rt_on");
        this.standbyText = "MONITOR RUNNING";
        this.$store.commit("dataPool/alarmEnabled", true);
        clearTimeout(this.checkConnectionTimer);
        this.checkConnectionTimer = setTimeout(
          this.checkConnectionStatus,
          1000
        );
      } else {
        this.$root.$emit("rt_off");
        this.standbyColor = "bg-red-10";
        this.standbyText = "MONITOR STANDBY";
        this.$store.commit("dataPool/alarmEnabled", false);
        clearTimeout(this.checkConnectionTimer);
      }
    },
    connect() {
      if (!this.connected) {
        // try to establish a connection
        // this.ws = new WebSocket('ws://104.248.90.19:8080/ws')
        this.ws = new WebSocket("ws://localhost:8080/api");
        // attach a message handler
        this.ws.onmessage = this.receiveDataFromServer;
        // start the check connection timer
        this.checkConnectionTimer = setTimeout(
          this.checkConnectionStatus,
          1000
        );
        // update the user interface
        this.connectedLabel = "";
        this.icon = "settings_ethernet";
        this.connectedColor = "bg-orange-10";
      } else {
        this.connected = false;
        this.ws.send(JSON.stringify({ command: "close", id: this.id }));
        this.ws.close();
        clearTimeout(this.checkConnectionTimer);
        this.connectedLabel = "OFFLINE";
        this.icon = "sentiment_very_dissatisfied";
        this.connectedColor = "bg-red-10";
      }
    },
    checkConnectionStatus() {
      // send a message to the server asking if it is still alive
      if (this.ws.readyState === WebSocket.CLOSED) {
        // set the state to false
        this.connected = false;
        // update the user interface
        this.connectedLabel = "OFFLINE";
        this.icon = "sentiment_very_dissatisfied";
        this.connectedColor = "bg-red-10";
        // try to reconnect
        this.connect();
      }

      if (this.ws.readyState === WebSocket.OPEN) {
        // set the state to false
        this.connected = true;
        // try to pull some data from the server to check the id
        this.requestDataFromServer();
        // set the time for a new check
        this.checkConnectionTimer = setTimeout(
          this.checkConnectionStatus,
          1000
        );
      }
    },
    requestDataFromServer() {
      if (this.connected) {
        this.ws.send(JSON.stringify({ command: "get", id: this.id }));
      }
    },
    receiveDataFromServer(data) {
      const processed_data = JSON.parse(data.data);
      if (typeof processed_data === "string") {
        switch (processed_data) {
          case "no data":
            this.connectedLabel = "NO DATA";
            this.connectedColor = "bg-red-10";
            this.icon = "sentiment_very_dissatisfied";
            break;
          case "id not registered":
            this.id_error = true;
            this.connectedLabel = "ID ERROR";
            this.connectedColor = "bg-red-10";
            this.icon = "sentiment_very_dissatisfied";
            break;
        }
      } else {
        this.processData(processed_data);
      }
    },
    processData(data) {
      this.connectedLabel = "";
      this.icon = "sentiment_satisfied_alt";
      this.connectedColor = "bg-green-10";

      if (data.hasOwnProperty("heartrate")) {
        this.currentDataObject.abpDiast = data["abpDiast"];
        this.currentDataObject.abpSyst = data["abpSyst"];
        this.currentDataObject.cvp = data["cvp"];
        this.currentDataObject.etco2 = data["etco2"];
        this.currentDataObject.heartrate = data["heartrate"];
        this.currentDataObject.papDiast = data["papDiast"];
        this.currentDataObject.papSyst = data["papSyst"];
        this.currentDataObject.pfi = data["pfi"];
        this.currentDataObject.respRate = data["respRate"];
        this.currentDataObject.satPost = data["satPost"];
        this.currentDataObject.satPre = data["satPre"];
        this.currentDataObject.satVen = data["satVen"];
        this.currentDataObject.temp = data["temp"];
        this.currentDataObject.imageName = data["imageName"];
        this.currentDataObject.rhythmType = data["rhythmType"];
        this.currentDataObject.intubated = data["intubated"];
        this.currentDataObject.compressionsFrequency =
          data["compressionsFrequency"];
        this.currentDataObject.rhythmParameter = data["rhythmParameter"];
        this.currentDataObject.alarmOverride = data["alarmOverride"];
      }
      this.updateModel();
    },
    updateModel() {
      this.$model.setEmulatorData(this.currentDataObject);
    },
    silenceAlarms() {
      //this.$root.$on('hires_on', () => { this.hires = true })
      this.silenceState = !this.silenceState;
      this.silenceDuration = 30;
      this.$root.$emit("silence", this.silenceState);
    },
    pauseAlarms() {
      this.silenceState = !this.silenceState;
      this.silenceDuration = 180;
      this.$root.$emit("pause", this.silenceState);
    },
    trends() {
      this.trendsState = !this.trendsState;
      this.$root.$emit("trends", this.trendsState);
      if (this.trendsState) {
        this.$root.$emit("message", "TRENDS VISIBLE");
      } else {
        this.$root.$emit("message", "TRENDS HIDDEN");
      }
    }
  }
};
</script>

<style></style>
