<template>
    <q-card class="q-pa-sm" bordered>
        <div class="row">
            <q-btn class="q-ma-sm col" :color="buttonColorEnabled" size=sm @click="toggleEnabled">
                    {{ label }}
            </q-btn>
        </div>
        <div v-if="enabled" class="row">
            <q-card class="q-ml-sm q-mr-sm q-mb-sm q-pa-xs col bg-black text-center text-h5"  bordered>
                {{ currentValueText }} / {{ currentValueText2 }}
            </q-card>
        </div>
        <div v-if="enabled" class="row">
            <div class="q-mb-sm col text-center" style="font-size: 10px">target value</div>
        </div>
        <div v-if="enabled" class="row">
            <q-slider
                class="col q-mb-sm"
                v-model="targetValue"
                color=teal-10
                label-color=red-10
                :min=min
                :max=max
                :step=step
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
                color=teal-10
                label-color=red-10
                :min=min
                :max=max
                :step=step
                vertical
                reverse
                dark
                label
                label-always
                @change="changeTargetValue2"
            />
        </div>
        <div v-if="enabled" class="row">
            <q-card class="q-ml-sm q-mr-sm q-pl-sm q-pr-sm q-pb-sm col bg-black" style="font-size: 10px" bordered>
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
            <q-card class="q-ml-sm q-mr-sm q-pl-sm q-pr-sm q-pb-sm col bg-black" style="font-size: 10px" bordered>
                <q-select
                    label="at time"
                    v-model="timeAtOption"
                    :options="timeAtOptions"
                    dark
                    dense
                ></q-select>
            </q-card>
        </div>
         <div v-if="enabled" class="row">
             <q-btn class="q-ma-sm col" :color="buttonColorArm" @click="arm" size=sm>
                    {{ buttonTextArm }}
            </q-btn>
        </div>
        <div v-if="enabled" class="row">
             <q-btn class="q-ma-sm col" :color="buttonStartColor" @click="start" size=sm>
                    {{ buttonStartText }}
            </q-btn>
        </div>
    </q-card>
</template>

