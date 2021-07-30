<template>
    <q-card class="bg-dark">
        <div class="q-gutter-xs">
            <q-btn class="bg-blue-grey-10" @click="changeRhythmType" style="height: 60px; width: 120px">CARDIAC RHYTHM</q-btn>
            <q-btn class="bg-blue-grey-10" @click="openCompressionsSelector" style="height: 60px; width: 120px">CHEST COMPRESSIONS</q-btn>
            <q-btn :class="intubationButtonColor" @click="toggleIntubation" style="height: 60px; width: 120px">{{ intubationButtonText }}</q-btn>
            <q-btn class="bg-blue-grey-10" @click="showImageSelector" style="height: 60px; width: 120px">SELECT IMAGE</q-btn>
            <q-btn class="bg-blue-grey-10" @click="openLabSelector" style="height: 60px; width: 120px">SELECT LAB RESULTS</q-btn>
            <q-btn class="bg-blue-grey-10" style="height: 60px; width: 120px">SAVE STATE</q-btn>
            <q-btn class="bg-blue-grey-10" style="height: 60px; width: 120px">LOAD STATE</q-btn>
            <q-btn :class="connectedColor" @click="connect" style="height: 60px; width: 85px; font-size: 8px">
                {{ connectedLabel }}
                <q-icon :name="icon" style="font-size: 32px"></q-icon>
            </q-btn>
        </div>
        <div style="font-size: 12px">
           selected image file : {{ selectedMediaFile }}
        </div>
    </q-card>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
