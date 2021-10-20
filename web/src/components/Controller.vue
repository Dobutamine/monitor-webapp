<template>
    <div v-if="isEnabled" class="row q-ml-md q-mr-md q-mb-md q-mt-es">
        <q-btn v-on:click="startModel" dense :color="colorRT" class="q-mt-sm q-mr-sm col" style="max-width: 200px">
           <!-- <q-icon name="play_arrow" class="text-white" style="font-size: 1rem;" /> -->
        </q-btn>
      </div>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      isEnabled: false,
      timeToCalculate: 10,
      watchedModelsDiagram: [],
      watchedModelsChart: [],
      watchedModelsChart2: [],
      caption: 'CALCULATE',
      color: 'teal-10',
      captionRT: 'REALTIME',
      colorRT: 'teal-10',
      rtRunning: false,
      captionGOTO: 'FORWARD',
      colorGOTO: 'teal-10',
      gotoTarget: 60
    }
  },
  mounted () {
    this.buildEventListener()

    this.$root.$on('ff_on', () => this.ffOn())
    this.$root.$on('calc_on', () => this.calcOn())
    this.$root.$on('rt_on', () => this.changeStateRTOn())
    this.$root.$on('rt_off', () => this.changeStateRTOff())
    this.$root.$on('rt_watch_diagram', (e) => { this.updateWatchedModelsDiagram(e) })
    this.$root.$on('rt_watch_chart', (e) => { this.updateWatchedModelsChart(e) })
    this.$root.$on('rt_watch_chart2', (e) => { this.updateWatchedModelsChart2(e) })
    this.$root.$on('forceupdate', this.forceUpdate)
  },
  beforeDestroy () {
    this.modelEventListener = this.$model.engine.removeEventListener('message', (message) => this.processModelMessage(message))
    this.modelEventListener = null
    this.$root.$off('ff_on')
    this.$root.$off('calc_on')
    this.$root.$off('rt_on')
    this.$root.$off('rt_off')
    this.$root.$off('rt_watch_diagram')
    this.$root.$off('rt_watch_chart')
    this.$root.$off('rt_watch_chart2')
    this.$root.$off('forceupdate')
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
    },
    updateWatchedModelsDiagram (modelsToWatch) {
      this.watchedModelsDiagram = modelsToWatch
      this.updateModelsToWatchRT()
    },
    updateWatchedModelsChart (modelsToWatch) {
      this.watchedModelsChart = modelsToWatch
      this.updateModelsToWatchRT()
    },
    updateWatchedModelsChart2 (modelsToWatch) {
      this.watchedModelsChart2 = modelsToWatch
      this.updateModelsToWatchRT()
    },
    updateModelsToWatchRT () {
      const tempRTModels = this.watchedModelsChart.concat(this.watchedModelsDiagram)
      const rtModels = this.watchedModelsChart2.concat(tempRTModels)
      this.$model.setDataloggerWatchedModelsRT(rtModels)
      this.$model.setDataloggerWatchedModels(rtModels)
    },
    changeStateRTOn () {
      this.rtRunning = true
      this.$model.startModel()
      this.captionRT = 'REALTIME'
      this.colorRT = 'teal-10'
    },
    changeStateRTOff () {
      this.rtRunning = false
      this.$model.stopModel()
      this.captionRT = 'REALTIME'
      this.colorRT = 'red-10'
    },
    startModel () {
      if (this.rtRunning) {
        this.$root.$emit('rt_off')
      } else {
        this.$root.$emit('rt_on')
      }
    },
    calcOn () {
      this.caption = 'CALCULATING'
      this.color = 'negative'
    },
    calculateModel () {
      this.$root.$emit('calc_on')
      this.$model.calculateModel(this.timeToCalculate)
    },
    ffOn () {
      this.captionGOTO = 'WAIT'
      this.colorGOTO = 'negative'
    },
    fastForwardModel () {
      this.$root.$emit('ff_on')
      this.$model.fastForwardModel(this.timeToCalculate)
    },
    processModelMessage (message) {
      if (this.isEnabled) {
        switch (message.data.type) {
          case 'data':
            switch (message.data.target) {
              case 'datalogger_output':
                this.caption = 'CALCULATE'
                this.color = 'teal-10'
                this.rtRunning = false
                this.captionRT = 'REALTIME'
                this.colorRT = 'teal-10'
                this.captionGOTO = 'FORWARD'
                this.colorGOTO = 'teal-10'
              }
              break
          case 'mes':
            if (message.data.data[0] === 'ready') {
              this.captionGOTO = 'FORWARD'
              this.colorGOTO = 'teal-10'
            }
            break
        }
      }
    },
    buildEventListener () {
      this.modelEventListener = this.$model.engine.addEventListener('message', (message) => this.processModelMessage(message))
    },
    forceUpdate (e) {
      this.$forceUpdate()
      delete this.modelEventListener
      // restart the event listener
      this.buildEventListener()
    }
  }
}

</script>

<style>
.gutter {
  display: flex;
        width: 100%;
        justify-content: center;
}
</style>
