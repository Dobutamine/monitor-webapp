<template>
    <q-page padding class="bg-black">
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-input v-model="id" type="password" :value="id" stack-label autofocus label="PLEASE ENTER YOUR ID">
                </q-input>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                <q-btn v-if="id != ''" :class="connectedColor" @click="connect" style="height: 60px; width: 100px; font-size: 10px">
                    {{ connectedLabel }}
                    <q-icon :name="icon" style="font-size: 32px"></q-icon>
                </q-btn>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div v-if="showChoices" class="col text-center">
                SELECT YOUR APPLICATION
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                    <q-btn v-if="showChoices" class="q-pl-lg q-pr-lg bg-orange-10" @click="monitor" style="width: 200px" size=lg>MONITOR</q-btn>
            </div>
            <div class="col text-center">
            </div>
        </div>
        <div class="row justify-center items-start q-ma-lg">
            <div class="col text-center">
            </div>
            <div class="col text-center">
                 <q-btn v-if="showChoices" class="q-pl-lg q-pr-lg bg-orange-10" @click="instructor" style="width: 200px" size=lg>INSTRUCTOR</q-btn>
            </div>
            <div class="col text-center">
            </div>
        </div>
    </q-page>
</template>

<script>
/* eslint-disable */
export default {
    data () {
        return {
            id: '',
            checkConnectionTimer: null,
            icon: 'sentiment_very_dissatisfied',
            ws: null,
            connected: false,
            connectedLabel: 'OFFLINE',
            connectedColor: 'bg-red-10',
            showChoices: false
        }
    },
    methods: {
        monitor () {
            clearTimeout(this.checkConnectionTimer)
            this.ws.send(JSON.stringify({ command: 'close', id: this.id.toUpperCase() }))
            this.ws.close()
            this.$store.commit('dataPool/id', this.id.toUpperCase())
            this.$router.push("/monitor")
        },
        instructor () {
            clearTimeout(this.checkConnectionTimer)
            this.ws.send(JSON.stringify({ command: 'close', id: this.id.toUpperCase() }))
            this.ws.close()
            this.$store.commit('dataPool/id', this.id.toUpperCase())
            this.$router.push("/instructor")
        },
        connect () {
            if (!this.connected) {
                // try to establish a connection
                this.ws = new WebSocket('ws://104.248.90.19:8080/ws')
                //this.ws = new WebSocket('ws://localhost:2340/ws')
                // attach a message handler
                this.ws.onmessage = this.receiveDataFromServer
                // start the check connection timer
                this.checkConnectionTimer = setTimeout(this.checkConnectionStatus, 1000)
                // update the user interface
                this.connectedLabel = ''
                this.icon = 'settings_ethernet'
                this.connectedColor = 'bg-orange-10'
            } else {
                this.connected = false
                this.ws.send(JSON.stringify({ command: 'close', id: this.id.toUpperCase()}))
                this.ws.close()
                clearTimeout(this.checkConnectionTimer)
                this.connectedLabel = 'OFFLINE'
                this.icon = 'sentiment_very_dissatisfied'
                this.connectedColor = 'bg-red-10'
            }
        },
        checkConnectionStatus () {
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
                // try to pull some data from the server to check the id
                this.requestDataFromServer()
                // set the time for a new check
                this.checkConnectionTimer = setTimeout(this.checkConnectionStatus, 1000)
            }
        },
        requestDataFromServer () {
            if (this.connected) {
                this.ws.send(JSON.stringify({ command: 'get', id: this.id.toUpperCase() }))
            }
        },
        receiveDataFromServer (data) {
            const processed_data = JSON.parse(data.data)
            if (typeof processed_data  === 'string'){
                switch (processed_data) {
                    case "bo data":
                        this.connectedLabel = ''
                        this.icon = 'sentiment_satisfied_alt'
                        this.connectedColor = 'bg-teal-10'
                        this.showChoices = true
                        break
                    case "id not registered":
                        this.id_error = true
                        this.connectedLabel = 'ID ERROR'
                        this.connectedColor = 'bg-red-10'
                        this.icon = 'sentiment_very_dissatisfied'
                        this.showChoices = false
                        break
                }
            } else {
                this.connectedLabel = ''
                this.icon = 'sentiment_satisfied_alt'
                this.connectedColor = 'bg-teal-10'
                this.showChoices = true
            }
        }
    },
    mounted () {
        this.$q.dark.set(true)
        this.connect()
    }
}
</script>

<style>

</style>
