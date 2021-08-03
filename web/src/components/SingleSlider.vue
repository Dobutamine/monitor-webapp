<template>
  <q-card class="q-pa-sm" bordered>
    <div class="row">
      <q-btn
        class="q-ma-sm col"
        :color="buttonColorEnabled"
        size="sm"
        @click="showPopUp"
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
      <q-card
        class="q-ml-sm q-mr-sm q-pl-sm q-pr-sm q-pb-sm col bg-black"
        style="font-size: 10px"
        bordered
      >
        <q-select
          label="in time"
          v-model="timeInOption"
          :options="timeInOptions"
          @change="changeTimeIn"
          dark
          dense
        ></q-select>
      </q-card>
    </div>
    <div v-if="enabled" class="row">
      <q-card
        class="q-ml-sm q-mr-sm q-pl-sm q-pr-sm q-pb-sm col bg-black"
        style="font-size: 10px"
        bordered
      >
        <q-select
          label="at time"
          v-model="timeAtOption"
          :options="timeAtOptions"
          @change="changeTimeAt"
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
  computed: {
    drawerState: {
      get() {
        return this.$store.state.dataPool.drawerState;
      },
      set(val) {
        this.$store.commit("dataPool/updateDrawerState", val);
      }
    }
  },
  components: {
    ChannelSettings
  },
  props: {
    value: {
      required: true,
      type: Number
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
    }
  },
  data() {
    return {
      enabled: true,
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
    showPopUp() {
      this.$q.dialog({
        component: ChannelSettings,
        parent: this,
        channel: null
      });
    },
    changeTimeIn(e) {
      console.log(e);
    },
    changeTimeAt(e) {
      console.log(e);
    },
    toggleEnabled() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.buttonColorEnabled = "teal-10";
      } else {
        this.buttonColorEnabled = "red-10";
      }
      this.updateValues();
    },
    changeTargetValue() {
      this.stepSize = 0;
      this.running = false;
      this.buttonStartColor = "teal-10";
      this.buttonStartText = "START";

      this.buttonColorArm = "blue-10";
      this.buttonTextArm = "ARM";
      this.armed = false;

      if (this.targetValue != this.currentValue) {
        if (this.timeInOption != "instant") {
          this.buttonColorArm = "red-10";
          this.buttonTextArm = "ARMED";
          this.armed = true;
          this.currentValueText =
            this.currentValue.toFixed(1) + " -> " + this.targetValue;
        } else {
          this.currentValue = this.targetValue;
          this.buttonColorArm = "blue-10";
          this.buttonTextArm = "ARM";
          this.armed = false;
          this.currentValueText = this.currentValue;
        }
      } else {
        this.buttonColorArm = "blue-10";
        this.buttonTextArm = "ARM";
        this.armed = false;
        this.currentValueText = this.currentValue;
      }
    },
    arm() {
      this.stepSize = 0;
      this.armed = false;
      this.buttonColorArm = "blue-10";
      this.buttonTextArm = "ARM";
      this.running = false;
      this.buttonStartColor = "teal-10";
      this.buttonStartText = "START";
      this.currentValueText = this.currentValue;
    },
    start() {
      if (!this.running) {
        this.armed = false;
        this.buttonColorArm = "blue-10";
        this.buttonTextArm = "ARM";
        this.buttonStartColor = "red-10";
        this.buttonStartText = "RUNNING";
        this.running = true;
        this.timeIn = this.getTheTimeInTime();
        this.timeLeft = this.timeIn;
        this.stepSize = (this.targetValue - this.currentValue) / this.timeIn;
      } else {
        this.stepSize = 0;
        this.running = false;
        this.buttonStartColor = "teal-10";
        this.buttonStartText = "START";
        this.currentValueText = this.currentValue;
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
    setDataFromOutside(data) {
      switch (this.label) {
        case "HEARTRATE":
          this.currentValue = data.heartrate;
          this.currentValueText = this.currentValue.toString();
          this.targetValue = data.heartrate;
          break;
        case "SAT PRE":
          this.currentValue = data.satPre;
          this.currentValueText = this.currentValue.toString();
          this.targetValue = data.satPre;
          break;
        case "SAT POST":
          this.currentValue = data.satPost;
          this.currentValueText = this.currentValue.toString();
          this.targetValue = data.satPost;
          break;
        case "RESP RATE":
          this.currentValue = data.respRate;
          this.currentValueText = this.currentValue.toString();
          this.targetValue = data.respRate;
          break;
        case "ETCO2":
          this.currentValue = data.etco2;
          this.currentValueText = this.currentValue.toString();
          this.targetValue = data.etco2;
          break;
        case "TEMPERATURE":
          this.currentValue = data.temp;
          this.currentValueText = this.currentValue.toString();
          this.targetValue = data.temp;
          break;
        case "PFI":
          this.currentValue = data.pfi;
          this.currentValueText = this.currentValue.toString();
          this.targetValue = data.pfi;
          break;
      }
    },
    updateValues() {
      switch (this.label) {
        case "HEARTRATE":
          this.$store.commit("dataPool/heartrate", this.currentValue);
          break;
        case "SAT PRE":
          this.$store.commit("dataPool/satPre", this.currentValue);
          break;
        case "SAT POST":
          this.$store.commit("dataPool/satPost", this.currentValue);
          break;
        case "RESP RATE":
          this.$store.commit("dataPool/respRate", this.currentValue);
          break;
        case "ETCO2":
          this.$store.commit("dataPool/etco2", this.currentValue);
          break;
        case "TEMPERATURE":
          this.$store.commit("dataPool/temp", this.currentValue);
          break;
        case "PFI":
          this.$store.commit("dataPool/pfi", this.currentValue);
          break;
      }
    },
    blinker() {
      this.updateValues();
      if (this.armed) {
        this.armedBlinkStatus = !this.armedBlinkStatus;
        if (this.armedBlinkStatus) {
          this.buttonColorArm = "black-10";
        } else {
          this.buttonColorArm = "red-10";
        }
      }

      if (this.running) {
        this.timeLeft -= 1;
        this.currentValue += this.stepSize;
        if (
          Math.abs(this.currentValue - this.targetValue) <
          Math.abs(this.stepSize)
        ) {
          this.currentValue = this.targetValue;
          this.stepSize = 0;
          this.running = false;
          this.buttonStartColor = "teal-10";
          this.buttonStartText = "START";
          this.currentValueText = this.currentValue;
        } else {
          this.currentValueText =
            this.currentValue.toFixed(1) + " -> " + this.targetValue;
          this.startBlinkStatus = !this.startBlinkStatus;
          if (this.startBlinkStatus) {
            this.buttonStartColor = "black-10";
            this.buttonStartText = "RUNNING (" + this.timeLeft + ")";
          } else {
            this.buttonStartColor = "red-10";
            this.buttonStartText = "RUNNING (" + this.timeLeft + ")";
          }
        }
      }
    }
  },
  mounted() {
    this.currentValue = this.value;
    this.currentValueText = this.currentValue;
    this.targetValue = this.value;

    this.$root.$on("instructorupdate", newdata => {
      this.setDataFromOutside(newdata);
    });

    this.$root.$on("newheartrate", newdata => {
      if (this.label === "HEARTRATE") {
        this.currentValue = newdata;
        this.currentValueText = this.currentValue;
        this.targetValue = newdata;
        this.$store.commit("dataPool/heartrate", this.currentValue);
      }
    });

    setInterval(() => {
      this.blinker();
    }, 1000);
  },
  beforeDestroy() {
    this.$root.$off("instructorupdate");
    this.$root.$off("newheartrate");
  }
};
</script>

<style></style>
