<template>
  <q-dialog v-model="confirm" ref="dialog" full-width persistent buttons>
    <q-card class="q-ma-sm">
      <div class="q-ma-md row">
        MONITOR CURVES CONFIGURATION
      </div>
   
      <div class="q-ma-sm row">
        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 1" v-model="parameter_ch1" @input="parameterChange_ch1" :options="parameters_curves" />
          </div>
          
          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="alarms enabled" v-model="alarmEnabled_ch1" value="alarmEnabled_ch1" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch1" class="q-ma-sm row">
            <q-input class="row" label="alarm upper limit" type="number" v-model="upperAlarm_ch1" value="upperAlarm_ch1" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch1"  class="q-ma-sm row">
            <q-input class="row" label="alarm lower limit" type="number" v-model="lowerAlarm_ch1" dense autofocus />
          </div>
          
          <div v-if="color_ch1_enabled" class="q-ma-sm row">
            <q-color v-model="color_ch1" default-view="palette" @change="colorChanged_ch1" no-footer dark/>
          </div>

          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="autoscale" v-model="autoscale_ch1" value="autoscale_ch1" dense autofocus />
          </div>

          <div v-if="!autoscale_ch1"  class="q-ma-sm row">
            <q-input class="row" label="scale lower limit" type="number" v-model="minY_ch1" dense autofocus />
          </div>

          <div v-if="!autoscale_ch1"  class="q-ma-sm row">
            <q-input class="row" label="scale upper limit" type="number" v-model="maxY_ch1" dense autofocus />
          </div>
          

        </div>

        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 2" v-model="parameter_ch2" @input="parameterChange_ch2" :options="parameters_curves" />
          </div>
          
          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="alarms enabled" v-model="alarmEnabled_ch2" value="alarmEnabled_ch2" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch2" class="q-ma-sm row">
            <q-input class="row" label="alarm upper limit" type="number" v-model="upperAlarm_ch2" value="upperAlarm_ch2" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch2"  class="q-ma-sm row">
            <q-input class="row" label="alarm lower limit" type="number" v-model="lowerAlarm_ch2" dense autofocus />
          </div>
        
          
          <div v-if="color_ch2_enabled" class="q-ma-sm row">
            <q-color v-model="color_ch2" default-view="palette" @change="colorChanged_ch2" no-footer dark/>
          </div>


          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="autoscale" v-model="autoscale_ch2" value="autoscale_ch2" dense autofocus />
          </div>

          <div v-if="!autoscale_ch2"  class="q-ma-sm row">
            <q-input class="row" label="scale lower limit" type="number" v-model="minY_ch2" dense autofocus />
          </div>

          <div v-if="!autoscale_ch2"  class="q-ma-sm row">
            <q-input class="row" label="scale upper limit" type="number" v-model="maxY_ch2" dense autofocus />
          </div>

        </div>

        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 3" v-model="parameter_ch3" @input="parameterChange_ch3" :options="parameters_curves" />
          </div>
          
          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="alarms enabled" v-model="alarmEnabled_ch3" value="alarmEnabled_ch3" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch3" class="q-ma-sm row">
            <q-input class="row" label="alarm upper limit" type="number" v-model="upperAlarm_ch3" value="upperAlarm_ch3" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch3"  class="q-ma-sm row">
            <q-input class="row" label="alarm lower limit" type="number" v-model="lowerAlarm_ch3" dense autofocus />
          </div>
          
          
          <div v-if="color_ch3_enabled" class="q-ma-sm row">
            <q-color v-model="color_ch3" default-view="palette" @change="colorChanged_ch3" no-footer dark/>
          </div>

          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="autoscale" v-model="autoscale_ch3" value="autoscale_ch3" dense autofocus />
          </div>

          <div v-if="!autoscale_ch3"  class="q-ma-sm row">
            <q-input class="row" label="scale lower limit" type="number" v-model="minY_ch3" dense autofocus />
          </div>

          <div v-if="!autoscale_ch3"  class="q-ma-sm row">
            <q-input class="row" label="scale upper limit" type="number" v-model="maxY_ch3" dense autofocus />
          </div>

        </div>

        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 4" v-model="parameter_ch4" @input="parameterChange_ch4" :options="parameters_curves" />
          </div>
          
          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="alarms enabled" v-model="alarmEnabled_ch4" value="alarmEnabled_ch4" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch4" class="q-ma-sm row">
            <q-input class="row" label="alarm upper limit" type="number" v-model="upperAlarm_ch4" value="upperAlarm_ch4" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch4"  class="q-ma-sm row">
            <q-input class="row" label="alarm lower limit" type="number" v-model="lowerAlarm_ch4" dense autofocus />
          </div>
          
          
          <div v-if="color_ch4_enabled" class="q-ma-sm row">
            <q-color v-model="color_ch4" default-view="palette" @change="colorChanged_ch4" no-footer dark/>
          </div>


          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="autoscale" v-model="autoscale_ch4" value="autoscale_ch4" dense autofocus />
          </div>

          <div v-if="!autoscale_ch4"  class="q-ma-sm row">
            <q-input class="row" label="scale lower limit" type="number" v-model="minY_ch4" dense autofocus />
          </div>

          <div v-if="!autoscale_ch4"  class="q-ma-sm row">
            <q-input class="row" label="scale upper limit" type="number" v-model="maxY_ch4" dense autofocus />
          </div>

        </div>

        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 5" v-model="parameter_ch5" @input="parameterChange_ch5" :options="parameters_curves" />
          </div>
          
          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="alarms enabled" v-model="alarmEnabled_ch5" value="alarmEnabled_ch5" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch5" class="q-ma-sm row">
            <q-input class="row" label="alarm upper limit" type="number" v-model="upperAlarm_ch5" value="upperAlarm_ch5" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch5"  class="q-ma-sm row">
            <q-input class="row" label="alarm lower limit" type="number" v-model="lowerAlarm_ch5" dense autofocus />
          </div>
          
          <div v-if="color_ch5_enabled" class="q-ma-sm row">
            <q-color v-model="color_ch5" default-view="palette" @change="colorChanged_ch5" no-footer dark/>
          </div>

          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="autoscale" v-model="autoscale_ch5" value="autoscale_ch5" dense autofocus />
          </div>

          <div v-if="!autoscale_ch5"  class="q-ma-sm row">
            <q-input class="row" label="scale lower limit" type="number" v-model="minY_ch5" dense autofocus />
          </div>

          <div v-if="!autoscale_ch5"  class="q-ma-sm row">
            <q-input class="row" label="scale upper limit" type="number" v-model="maxY_ch5" dense autofocus />
          </div>
        </div>

        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 6" v-model="parameter_ch6" @input="parameterChange_ch6" :options="parameters_curves" />
          </div>
          
          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="alarms enabled" v-model="alarmEnabled_ch6" value="alarmEnabled_ch6" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch6" class="q-ma-sm row">
            <q-input class="row" label="alarm upper limit" type="number" v-model="upperAlarm_ch6" value="upperAlarm_ch0" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch6"  class="q-ma-sm row">
            <q-input class="row" label="alarm lower limit" type="number" v-model="lowerAlarm_ch6" dense autofocus />
          </div>
          
          <div v-if="color_ch6_enabled" class="q-ma-sm row">
            <q-color v-model="color_ch6" default-view="palette" @change="colorChanged_ch6" no-footer dark/>
          </div>


          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="autoscale" v-model="autoscale_ch6" value="autoscale_ch6" dense autofocus />
          </div>

          <div v-if="!autoscale_ch6"  class="q-ma-sm row">
            <q-input class="row" label="scale lower limit" type="number" v-model="minY_ch6" dense autofocus />
          </div>

          <div v-if="!autoscale_ch6"  class="q-ma-sm row">
            <q-input class="row" label="scale upper limit" type="number" v-model="maxY_ch6" dense autofocus />
          </div>

        </div>

      </div>

      <!-- <q-card-actions align="center">
        <q-btn color="primary" label="DELIVERY ROOM" @click="onCancelClick" />
        <q-btn color="primary" label="ICU" @click="onCancelClick" />
        <q-btn color="primary" label="WARD" @click="onCancelClick" />
        
      </q-card-actions> -->

      <q-card-actions align="center">
        <q-btn color="secondary" label="Accept" @click="onOKClick" />
        <q-btn color="secondary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    

    </q-card>
  </q-dialog>
