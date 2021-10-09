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
        },
    },
    watch: {
        monitorValues: function (newVal, oldVal)  {
            // watch if the monitor values are loaded from the server
            this.currentValue = newVal[this.value_name1]
            this.currentValue2 = newVal[this.value_name2]
            this.currentValueText = newVal[this.value_name1]
            this.currentValueText2 = newVal[this.value_name2]
            this.targetValue = newVal[this.value_name1]
            this.targetValue2 = newVal[this.value_name2]
        },
        monitorConfiguration: function (newVal, oldVal) {
            // console.log(newVal)
        }
    },
    data () {
        return {
            enabled: true,
            labelVisibility: 'CONNECTED',
            buttonColorVisibility: "teal-10",
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
        toggleVisibility () {

        },
        toggleEnabled () {
            this.enabled = !this.enabled
            if (this.enabled) {
                this.buttonColorEnabled = 'teal-10'
            } else {
                this.buttonColorEnabled = 'red-10'
            }
        },
        changeTargetValue () {

        },
        changeTargetValue2 () {

        },
        arm () {
        },
        start () {     
        },
        getTheTimeInTime () {
            const foundIndex = this.timeInOptions.indexOf(this.timeInOption)
            if (foundIndex > -1) {
                return this.timings[foundIndex]
            } else {
                return 1
            }
        }

    },
    mounted () {
  
    },
    beforeDestroy () {

    }

}
</script>

<style>

</style>