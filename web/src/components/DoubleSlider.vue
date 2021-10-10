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
        {{ currentValueText }}
      </q-card>
    </div>
    <div v-if="enabled" class="row">
      <div class="q-mb-sm col text-center" style="font-size: 10px">
        target value
      </div>
    </div>
    <div v-if="enabled" class="row">
      <q-slider
        class="col q-mb-sm"
        v-model="targetValue"
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
        v-model="targetValue"
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
    value_name: {
      required: true,
      type: String,
      default: ""
    }

  },
  watch: {
    monitorValues: function (newVal, oldVal)  {
      // watch if the monitor values are loaded from the server
      this.currentValue = newVal[this.value_name]
      this.connected = newVal[this.value_name + 'Connected']
      if (this.connected) {
        this.buttonConnectedText = "CONNECTED"
        this.buttonConnectedColor = "teal-10"
      } else {
        this.buttonConnectedText = "DISCONNECTED"
        this.buttonConnectedColor = "red-10"
      }
      if (this.step < 1) {
        this.currentValueText = newVal[this.value_name].toFixed(1)
        this.targetValue = parseFloat(newVal[this.value_name].toFixed(1))
      } else {
        this.currentValueText = newVal[this.value_name].toFixed(0)
        this.targetValue = parseFloat(newVal[this.value_name].toFixed(0))
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
      connected: true,
      currentValue: 10,
      currentValueText: "10",
      targetValue: 20,
      timeIn: 5,
      timeAt: 0,
      timeLeft: 0,
      stepSize: 0,
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
      updateTimerRunning: false
    };
  },
  methods: {
    toggleVisibility () {
  
    },
    showPopUp() {
      this.$q.dialog({
        component: ChannelSettings,
        parent: this,
        channel: null
      });
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
      this.monitorValues[this.value_name + 'Connected'] = this.connected
      this.updateCurrentValueLabel()

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
          this.targetValue = parseFloat(this.currentValue.toFixed(1))
        } else {
          this.targetValue = parseInt(this.currentValue.toFixed(0))
        }
        this.stepSize = 0
        this.buttonArmEnabled = false
        this.updateCurrentValueLabel()

      } else {
        // get the selected time in interval
        this.timeIn = this.getTheTimeInTime()
        // determine the step size
        this.stepSize = (this.targetValue - this.currentValue) / this.timeIn
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
        this.currentValueText = this.currentValue.toFixed(1)
      } else {
        this.currentValueText = this.currentValue.toFixed(0)
      }
      this.monitorValues[this.value_name] = this.currentValue
      this.$root.$emit('updatemonitorvitals')
    },
    updateParameter() {
      this.currentValue += this.stepSize
      this.timeLeft -= 1
      if (Math.abs(this.targetValue - this.currentValue) < Math.abs(this.stepSize)) {
        // ready
        this.currentValue = this.targetValue
        // reset the step size
        this.stepSize = 0
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
    changeTargetValue() {
      if (this.timeInOption === 'instant') {

        // if in instant mode then update the current value immediately
        this.currentValue = this.targetValue
        this.updateCurrentValueLabel()
      } else {
        if (this.targetValue !== this.currentValue) {
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

  }
};
</script>

<style></style>
