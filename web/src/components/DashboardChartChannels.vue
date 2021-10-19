<template>
  <q-card>
    <canvas :id="chartId" class="stage" :style="{height: height}"></canvas>
  </q-card>
</template>

<script>
/* eslint-disable */
import * as PIXI from 'pixi.js'
import ChartChannel from '../classes/ChartChannel'

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
      required: true,
      type: Object
    },
    monitorValues: {
      required: true,
      type: Object
    },
    configuration: {
      required: true,
      type: Array
    }
  },
  watch: {
    monitorConfiguration: function (newVal, oldVal)  {
      this.updateChannelsConfiguration()
    }
  },
  data () {
    return {
      pixiApp: null,
      canvas: null,
      width: 1000,
      height: 100,
      dataPointCounter: 0,
      maxDataPoints: 0,
      noOfChannels: 6,
      cursors: [],
      dataCursorFast: 0,
      dataCursorSlow: 0,
      channels: [],
      channelConfigurations: []
    }
  },
  methods: {
    updater (message) {
      if (message.data.target === 'monitor') {
        this.updateData(message.data.data)
      }
    },
    updateData (data) {
      this.channels.forEach(channel => {
        channel.update(data)
      })
    },
    onResize (newSize) {
      // get the current width of the canvas
      this.width = this.canvas.getBoundingClientRect().width
      // calculate the new height
      this.height = newSize.height / 8 * this.noOfChannels
      // resize the pixiApp renderer
      if (this.pixiApp) {
        this.pixiApp.renderer.resize(this.width, this.height)
      }
      // update the channels
      this.channels.forEach(channel => {
        channel.updateSize(this.width, this.height / this.noOfChannels)
      })
    },
    initialize () {
      // get the reference to the canvas
      this.canvas = document.getElementById(this.chartId)
      // set the detail level of the pixi js
      PIXI.settings.RESOLUTION = 2
      // define a pixi app with the canvas as view
      this.pixiApp = new PIXI.Application({
        view: this.canvas,
        transparent: false,
        antialias: true,
        backgroundColor: 0x000000
      })
      // add the pixi application to the view
      this.$el.appendChild(this.pixiApp.view)
      this.pixiApp.renderer.view.style.display = 'block'
      this.pixiApp.renderer.autoResize = true
      this.pixiApp.stage.interactive = false

      this.width = this.canvas.getBoundingClientRect().width

      // add a resize event handler
      this.$root.$on("resize", newSize => this.onResize(newSize));

      // add a event listener for the model
      this.modelEventListener = this.$model.engine.addEventListener("message", this.updater);
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
        const channel = new ChartChannel(
          this.pixiApp.stage,
          curve,
          {
            label: "ecg",
            curveLabel: "III",
            sourceCurve: "ecg_signal",
            connected: true,
            source1: "ecg_signal",
            source2: "",
            timeframe: 6,
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
          this.dataUpdateInterval,
          this.dataPointsPerUpdate,
          this.width
        )
        // add channel to array
        this.channels.push(channel)
      }

      this.initialized = true
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
              curveLabel: this.monitorConfiguration[id].curveLabel,
              connected: this.monitorConfiguration[id].connected,
              sourceCurve: this.monitorConfiguration[id].sourceCurve,
              timeframe: this.monitorConfiguration[id].timeframe,
              performance: this.monitorConfiguration[id].performance,
              channelNo: channel.channelNo,
              color: this.monitorConfiguration[id].color,
              zoom: this.monitorConfiguration[id].zoom,
              grid: this.monitorConfiguration[id].grid,
              autoscale: this.monitorConfiguration[id].autoscale,
              minY: this.monitorConfiguration[id].minY,
              maxY: this.monitorConfiguration[id].maxY,
              limiterMax: this.monitorConfiguration[id].limiterMax,
              limiterMin: this.monitorConfiguration[id].limiterMin,
              squeezeFactor: this.monitorConfiguration[id].squeezeFactor,
            }
            channel.updateConfiguration(newConfig)
          }
        })
      }
    },
  },
  mounted () {
// get the api url
    this.apiUrl = this.$store.state.dataPool.apiUrl;

    // get the patient id
    this.id = this.$store.state.dataPool.id;

    // initialize the screen
    this.initialize();

    // initialize the parameters
    this.initializeChannels();

  },
  beforeDestroy () {
    // clean up
    this.$root.$off("resize");
    this.$model.engine.removeEventListener("message", this.updater);
    this.modelEventListener = null;
    this.$el.removeChild(this.pixiApp.view);
    this.channels = [];
    this.pixiApp.destroy();
    this.pixiApp = null;
  }
}
</script>

<style>
.stage {
  width: 100%;
}
</style>