<script>
/* eslint-disable */
export default {
    computed: {
        drawerState: {
            get () {
                return this.$store.state.dataPool.drawerState
            },
            set (val) {
                this.$store.commit('dataPool/updateDrawerState', val)
            }
        }
    },
    props: {
        value: {
            required: true,
            type: Number
        },
        value2: {
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
        },
    },
    data () {
        return {
            enabled: true,
            buttonColorEnabled: 'teal-10',
            buttonColorArm: 'blue-10',
            buttonTextArm: 'ARM',
            buttonStartColor: 'teal-10',
            buttonStartText: 'START',
            armed: false,
            armedBlinkStatus: false,
            startBlinkStatus: false,
            currentValue: 10,
            currentValueText: '10',
            currentValue2: 10,
            currentValueText2: '10',
            targetValue: 20,
            targetValue2: 20,
            running: false,
            timeIn: 5,
            timeAt: 0,
            timeLeft: 0,
            stepSize: 0,
            stepSize2: 0,
            timeInOptions: ['instant', '5 sec', '10 sec', '30 sec', '1 min', '3 min', '5 min', '10 min'],
            timeInOption: 'instant',
            timeAtOptions: ['instant', '5 sec', '10 sec', '30 sec', '1 min', '3 min', '5 min', '10 min'],
            timeAtOption: 'instant',
            timings: [0, 5, 10, 15, 20, 30, 60, 120, 180]
        }
    },
    methods: {
        toggleEnabled () {
            this.enabled = !this.enabled
            if (this.enabled) {
                this.buttonColorEnabled = 'teal-10'
            } else {
                this.buttonColorEnabled = 'red-10'
            }
        },
        changeTargetValue () {

            this.stepSize = 0
            this.running = false
            this.buttonStartColor = 'teal-10'
            this.buttonStartText = 'START'

            this.buttonColorArm = 'blue-10'
            this.buttonTextArm = 'ARM'
            this.armed = false

            if (this.targetValue != this.currentValue) {
                if (this.timeInOption != 'instant') {
                    this.buttonColorArm = 'red-10'
                    this.buttonTextArm = 'ARMED'
                    this.armed = true
                    this.currentValueText =this.currentValue.toFixed(0)
                } else {
                    this.currentValue = this.targetValue
                    this.buttonColorArm = 'blue-10'
                    this.buttonTextArm = 'ARM'
                    this.armed = false
                    this.currentValueText = this.currentValue.toFixed(0)
                } 
            } else {
                this.buttonColorArm = 'blue-10'
                this.buttonTextArm = 'ARM'
                this.armed = false
                this.currentValueText = this.currentValue.toFixed(0)
            }
        },
        changeTargetValue2 () {

            this.stepSize2 = 0
            this.running = false
            this.buttonStartColor = 'teal-10'
            this.buttonStartText = 'START'

            this.buttonColorArm = 'blue-10'
            this.buttonTextArm = 'ARM'
            this.armed = false

            if (this.targetValue2 != this.currentValue2) {
                if (this.timeInOption != 'instant') {
                    this.buttonColorArm = 'red-10'
                    this.buttonTextArm = 'ARMED'
                    this.armed = true
                    this.currentValueText2 = this.currentValue2.toFixed(0)
                } else {
                    this.currentValue2 = this.targetValue2
                    this.buttonColorArm = 'blue-10'
                    this.buttonTextArm = 'ARM'
                    this.armed = false
                    this.currentValueText2 = this.currentValue2.toFixed(0)
                } 
            } else {
                this.buttonColorArm = 'blue-10'
                this.buttonTextArm = 'ARM'
                this.armed = false
                this.currentValueText2 = this.currentValue2.toFixed(0)
            }
        },
        arm () {
            this.stepSize = 0
            this.armed = false
            this.buttonColorArm = 'blue-10'
            this.buttonTextArm = 'ARM'
            this.running = false
            this.buttonStartColor = 'teal-10'
            this.buttonStartText = 'START'
            this.currentValueText = (this.currentValue).toFixed(0)
        },
        start () {
            if (!this.running) {
                this.armed = false
                this.buttonColorArm = 'blue-10'
                this.buttonTextArm = 'ARM'
                this.buttonStartColor = 'red-10'
                this.buttonStartText = 'RUNNING'
                this.running = true
                this.timeIn = this.getTheTimeInTime()
                this.timeLeft = this.timeIn
                this.stepSize = (this.targetValue - this.currentValue) / this.timeIn
                this.stepSize2 = (this.targetValue2 - this.currentValue2) / this.timeIn
            } else {
                this.stepSize = 0
                this.stepSize2 = 0
                this.running = false
                this.buttonStartColor = 'teal-10'
                this.buttonStartText = 'START'
                this.currentValueText = this.currentValue.toFixed(0)
                this.currentValueText2 = this.currentValue2.toFixed(0)
            }        
        },
        getTheTimeInTime () {
            const foundIndex = this.timeInOptions.indexOf(this.timeInOption)
            if (foundIndex > -1) {
                return this.timings[foundIndex]
            } else {
                return 1
            }
        },
        updateValues () {
            switch (this.label) {
                case "HEARTRATE":
                    this.$store.commit('dataPool/heartrate', this.currentValue)
                    break
                case "SAT PRE":
                    this.$store.commit('dataPool/satPre', this.currentValue)
                    break
                case "SAT POST":
                    this.$store.commit('dataPool/satPost', this.currentValue)
                    break
                case "RESP RATE":
                    this.$store.commit('dataPool/respRate', this.currentValue)
                    break
                case "ABP":
                    this.$store.commit('dataPool/abpSyst', this.currentValue)
                    this.$store.commit('dataPool/abpDiast', this.currentValue2)
                    break
                case "ETCO2":
                    this.$store.commit('dataPool/etco2', this.currentValue)
                    break
                case "TEMPERATURE":
                    this.$store.commit('dataPool/temp', this.currentValue)
                    break
                case "PFI":
                    this.$store.commit('dataPool/pfi', this.currentValue)
                    break
            }
        },
        blinker () {
            this.updateValues()
            if (this.armed) {
                this.armedBlinkStatus = !this.armedBlinkStatus
                if (this.armedBlinkStatus) {
                    this.buttonColorArm = 'black-10'
                } else {
                    this.buttonColorArm = 'red-10'
                }
            }

            if (this.running) {
                this.timeLeft -= 1
                this.currentValue += this.stepSize
                this.currentValue2 += this.stepSize2

                if (Math.abs(this.currentValue - this.targetValue) < Math.abs(this.stepSize)) {
                    this.currentValue = this.targetValue
                    this.stepSize = 0
                    this.currentValueText = this.currentValue.toFixed(0)
                } else {
                    this.currentValueText = (this.currentValue).toFixed(0)
                    this.startBlinkStatus = !this.startBlinkStatus
                }

                if (Math.abs(this.currentValue2 - this.targetValue2) < Math.abs(this.stepSize2)) {
                    this.currentValue2 = this.targetValue2
                    this.stepSize2 = 0
                    this.running = false
                    this.currentValueText2 = this.currentValue2.toFixed(0)
                } else {
                    this.currentValueText2 = (this.currentValue2).toFixed(0)
                    this.startBlinkStatus = !this.startBlinkStatus
                }

                if (this.stepSize === 0 && this.stepSize2 === 0) {
                    this.running = false
                    this.buttonStartColor = 'teal-10'
                    this.buttonStartText = 'START'

                } else {
                    if (this.startBlinkStatus){
                        this.buttonStartColor = 'black-10'
                        this.buttonStartText = 'RUNNING (' + this.timeLeft +')'
                    } else {
                        this.buttonStartColor = 'red-10'
                        this.buttonStartText = 'RUNNING (' + this.timeLeft + ')'
                    }
                }


            }



        }
    },
    mounted () {
        this.currentValue = this.value
        this.currentValue2 = this.value2
        this.currentValueText = this.currentValue
        this.targetValue = this.value
        this.targetValue2 = this.value2
        setInterval(() => {
            this.blinker()
        }, 1000);
    }

}
</script>

<style>

</style>