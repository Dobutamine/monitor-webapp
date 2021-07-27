<template>
  <q-page padding class="bg-black">
    <div class="row justify-center items-start q-ma-es">
      <div class="col text-center">
        <MessageBox></MessageBox>
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
          <DashboardChartChannels chartId="100" :configuration="channelConfigurations" :dataUpdateInterval="0.025" :dataPointsPerUpdate="5"></DashboardChartChannels>
        </div>
        <div :class="parameterCols">
          <DashboardParameterChannels chartId="300" :dataUpdateInterval="0.025" :dataPointsPerUpdate="5"></DashboardParameterChannels>
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
import Controller from 'components/Controller'
import DashboardChartChannels from 'components/DashboardChartChannels'
import DashboardParameterChannels from 'components/DashboardParameterChannels'
import Vital from 'components/Vital'
import Buttons from 'components/Buttons'
import AlarmBox from 'components/AlarmBox'
import AlarmMessage from 'components/AlarmMessage'
import MessageBox from 'components/MessageBox'
import ImageView from 'components/ImageView'

export default {
  name: 'PageIndex',
  components: {
    DashboardChartChannels,
    DashboardParameterChannels,
    Controller,
    Vital,
    AlarmBox,
    MessageBox,
    AlarmMessage,
    Buttons,
    ImageView
  },
  data () {
    return {
      height: '2024px',
      chartCols: 'col-9 text-center',
      parameterCols: 'col-3 text-center',
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
          label: '',
          order: 0,
          source1: 'empty',
          source2: '',
          timeframe: 5,
          performance: 1,
          color:'0x000000',
          zoom: 0.6,
          grid: false,
          autoscale: false,
          minY: -10,
          maxY: 20,
          limiterMax: '',
          limiterMin: '',
          squeezeFactor: 0,
        },
        {
          label: 'ecg',
          order: 1,
          source1: 'ecg_signal',
          source2: '',
          timeframe: 5,
          performance: 1,
          color:'0x5EEA32',
          zoom: 0.6,
          grid: false,
          autoscale: false,
          minY: -10,
          maxY: 10,
          limiterMax: '',
          limiterMin: '',
          squeezeFactor: 0,
        },
        {
          label: 'Pleth(1)',
          order: 2,
          source1: 'sat_signal',
          source2: '',
          timeframe: 5,
          performance: 1,
          color:'0xDF32EA',
          zoom: 0.6,
          grid: true,
          autoscale: true,
          minY: 0,
          maxY: 100,
          limiterMax: 'abpSyst',
          limiterMin: 'abpDiast',
          squeezeFactor: 30
        },
        {
          label: 'Pleth(2)',
          order: 3,
          source1: 'sat_signal',
          source2: '',
          timeframe: 5,
          performance: 1,
          color:'0xDF32EA',
          zoom: 0.4,
          grid: true,
          autoscale: true,
          minY: 0,
          maxY: 100,
          limiterMax: 'abpSyst',
          limiterMin: 'abpDiast',
          squeezeFactor: 30
        },
        {
          label: 'abp',
          order: 4,
          source1: 'abp_signal',
          source2: '',
          timeframe: 5,
          performance: 1,
          color:'0xFB0808',
          zoom: 0.7,
          grid: true,
          autoscale: true,
          minY: 0,
          maxY: 100,
          limiterMax: 'abpSyst',
          limiterMin: 'abpDiast',
          squeezeFactor: 30,
        },
        {
          label: 'RF',
          order: 5,
          source1: 'resp_signal',
          source2: '',
          timeframe: 20,
          performance: 2,
          color:'0xffffff',
          zoom: 0.7,
          grid: false,
          autoscale: true,
          minY: 0,
          maxY: 100,
          limiterMax: '',
          limiterMin: '',
          squeezeFactor: 0,
        },
        {
          label: 'etco2',
          order: 6,
          source1: 'etco2_signal',
          source2: '',
          timeframe: 20,
          performance: 2,
          color:'0xFBE908',
          zoom: 0.7,
          grid: true,
          autoscale: true,
          minY: 0,
          maxY: 100,
          limiterMax: 'etco2',
          limiterMin: 'zero',
          squeezeFactor: 50,
        }
      ]
    }
  },
  methods: {
    onResize () {
      this.$root.$emit('resize', { width: this.$q.screen.width, height: this.$q.screen.height })
    },
    switchTrends (state) {
      if (state) {
        this.chartCols = 'col-6 text-center'
        this.trendCols = 'col-3 text-center'
      } else {
        this.chartCols = 'col-9 text-center'
        this.trendCols = 'col text-center'
      }
    },
    blinker () {
      this.blinkerState = !this.blinkerState
      this.$store.commit('dataPool/blinkerState', this.blinkerState)

      // get the curve shapers
      this.satZoom1 = this.satZoomBase1 / this.$store.state.dataPool.curveSqueeze
      this.satZoom2 = this.satZoomBase2 / this.$store.state.dataPool.curveSqueeze
      this.abpZoom = this.abpZoomBase / this.$store.state.dataPool.curveSqueeze

      // play the sounds
      if (this.$store.state.dataPool.alarmEnabled) {
        if (this.$store.state.dataPool.redAlarmCounter > 0) {
          this.alarmHi.play()
        } else {
          if (this.$store.state.dataPool.alarmCounter > 0 & this.$store.state.dataPool.blinkerState === true ) {
          this.alarmLo.play()
          }
        }
      }
    }
  },
  mounted () {
    // attach an event handler to the model instance
    this.height = (this.$q.screen.height - 50) + 'px'
    this.max_width = this.$q.screen.width
    this.$q.dark.set(true)

    this.$root.$on('trends', (state) => { this.switchTrends(state) })
    this.alarmHi = new Audio('/sounds/alarm_hi.wav')
    this.alarmHi.preload = 'auto'
    this.alarmLo = new Audio('/sounds/alarm_lo.wav')
    this.alarmLo.preload = 'auto'

    this.blinkerTimer = setInterval(this.blinker, 750)

    this.$root.$on('showimage', (no) => {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q.screen.height / 2}px`
      console.log(styleImg)
      this.$q.dialog({ component: ImageView, parent: this, image_no: 2, imgSize: styleImg})
    })
  },
  beforeUnmount () {
    this.$root.$off('trends', (state) => { this.switchTrends(state) })
    this.$root.$off('resize')
    this.$root.$off('showimage')
  },
  beforeDestroy () {
    clearInterval(this.blinkerTimer)
    this.$root.$off('trends', (state) => { this.switchTrends(state) })
  }
}
</script>
