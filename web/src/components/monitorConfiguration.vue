<template>
  <q-dialog v-model="confirm" ref="dialog" full-width persistent buttons>
    <q-card class="q-ma-sm">
      <div class="q-ma-md row">
        MONITOR CURVES CONFIGURATION
      </div>
   
      <div class="q-ma-sm row">
        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 1" v-model="parameter_ch0" @input="parameterChange_ch0" :options="parameters_curves" />
          </div>
          
          <div class="q-ma-sm row">
            <q-toggle class="row" left-label label="alarms enabled" v-model="alarmEnabled_ch0" value="alarmEnabled_ch0" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch0" class="q-ma-sm row">
            <q-input class="row" label="alarm upper limit" type="number" v-model="upperAlarm_ch0" value="upperAlarm_ch0" dense autofocus />
          </div>
          
          <div v-if="alarmEnabled_ch0"  class="q-ma-sm row">
            <q-input class="row" label="alarm lower limit" type="number" v-model="lowerAlarm_ch0" dense autofocus />
          </div>
          
          <div v-if="color_ch0_enabled" class="q-ma-sm row">
            <q-color v-model="color_ch0" default-view="palette" @change="colorChanged_ch0" no-footer dark/>
          </div>
        </div>

        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 2" v-model="parameter_ch1" @input="parameterChange_ch1" :options="parameters_curves" />
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
            <q-color v-model="color_ch1" default-view="palette" @change="colorChanged_ch1" @click="color_ch1_enabled = !color_ch1_enabled" no-footer dark/>
          </div>
        </div>

        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 3" v-model="parameter_ch2" @input="parameterChange_ch2" :options="parameters_curves" />
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
        </div>

        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 4" v-model="parameter_ch3" @input="parameterChange_ch3" :options="parameters_curves" />
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
        </div>

        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 5" v-model="parameter_ch4" @input="parameterChange_ch4" :options="parameters_curves" />
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
        </div>

        <div class="q-ma-sm col">
          <div class="q-ma-sm">
            <q-select label="Curve 6" v-model="parameter_ch5" @input="parameterChange_ch5" :options="parameters_curves" />
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
        </div>
      </div>

      <q-card-actions align="center">
        <q-btn color="secondary" label="Accept" @click="onOKClick" />
        <q-btn color="secondary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    

    </q-card>
  </q-dialog>
</template>

<script>
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
      parameters_curves: ['EMPTY', 'HR', 'SAT(1)', 'SAT(2)', 'ABP', 'RF', 'ETCO2', 'CVP', 'PAP'],
      parameters_no_curve: ['EMPTY', 'Temp', 'Pols', 'NIBD', 'PFI'],
      parameter_ch0: '',
      alarmEnabled_ch0: true,
      upperAlarm_ch0: 100,
      lowerAlarm_ch0: 0,
      color_ch0: "#000000",
      color_ch0_enabled: true,
      parameter_ch1: '',
      alarmEnabled_ch1: true,
      upperAlarm_ch1: 100,
      lowerAlarm_ch1: 0,
      color_ch1: "#000000",
      color_ch1_enabled: true,
      parameter_ch2: '',
      alarmEnabled_ch2: true,
      upperAlarm_ch2: 100,
      lowerAlarm_ch2: 0,
      color_ch2: "#000000",
      color_ch2_enabled: true,
      parameter_ch3: '',
      alarmEnabled_ch3: true,
      upperAlarm_ch3: 100,
      lowerAlarm_ch3: 0,
      color_ch3: "#000000",
      color_ch3_enabled: true,
      parameter_ch4: '',
      alarmEnabled_ch4: true,
      upperAlarm_ch4: 100,
      lowerAlarm_ch4: 0,
      color_ch4: "#000000",
      color_ch4_enabled: true,
      parameter_ch5: '',
      alarmEnabled_ch5: true,
      upperAlarm_ch5: 100,
      lowerAlarm_ch5: 0,
      color_ch5: "#000000",
      color_ch5_enabled: true
      
    }
  },
  methods: {
    parameterChange_ch0 () {

    },
    colorChanged_ch0 () {

    },
    parameterChange_ch1 () {

    },
    colorChanged_ch1 () {

    },
    parameterChange_ch2 () {

    },
    colorChanged_ch2 () {

    },
    parameterChange_ch3 () {

    },
    colorChanged_ch3 () {

    },
    parameterChange_ch4 () {

    },
    colorChanged_ch4 () {

    },
    parameterChange_ch5 () {

    },
    colorChanged_ch5 () {

    },
    updateMonitorConfigurationInterface () {
      console.log(this.monitorConfiguration)
      // this.monitorConfiguration.forEach(configuration => {
      //   switch (configuration.channelNo) {
      //     case 1:
      //       // this is curve 0
      //       this.parameter_ch0 = configuration.label
      //       this.alarmEnabled_ch0 = configuration.alarmEnabled
      //       this.color_ch0 = configuration.color
      //       this.upperAlarm_ch0 = configuration.upperAlarm
      //       this.lowerAlarm_ch0 = configuration.lowerAlarm
      //       break;
      //     case 2:
      //       this.parameter_ch1 = configuration.label
      //       this.alarmEnabled_ch1 = configuration.alarmEnabled
      //       this.color_ch1 = configuration.color
      //       this.upperAlarm_ch1 = configuration.upperAlarm
      //       this.lowerAlarm_ch1 = configuration.lowerAlarm
      //       break;
      //     case 3:
      //       this.parameter_ch2 = configuration.label
      //       this.alarmEnabled_ch2 = configuration.alarmEnabled
      //       this.color_ch2 = configuration.color
      //       this.upperAlarm_ch2 = configuration.upperAlarm
      //       this.lowerAlarm_ch2 = configuration.lowerAlarm
      //       break;
      //     case 4:
      //       this.parameter_ch3 = configuration.label
      //       this.alarmEnabled_ch3 = configuration.alarmEnabled
      //       this.color_ch3 = configuration.color
      //       this.upperAlarm_ch3 = configuration.upperAlarm
      //       this.lowerAlarm_ch3 = configuration.lowerAlarm
      //       break;
      //     case 5:
      //       this.parameter_ch4 = configuration.label
      //       this.alarmEnabled_ch4 = configuration.alarmEnabled
      //       this.color_ch4 = configuration.color
      //       this.upperAlarm_ch4 = configuration.upperAlarm
      //       this.lowerAlarm_ch4 = configuration.lowerAlarm
      //       break;
      //     case 6:
      //       this.parameter_ch5 = configuration.label
      //       this.alarmEnabled_ch5 = configuration.alarmEnabled
      //       this.color_ch5 = configuration.color
      //       this.upperAlarm_ch5 = configuration.upperAlarm
      //       this.lowerAlarm_ch5 = configuration.lowerAlarm
      //       break;

      //   }
        
      // });

    },
    updateMonitorConfigurationOnServer() {
      const url = `${this.apiUrl}/api/configs/new`;
      axios
        .post(url, {
          id: this.id,
        })
        .then(res => {
          // store the image name in the monitor values object
          console.log('monitor configuration updated by instructor')
          // increase the update counter
          this.monitorValues.configurationUpdateCounter += 1
          // signal the instructor component that the monitor values are changed
          this.$root.$emit('updatemonitorvitals')
        })
        .catch(error => {});
      
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onOKClick() {
      this.updateMonitorConfigurationOnServer()
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