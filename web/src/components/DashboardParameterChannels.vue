<template>
  <q-card>
    <canvas :id="chartId" class="stage" :style="{height: height}"></canvas>
  </q-card>
</template>

<script>
/* eslint-disable */
import { Quasar, Dialog } from 'quasar'
import * as PIXI from 'pixi.js'
import ParameterChannel from '../classes/ParameterChannel'
import ParameterChannelSmall from '../classes/ParameterChannelSmall'
import ChannelSettings from 'components/ChannelSettings'

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
    }
  },
  components: {
    ChannelSettings
  },
  data () {
    return {
      settings: false,
      pixiApp: null,
      canvas: null,
      width: 1000,
      height: 100,
      noOfChannels: 6,
      parameters: ['none','ECG', 'SAT(1)', 'SAT(2)','ABP', 'RESP', 'ETCO2', 'CVP', 'PAP'],
      parameter: 'ECG',
      min: 100,
      showNIBD: false,
      channels: [],
      channelConfigurations: [
        {
          label: 'HR',
          source1: 'heartrate',
          source2: '',
          channelNo: 1,
          color: '#5EEA32',
          alarmEnabled: true,
          lowerAlarm: 80,
          upperAlarm: 180
        },
        {
          label: 'SAT(1)',
          source1: 'satPre',
          source2: '',
          channelNo: 2,
          color: '#DF32EA',
          alarmEnabled: true,
          lowerAlarm: 88,
          upperAlarm: 100
        },
        {
          label: 'SAT(2)',
          source1: 'satPost',
          source2: '',
          channelNo: 3,
          color: '#DF32EA',
          alarmEnabled: true,
          lowerAlarm: 88,
          upperAlarm: 100
        },
        {
          label: 'ABP',
          source1: 'abpSyst',
          source2: 'abpDiast',
          channelNo: 4,
          color: '#FB0808',
          alarmEnabled: true,
          lowerAlarm: 35,
          upperAlarm: 75
        },
        {
          label: 'NIBD',
          source1: 'abpSyst',
          source2: 'abpDiast',
          channelNo: 11,
          color: '#FB0808',
          alarmEnabled: true,
          lowerAlarm: 35,
          upperAlarm: 75
        },
        {
          label: 'Tskin',
          source1: 'temp',
          source2: '',
          channelNo: 12,
          color: '#5EEA32',
          alarmEnabled: false,
          lowerAlarm: 35,
          upperAlarm: 75
        },
        {
          label: 'Pols',
          source1: 'heartrate',
          source2: '',
          channelNo: 8,
          color: '#DF32EA',
          alarmEnabled: false,
          lowerAlarm: 35,
          upperAlarm: 75
        },
        {
          label: 'PFI',
          source1: 'pfi',
          source2: '',
          channelNo: 9,
          color: '#DF32EA',
          alarmEnabled: false,
          lowerAlarm: 35,
          upperAlarm: 75
        },
        {
          label: 'RF',
          channelNo: 5,
          source1: 'respRate',
          source2: '',
          color: '#FFFFFF',
          alarmEnabled: true,
          lowerAlarm: 20,
          upperAlarm: 100
        },
        {
          label: 'etCO2',
          source1: 'etco2',
          source2: '',
          channelNo: 6,
          color: '#FBE908',
          alarmEnabled: true,
          lowerAlarm: 30,
          upperAlarm: 75
        },

      ],
      updateChannelsCounter: 0,
      updateChannelsInterval: 0.750
    }
  },
  methods: {
    changeChannelConfiguration (newconfig) {
      this.channels.forEach(channel => {
        if (channel.channelNo === newconfig.channelNo) {
          channel.updateConfiguration(newconfig)
          this.$root.$emit("changechannelchart", newconfig)
        }
      })

    },
    parameterChange () {

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
    updateData (data) {
      let alarmCounterChange = { yellow: 0, red: 0}
      this.channels.forEach(channel => {
        if (channel.caption !== 'NIBD') {
          channel.update(data)
        } else {
          if (this.showNIBD) {
            this.showNIBD = false
            channel.update(data)
          }
        }
        
        let alarmChange = channel.checkAlarm(this.$store.state.dataPool.blinkerState)
        alarmCounterChange.yellow += alarmChange.yellow
        alarmCounterChange.red += alarmChange.red
      })
      this.$store.commit('dataPool/IncreaseAlarmCounter', alarmCounterChange.yellow)
      this.$store.commit('dataPool/IncreaseRedAlarmCounter', alarmCounterChange.red)

      if (this.$store.state.dataPool.redAlarmCounter > 0) {
        this.$root.$emit('alarmmessageon', { text: '* CRITICAL *', color: 'red'})
      } else if (this.$store.state.dataPool.alarmCounter > 0) {
          this.$root.$emit('alarmmessageon', { text: '* WARNING *', color: 'yellow'})
      }

      if (this.$store.state.dataPool.alarmCounter < 1 & this.$store.state.dataPool.redAlarmCounter < 1 ) {
        this.$root.$emit('alarmmessageoff')
      }
       
    },
    initializeChannels () {
      while(this.pixiApp.stage.children[0]) { 
        this.pixiApp.stage.removeChild(this.app.children[0]);
      }
      this.channels = []
      this.channelConfigurations.forEach((channelConfiguration) => {
        if (channelConfiguration.channelNo <7) {
          const channel = new ParameterChannel (this.pixiApp.stage, channelConfiguration, this.dataUpdateInterval, this.dataPointsPerUpdate, this.width)
          channel.value.interactive = true
          channel.value.on('touchstart', (e) => this.showPopUp(e))
          channel.value.on('mousedown', (e) => this.showPopUp(e))
          this.channels.push(channel)
        }  else {
          const channel = new ParameterChannelSmall (this.pixiApp.stage, channelConfiguration, this.dataUpdateInterval, this.dataPointsPerUpdate, this.width)
          channel.value.interactive = true
          channel.value.on('touchstart', (e) => this.showPopUp(e))
          channel.value.on('mousedown', (e) => this.showPopUp(e))
          this.channels.push(channel)
        }
        
      });
    },
    showPopUp(e) {
      // find the channel properties
      this.channels.forEach(channel => {
        if (channel.channelNo === e.target.channelNo) {
          this.$q.dialog({ component: ChannelSettings, parent: this, channel: channel})
        }
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
    }
  },
  mounted () {
    this.initialize()

    this.initializeChannels()
    // add a resize event handler
    this.$root.$on('resize', (newSize) => this.onResize(newSize))

    this.$root.$on('opensettings', (e) => this.settings = true)

    this.$root.$on('newchannelconfig', (e) => this.changeChannelConfiguration(e))

    this.$root.$on('shownibd', () => this.showNIBD = true)

    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      if (message.data.target === 'monitor') {
        if (this.updateChannelsCounter > this.updateChannelsInterval) {
          this.updateChannelsCounter = 0
          this.updateData(message.data.data)
        }
        this.updateChannelsCounter += this.dataUpdateInterval
      }
    })

  }

}
</script>

<style>
.stage {
  width: 100%;
}

</style>