</template>

<script>
import { config } from 'process'
export default {
  props: {
    monitorConfiguration: {
      required: true,
      type: Object
    },
    monitorValues: {
      required: true,
      type: Object
    }
  },
  watch: {
    monitorConfiguration: function (newVal, oldVal) {
      this.updateMonitorConfigurationInterface()
    }
  },
  data() {
    return {
      confirm: false,
      parameters_curves: ['EMPTY', 'HEARTRATE', 'SAT(1)', 'SAT(2)', 'ABP', 'RESPRATE', 'ETCO2', 'CVP', 'PAP'],
      parameters_no_curve: ['EMPTY', 'Temp', 'Pols', 'NIBD', 'PFI'],
      parameter_ch1: '',
      alarmEnabled_ch1: true,
      upperAlarm_ch1: 400,
      lowerAlarm_ch1: 0,
      color_ch1: "#000000",
      color_ch1_enabled: true,
      autoscale_ch1: true,
      minY_ch1: 0,
      maxY_ch1: 100,

      parameter_ch2: '',
      alarmEnabled_ch2: true,
      upperAlarm_ch2: 400,
      lowerAlarm_ch2: 0,
      color_ch2: "#000000",
      color_ch2_enabled: true,
      autoscale_ch2: true,
      minY_ch2: 0,
      maxY_ch2: 100,


      parameter_ch3: '',
      alarmEnabled_ch3: true,
      upperAlarm_ch3: 400,
      lowerAlarm_ch3: 0,
      color_ch3: "#000000",
      color_ch3_enabled: true,
      autoscale_ch3: true,
      minY_ch3: 0,
      maxY_ch3: 100,


      parameter_ch4: '',
      alarmEnabled_ch4: true,
      upperAlarm_ch4: 400,
      lowerAlarm_ch4: 0,
      color_ch4: "#000000",
      color_ch4_enabled: true,
      autoscale_ch4: true,
      minY_ch4: 0,
      maxY_ch4: 100,


      parameter_ch5: '',
      alarmEnabled_ch5: true,
      upperAlarm_ch5: 400,
      lowerAlarm_ch5: 0,
      color_ch5: "#000000",
      color_ch5_enabled: true,
      autoscale_ch5: true,
      minY_ch5: 0,
      maxY_ch5: 100,


      parameter_ch6: '',
      alarmEnabled_ch6: true,
      upperAlarm_ch6: 400,
      lowerAlarm_ch6: 0,
      color_ch6: "#000000",
      color_ch6_enabled: true,
      autoscale_ch6: true,
      minY_ch6: 0,
      maxY_ch6: 100,

      
    }
  },
  methods: {
    parameterChange_ch6 () {
      if (this.parameter_ch6 === 'EMPTY') {
        this.color_ch6 = "#000000"
        this.alarmEnabled_ch6 = false
      } else {
        this.color_ch6 = this.defaultColor(this.parameter_ch6)
      }

    },
    colorChanged_ch6 () {

    },
    defaultColor (label) {

      switch (label) {
        case "HEARTRATE":
          return "#00F500"
          break
        case "SAT(1)":
          return "#DF32EA"
          break
        case "SAT(2)":
          return "#DF32EA"
          break
        case "ABP":
          return "#FF0000"
          break
        case "RESPRATE":
          return "#FFFFFF"
          break
        case "ETCO2":
          return "#FBE908"
          break
        case "CVP":
          return "#0080FF"
          break
        case "PAP":
          return "#F5F500"
          break
        case "Temp":
          return "#00F500"
          break
        case "Pols":
          return "#DF32EA"
          break
        case "NIBD":
          return "#FF0000"
          break
        case "PFI":
          return "#DF32EA"
          break
      }
    },
    checkSAT1(channel) {

    },
    parameterChange_ch1 () {
      if (this.parameter_ch1 === 'EMPTY') {
        this.color_ch1 = "#000000"
        this.alarmEnabled_ch1 = false
      } else {
        this.color_ch1 = this.defaultColor(this.parameter_ch1)
      }

    },
    colorChanged_ch1 () {

    },
    parameterChange_ch2 () {
      if (this.parameter_ch2 === 'EMPTY') {
        this.color_ch2 = "#000000"
        this.alarmEnabled_ch2 = false
      } else {
        this.color_ch2 = this.defaultColor(this.parameter_ch2)
      }

    },
    colorChanged_ch2 () {

    },
    parameterChange_ch3 () {
      if (this.parameter_ch3 === 'EMPTY') {
        this.color_ch3 = "#000000"
        this.alarmEnabled_ch3 = false
      } else {
        this.color_ch3 = this.defaultColor(this.parameter_ch3)
      }

    },
    colorChanged_ch3 () {

    },
    parameterChange_ch4 () {
      if (this.parameter_ch4 === 'EMPTY') {
        this.color_ch4 = "#000000"
        this.alarmEnabled_ch4 = false
      } else {
        this.color_ch4 = this.defaultColor(this.parameter_ch4)
      }

    },
    colorChanged_ch4 () {

    },
    parameterChange_ch5 () {
      if (this.parameter_ch5 === 'EMPTY') {
        this.color_ch5 = "#000000"
        this.alarmEnabled_ch5 = false
      } else {
        this.color_ch5 = this.defaultColor(this.parameter_ch5)
      }
    },
    colorChanged_ch5 () {

    },
    acceptNewConfiguration () {
      let config1 = this.setConfigurationFromCurveLabel(this.parameter_ch1)

      this.monitorConfiguration.curve1.label = config1.label
      this.monitorConfiguration.curve1.curveLabel = config1.curveLabel
      this.monitorConfiguration.curve1.source1 = config1.source1
      this.monitorConfiguration.curve1.source2 = config1.source2
      this.monitorConfiguration.curve1.sourceCurve = config1.sourceCurve
      this.monitorConfiguration.curve1.color = this.color_ch1
      this.monitorConfiguration.curve1.colorEnabled = this.color_ch1_enabled
      this.monitorConfiguration.curve1.upperAlarm = this.upperAlarm_ch1
      this.monitorConfiguration.curve1.lowerAlarm = this.lowerAlarm_ch1


      this.monitorConfiguration.curve1.autoscale = this.autoscale_ch1
      this.monitorConfiguration.curve1.minY = this.minY_ch1
      this.monitorConfiguration.curve1.maxY = this.maxY_ch1
      this.monitorConfiguration.curve1.grid = config1.grid
      this.monitorConfiguration.curve1.performance = config1.performance
      this.monitorConfiguration.curve1.zoom = config1.zoom
      this.monitorConfiguration.curve1.timeframe = config1.timeframe


      let config2 = this.setConfigurationFromCurveLabel(this.parameter_ch2)
      this.monitorConfiguration.curve2.label = config2.label
      this.monitorConfiguration.curve2.curveLabel = config2.curveLabel
      this.monitorConfiguration.curve2.source1 = config2.source1
      this.monitorConfiguration.curve2.source2 = config2.source2
      this.monitorConfiguration.curve2.sourceCurve = config2.sourceCurve
      this.monitorConfiguration.curve2.color = this.color_ch2
      this.monitorConfiguration.curve2.colorEnabled = this.color_ch2_enabled
      this.monitorConfiguration.curve2.upperAlarm = this.upperAlarm_ch2
      this.monitorConfiguration.curve2.lowerAlarm = this.lowerAlarm_ch2

      this.monitorConfiguration.curve2.autoscale = this.autoscale_ch2
      this.monitorConfiguration.curve2.minY = this.minY_ch2
      this.monitorConfiguration.curve2.maxY = this.maxY_ch2
      this.monitorConfiguration.curve2.grid = config2.grid
      this.monitorConfiguration.curve2.performance = config2.performance
      this.monitorConfiguration.curve2.zoom = config2.zoom
      this.monitorConfiguration.curve2.timeframe = config2.timeframe

      let config3 = this.setConfigurationFromCurveLabel(this.parameter_ch3)
      this.monitorConfiguration.curve3.label = config3.label
      this.monitorConfiguration.curve3.curveLabel = config3.curveLabel
      this.monitorConfiguration.curve3.source1 = config3.source1
      this.monitorConfiguration.curve3.source2 = config3.source2
      this.monitorConfiguration.curve3.sourceCurve = config3.sourceCurve
      this.monitorConfiguration.curve3.color = this.color_ch3
      this.monitorConfiguration.curve3.colorEnabled = this.color_ch3_enabled
      this.monitorConfiguration.curve3.upperAlarm = this.upperAlarm_ch3
      this.monitorConfiguration.curve3.lowerAlarm = this.lowerAlarm_ch3

      this.monitorConfiguration.curve3.autoscale = this.autoscale_ch3
      this.monitorConfiguration.curve3.minY = this.minY_ch3
      this.monitorConfiguration.curve3.maxY = this.maxY_ch3
      this.monitorConfiguration.curve3.grid = config3.grid
      this.monitorConfiguration.curve3.performance = config3.performance
      this.monitorConfiguration.curve3.zoom = config3.zoom
      this.monitorConfiguration.curve3.timeframe = config3.timeframe

      let config4 = this.setConfigurationFromCurveLabel(this.parameter_ch4)
      this.monitorConfiguration.curve4.label = config4.label
      this.monitorConfiguration.curve4.curveLabel = config4.curveLabel
      this.monitorConfiguration.curve4.source1 = config4.source1
      this.monitorConfiguration.curve4.source2 = config4.source2
      this.monitorConfiguration.curve4.sourceCurve = config4.sourceCurve
      this.monitorConfiguration.curve4.color = this.color_ch4
      this.monitorConfiguration.curve4.colorEnabled = this.color_ch4_enabled
      this.monitorConfiguration.curve4.upperAlarm = this.upperAlarm_ch4
      this.monitorConfiguration.curve4.lowerAlarm = this.lowerAlarm_ch4

      this.monitorConfiguration.curve4.autoscale = this.autoscale_ch4
      this.monitorConfiguration.curve4.minY = this.minY_ch4
      this.monitorConfiguration.curve4.maxY = this.maxY_ch4
      this.monitorConfiguration.curve4.grid = config4.grid
      this.monitorConfiguration.curve4.performance = config4.performance
      this.monitorConfiguration.curve4.zoom = config4.zoom
      this.monitorConfiguration.curve4.timeframe = config4.timeframe


      let config5 = this.setConfigurationFromCurveLabel(this.parameter_ch5)
      this.monitorConfiguration.curve5.label = config5.label
      this.monitorConfiguration.curve5.curveLabel = config5.curveLabel
      this.monitorConfiguration.curve5.source1 = config5.source1
      this.monitorConfiguration.curve5.source2 = config5.source2
      this.monitorConfiguration.curve5.sourceCurve = config5.sourceCurve
      this.monitorConfiguration.curve5.color = this.color_ch5
      this.monitorConfiguration.curve5.colorEnabled = this.color_ch5_enabled
      this.monitorConfiguration.curve5.upperAlarm = this.upperAlarm_ch5
      this.monitorConfiguration.curve5.lowerAlarm = this.lowerAlarm_ch5

      this.monitorConfiguration.curve5.autoscale = this.autoscale_ch5
      this.monitorConfiguration.curve5.minY = this.minY_ch5
      this.monitorConfiguration.curve5.maxY = this.maxY_ch5
      this.monitorConfiguration.curve5.grid = config5.grid
      this.monitorConfiguration.curve5.performance = config5.performance
      this.monitorConfiguration.curve5.zoom = config5.zoom
      this.monitorConfiguration.curve5.timeframe = config5.timeframe


      let config6 = this.setConfigurationFromCurveLabel(this.parameter_ch6)
      this.monitorConfiguration.curve6.label = config6.label
      this.monitorConfiguration.curve6.curveLabel = config6.curveLabel
      this.monitorConfiguration.curve6.source1 = config6.source1
      this.monitorConfiguration.curve6.source2 = config6.source2
      this.monitorConfiguration.curve6.sourceCurve = config6.sourceCurve
      this.monitorConfiguration.curve6.color = this.color_ch6
      this.monitorConfiguration.curve6.colorEnabled = this.color_ch6_enabled
      this.monitorConfiguration.curve6.upperAlarm = this.upperAlarm_ch6
      this.monitorConfiguration.curve6.lowerAlarm = this.lowerAlarm_ch6

      this.monitorConfiguration.curve6.autoscale = this.autoscale_ch6
      this.monitorConfiguration.curve6.minY = this.minY_ch6
      this.monitorConfiguration.curve6.maxY = this.maxY_ch6
      this.monitorConfiguration.curve6.grid = config6.grid
      this.monitorConfiguration.curve6.performance = config6.performance
      this.monitorConfiguration.curve6.zoom = config6.zoom
      this.monitorConfiguration.curve6.timeframe = config6.timeframe

      // check whether SAT(1) is chosen somewhere, if so put the Pols on channel 8
      if (this.parameter_ch1 === 'SAT(1)' || this.parameter_ch2 === 'SAT(1)' || this.parameter_ch3 === 'SAT(1)' || this.parameter_ch4 === 'SAT(1)') {
        this.monitorConfiguration.param2.alarmEnabled = false
        this.monitorConfiguration.param2.color = "#DF32EA"
        this.monitorConfiguration.param2.connected = true
        this.monitorConfiguration.param2.label = "Pulse"
        this.monitorConfiguration.param2.lowerAlarm = 80
        this.monitorConfiguration.param2.upperAlarm = 180
        this.monitorConfiguration.param2.source1 = "heartrate"
        this.monitorConfiguration.param2.source2 = ""
      } else {
        this.monitorConfiguration.param2.alarmEnabled = false
        this.monitorConfiguration.param2.color = "#000000"
        this.monitorConfiguration.param2.connected = true
        this.monitorConfiguration.param2.label = ""
        this.monitorConfiguration.param2.lowerAlarm = 80
        this.monitorConfiguration.param2.upperAlarm = 180
        this.monitorConfiguration.param2.source1 = "empty"
        this.monitorConfiguration.param2.source2 = ""
      }
      


      this.updateMonitorConfigurationOnServer()

    },
    setConfigurationFromCurveLabel (curveLabel) {
      let configObject = {
        label: '',
        curveLabel: '',
        source4: '',
        source2: '',
        sourceCurve: '',
        autoscale: true,
        minY: -40,
        maxY: 40,
        grid: true,
        performance: 4,
        zoom: 0.6,
        timeframe: 5
      }
      switch (curveLabel) {
        case "EMPTY":
          configObject.label = ''
          configObject.curveLabel = ''
          configObject.source1 = 'empty'
          configObject.source2 = ''
          configObject.sourceCurve = 'empty'

          configObject.autoscale = false
          configObject.minY = -10
          configObject.maxY = 10
          configObject.grid = false
          configObject.performance = 4
          configObject.zoom = 0
          configObject.timeframe = 5

          break;
        case "HEARTRATE":
          configObject.label = 'HR'
          configObject.curveLabel = 'III'
          configObject.source1 = 'heartrate'
          configObject.source2 = ''
          configObject.sourceCurve = 'ecg_signal'
          
          configObject.autoscale = false
          configObject.minY = -10
          configObject.maxY = 10
          configObject.grid = false
          configObject.performance = 1
          configObject.zoom = 0.6
          configObject.timeframe = 5

          break;
        case "SAT(1)":
          configObject.label = 'SAT(1)'
          configObject.curveLabel = 'SAT(1)'
          configObject.source1 = 'satPre'
          configObject.source2 = ''
          configObject.sourceCurve = 'abp_signal'

          configObject.autoscale = true
          configObject.minY = -10
          configObject.maxY = 10
          configObject.grid = true
          configObject.performance = 1
          configObject.zoom = 0.6
          configObject.timeframe = 5

          break;
        case "SAT(2)":
          configObject.label = 'SAT(2)'
          configObject.curveLabel = 'SAT(2)'
          configObject.source1 = 'satPost'
          configObject.source2 = ''
          configObject.sourceCurve = 'sat_signal'

          configObject.autoscale = true
          configObject.minY = -10
          configObject.maxY = 10
          configObject.grid = true
          configObject.performance = 1
          configObject.zoom = 0.6
          configObject.timeframe = 5

          break;
        case "ABP":
          configObject.label = 'ABP'
          configObject.curveLabel = 'ABP'
          configObject.source1 = 'abpSyst'
          configObject.source2 = 'abpDiast'
          configObject.sourceCurve = 'abp_signal'

          configObject.autoscale = true
          configObject.minY = -10
          configObject.maxY = 10
          configObject.grid = true
          configObject.performance = 1
          configObject.zoom = 0.6
          configObject.timeframe = 5
          break;
        case "RESPRATE":
          configObject.label = 'RF'
          configObject.curveLabel = 'RF'
          configObject.source1 = 'respRate'
          configObject.source2 = ''
          configObject.sourceCurve = 'resp_signal'

          configObject.autoscale = true
          configObject.minY = -10
          configObject.maxY = 10
          configObject.grid = true
          configObject.performance = 1
          configObject.zoom = 0.6
          configObject.timeframe = 20

          break;
        case "ETCO2":
          configObject.label = 'etCO2'
          configObject.curveLabel = 'etco2'
          configObject.source1 = 'etco2'
          configObject.source2 = ''
          configObject.sourceCurve = 'etco2_signal'

          configObject.autoscale = true
          configObject.minY = -10
          configObject.maxY = 10
          configObject.grid = true
          configObject.performance = 1
          configObject.zoom = 0.6
          configObject.timeframe = 20

          break;
        case "CVP":
          configObject.label = 'CVP'
          configObject.curveLabel = 'CVP'
          configObject.source1 = 'cvp'
          configObject.source2 = ''
          configObject.sourceCurve = 'cvp_signal'

          configObject.autoscale = true
          configObject.minY = -10
          configObject.maxY = 10
          configObject.grid = true
          configObject.performance = 1
          configObject.zoom = 0.6
          configObject.timeframe = 5

          break;
        case "PAP":
          configObject.label = 'PAP'
          configObject.curveLabel = 'PAP'
          configObject.source1 = 'papSyst'
          configObject.source2 = 'papDiast'
          configObject.sourceCurve = 'pap_signal'

          configObject.autoscale = true
          configObject.minY = -10
          configObject.maxY = 10
          configObject.grid = true
          configObject.performance = 1
          configObject.zoom = 0.6
          configObject.timeframe = 5
          break;
      }
      return configObject

    },
    getCurveLabelFromConfiguration (configLabel) {
      // parameters_curves: ['EMPTY', 'HEARTRATE', 'SAT(4)', 'SAT(2)', 'ABP', 'RESPRATE', 'ETCO2', 'CVP', 'PAP'],
      switch (configLabel) {
        case "empty":
          return "EMPTY"
          break
        case "HR":
          return "HEARTRATE"
          break
        case "SAT(1)":
          return "SAT(1)"
          break
        case "SAT(2)":
          return "SAT(2)"
          break
        case "ABP":
          return "ABP"
          break
        case "PAP":
          return "PAP"
          break
        case "CVP":
          return "CVP"
          break
        case "etCO2":
          return "ETCO2"
          break
        case "RF":
          return "RESPRATE"
          break
        
      }
    },
    updateMonitorConfigurationInterface () {

      this.parameter_ch1 = this.getCurveLabelFromConfiguration(this.monitorConfiguration.curve1.label)
      this.alarmEnabled_ch1 = this.monitorConfiguration.curve1.alarmEnabled
      this.upperAlarm_ch1 = this.monitorConfiguration.curve1.upperAlarm
      this.lowerAlarm_ch1 = this.monitorConfiguration.curve1.lowerAlarm
      this.autoscale_ch1 = this.monitorConfiguration.curve1.autoscale
      this.minY_ch1 = this.monitorConfiguration.curve1.minY
      this.maxY_ch1 = this.monitorConfiguration.curve1.maxY
      this.color_ch1 = this.monitorConfiguration.curve1.color
      
      this.parameter_ch2 = this.getCurveLabelFromConfiguration(this.monitorConfiguration.curve2.label)
      this.alarmEnabled_ch2 = this.monitorConfiguration.curve2.alarmEnabled
      this.upperAlarm_ch2 = this.monitorConfiguration.curve2.upperAlarm
      this.lowerAlarm_ch2 = this.monitorConfiguration.curve2.lowerAlarm
      this.color_ch2 = this.monitorConfiguration.curve2.color
      this.autoscale_ch2 = this.monitorConfiguration.curve2.autoscale
      this.minY_ch2 = this.monitorConfiguration.curve2.minY
      this.maxY_ch2 = this.monitorConfiguration.curve2.maxY

      this.parameter_ch3 = this.getCurveLabelFromConfiguration(this.monitorConfiguration.curve3.label)
      this.alarmEnabled_ch3 = this.monitorConfiguration.curve3.alarmEnabled
      this.upperAlarm_ch3 = this.monitorConfiguration.curve3.upperAlarm
      this.lowerAlarm_ch3 = this.monitorConfiguration.curve3.lowerAlarm
      this.color_ch3 = this.monitorConfiguration.curve3.color
      this.autoscale_ch3 = this.monitorConfiguration.curve3.autoscale
      this.minY_ch3 = this.monitorConfiguration.curve3.minY
      this.maxY_ch3 = this.monitorConfiguration.curve3.maxY

      this.parameter_ch4 = this.getCurveLabelFromConfiguration(this.monitorConfiguration.curve4.label)
      this.alarmEnabled_ch4 = this.monitorConfiguration.curve4.alarmEnabled
      this.upperAlarm_ch4 = this.monitorConfiguration.curve4.upperAlarm
      this.lowerAlarm_ch4 = this.monitorConfiguration.curve4.lowerAlarm
      this.color_ch4 = this.monitorConfiguration.curve4.color
      this.autoscale_ch4 = this.monitorConfiguration.curve4.autoscale
      this.minY_ch4 = this.monitorConfiguration.curve4.minY
      this.maxY_ch4 = this.monitorConfiguration.curve4.maxY

      this.parameter_ch5 = this.getCurveLabelFromConfiguration(this.monitorConfiguration.curve5.label)
      this.alarmEnabled_ch5 = this.monitorConfiguration.curve5.alarmEnabled
      this.upperAlarm_ch5 = this.monitorConfiguration.curve5.upperAlarm
      this.lowerAlarm_ch5 = this.monitorConfiguration.curve5.lowerAlarm
      this.color_ch5 = this.monitorConfiguration.curve5.color
      this.autoscale_ch5 = this.monitorConfiguration.curve5.autoscale
      this.minY_ch5 = this.monitorConfiguration.curve5.minY
      this.maxY_ch5 = this.monitorConfiguration.curve5.maxY

      this.parameter_ch6 = this.getCurveLabelFromConfiguration(this.monitorConfiguration.curve6.label)
      this.alarmEnabled_ch6 = this.monitorConfiguration.curve6.alarmEnabled
      this.upperAlarm_ch6 = this.monitorConfiguration.curve6.upperAlarm
      this.lowerAlarm_ch6 = this.monitorConfiguration.curve6.lowerAlarm
      this.color_ch6 = this.monitorConfiguration.curve6.color
      this.autoscale_ch6 = this.monitorConfiguration.curve6.autoscale
      this.minY_ch6 = this.monitorConfiguration.curve6.minY
      this.maxY_ch6 = this.monitorConfiguration.curve6.maxY

    },
    updateMonitorConfigurationOnServer() {
      this.$root.$emit('updatemonitorconfig')
      // increase the update counter
      this.monitorValues.configurationUpdateCounter += 1
      // signal the instructor component that the monitor values are changed
      this.$root.$emit('updatemonitorvitals')    
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onOKClick() {
      this.acceptNewConfiguration()
      this.$refs.dialog.hide();
    },
    onCancelClick() {
      this.$refs.dialog.hide();
    },
  },
  mounted() {
    this.updateMonitorConfigurationInterface()

  },
  beforeDestroy() {

  }

}
</script>

<style>
</style>