export default {
    data () {
        return {
            silenceState: false,
            silenceDuration: 30,
            trendsState: true,
            id: 'YODA',
            show_icon: true,
            icon: 'sentiment_very_dissatisfied',
            connected: false,
            connectedLabel: 'OFFLINE',
            connectedColor: 'bg-red-10',
            checkConnectionTimer: null,
            serverUpdateTimer: null,
            id_unknown: true,
            ws: null,
            allIsFine: false,
            bluegreay: 'bg-blue-grey-10',
            red: 'bg-red-10',
            intubationButtonColor: 'bg-blue-grey-10',
            intubationButtonText: 'MECHANICAL VENTILATION',
            selectedMediaFile: '',
            currentDataObject: {
                command: '',
                id: '',
                error: '',
                heartrate: 123,
                satPre: 97,
                satPost: 95,
                satVen: 80,
                respRate: 45,
                etco2: 55,
                abpSyst: 70,
                abpDiast: 50,
                pfi: 0.8,
                temp: 37.1,
                cvp: 4,
                papSyst: 40,
                papDiast: 20,
                imageName: '',
                compressionsFrequency: 0,
                alarmOverride: false,
                resusState: 0,
                rhythmType: 0,
                rhythmParameter: 0,
                intubated: false,
                rhythmParameter: 0,
                channelConfigChanged: true,
                channelConfigurations: {},
                alarmEnabled: true
            }
        }
    },
    mounted () {
        this.id = this.$store.state.dataPool.id
        this.connect()
    },
    beforeDestroy () {
        clearTimeout(this.checkConnectionTimer)
        clearTimeout(this.serverUpdateTimer)
        this.serverUpdateTimer = null
        this.ws.send(JSON.stringify({ command: 'close', id: this.id }))
        this.ws.close()
    },
    methods: {
        changeRhythmType () {
            // this.currentDataObject.rhythmType = 6
            // this.$store.commit('dataPool/rhythmType', this.currentDataObject.rhythmType)
            // this.currentDataObject.rhythmParameter = 0
            // this.$store.commit('dataPool/rhythmParameter', this.currentDataObject.rhythmParameter)

            this.$root.$emit('rhythmselector')
        },
        openCompressionsSelector () {
            this.$root.$emit('compressionsselector')
        },
        openLabSelector () {
            this.$root.$emit('labselector')
        },
        goToMonitor () {
            this.$router.push("/monitor")
        },
        connect () {
            if (!this.connected) {
                // try to establish a connection
                // this.ws = new WebSocket('ws://104.248.90.19:8080/ws')
                this.ws = new WebSocket('ws://localhost:8080/api')
                // attach a message handler
                this.ws.onmessage = this.receiveDataFromServer
                // check connection and ask for data
                this.checkConnectionTimer = setTimeout(this.checkConnectionStatus, 1000)
                // update the user interface
                this.connectedLabel = ''
                this.icon = 'settings_ethernet'
                this.connectedColor = 'bg-orange-10'
            } else {
                this.connected = false
                this.ws.send(JSON.stringify({ command: 'close', id: this.id }))
                this.ws.close()
                clearTimeout(this.checkConnectionTimer)
                this.connectedLabel = 'OFFLINE'
                this.icon = 'sentiment_very_dissatisfied'
                this.connectedColor = 'bg-red-10'
            }
        },
        checkConnectionStatus () {
            // send a message to the server asking if it is still alive
            if (this.ws.readyState === WebSocket.CLOSED) {
                // set the state to false
                this.connected = false
                // update the user interface
                this.connectedLabel = 'OFFLINE'
                this.icon = 'sentiment_very_dissatisfied'
                this.connectedColor = 'bg-red-10'
                this.connect()
            }

            if (this.ws.readyState === WebSocket.OPEN) {
                // set the state to false
                this.connected = true
                // // try to pull some data from the server to check the id
                this.ws.send(JSON.stringify({ command: 'get', id: this.id }))
                // set the time for a new check
                this.serverUpdateTimer = setTimeout(this.sendDataToServer, 1000)
            }
        },
        sendDataToServer () {
            if (this.connected) {
                // make the data object
                this.currentDataObject.command = 'set'
                this.currentDataObject.id = this.id
                this.currentDataObject.heartrate = this.$store.state.dataPool.heartrate
                this.currentDataObject.satPre = this.$store.state.dataPool.satPre
                this.currentDataObject.satPost = this.$store.state.dataPool.satPost
                this.currentDataObject.satVen = this.$store.state.dataPool.satVen
                this.currentDataObject.respRate = this.$store.state.dataPool.respRate
                this.currentDataObject.etco2 = this.$store.state.dataPool.etco2
                this.currentDataObject.abpSyst = this.$store.state.dataPool.abpSyst
                this.currentDataObject.abpDiast = this.$store.state.dataPool.abpDiast
                this.currentDataObject.pfi = this.$store.state.dataPool.pfi
                this.currentDataObject.temp = this.$store.state.dataPool.temp
                this.currentDataObject.cvp = this.$store.state.dataPool.cvp
                this.currentDataObject.papSyst = this.$store.state.dataPool.papSyst
                this.currentDataObject.papDiast = this.$store.state.dataPool.papDiast
                this.currentDataObject.imageName = this.$store.state.dataPool.imageName
                this.currentDataObject.rhythmType = this.$store.state.dataPool.rhythmType
                this.currentDataObject.intubated = this.$store.state.dataPool.intubated
                this.currentDataObject.compressionsFrequency = this.$store.state.dataPool.compressionsFrequency
                this.currentDataObject.rhythmParameter = this.$store.state.dataPool.rhythmParameter
                this.currentDataObject.alarmOverride = this.$store.state.dataPool.alarmOverride
                this.selectedMediaFile = this.currentDataObject.imageName
                this.ws.send(JSON.stringify(this.currentDataObject))

                this.serverUpdateTimer = setTimeout(this.sendDataToServer, 1000)
            }
        },

        receiveDataFromServer (data) {
            const processed_data = JSON.parse(data.data)
            if (typeof processed_data  === 'string'){
                switch (processed_data) {
                    case "no data":
                        this.connectedLabel = 'NO DATA'
                        this.connectedColor = 'bg-red-10'
                        this.icon = 'sentiment_very_dissatisfied'
                        this.allIsFine = false
                        break
                    case "id not registered":
                        this.id_error = true
                        this.connectedLabel = 'ID ERROR'
                        this.connectedColor = 'bg-red-10'
                        this.icon = 'sentiment_very_dissatisfied'
                        this.allIsFine = false
                        break
                }
            } else {
                this.processData(processed_data)
            }
        },
        showImageSelector () {
            this.$root.$emit('imageselector')
        },
        getMediaFilelistFromServer () {
            axios.get('http://localhost:8080/api/media/list')
                .then( res => {
                    this.mediaFilelist = res.data.filter(file => file.endsWith('jpg'));
                })
        },
        toggleIntubation () {
            this.currentDataObject.intubated = !this.currentDataObject.intubated
            if (this.currentDataObject.intubated) {
                this.intubationButtonText = 'MECHANICAL VENTILATION'
                this.intubationButtonColor = this.red
            } else {
                this.intubationButtonText = 'MECHANICAL VENTILATION'
                this.intubationButtonColor = this.bluegreay
            }
            this.$store.commit('dataPool/intubated', this.currentDataObject.intubated)
        },
        processData (data) {
            this.connectedLabel = ''
            this.icon = 'sentiment_satisfied_alt'
            this.connectedColor = 'bg-teal-10'
            // set the parameters not set by the sliders
            this.currentDataObject.intubated = data.intubated
            this.currentDataObject.rhythmType = data.rhythmType
            this.currentDataObject.rhythmParameter = data.rhythmParameter
            this.currentDataObject.imageName = data.imageName
            this.currentDataObject.pfi = data.pfi
            this.currentDataObject.compressionsFrequency = data.compressionsFrequency
            this.currentDataObject.alarmOverride = data.alarmOverride
            
            if (this.intubated) {
                this.intubationButtonText = 'MECHANICAL VENTILATION'
                this.intubationButtonColor = this.red
            } else {
                this.intubationButtonText = 'MECHANICAL VENTILATION'
                this.intubationButtonColor = this.bluegreay
            }
            // update the parameters with sliders
            this.$root.$emit('instructorupdate', data)

        },
        silenceAlarms () {
            //this.$root.$on('hires_on', () => { this.hires = true })
            this.silenceState = !this.silenceState
            this.silenceDuration = 30
            this.$root.$emit('silence', this.silenceState)
        },
        pauseAlarms () {
            this.silenceState = !this.silenceState
            this.silenceDuration = 180
            this.$root.$emit('pause', this.silenceState)
        },
        trends () {
            this.trendsState = !this.trendsState
            this.$root.$emit('trends', this.trendsState)
            if (this.trendsState) {
                this.$root.$emit('message', 'TRENDS VISIBLE')
            } else {
                this.$root.$emit('message', 'TRENDS HIDDEN')
            }
        }
    }

}
</script>

<style>

</style>