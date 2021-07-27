<template>
  <q-page padding class="bg-black">
    <div class="row justify-center q-ma-es">
        <div class="q-ma-sm col">
            <SingleSlider :value=hr :min=0 :max=240 :step=1 label="HEARTRATE"></SingleSlider>
        </div>
        <div class="q-ma-sm col">
            <SingleSlider :value=97 :min=0 :max=100 :step=1 label="SAT PRE"></SingleSlider>
        </div>
        <div class="q-ma-sm col">
            <SingleSlider :value=95 :min=0 :max=100 :step=1 label="SAT POST"></SingleSlider>
        </div>
         <div class="q-ma-sm col-2">
            <DoubleSlider :value=70 :value2=50 :min=0 :max=100 :step=1 label="ABP"></DoubleSlider>
        </div>
        <div class="q-ma-sm col">
            <SingleSlider :value=50 :min=0 :max=100 :step=1 label="RESP RATE"></SingleSlider>
        </div>
        <div class="q-ma-sm col">
            <SingleSlider :value=45 :min=0 :max=100 :step=1 label="ETCO2"></SingleSlider>
        </div>
        <div class="q-ma-sm col">
            <SingleSlider :value=36.6 :min=28 :max=42 :step=0.1 label="TEMPERATURE"></SingleSlider>
        </div>
        <div class="q-ma-sm col">
            <SingleSlider :value=0 :min=0 :max=5 :step=0.1 label="PFI"></SingleSlider>
        </div>
    </div>
     <div class="row justify-center q-ma-es">
        <ButtonsInstructor></ButtonsInstructor>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
import SingleSlider from 'components/SingleSlider'
import DoubleSlider from 'components/DoubleSlider'
import ButtonsInstructor from 'components/ButtonsInstructor'

export default {
  name: 'PageInstructor',
  components: {
      SingleSlider,
      DoubleSlider,
      ButtonsInstructor
  },
  data () {
    return {
      height: '2024px',
      hr: 125
    }
  },
  methods: {},
  mounted () {
    // attach an event handler to the model instance
    this.height = (this.$q.screen.height - 50) + 'px'
    this.max_width = this.$q.screen.width
    this.$q.dark.set(true)
  },
  beforeDestroy () {
  }
}
</script>
