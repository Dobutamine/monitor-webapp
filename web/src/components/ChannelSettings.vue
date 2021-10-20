<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
       <q-card class="q-ma-sm">
                        <div class="q-ma-sm">
                            {{ channel.label }}
                        </div>
                        <div class="q-ma-sm row">
                            <q-toggle class="row" left-label label="alarms enabled" v-model="channel.alarmEnabled" value="alarmEnabled" dense autofocus />
                        </div>
                        <div class="q-ma-sm row">
                             <q-input class="row" label="alarm upper limit" type="number" v-model="channel.upperAlarm" value="upperAlarm" dense autofocus />
                        </div>
                        <div  class="q-ma-sm row">
                            <q-input class="row" label="alarm lower limit" type="number" v-model="channel.lowerAlarm" dense autofocus />
                        </div>
                        <q-badge color="grey-3" text-color="black" class="q-ma-sm">
                            Select color
                        </q-badge>
                        <div class="q-ma-sm row">
                            <q-color v-model="channel.color" default-view="palette" @change="colorChanged" no-footer dark/>
                        </div>
                        <div class="q-ma-sm row">
                            <q-toggle class="row" left-label label="value in mmHg" v-model="channel.mmhg" value="mmhg" dense autofocus />
                        </div>

                        <q-card-actions align="center">
                            <q-btn color="secondary" label="OK" @click="onOKClick" />
                            <q-btn color="secondary" label="Cancel" @click="onCancelClick" />
                        </q-card-actions>
            </q-card>
    </q-dialog>
</template>

<script>
/* eslint-disable */
export default {
  name: 'ChannelSettings',
  props: {
    channelNo: {
      required: true,
      type: Number
    },
    monitorValues: {
      required: true,
      type: Object
    },
    monitorConfiguration: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      parameter: '',
      parameters: ['EMPTY', 'ECG', 'SAT PRE', 'SAT POST', 'ABP', 'RESP', 'ETCO2', 'NIBD','POLS', 'PFI', 'TEMP', 'CVP', 'PAP'],
      label: '',
      color: '',
      mmhg: true,
      lowerAlarm: 0,
      upperAlarm: 0,
      alarmEnabled: false,
      alarmEnabled: true,
      lowerAlarm: 0,
      upperAlarm: 100,
      confirm: false,
      channel: {}
    }
  },
  methods: {
      colorChanged () {

      },
      show() {
        this.$refs.dialog.show();
      },
      hide() {
        this.$refs.dialog.hide();
      },
      onOKClick() {
        this.updateMonitorConfigurationOnServer()
        this.hide()
      },
      onCancelClick() {
        this.hide();
      },
      updateMonitorConfigurationOnServer() {
        this.$root.$emit('channelsettingschangedconfiguration')
      },
      
      getChannelConfiguration () {
        switch (this.channelNo) {
          case 1:
            this.channel = this.monitorConfiguration.curve1
            break
          case 2:
            this.channel = this.monitorConfiguration.curve2
            break
          case 3:
            this.channel = this.monitorConfiguration.curve3
            break
          case 4:
            this.channel = this.monitorConfiguration.curve4
            break
          case 5:
            this.channel = this.monitorConfiguration.curve5
            break
          case 6:
            this.channel = this.monitorConfiguration.curve6
            break
          case 7:
            this.channel = this.monitorConfiguration.param1
            break
          case 8:
            this.channel = this.monitorConfiguration.param2
            break
          case 9:
            this.channel = this.monitorConfiguration.param3
            break
          case 10:
            this.channel = this.monitorConfiguration.param4
            break
          case 11:
            this.channel = this.monitorConfiguration.param5
            break
          case 12:
            this.channel = this.monitorConfiguration.param6
            break
        }
      }
    },
    mounted () {
      // try to find the correct channel
      this.getChannelConfiguration()
    }
}
</script>

<style>

</style>
