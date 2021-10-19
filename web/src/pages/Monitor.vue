<template>
  <q-page padding class="bg-black">
    <div class="row justify-center items-start q-ma-es">
      <div class="col text-center">
        <Timer></Timer>
      </div>
      <div class="col text-center">
        <Controller></Controller>
        <AlarmBox></AlarmBox>
      </div>
      <div class="col text-center">
        <AlarmMessage></AlarmMessage>
      </div>
    </div>
    <div class="row justify-center items-start q-ma-es">
      <div :class="chartCols">
        <DashboardChartChannels
          chartId="100"
          :configuration="channelConfigurations"
          :dataUpdateInterval="0.025"
          :dataPointsPerUpdate="5"
          :monitorConfiguration=this.monitorConfiguration
          :monitorValues=this.monitorValues
        ></DashboardChartChannels>
      </div>
      <div :class="parameterCols">
        <DashboardParameterChannels
          chartId="300"
          :dataUpdateInterval="0.025"
          :dataPointsPerUpdate="5"
          :monitorConfiguration=this.monitorConfiguration
          :monitorValues=this.monitorValues
        ></DashboardParameterChannels>
      </div>
    </div>
    <div class="row justify-center items-start q-ma-es">
       <div class="q-gutter-xs">
        <q-btn
          @click="silenceAlarms"
          class="bg-warning"
          style="height: 60px; width: 85px"
          >silence</q-btn
        >
        <q-btn
          @click="pauseAlarms"
          class="bg-blue-grey-8"
          style="height: 60px; width: 85px"
          >pause alarms</q-btn
        >
        <q-btn
          @click="startNIBD"
          :class="nibdClass"
          style="height: 60px; width: 85px"
          >{{ nibdtext }}</q-btn
        >
        <q-btn
          :class="imageButtonColor"
          style="height: 60px; width: 85px"
          @click="showImage"
          >{{imageButtonText}}</q-btn
        >
        <q-btn
          :class="labButtonColor"
          @click="showLabs"
          style="height: 60px; width: 85px"
          >{{labButtonText}}</q-btn
        >
        <q-btn
          @click="toggleTimer"
          :class="timerBtnColor"
          style="height: 60px; width: 85px"
          >{{ timerBtnText }}</q-btn
        >
        <q-btn
        class="bg-blue-grey-8"
        style="height: 60px; width: 85px"
        @click="toggleTopBar"
        >{{ barText }}</q-btn
        >
      <q-btn
        :class="standbyColor"
        style="height: 60px; width: 85px"
        @click="standby"
        >{{ standbyText}}</q-btn
      >
    </div>
    </div>
    <q-resize-observer @resize="onResize" />
  </q-page>
</template>

<script>
/* eslint-disable */
import Controller from "components/Controller";
import DashboardChartChannels from "components/DashboardChartChannels";
import DashboardParameterChannels from "components/DashboardParameterChannels";
import Vital from "components/Vital";
import AlarmBox from "components/AlarmBox";
import AlarmMessage from "components/AlarmMessage";
import MessageBox from "components/MessageBox";
import ImageView from "components/ImageView";
import Timer from "components/Timer";
import LabView from "components/LabView";

import axios from "axios";

