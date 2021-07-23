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
            <div :class="classState2" :style="styleValue" @click="vitalClicked">
                {{ currentValue1 }}/{{ currentValue2 }}
            </div>
            <div :class="classState" :style="styleValue2" @click="vitalClicked">
                ({{ currentMean }})
            </div>
        </div>
        </div>
    </q-card>
</template>

<script>
/* eslint-disable */
export default {
    props: {
        source1: {
            required: true,
            type: String
        },
        source2: {
            required: true,
            type: String
        },
        label: {
            required: true,
            type: String
        },
        color: {
            required: true,
            type: String
        },
        min: {
            required: true,
            type: Number
        },
        max: {
            required: true,
            type: Number
        },
        size: {
            required: true,
            type: String
        }

    },
    data () {
        return {
            graphClass: 'rectangle',
            styleLabel: 'font-size: 12px',
            styleAlarms: 'font-size: 12px',
            styleValue: 'font-size: 76px',
            styleValue2: 'font-size: 76px',
            classLabel: '',
            classMin: '',
            classMax: '',
            classOn: 'row text-purple-13 text-bold',
            classOff: 'row text-black text-bold',
            classOnMini: 'q-mt-md row text-purple-13 text-bold',
            classOffMini: 'q-mt-md row text-black text-bold',
            classState: 'row text-purple-13 text-bold',
            classState2: 'row text-purple-13 text-bold',
            alarmState: false,
            alarmEnabled: true,
            updateCounter: 0,
            updateFrequency: 1,
            currentValue1: '-',
            currentValue2: '-',
            currentMean: '-',
            rt_data: null,
            blinkingState: true,
            timer: null,
            height: '100px',
            fontSize: 76,
            fontSize2: 34,
            fontSizeLabel: 12,
            fontSizeAlarms: 12
        }
    },
    methods: {
        resize (newSize) {
            switch (this.size) {
                case "small":
                    this.fontSize = 32
                    this.fontSize2 = 16
                    this.fontSizeLabel = 12 
                    this.fontSizeAlarms = 8
                    break
                case "medium":
                    this.fontSize = 76
                    this.fontSize2 = 32
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
            this.styleValue2= 'font-size: ' + parseInt(this.fontSize2 / fontSizeFactor).toString() + 'px'
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
                this.currentValue1 = parseFloat(this.rt_data[this.rt_data.length - 1][this.source1])
                this.currentValue2 = parseFloat(this.rt_data[this.rt_data.length - 1][this.source2])
                if (!Number.isNaN(this.currentValue)) {
                    this.currentMean = parseInt((2 * this.currentValue2 + this.currentValue1) / 3)
                    if (this.alarmEnabled) {
                        this.classMax = this.classMaxOn
                        this.classMin = this.classMinOn
                        this.checkAlarm()
                    } else {
                        this.alarmState = false
                        clearInterval(this.timer)
                        this.classState = this.classOn
                        this.classMax = this.classMaxOff
                        this.classMin = this.classMinOff
                    }
                } else {
                    this.currentValue1 = ''
                    this.classMax = this.classMaxOff
                    this.classMin = this.classMinOff
                    
                }
            }
        },
        checkAlarm () {
            if (this.currentMean < this.min) {
                this.alarmState = true
                if (this.timer == undefined) {
                    this.timer = setInterval(() => { 
                        this.blinkingState = !this.blinkingState
                        if (this.blinkingState) {
                            this.classState = this.classOn
                        } else {
                            this.classState = this.classOff
                        }   
                    }, (1000));
                }
            } else {
                this.alarmState = false
                clearInterval(this.timer)
                this.classState = this.classOn
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
                        this.styleValue2= 'font-size: ' + this.fontSize2.toString() + 'px'

                        this.classState = `q-mt-sm row text-${this.color} text-bold`
                        this.classOn = `q-mt-sm row text-${this.color} text-bold`
                        this.classOff = 'q-mt-sm row text-black text-bold'
                    break
                case "medium":
                        this.styleLabel = 'font-size: ' + this.fontSizeLabel.toString() + 'px'
                        this.styleAlarms = 'font-size: 12px' + this.fontSizeAlarms.toString() + 'px'
                        this.styleValue= 'font-size: ' + this.fontSize.toString() + 'px'
                        this.styleValue2= 'font-size: ' + this.fontSize2.toString() + 'px'

                        this.classState = `row text-${this.color} text-bold`
                        this.classOn = `row text-${this.color} text-bold`
                        this.classOff = 'row text-black text-bold'
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
      // this.$root.$on('trends', (state) => { this.switchTrends(state) })
      this.setColors()

      this.$root.$on('resize', (newSize) => this.resize(newSize))
    },
}
</script>

<style>
.rectangle {
  display: flex;
  width: 100%;
}
.rectangleHide {
  display: none;
  width: 100%;
}
.gutter {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>