<template>
  <q-card class="q-pa-sm" bordered>
    <div class="row">
      <q-btn
        class="q-ma-sm col"
        :color="buttonColorEnabled"
        size="sm"
        @click="toggleEnabled"
      >
        {{ label }}
      </q-btn>
    </div>
    <div v-if="enabled" class="row">
      <q-card
        class="q-ml-sm q-mr-sm q-mb-sm q-pa-xs col bg-black text-center text-h5"
        bordered
      >
        {{ currentValue1Text }}/{{ currentValue2Text }}
      </q-card>
    </div>
    <div v-if="enabled" class="row">
      <!-- <div class="q-mb-sm col text-center" style="font-size: 10px">
        <q-btn size="xs" :class="linkButtonColor" @click="linkValues">link</q-btn>
      </div> -->
      <div class="q-mb-sm col text-center" style="font-size: 10px">
        target value
      </div>
    </div>
    <div v-if="enabled" class="row">
      <q-slider
        class="col q-mb-sm"
        v-model="targetValue1"
        color="teal-10"
        label-color="red-10"
        :min="min"
        :max="max"
        :step="step"
        vertical
        reverse
        dark
        label
        label-always
        @change="changeTargetValue"
      />
      <q-slider
        class="col q-mb-sm"
        v-model="targetValue2"
        color="teal-10"
        label-color="red-10"
        :min="min"
        :max="max"
        :step="step"
        vertical
        reverse
        dark
        label
        label-always
        @change="changeTargetValue"
      />
    </div>
    <div v-if="enabled" class="row">
      <q-btn
        class="q-ma-sm col"
        :color="buttonConnectedColor"
        size="sm"
        @click="toggleConnected"
      >
        {{ buttonConnectedText }}
      </q-btn>
    </div>
    <div v-if="enabled" class="row">
      <q-card
        class="q-ml-sm q-mr-sm q-pl-sm q-pr-sm q-pb-sm col bg-black"
        style="font-size: 10px"
        bordered
      >
        <q-select
          label="in time"
          v-model="timeInOption"
          :options="timeInOptions"
          @input="timeInChanged"
          dark
          dense
        ></q-select>
      </q-card>
    </div>

    <div v-if="enabled & buttonArmEnabled" class="row">
      <q-btn class="q-ma-sm col" :color="buttonColorArm" @click="startChangingParameter" size="sm">
        {{ buttonTextArm }}
      </q-btn>
    </div>
  </q-card>
</template>

<script>
import ChannelSettings from "components/ChannelSettings";

