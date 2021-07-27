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
    configuration: {
      required: true,
      type: Array
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
    changeChannelColor(args) {
      this.channels.forEach(channel => {
        if (channel.label === args.label) {
          channel.setChannelColor(args.color)
        }
      })

    },
    changeChannelState(newconfig) {
      console.log(newconfig)
      this.channels.forEach(channel => {
        console.log(channel)
      })
    },
    changeChannelConfig(newconfig) {
      // process parameter change

      // convert the newconfig to the newconfig for charts
      switch (newconfig.source1) {
        case "empty":
          newconfig.label = ''
          newconfig.source1 = 'empty'
          newconfig.source2 = ''
          break
        case 'heartrate':
          newconfig.label = 'III'
          newconfig.source1 = 'ecg_signal'
          newconfig.source2 = ''
          break
        case 'satPre':
          newconfig.label = 'Pleth(1)'
          newconfig.source1 = 'sat_signal'
          newconfig.source2 = ''
          break
        case 'satPost':
          newconfig.label = 'Pleth(2)'
          newconfig.source1 = 'sat_signal'
          newconfig.source2 = ''
          break
        case 'abpSyst':
          newconfig.label = 'abp'
          newconfig.source1 = 'abp_signal'
          newconfig.source2 = ''
          break
        case 'respRate':
          newconfig.label = 'RF'
          newconfig.source1 = 'resp_signal'
          newconfig.source2 = ''
          break
        case 'etco2':
          newconfig.label = 'etco2'
          newconfig.source1 = 'etco2_signal'
          newconfig.source2 = ''
          break
      }

      // find new parameter in current configuration
      let combinedConfiguration = {}
      this.channelConfigurations.forEach(channelConfiguration => {
        if (channelConfiguration.source1 === newconfig.source1) {
          channelConfiguration.order = newconfig.channelNo
          channelConfiguration.color = newconfig.color
          combinedConfiguration = channelConfiguration
        }
      })

      // now update the correct channel with the new configuration
      this.channels.forEach(channel => {
        if (channel.channelNo === combinedConfiguration.order) {
          channel.updateConfiguration(combinedConfiguration)
        }
      })
    },
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
    initializeChannels () {
      while(this.pixiApp.stage.children[0]) { 
        this.pixiApp.stage.removeChild(this.app.children[0]);
      }
      this.channels = []
      this.channelConfigurations.forEach((channelConfiguration) => {
        const channel = new ChartChannel (this.pixiApp.stage, channelConfiguration, this.dataUpdateInterval, this.dataPointsPerUpdate, this.width)
        this.channels.push(channel)
      });
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
      // initialize all the data channels
      this.initializeChannels()
    }
  },
  beforeMount () {
  },
  mounted () {
    this.channelConfigurations = this.configuration

    // initialize the pixi app
    this.initialize()

    // add a resize event handler
    this.$root.$on('resize', (newSize) => this.onResize(newSize))

    this.$root.$on('newlayout', (layout) => {
      this.channelConfigurations = layout
      this.initialize()
    })

    this.$root.$on('changechannelchart', (newconfig) => this.changeChannelConfig(newconfig))

    this.$root.$on('switchchannel', (newconfig) => this.changeChannelState(newconfig))

    // add a data update event handler
    this.modelEventListener = this.$model.engine.addEventListener('message', this.updater)
  },
  beforeDestroy () {
    // clean up
    this.$root.$off('resize')
    this.$root.$off('newlayout')
    this.$root.$off('changechannelchart')
    this.$root.$off('switchchannel')
    this.$model.engine.removeEventListener('message', this.updater)
    this.modelEventListener = null
    this.$el.removeChild(this.pixiApp.view)
    this.channels = []
    this.pixiApp.destroy()
    this.pixiApp = null
  }
}
</script>

<style>
.stage {
  width: 100%;
}
</style>
