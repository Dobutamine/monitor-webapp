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
    </div>
    <div v-if="enabled" class="row">
      <q-btn
        class="q-ma-sm col"
        :color="buttonColorVisibility"
        size="sm"
        @click="toggleVisibility"
      >
        {{ labelVisibility }}
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
          dark
          dense
        ></q-select>
      </q-card>
    </div>

    <div v-if="enabled" class="row">
      <q-btn class="q-ma-sm col" :color="buttonColorArm" @click="arm" size="sm">
        {{ buttonTextArm }}
      </q-btn>
    </div>
    <div v-if="enabled" class="row">
      <q-btn
        class="q-ma-sm col"
        :color="buttonStartColor"
        @click="start"
        size="sm"
      >
        {{ buttonStartText }}
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
      type: Array
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
      this.currentValueText = newVal[this.value_name]
      this.targetValue = newVal[this.value_name]
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
      buttonColorArm: "blue-10",
      buttonTextArm: "ARM",
      buttonStartColor: "teal-10",
      buttonStartText: "START",
      armed: false,
      armedBlinkStatus: false,
      startBlinkStatus: false,
      currentValue: 10,
      currentValueText: "10",
      targetValue: 20,
      running: false,
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
      timeAtOptions: [
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
      timeAtOption: "instant",
      timings: [0, 5, 10, 15, 20, 30, 60, 120, 180],
      configuration: {
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
      }
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
    changeTargetValue() {
      this.monitorValues[this.value_name] = this.targetValue
    },
    arm() {

    },
    start() {

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