/* eslint-disable */
export default {
  components: {
    ChannelSettings
  },
  props: {
    monitorValues: {
      required: true,
      type: Object
    },
    monitorConfiguration: {
      required: true,
      type: Object
    },
    min: {
      required: true,
      type: Number
    },
    max: {
      required: true,
      type: Number
    },
    step: {
      required: true,
      type: Number
    },
    label: {
      required: true,
      type: String
    },
    value_name1: {
      required: true,
      type: String,
      default: ""
    },
    value_name2: {
      required: true,
      type: String,
      default: ""
    }


  },
  watch: {
    value_name1: function (newVal, oldVal) {
      this.valueConnectedName = newVal.substring(0,3) + 'Connected'
    },
    monitorValues: function (newVal, oldVal)  {
      // watch if the monitor values are loaded from the server
      this.currentValue1 = newVal[this.value_name1]
      this.currentValue2 = newVal[this.value_name2]
      this.valueConnectedName = this.value_name1.substring(0,3) + 'Connected'
    
      this.connected = newVal[this.valueConnectedName]
      if (this.connected) {
        this.buttonConnectedText = "CONNECTED"
        this.buttonConnectedColor = "teal-10"
      } else {
        this.buttonConnectedText = "DISCONNECTED"
        this.buttonConnectedColor = "red-10"
      }
      if (this.step < 1) {
        this.currentValue1Text = newVal[this.value_name1].toFixed(1)
        this.targetValue1 = parseFloat(newVal[this.value_name1].toFixed(1))

        this.currentValue2Text = newVal[this.value_name2].toFixed(1)
        this.targetValue2 = parseFloat(newVal[this.value_name2].toFixed(1))

      } else {
        this.currentValue1Text = newVal[this.value_name1].toFixed(0)
        this.targetValue1 = parseFloat(newVal[this.value_name1].toFixed(0))

        this.currentValue2Text = newVal[this.value_name2].toFixed(0)
        this.targetValue2 = parseFloat(newVal[this.value_name2].toFixed(0))


      }
      
      
    },
    monitorConfiguration: function (newVal, oldVal) {
      // console.log(newVal)
    }

  },
  data() {
    return {
      enabled: true,
      visibile: true,
      labelVisibility: 'CONNECTED',
      buttonColorVisibility: "teal-10",
      buttonColorEnabled: "teal-10",
      buttonArmEnabled: false,
      buttonColorArm: "blue-10",
      buttonTextArm: "START",
      buttonStartColor: "teal-10",
      buttonStartText: "START",
      buttonConnectedText: "CONNECTED",
      buttonConnectedColor: "teal-10",
      linkButtonColor: 'bg-teal-10',
      linkStatus: true,
      connected: true,
      currentValue1: 10,
      currentValue1Text: "10",
      targetValue1: 20,
      currentValue2: 10,
      currentValue2Text: "10",
      targetValue2: 20,
      valueConnectedName: 'abpConnected',
      timeIn: 5,
      timeAt: 0,
      timeLeft: 0,
      stepSize1: 0,
      stepSize2: 0,
      timeInOptions: [
        "instant",
        "5 sec",
        "10 sec",
        "15 sec",
        "20 sec",
        "30 sec",
        "1 min",
        "2 min",
        "3 min"
      ],
      timeInOption: "instant",
      timings: [0, 5, 10, 15, 20, 30, 60, 120, 180],
      updateTimer: null,
      updateTimerRunning: false,
      prevTargetValue1: 0,
      prevTargetValue2: 0,
    };
  },
  methods: {
    linkValues() {
      if (this.linkStatus) {
        this.linkStatus = false
        this.linkButtonColor="bg-red-10"
      } else {
        this.linkStatus = true
        this.linkButtonColor="bg-teal-10"
      }
    },
    toggleEnabled() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.buttonColorEnabled = "teal-10";
      } else {
        this.buttonColorEnabled = "red-10";
      }
    },
    toggleConnected() {
      if (this.connected) {
        this.connected = false
        this.buttonConnectedText = "DISCONNECTED"
        this.buttonConnectedColor = "red-10"
      } else {
        this.connected = true
        this.buttonConnectedText = "CONNECTED"
        this.buttonConnectedColor = "teal-10"
      }
      // find the channel in monitorConfiguration object which has the value_name 
      if (this.monitorConfiguration.curve1.source1 === this.value_name1) {
        this.monitorConfiguration.curve1.connected = this.connected
      }
      if (this.monitorConfiguration.curve2.source1 === this.value_name1) {
        this.monitorConfiguration.curve2.connected = this.connected
      }
      if (this.monitorConfiguration.curve2.source1 === this.value_name1) {
        this.monitorConfiguration.curve2.connected = this.connected
      }
      if (this.monitorConfiguration.curve3.source1 === this.value_name1) {
        this.monitorConfiguration.curve3.connected = this.connected
      }
      if (this.monitorConfiguration.curve4.source1 === this.value_name1) {
        this.monitorConfiguration.curve4.connected = this.connected
      }
      if (this.monitorConfiguration.curve5.source1 === this.value_name1) {
        this.monitorConfiguration.curve5.connected = this.connected
      }
      if (this.monitorConfiguration.curve6.source1 === this.value_name1) {
        this.monitorConfiguration.curve6.connected = this.connected
      }

      if (this.monitorConfiguration.param1.source1 === this.value_name1) {
        this.monitorConfiguration.param1.connected = this.connected
      }
      if (this.monitorConfiguration.param2.source1 === this.value_name1) {
        this.monitorConfiguration.param2.connected = this.connected
      }
      if (this.monitorConfiguration.param3.source1 === this.value_name1) {
        this.monitorConfiguration.param3.connected = this.connected
      }
      if (this.monitorConfiguration.param4.source1 === this.value_name1) {
        this.monitorConfiguration.param4.connected = this.connected
      }
      if (this.monitorConfiguration.param5.source1 === this.value_name1) {
        this.monitorConfiguration.param5.connected = this.connected
      }
      if (this.monitorConfiguration.param6.source1 === this.value_name1) {
        this.monitorConfiguration.param6.connected = this.connected
      }

      this.$root.$emit('updatemonitorconfig')
      // set the monitorvalues connected => not functional for now
      this.monitorValues[this.value_name + 'Connected'] = this.connected
      // increase the update counter
      this.monitorValues.configurationUpdateCounter += 1
      // signal the instructor component that the monitor values are changed
      this.$root.$emit('updatemonitorvitals')  

    },
    startChangingParameter() {
      if (this.updateTimerRunning) {
        this.updateTimerRunning = false
        this.buttonColorArm = "blue-10"
        this.buttonTextArm = "START"
        // clear the interval timer
        clearInterval(this.updateTimer)
        this.updateTimer = null
        // set the target value to the current value
        if (this.step < 1) {
          this.targetValue1 = parseFloat(this.currentValue1.toFixed(1))
          this.targetValue2 = parseFloat(this.currentValue2.toFixed(1))
        } else {
          this.targetValue1 = parseInt(this.currentValue1.toFixed(0))
          this.targetValue2 = parseInt(this.currentValue2.toFixed(0))
        }
        this.stepSize1 = 0
        this.stepSize2 = 0
        this.buttonArmEnabled = false
        this.updateCurrentValueLabel()

      } else {
        // get the selected time in interval
        this.timeIn = this.getTheTimeInTime()
        // determine the step size
        this.stepSize1 = (this.targetValue1 - this.currentValue1) / this.timeIn
        this.stepSize2 = (this.targetValue2 - this.currentValue2) / this.timeIn
        this.timeLeft = this.timeIn - 1
        // change button state
        this.buttonColorArm = "red-10"
        this.buttonTextArm = `RUNNING ${this.timeLeft} SEC.`
        
        // start the timer
        this.updateTimer = setInterval(() => this.updateParameter(), 1000)
        this.updateTimerRunning = true
      }
    },
    updateCurrentValueLabel() {
      if (this.step < 1) {
        this.currentValue1Text = this.currentValue1.toFixed(1)
        this.currentValue2Text = this.currentValue2.toFixed(1)
      } else {
        this.currentValue1Text = this.currentValue1.toFixed(0)
        this.currentValue2Text = this.currentValue2.toFixed(0)
      }
      this.monitorValues[this.value_name1] = this.currentValue1
      this.monitorValues[this.value_name2] = this.currentValue2
      this.$root.$emit('updatemonitorvitals')
    },
    updateParameter() {
      this.currentValue1 += this.stepSize1
      this.currentValue2 += this.stepSize2
      this.timeLeft -= 1

      if (Math.abs(this.targetValue1 - this.currentValue1) < Math.abs(this.stepSize1)) {
         this.currentValue1 = this.targetValue1
         this.stepSize1 = 0
      }

      if (Math.abs(this.targetValue2 - this.currentValue2) < Math.abs(this.stepSize2)) {
        // ready
        this.currentValue2 = this.targetValue2
        // reset the step size
        this.stepSize2 = 0
      }

      if (this.stepSize1 === 0 && this.stepSize2 === 0) {
        // clear the interval timer
        clearInterval(this.updateTimer)
        this.updateTimer = null
        // reset the button
        this.buttonColorArm = "blue-10"
        this.buttonTextArm = "START"
        this.buttonArmEnabled = false
        this.updateTimerRunning = false
      } else {
        this.buttonTextArm = `RUNNING ${this.timeLeft} SEC.`
      }
      
      this.updateCurrentValueLabel()

    },
    timeInChanged () {
      // if (this.timeInOption === 'instant') {
      //   this.buttonArmEnabled = false
      // } else {
      //   this.buttonArmEnabled = true
      // }
    },
    changeTargetValue(e) {
      if (this.timeInOption === 'instant') {

        // if in instant mode then update the current value immediately
        this.currentValue1 = this.targetValue1
        this.currentValue2 = this.targetValue2
        this.updateCurrentValueLabel()
      } else {
        if (this.targetValue1 !== this.currentValue1 || this.targetValue2 !== this.currentValue2) {
          this.buttonArmEnabled = true
        }
      }
    },
    getTheTimeInTime() {
      const foundIndex = this.timeInOptions.indexOf(this.timeInOption);
      if (foundIndex > -1) {
        return this.timings[foundIndex];
      } else {
        return 1;
      }
    },

  },
  mounted() {

  },
  beforeDestroy() {
    clearInterval(this.updateTimer)
    this.updateTimer = null

  }
};
</script>

<style></style>
