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
      <Buttons></Buttons>
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
import Buttons from "components/Buttons";
import AlarmBox from "components/AlarmBox";
import AlarmMessage from "components/AlarmMessage";
import MessageBox from "components/MessageBox";
import ImageView from "components/ImageView";
import Timer from "components/Timer";
import LabView from "components/LabView";

import axios from "axios";
import { clearInterval } from 'timers';

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
    Buttons,
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
      updateTimer: null,


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
    updateInterfaceWithMonitorValues() {
      // update all instructor interface components with the current monitor values
      if (this.monitorValues) {
        // console.log(this.monitorValues)
      }

    },
    updateInterfaceWithMonitorConfiguration() {
      // update all instructor interface components with the current monitor configuration
      if (this.monitorConfiguration) {
        console.log(this.monitorConfiguration)
      }
    },
    getMonitorConfigurationFromServer () {
      // build api url
      const url = `${this.apiUrl}/api/configs?id=${this.id}`;
      // get the monitor configuration
      axios.get(url)
        .then(res => {
          console.log('monitor interface got monitor configuration from server')
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
          console.log('monitor interface updated the monitor configuration')
          clearTimeout(this.configUpdateTimer)
          this.configUpdateTimer = null
        })
        .catch(error => {}
      );
    },
    setMonitorValuesOnServer() {
      // get the name of the selected image
      this.selectedImage = this.monitorValues.imageName

      // first check wether the websocket connection is open
      if (this.websocket.readyState === WebSocket.OPEN) {
        // now get the monitor values by constructing a message object
        const message = {
          "command": "set",
          "payload": this.monitorValues
        }
        this.websocket.send(JSON.stringify(message));
        console.log('monitor interface updated the monitor values')
        clearTimeout(this.serverUpdateTimer)
        this.serverUpdateTimer = null
      }
    },
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
        console.log('monitor interface websocket requested the monitor values.')
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
          console.log('monitor interface received monitor values from api.')
        }
      };

      // handle websocket opening
      this.websocket.onopen = () => {
        console.log('monitor interface websocket connection with api opened.')
        // get the current monitor values from the api (websocket) with an interval timer
        this.updateTimer = setInterval(() => this.getMonitorValuesFromServer(), 1000)
      }

      // handle websocket closing
      this.websocket.onclose = () => {
        console.log('monitor interface websocket connection with api closed.')
        // remove the update timer
        this.updateTimer = null
      }

      // handle websocket errors
      this.websocket.onerror = (err) => {
        console.log('monitor interface websocket connection error: ', err)
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

    this.$root.$on("showimage", name => {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q
        .screen.height / 2}px`;
      this.$q.dialog({
        component: ImageView,
        parent: this,
        imgName: name,
        imgSize: styleImg
      });
    });

    this.$root.$on("showlabs", name => {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q
        .screen.height / 2}px`;
      this.$q.dialog({
        component: LabView,
        parent: this,
        imgName: name,
        imgSize: styleImg
      });
    });

    // get the current monitor configuration from the api
    this.getMonitorConfigurationFromServer()

    // connect to the server api websockets
    this.connectToWebsocketApi()
  },
  beforeDestroy() {
    console.log('cleaning up monitor window')
  
    // removing the blinker timer
    this.blinkerTimer = null

    this.$root.$off("showimage");
    this.$root.$off("showlabs");

    // remove the update timer
    this.updateTimer = null

    // close the websocket connection with the api
    if (this.websocket) {
      this.websocket.close()
    }
  }
};
</script>
