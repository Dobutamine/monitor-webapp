<template>
    <q-card v-if="visible" :class="cardClass">
        <div class="text-h6">
            {{ message }}
        </div>
    </q-card>
</template>
<script>
/* eslint-disable */
export default {
    data () { 
        return {
            cardClass: 'q-ma-sm bg-secondary text-black',
            visible: false,
            silenceState: false,
            pauseState: false,
            message: '',
            timer: null,
            clock: 0,
            interval: 0
        }
    },
    methods: {
        silenceMessage (state) {
            this.silenceState = state
            if (this.silenceState) {
                this.visible = true
                this.$store.commit('dataPool/alarmEnabled', false)
                this.message = 'ALARMS SILENT 30 SEC.'
                this.cardClass = 'q-ma-sm bg-amber text-white'
                this.clock = 30
                this.timer = setInterval(() => { 
                    this.clock -= 1
                    if (this.clock === 0) {
                        clearInterval(this.timer)
                        this.visible = false
                        this.$store.commit('dataPool/alarmEnabled', true)
                    }
                    this.message = `ALARMS SILENT ${this.clock} SEC.`
                    }, 1000);
            } else {
                this.visible = false
                this.$store.commit('dataPool/alarmEnabled', true)
                clearInterval(this.timer)
            }
        },
        pauseMessage (state) {
            this.pauseState = state
            if (this.pauseState) {
                this.visible = true
                this.$store.commit('dataPool/alarmEnabled', false)
                this.message = 'ALARMS SILENT 3 MIN.'
                this.cardClass = 'q-ma-sm bg-negative text-white'
                this.clock = 180
                this.timer = setInterval(() => { 
                    this.clock -= 1
                    if (this.clock <= 0) {
                        clearInterval(this.timer)
                        this.visible = false
                        this.$store.commit('dataPool/alarmEnabled', true)
                    }
                    this.message = `ALARMS SILENT ${this.clock} SEC.`
                    }, 1000);
            } else {
                this.visible = false
                this.$store.commit('dataPool/alarmEnabled', true)
                clearInterval(this.timer)
            }
        },
        disableAlarms () {

        },
        enableAlarms () {
            this.visible = false
        }

    },
    mounted () {
        this.$root.$on('silence', (state) => { this.silenceMessage(state) })
        this.$root.$on('pause', (state) => { this.pauseMessage(state) })
    },
     beforeDestroy () {
        this.$root.$off('silence', (state) => { this.silenceMessage(state) })
        this.$root.$off('pause', (state) => { this.pauseMessage(state) })
    }
}
</script>
<style>
</style>