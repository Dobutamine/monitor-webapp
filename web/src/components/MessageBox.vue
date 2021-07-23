<template>
    <q-card :class="classBox">
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
            visible: true,
            blackState: 'q-ma-sm bg-black text-black',
            messageState: 'q-ma-sm bg-secondary text-white',
            classBox: 'q-ma-sm bg-black text-black',
            message: 'no message'

        }
    },
    methods: {
        displayMessage (message) {
            this.classBox = this.messageState
            this.message = message
            setTimeout(this.hideMessage, 3000)
        },
        hideMessage () {
            this.classBox = this.blackState
        }
    },
    mounted () {
        this.$root.$on('message', (message) => { this.displayMessage(message) })
    },
     beforeDestroy () {
        this.$root.$off('message', (message) => { this.displayMessage(message) })
    }
}
</script>
<style>
</style>