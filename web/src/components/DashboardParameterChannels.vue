<template>
  <q-card>
    <canvas :id="chartId" class="stage" :style="{ height: height }"></canvas>
  </q-card>
</template>

<script>
/* eslint-disable */
import axios from "axios";
import { Quasar, Dialog } from "quasar";
import * as PIXI from "pixi.js";
import ParameterChannel from "../classes/ParameterChannel";
import ParameterChannelSmall from "../classes/ParameterChannelSmall";
import ChannelSettings from "components/ChannelSettings";

export default {
  props: {
    chartId: {
      required: true,
      type: String
    },
    dataUpdateInterval: {
      required: true,
      type: Number
    },
    dataPointsPerUpdate: {
      required: true,
      type: Number
    },
    monitorConfiguration: {
      required:true,
      type: Object
    },
    monitorValues: {
      required: true,
      type: Object
    },
  },
  watch: {
    monitorConfiguration: function (newVal, oldVal)  {
      this.updateChannelsConfiguration()
    }
  },
  components: {
    ChannelSettings
  },
  data() {
    return {
      id: "",
      apiUrl: "",
      initialized: false,
      settings: false,
      pixiApp: null,
      canvas: null,
      width: 1000,
      height: 100,
      noOfChannels: 6,
      parameters: [
        "none",
        "ECG",
        "SAT(1)",
        "SAT(2)",
        "ABP",
        "RESP",
        "ETCO2",
        "CVP",
        "PAP"
      ],
      parameter: "ECG",
      min: 100,
      showNIBD: false,
      updateChannelsCounter: 0,
      updateChannelsInterval: 0.75,
    };
  },
  methods: {
    updater(message) {
      if (message.data.target === "monitor") {
        if (this.updateChannelsCounter > this.updateChannelsInterval) {
          this.updateChannelsCounter = 0;
          this.updateData(message.data.data);
        }
        this.updateChannelsCounter += this.dataUpdateInterval;
      }
    },
    updateData(data) {
      let alarmCounterChange = { yellow: 0, red: 0 };
      this.channels.forEach(channel => {
        if (channel.caption !== "NIBD") {
          channel.update(data);
        } else {
          if (this.showNIBD) {
            this.showNIBD = false;
            channel.update(data);
          }
        }

        let alarmChange = channel.checkAlarm(
          this.$store.state.dataPool.blinkerState
        );
        alarmCounterChange.yellow += alarmChange.yellow;
        alarmCounterChange.red += alarmChange.red;
      });
      this.$store.commit(
        "dataPool/IncreaseAlarmCounter",
        alarmCounterChange.yellow
      );
      this.$store.commit(
        "dataPool/IncreaseRedAlarmCounter",
        alarmCounterChange.red
      );

      if (this.$store.state.dataPool.redAlarmCounter > 0) {
        this.$root.$emit("alarmmessageon", {
          text: "* CRITICAL *",
          color: "red"
        });
      } else if (this.$store.state.dataPool.alarmCounter > 0) {
        this.$root.$emit("alarmmessageon", {
          text: "* WARNING *",
          color: "yellow"
        });
      }

      if (
        (this.$store.state.dataPool.alarmCounter < 1) &
        (this.$store.state.dataPool.redAlarmCounter < 1)
      ) {
        this.$root.$emit("alarmmessageoff");
      }
    },
    showPopUp(e) {
      // find the channel properties
      this.channels.forEach(channel => {
        if (channel.channelNo === e.target.channelNo) {
          this.$q.dialog({
            component: ChannelSettings,
            parent: this,
            channel: channel
          });
        }
      });
    },
    onResize(newSize) {
      // get the current width of the canvas
      this.width = this.canvas.getBoundingClientRect().width;
      // calculate the new height
      this.height = (newSize.height / 8) * this.noOfChannels;
      // resize the pixiApp renderer
      if (this.pixiApp) {
        this.pixiApp.renderer.resize(this.width, this.height);
      }
      // update the channels
      this.channels.forEach(channel => {
        channel.updateSize(this.width, this.height / this.noOfChannels);
      });
    },
    initialize() {
      // get the reference to the canvas
      this.canvas = document.getElementById(this.chartId);
      // set the detail level of the pixi js
      PIXI.settings.RESOLUTION = 2;
      // define a pixi app with the canvas as view
      this.pixiApp = new PIXI.Application({
        view: this.canvas,
        transparent: false,
        antialias: true,
        backgroundColor: 0x000000
      });
      // add the pixi application to the view
      this.$el.appendChild(this.pixiApp.view);
      this.pixiApp.renderer.view.style.display = "block";
      this.pixiApp.renderer.autoResize = true;
      this.pixiApp.stage.interactive = false;

      this.width = this.canvas.getBoundingClientRect().width;

      // add a resize event handler
      this.$root.$on("resize", newSize => this.onResize(newSize));

      // add a event listener for the model
      this.modelEventListener = this.$model.engine.addEventListener("message", this.updater);
    },
    updateChannelsConfiguration() {
      // only do this when the initialization has taken place
      if (this.initialized) {
        // process the modelConfiguration object
        // find channel1 in the channels list
        this.channels.forEach(channel => {
          if (channel.channelNo <= 6) {
            // these are curves
            const id = 'curve' + channel.channelNo
            const newConfig = {
              label: this.monitorConfiguration[id].label,
              visible: this.monitorConfiguration[id].connected,
              source1: this.monitorConfiguration[id].source1,
              source2: this.monitorConfiguration[id].source2,
              color: this.monitorConfiguration[id].color,
              alarmEnabled: this.monitorConfiguration[id].alarmEnabled,
              lowerAlarm: this.monitorConfiguration[id].lowerAlarm,
              upperAlarm: this.monitorConfiguration[id].upperAlarm,
            }
            channel.updateConfiguration(newConfig)
          }
          if (channel.channelNo >= 7) {
            // these are curves
            const id = 'param' + (parseInt(channel.channelNo) - 6)
            const newConfig = {
              label: this.monitorConfiguration[id].label,
              visible: this.monitorConfiguration[id].connected,
              source1: this.monitorConfiguration[id].source1,
              source2: this.monitorConfiguration[id].source2,
              color: this.monitorConfiguration[id].color,
              alarmEnabled: this.monitorConfiguration[id].alarmEnabled,
              lowerAlarm: this.monitorConfiguration[id].lowerAlarm,
              upperAlarm: this.monitorConfiguration[id].upperAlarm,
            }
            channel.updateConfiguration(newConfig)
          }
        })
      }
    },
    initializeChannels() {
      // we have to do a initial initialization but we might not yet have a monitor configuration object

      // remove all channels
      while (this.pixiApp.stage.children[0]) {
        this.pixiApp.stage.removeChild(this.pixiApp.stage.children[0]);
      }

      // empty the channels array
      this.channels = [];

      // configure channels
      // channel 1-6 are curve channels
      for (let curve=1; curve<7; curve++){
        // define a channel
        const channel = new ParameterChannel(
          this.pixiApp.stage,
          curve,
          {
            label: "",
            connected: false,
                "source1": "empty",
                "source2": "",
                "color": "#000000",
                "alarmEnabled": false,
                "lowerAlarm": 80,
                "upperAlarm": 180
          },
          this.dataUpdateInterval,
          this.dataPointsPerUpdate,
          this.width
        )
        // add channel to array
        this.channels.push(channel)
      }
      // channel 7-12 are parameter channels
      for (let curve=7; curve<13; curve++){
        // define a channel
        const channel = new ParameterChannelSmall(
          this.pixiApp.stage,
          curve,
          {
            label: "",
            connected: false,
                "source1": "empty",
                "source2": "",
                "color": "#000000",
                "alarmEnabled": false,
                "lowerAlarm": 80,
                "upperAlarm": 180
          },
          this.dataUpdateInterval,
          this.dataPointsPerUpdate,
          this.width
        )
        // add channel to array
        this.channels.push(channel)
      }

      this.initialized = true
    },

  },
  mounted() {
    // get the api url
    this.apiUrl = this.$store.state.dataPool.apiUrl;

    // get the patient id
    this.id = this.$store.state.dataPool.id;

    // initialize the screen
    this.initialize();

    // initialize the parameters
    this.initializeChannels();

  },
  beforeDestroy() {
    // reset the alarm counters
    this.$store.commit("dataPool/ResetAlarmCounter");
    this.$store.commit("dataPool/ResetRedAlarmCounter");
    // clean up
    this.$root.$off("resize");
    this.$model.engine.removeEventListener("message", this.updater);
    this.modelEventListener = null;
    this.$el.removeChild(this.pixiApp.view);
    this.channels = [];
    this.pixiApp.destroy();
    this.pixiApp = null;
  }
};
</script>

<style>
.stage {
  width: 100%;
}
</style>