export default {
  name: "PageIndex",
  components: {
    DashboardChartChannels,
    DashboardParameterChannels,
    Controller,
    Vital,
    AlarmBox,
    MessageBox,
    AlarmMessage,
    ImageView,
    Timer,
    LabView
  },
  data() {
    return {
      apiUrl: "",
      webSocketUrl: "",
      id: "",
      height: 0,
      max_width: 0,
      websocket: null,
      monitorConfiguration: {},
      monitorValues: {},
      currentImageUpdateCounter: 0,
      currentLabUpdateCounter: 0,
      currentConfigUpdateCounter: 0,
      updateTimer: null,
      standbyMonitor: true,
      standbyColor: "bg-red-10",
      standbyText: "MONITOR STANDBY",
      nibdtext: "nibd start",
      nibdClass: "bg-blue-grey-8",
      nibdCounter: 15,
      nibdTimer: null,
      timerState: false,
      timerBtnText: "SHOW TIMER",
      timerBtnColor: "bg-blue-grey-8",
      imageButtonColor: "bg-blue-grey-8",
      imageButtonText: "IMAGING",
      labButtonColor: "bg-blue-grey-8",
      labButtonText: "LAB",
      firstReception: true,
      silenceState: false,
      silenceDuration: 30,
      barText: "HIDE TOP",
      barVisibility: true,
      prevOverrideState: false,


      chartCols: "col-9 text-center",
      parameterCols: "col-3 text-center",
      alarmsEnabled: true,
      alarmHi: null,
      alarmLo: null,
      blinkerTimer: null,
      blinkerState: true,
      satZoom1: 0.6,
      satZoom2: 0.5,
      abpZoom: 0.7,
      satZoomBase1: 0.6,
      satZoomBase2: 0.5,
      abpZoomBase: 0.7,
      channelConfigurations: [
        {
          label: "",
          order: 0,
          source1: "empty",
          source2: "",
          timeframe: 5,
          performance: 1,
          color: "0x000000",
          zoom: 0.6,
          grid: false,
          autoscale: false,
          minY: -10,
          maxY: 20,
          limiterMax: "",
          limiterMin: "",
          squeezeFactor: 0
        },
        {
          label: "ecg",
          order: 1,
          source1: "ecg_signal",
          source2: "",
          timeframe: 5,
          performance: 1,
          color: "0x5EEA32",
          zoom: 0.6,
          grid: false,
          autoscale: false,
          minY: -10,
          maxY: 10,
          limiterMax: "",
          limiterMin: "",
          squeezeFactor: 0
        },
        {
          label: "Pleth(1)",
          order: 2,
          source1: "sat_signal",
          source2: "",
          timeframe: 5,
          performance: 1,
          color: "0xDF32EA",
          zoom: 0.6,
          grid: true,
          autoscale: true,
          minY: 0,
          maxY: 100,
          limiterMax: "abpSyst",
          limiterMin: "abpDiast",
          squeezeFactor: 30
        },
        {
          label: "Pleth(2)",
          order: 3,
          source1: "sat_signal",
          source2: "",
          timeframe: 5,
          performance: 1,
          color: "0xDF32EA",
          zoom: 0.4,
          grid: true,
          autoscale: true,
          minY: 0,
          maxY: 100,
          limiterMax: "abpSyst",
          limiterMin: "abpDiast",
          squeezeFactor: 30
        },
        {
          label: "abp",
          order: 4,
          source1: "abp_signal",
          source2: "",
          timeframe: 5,
          performance: 1,
          color: "0xFB0808",
          zoom: 0.7,
          grid: true,
          autoscale: true,
          minY: 0,
          maxY: 100,
          limiterMax: "abpSyst",
          limiterMin: "abpDiast",
          squeezeFactor: 30
        },
        {
          label: "RF",
          order: 5,
          source1: "resp_signal",
          source2: "",
          timeframe: 20,
          performance: 2,
          color: "0xffffff",
          zoom: 0.7,
          grid: false,
          autoscale: true,
          minY: 0,
          maxY: 100,
          limiterMax: "",
          limiterMin: "",
          squeezeFactor: 0
        },
        {
          label: "etco2",
          order: 6,
          source1: "etco2_signal",
          source2: "",
          timeframe: 20,
          performance: 2,
          color: "0xFBE908",
          zoom: 0.7,
          grid: true,
          autoscale: true,
          minY: 0,
          maxY: 100,
          limiterMax: "etco2",
          limiterMin: "zero",
          squeezeFactor: 50
        }
      ],
 
    };
  },
  methods: {
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
    standby() {
      if (this.standbyMonitor) {
        this.alarmLo.play();
        this.alarmHi.play();
        this.standbyMonitor = false
        // start the modeing engine
        this.$root.$emit("rt_on");
        // set the buttons
        this.standbyColor = "bg-blue-10"
        this.standbyText = "MONITOR RUNNING"
        // start the pulling timer
        this.updateTimer = setInterval(() => this.getMonitorValuesFromServer(), 1000)
      } else {
        this.standbyMonitor = true
         // stop the modeling engine
         this.$root.$emit("rt_off");
        // set the buttons
        this.standbyColor = "bg-red-10"
        this.standbyText = "MONITOR STANDBY"
        // stop the pulling timer
        clearInterval(this.updateTimer)
        this.updateTimer = null
      }

    },
    showLabs() {
      this.currentLabUpdateCounter = (this.monitorValues.labUpdateCounter)
      this.labButtonColor = "bg-blue-grey-8"
      this.labButtonText = "LAB"
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q.screen.height / 2}px`;
      this.$q.dialog({
        component: LabView,
        parent: this,
        imgName: name,
        imgSize: styleImg
      });
    },
    toggleTopBar() {
      this.barVisibility = !this.barVisibility;
      if (this.barVisibility) {
        this.barText = "HIDE TOP";
      } else {
        this.barText = "SHOW TOP";
      }
      this.$root.$emit("barvisible", this.barVisibility);
    },
    toggleTimer() {
      this.timerState = !this.timerState;
      if (this.timerState) {
        this.$root.$emit("timeron");
        this.timerBtnText = "HIDE TIMER";
        this.timerBtnColor = 'bg-blue-10';
      } else {
        this.$root.$emit("timeroff");
        this.timerBtnText = "SHOW TIMER";
        this.timerBtnColor = 'bg-blue-grey-8';
      }

    },
    showImage() {
      this.currentImageUpdateCounter = (this.monitorValues.imageUpdateCounter)
      this.imageButtonColor = "bg-blue-grey-8"
      this.imageButtonText = "IMAGING"
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q.screen.height / 2}px`;
      this.$q.dialog({
        component: ImageView,
        parent: this,
        imgName: this.monitorValues.imageName,
        imgSize: styleImg
      });

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
    updateModel() {
      this.$model.setEmulatorData(this.monitorValues);
    },
    updateInterfaceWithMonitorValues() {
      // update all instructor interface components with the current monitor values
      if (this.monitorValues) {
        // check whether lab or image is available
        if (this.firstReception) {
          this.currentImageUpdateCounter = (this.monitorValues.imageUpdateCounter)
          this.currentLabUpdateCounter = (this.monitorValues.labUpdateCounter)
          this.firstReception = false
        }
        if (this.monitorValues.imageUpdateCounter != this.currentImageUpdateCounter){
          // signal button that an update is available
          this.imageButtonColor = "bg-red-10"
        }
        if (this.monitorValues.labUpdateCounter != this.currentLabUpdateCounter){
          // signal button that an update is available
          this.labButtonColor = "bg-red-10"
        }
        if (this.monitorValues.configurationUpdateCounter != this.currentConfigUpdateCounter){
          // signal button that an update is available
          this.currentConfigUpdateCounter = this.monitorValues.configurationUpdateCounter
          this.getMonitorConfigurationFromServer()
        }
        // check whether the alarm override is changed?
        if (this.monitorValues.alarmOverride != this.prevOverrideState) {
          // override has changed
          this.silenceState = this.monitorValues.alarmOverride
          this.silenceDuration = 180
          this.$root.$emit("pause", this.silenceState);
        }
        this.prevOverrideState = this.monitorValues.alarmOverride

        this.updateModel()
      }

    },
  
    updateInterfaceWithMonitorConfiguration() {
      // update all instructor interface components with the current monitor configuration
      if (this.monitorConfiguration) {
        
        this.updateModel()
      }
    },
    getMonitorConfigurationFromServer () {
      // build api url
      const url = `${this.apiUrl}/api/configs?id=${this.id}`;
      // get the monitor configuration
      axios.get(url)
        .then(res => {
          // console.log('monitor interface got monitor configuration from server')
          this.monitorConfiguration = res.data;
          this.updateInterfaceWithMonitorConfiguration()
        })
        .catch(error => {
          console.log(error);
        });
    },
    setMonitorConfigurationOnServer () {
      const url = `${this.apiUrl}/api/configs/new`;
      axios.post(url, {
          id: this.id,
          configuration: JSON.stringify(this.monitorConfiguration)
        })
        .then(res => {
          // console.log('monitor interface updated the monitor configuration')
          clearTimeout(this.configUpdateTimer)
          this.configUpdateTimer = null
        })
        .catch(error => {}
      );
    },
    // setMonitorValuesOnServer() {
    //   console.log('monitor set the values')
    //   // get the name of the selected image
    //   this.selectedImage = this.monitorValues.imageName

    //   // first check wether the websocket connection is open
    //   if (this.websocket.readyState === WebSocket.OPEN) {
    //     // now get the monitor values by constructing a message object
    //     const message = {
    //       "command": "set",
    //       "payload": this.monitorValues
    //     }
    //     this.websocket.send(JSON.stringify(message));
    //     // console.log('monitor interface updated the monitor values')
    //     clearTimeout(this.serverUpdateTimer)
    //     this.serverUpdateTimer = null
    //   }
    // },
    getMonitorValuesFromServer() {
      // first check wether the websocket connection is open
      if (this.websocket.readyState === WebSocket.OPEN) {
        // now get the monitor values by constructing a message object
        const message = {
          "command": "get",
          "payload": {
            "id": this.id
          }
        }
        this.websocket.send(JSON.stringify(message));
        // console.log('monitor interface websocket requested the monitor values.')
      }
    },

    connectToWebsocketApi() {
      // try to establish a websocket connection
      this.websocket = new WebSocket(this.webSocketUrl);

      // attach a message handler to handle recieved messages
      this.websocket.onmessage = (message) => {
        // check whether the received object is a monitor values object
        let mes = JSON.parse(message.data)
        if (mes.mes_type === "mon_values") {
          // update the monitor valeus object
          this.monitorValues = mes
          // update the monitor values in the instructor interface
          this.updateInterfaceWithMonitorValues()
          // console.log('monitor interface received monitor values from api.')
        }
      };

      // handle websocket opening
      this.websocket.onopen = () => {
        // console.log('monitor interface websocket connection with api opened.')
        

      }

      // handle websocket closing
      this.websocket.onclose = () => {
        // console.log('monitor interface websocket connection with api closed.')
        // remove the update timer
        this.updateTimer = null
      }

      // handle websocket errors
      this.websocket.onerror = (err) => {
        // console.log('monitor interface websocket connection error: ', err)
        // remove the update timer
        this.updateTimer = null
      }
    },
    onResize() {
      this.$root.$emit("resize", {
        width: this.$q.screen.width,
        height: this.$q.screen.height
      });
    },
  
    blinker() {
      this.blinkerState = !this.blinkerState;
      this.$store.commit("dataPool/blinkerState", this.blinkerState);

      // get the curve shapers
      this.satZoom1 =
        this.satZoomBase1 / this.$store.state.dataPool.curveSqueeze;
      this.satZoom2 =
        this.satZoomBase2 / this.$store.state.dataPool.curveSqueeze;
      this.abpZoom = this.abpZoomBase / this.$store.state.dataPool.curveSqueeze;

      // play the sounds
      if (this.$store.state.dataPool.alarmEnabled) {
        if (this.$store.state.dataPool.redAlarmCounter > 0) {
          this.alarmHi.play();
        } else {
          if (
            (this.$store.state.dataPool.alarmCounter > 0) &
            (this.$store.state.dataPool.blinkerState === true)
          ) {
            this.alarmLo.play();
          }
        }
      }
    }
  },
  mounted() {
    // get the user id retrieved during the login process from the store
    this.id = this.$store.state.dataPool.id;

    // if the id is empty then return to the login screen
    if (this.id === '') {
      this.$router.push("/")
      return
    }

    // if the id is not empty then build the instructor page
    // first get the api and websocket api url from the store
    this.apiUrl = this.$store.state.dataPool.apiUrl;
    this.webSocketUrl = this.$store.state.dataPool.apiWebSocketUrl;

    // get the height and the maximal width
    this.$q.dark.set(true);

    //preload the sounds into the buffer
    this.alarmHi = new Audio("/sounds/alarm_hi.wav");
    this.alarmHi.preload = "auto";
    this.alarmLo = new Audio("/sounds/alarm_lo.wav");
    this.alarmLo.preload = "auto";

    this.blinkerTimer = setInterval(this.blinker, 750);

    // get the current monitor configuration from the api
    this.getMonitorConfigurationFromServer()

    // connect to the server api websockets
    this.connectToWebsocketApi()
  },
  beforeDestroy() {
    // console.log('cleaning up monitor window')
  
    // removing the blinker timer
    this.blinkerTimer = null


    // remove the update timer
    clearInterval(this.updateTimer)
    this.updateTimer = null

    // close the websocket connection with the api
    if (this.websocket) {
      this.websocket.close()
    }
  }
};
</script>
