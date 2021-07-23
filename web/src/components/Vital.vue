<template>
    <q-card class="bg-black text-white" :style="{height: height}">
        <div class="row">
        <div class="col-1">
            <div :class="classLabel" :style="styleLabel">
                {{ label }}
            </div>
        </div>
        <div class="col-1">
            <div :class="classMax" :style="styleAlarms">
                {{ max }}
            </div>
            <div :class="classMin" :style="styleAlarms">
                {{ min }}
            </div>
        </div>
        <div class="q-ml-sm col">
            <div class="row text-caption text-purple-13">
            </div>
            <div :class="classState" :style="styleValue">
                {{ currentValue }}
                <q-popup-edit buttons label-set="OK" value="10">
                    <div class="q-ma-xs">
                        <div>
                            <q-select label="Parameter" v-model="parameter" @input="parameterChange" :options="parameters" />
                        </div>
                        <div class="q-ma-sm row">
                            <q-toggle class="row" left-label label="alarms enabled" v-model="alarmEnabled" dense autofocus />
                        </div>
                        <div v-if="alarmEnabled" class="q-ma-sm row">
                             <q-input class="row" label="alarm upper limit" type="number" v-model="max" dense autofocus />
                        </div>
                        <div v-if="alarmEnabled"  class="q-ma-sm row">
                            <q-input class="row" label="alarm lower limit" type="number" v-model="min" dense autofocus />
                        </div>
                        <q-badge color="grey-3" text-color="black" class="q-ma-sm">
                            Select color
                        </q-badge>
                        <div class="q-ma-sm row">
                            <q-color v-model="colorHEX" default-view="palette" @change="colorChanged" no-footer dark/>
                        </div>
                    </div>
                </q-popup-edit>
            </div>
        </div>
        </div>
    </q-card>
</template>

