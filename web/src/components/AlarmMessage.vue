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

            pauseState: false,
            message: '',
            timer: null,
            clock: 0,
            interval: 0
        }
    },
    methods: {
      showAlarmMessage(message) {
        this.visible = true
        this.message = message.text
        if (message.color === 'red') {
          this.cardClass = 'q-ma-sm bg-negative text-white'
        } else {
          this.cardClass = 'q-ma-sm bg-warning text-black'
        }
      },
      hideAlarmMessage() {
        this.visible = false
        console.log('hide')
      }

    },
    mounted () {
        this.$root.$on('alarmmessageon', (message) => { this.showAlarmMessage(message) })
        this.$root.$on('alarmmessageoff', () => { 
          this.visible = false 
          })
    },
     beforeDestroy () {
        this.$root.$off('alarmmessageon', (message) => { this.showAlarmMessage(message) })
        this.$root.$off('alarmmessageoff', () => { this.hideAlarmMessage })
    }
}
</script>
<style>
</style>