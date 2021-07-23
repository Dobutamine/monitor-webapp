<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
       <q-card class="q-ma-sm">
                        <div class="q-ma-sm">
                            <q-select label="Parameter" v-model="parameter" @input="parameterChange" :options="parameters" />
                        </div>
                        <div class="q-ma-sm row">
                            <q-toggle class="row" left-label label="alarms enabled" v-model="alarmEnabled" value="alarmEnabled" dense autofocus />
                        </div>
                        <div v-if="alarmEnabled" class="q-ma-sm row">
                             <q-input class="row" label="alarm upper limit" type="number" v-model="upperAlarm" value="upperAlarm" dense autofocus />
                        </div>
                        <div v-if="alarmEnabled"  class="q-ma-sm row">
                            <q-input class="row" label="alarm lower limit" type="number" v-model="lowerAlarm" dense autofocus />
                        </div>
                        <q-badge color="grey-3" text-color="black" class="q-ma-sm">
                            Select color
                        </q-badge>
                        <div class="q-ma-sm row">
                            <q-color v-model="color" default-view="palette" @change="colorChanged" no-footer dark/>
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
    channel: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      parameter: '',
      parameters: ['EMPTY', 'ECG', 'SAT PRE', 'SAT POST', 'ABP', 'RESP', 'ETCO2', 'NIBD','POLS', 'PFI', 'TEMP', 'CVP', 'PAP'],
      channelNo: 0,
      alarmEnabled: true,
      lowerAlarm: 0,
      upperAlarm: 100,
      color: '',
      confirm: false,
    }
  },
  methods: {
      parameterChange () {
        switch (this.parameter) {
           case 'EMPTY':
              this.color = "#000000"
              break
            case 'ECG':
              this.color = "#5EEA32"
              break
            case 'SAT PRE':
              this.color = "#DF32EA"
              break
            case 'SAT POST':
              this.color = "#DF32EA"
              break
            case 'ABP':
              this.color = "#FB0808"
              break
            case 'RESP':
              this.color = "#FFFFFF"
              break
            case 'ETCO2':
              this.color = "#0FBE908"
              break
            case 'NIBD':
              this.color = "#FB0808"
              break
            case 'POLS':
              this.color = "#DF32EA"
              break
            case 'PFI':
              this.color = "#DF32EA"
              break
            case 'PAP':
              break
            case 'CVP':
              break
            case 'TEMP':
              this.color = "#5EEA32"
              break     
        }

      },
      colorChanged () {

      },
      show() {
            this.$refs.dialog.show();
        },
        hide() {
            this.$refs.dialog.hide();
        },
        onDialogHide() {
            this.$emit("hide");

        },
        onOKClick() {
          // compose an channel update object
          let newChannel = {
            label: 'new',
            channelNo: this.channelNo,
            source1: '',
            source2: '',
            color: this.color,
            alarmEnabled: this.alarmEnabled,
            lowerAlarm: parseInt(this.lowerAlarm),
            upperAlarm: parseInt(this.upperAlarm)
          }

          switch (this.parameter) {
            case 'EMPTY':
              newChannel.label = ''
              newChannel.source1 = 'empty'
              newChannel.source2 = ''
              newChannel.lowerAlarm = 0
              newChannel.upperAlarm = 0
              newChannel.color = "#000000"
              newChannel.alarmEnabled = false
              break
            case 'ECG':
              newChannel.label = 'HR'
              newChannel.source1 = 'heartrate'
              newChannel.source2 = ''
              break
            case 'SAT PRE':
              newChannel.label = 'SAT(1)'
              newChannel.source1 = 'satPre'
              newChannel.source2 = ''
              break
            case 'SAT POST':
              newChannel.label = 'SAT(2)'
              newChannel.source1 = 'satPost'
              newChannel.source2 = ''
              break
            case 'ABP':
              newChannel.label = 'ABP'
              newChannel.source1 = 'abpSyst'
              newChannel.source2 = 'abpDiast'
              break
            case 'RESP':
              newChannel.label = 'RF'
              newChannel.source1 = 'respRate'
              newChannel.source2 = ''
              break
            case 'ETCO2':
              newChannel.label = 'etCO2'
              newChannel.source1 = 'etco2'
              newChannel.source2 = ''
              break
            case 'PAP':
              break
            case 'CVP':
              break
            case 'NIBD':
              newChannel.label = 'NIBD'
              newChannel.source1 = 'abpSyst'
              newChannel.source2 = 'abpDiast'
              break
              break
            case 'TEMP':
              newChannel.label = 'Tskin'
              newChannel.source1 = 'temp'
              newChannel.source2 = ''
              break
            case 'POLS':
              newChannel.label = 'Pols'
              newChannel.source1 = 'heartrate'
              newChannel.source2 = ''
              break
            case 'PFI':
              newChannel.label = 'pfi'
              newChannel.source1 = 'pfi'
              newChannel.source2 = ''
              break       
          }
          this.$root.$emit('newchannelconfig', newChannel)
            this.hide()
        },
        onCancelClick() {
            this.hide();
        }
    },
    mounted () {
      this.color = this.channel.color
      this.channelNo = this.channel.channelNo
      this.alarmEnabled = this.channel.alarmEnabled
      this.lowerAlarm = this.channel.lowerAlarm
      this.upperAlarm = this.channel.upperAlarm

      switch (this.channel.source1) {
        case "heartrate":
          this.parameter = 'ECG'
          break
        case "satPre":
          this.parameter = 'SAT PRE'
          break
        case "satPost":
          this.parameter = 'SAT POST'
          break
        case "abpSyst":
          this.parameter = 'ABP'
          break
        case "respRate":
          this.parameter = 'RESP'
          break
        case "etco2":
          this.parameter = 'ETCO2'
          break
        case "temp":
          this.parameter = 'TEMP'
          break
        case "pfi":
          this.parameter = 'PFI'
          break
      }
    }
}
</script>

<style>

</style>