<script>
/* eslint-disable */
export default {
    props: {
        source1_prop: {
            required: true,
            type: String
        },
        source2_prop: {
            required: true,
            type: String
        },
        order_prop: {
            required: true,
            type: Number
        },
        label_prop: {
            required: true,
            type: String
        },
        color_prop: {
            required: true,
            type: String
        },
        min_prop: {
            required: true,
            type: Number
        },
        max_prop: {
            required: true,
            type: Number
        },
        size_prop: {
            required: true,
            type: String
        },
        redAlarmEnabled_prop: {
            required: true,
            type: Boolean
        }

    },
    data () {
        return {
            source1 : 0,
            source2 : 0,
            order: 0,
            label: '',
            color: '',
            min: 0,
            max: 0,
            size: '',
            redAlarmEnabled: true,
            graphClass: 'rectangle',
            styleLabel: 'font-size: 12px',
            styleAlarms: 'font-size: 12px',
            styleValue: 'font-size: 76px',
            classLabel: '',
            classMin: '',
            classMax: '',
            classOn: 'row text-purple-13 text-bold',
            classOff: 'row text-black text-bold',
            classOnMini: 'q-mt-md row text-purple-13 text-bold',
            classOffMini: 'q-mt-md row text-black text-bold',
            classState: 'row text-purple-13 text-bold',
            alarmState: false,
            redAlarmState: false,
            prevAlarmState: false,
            prevRedAlarmState: false,
            alarmEnabled: true,
            updateCounter: 0,
            updateFrequency: 0.1,
            currentValue: '-',
            rt_data: null,
            timer: null,
            colorHEX: '#C7044B',
            parameters: ['EMPTY', 'HR', 'SpO2(1)', 'SpO2(2)', 'ABP(m)', 'RF', 'etCO2', 'Pols', 'PFI', 'Thuid', 'PAP', 'CVP'],
            parametersSource: ['', 'heartrate', 'satPre', 'satPost', 'abp', 'etco2', 'heartrate', 'pfi', 'temp', 'pap', 'cvp'],
            channelLabel: ['', 'ecg', 'Pleth(1)', 'Pleth(2)', 'abp', 'RF', 'etco2', '', '', '', 'pap', 'cvp'],
            parameter: '',
            height: '100px',
            fontSize: 76,
            fontSizeLabel: 12,
            fontSizeAlarms: 12
        }
    },
    methods: {
        colorChanged() {
            const index = this.parameters.indexOf(this.parameter)
            if (index > -1) {
                this.$root.$emit('changecolor', { color: this.colorHEX, label: this.channelLabel[index] })
                this.color = this.colorHEX.replace('#','0x')
                this.setColors()
            }
            
        },
        parameterChange (newParameter) {
            const index = this.parameters.indexOf(newParameter)
            
            if (index > -1) {
                this.$root.$emit('changechannel', { order: this.order, label: this.channelLabel[index] })
                this.source1 = this.parametersSource[index]
            }
            
        },
        resize (newSize) {
            switch (this.size) {
                case "small":
                    this.fontSize = 32
                    this.fontSizeLabel = 12 
                    this.fontSizeAlarms = 8
                    break
                case "medium":
                    this.fontSize = 76
                    this.fontSizeLabel = 12 
                    this.fontSizeAlarms = 12
                    break
            }
            let fontSizeFactor = 1
            if (newSize.height / 8 < 90) {
                fontSizeFactor = 1.5
            }

            if (newSize.height / 8 < 70) {
                fontSizeFactor = 2
            }

            this.styleValue= 'font-size: ' + parseInt(this.fontSize / fontSizeFactor).toString() + 'px'
            this.styleLabel= 'font-size: ' + parseInt(this.fontSizeLabel / fontSizeFactor).toString() + 'px'
            this.styleAlarms= 'font-size: ' + parseInt(this.fontSizeAlarms / fontSizeFactor).toString() + 'px'

            this.height = parseInt(newSize.height / 8).toString() + 'px'

        },
        vitalClicked () {
            this.alarmEnabled = !this.alarmEnabled
            this.setColors()
        },
        updateValue () {
            if (this.rt_data) {
                this.currentValue = parseFloat(this.rt_data[this.rt_data.length - 1][this.source1])
                if (!Number.isNaN(this.currentValue)) {
                    this.prevAlarmState = this.alarmState
                    this.prevRedAlarmState = this.redAlarmState

                    if (this.alarmEnabled) {
                        this.classMax = this.classMaxOn
                        this.classMin = this.classMinOn
                        this.checkAlarm()
                    } else {
                        this.alarmState = false
                        if (this.prevAlarmState == true) {
                            // decrease the counter
                            this.$store.commit('dataPool/DecreaseAlarmCounter')
                        }
                        clearInterval(this.timer)
                        this.classState = this.classOn
                        this.classMax = this.classMaxOff
                        this.classMin = this.classMinOff
                        
                    }
                } else {
                    this.currentValue = ''
                    this.classMax = this.classMaxOff
                    this.classMin = this.classMinOff
                    
                }
            }
        },
        checkAlarm () {
            // current alarm state
            this.alarmState = false
            this.redAlarmState = false

            if (this.currentValue < this.min) {
                this.alarmState = true
            }

            if (this.currentValue > this.max) {
                this.alarmState = true
            }

            if (this.alarmState) {
                if (this.$store.state.dataPool.blinkerState) {
                    this.classState = this.classOn
                } else {
                    this.classState = this.classOff
                }   
            } else {
                this.classState = this.classOn
            }

            if (this.alarmState === true && this.prevAlarmState === false) {
                // increase the counter
                this.$store.commit('dataPool/IncreaseAlarmCounter')
            }
            if (this.alarmState === false && this.prevAlarmState === true) {
                // decrease the counter
                this.$store.commit('dataPool/DecreaseAlarmCounter')
            }

            if (this.redAlarmEnabled) {
                if (this.currentValue < this.min - this.min * 0.15) {
                    this.redAlarmState = true
                }

                if (this.currentValue > this.max + this.max * 0.15) {
                    this.redAlarmState = true
                }

                if (this.redAlarmState === true && this.prevRedAlarmState === false) {
                    // increase the counter
                    this.$store.commit('dataPool/IncreaseRedAlarmCounter')
                }
                if (this.redAlarmState === false && this.prevRedAlarmState === true) {
                    // decrease the counter
                    this.$store.commit('dataPool/DecreaseRedAlarmCounter')
                }
            }
        },
        setColors () {
            this.classMinOn = `row text-caption text-${this.color}`
            this.classMinOff = `row text-caption text-black`
            
            this.classMaxOn = `q-mt-md row text-caption text-${this.color}`
            this.classMaxOff = `q-mt-md row text-caption text-black`
            
            this.classMin = `row text-caption text-${this.color}`
            this.classMax = `q-mt-md row text-caption text-${this.color}`

            if (this.alarmEnabled) {
                this.classMax = this.classMaxOn
                this.classMin = this.classMinOn
            } else {
                this.classMax = this.classMaxOff
                this.classMin = this.classMinOff
            }

            switch (this.size) {
                case "small":
                        this.styleLabel = 'font-size: ' + (this.fontSizeLabel).toString() + 'px'
                        this.styleAlarms = 'font-size: ' + this.fontSizeAlarms.toString() + 'px'
                        this.styleValue= 'font-size: ' + this.fontSize.toString() + 'px'

                        this.classState = `q-mt-sm row text-${this.color} text-bold`
                        this.classOn = `q-mt-sm row text-${this.color} text-bold`
                        this.classOff = 'q-mt-sm row text-black text-bold'

                        this.parameters = ['EMPTY', 'HR', 'SpO2(1)', 'SpO2(2)', 'ABP(m)', 'RF', 'etCO2', 'Pols', 'PFI', 'Thuid', 'PAP', 'CVP']
                    break
                case "medium":
                        this.styleLabel = 'font-size: ' + this.fontSizeLabel.toString() + 'px;  color: "' + this.color + '"'
                        console.log(this.styleLabel)
                        this.styleAlarms = 'font-size: ' + this.fontSizeAlarms.toString() + 'px;  color: "' + this.color + '"'
                        this.styleValue= 'font-size: ' + this.fontSize.toString() + 'px;  color: "' + this.color + '"'

                        this.classState = `row text-bold`
                        this.classOn = `row text-bold`
                        this.classOff = 'row text-black text-bold'

                        this.parameters = ['EMPTY', 'HR', 'SpO2(1)', 'SpO2(2)', 'ABP(m)', 'RF', 'etCO2', 'PAP', 'CVP']
                    break
            }

            this.classLabel = `row text-h7 text-bold text-${this.color}`
        }


    },
    beforeDestroy () {
        this.$root.$off('resize', (newSize) => this.resize(newSize))
    },
    mounted () {
        this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
        switch (message.data.type) {
          case 'data':
            switch (message.data.target) {
              case 'monitor':
                  if (this.updateCounter > this.updateFrequency) {
                        this.updateCounter = 0
                        this.rt_data = message.data.data
                        this.updateValue()
                  }
                  this.updateCounter += 0.015
                break
            }
            break
        }
      })

      this.source1 = this.source1_prop
      this.source2 = this.source2_prop
      this.order = this.order_prop
      this.label = this.label_prop
      this.color = this.color_prop
      this.min= this.min_prop
      this.max = this.max_prop
      this.size = this.size_prop
      this.redAlarmEnabled = this.redAlarmEnabled_prop

      this.parameter = this.label
      // this.$root.$on('trends', (state) => { this.switchTrends(state) })
      this.setColors()

      this.$root.$on('resize', (newSize) => this.resize(newSize))
    },
}
</script>

<style>
.rectangle {
  display: flex;
  height: 200px;
  width: 100%;
}
.rectangleHide {
  display: none;
  height: 200px;
  width: 100%;
}
.gutter {
  display: flex;
  width: 100%;
  height: 200px;
  justify-content: center;
}
</style>