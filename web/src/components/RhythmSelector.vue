<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
       <q-card class="q-ma-sm" style="width: 250px">
                        <div class="q-ma-sm"></div>
                        <q-card-section align="center">
                              <q-select v-model="selectedRhythm" :options="rhythmList" style="max-width: 300px" stack-label label="select cardiac rhythm" />
                               <q-input v-model="parameter" style="max-width: 300px" type=number stack-label :label="parameterText" />

                        </q-card-section>


                        <q-card-actions align="center">
                            <q-btn color="secondary" label="Start" size=sm @click="onOKClick" />
                            <q-btn color="secondary" label="Cancel" size=sm @click="onOKClick" />
                        </q-card-actions>
            </q-card>
    </q-dialog>
</template>

<script>
/* eslint-disable */
export default {
  name: 'ChannelSettings',
  props: {
    imgSize: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      url: '',
      confirm: false,
      selectedRhythm: 'sinus',
      parameter: 0,
      parameterText: 'rate /min',
      rhythmList: ['sinus', 'supraventricular tachycardia', 'ventricular tachycardia', 'ventricular fibrillation']

    }
  },
  methods: {
      show() {
            this.$refs.dialog.show();
        },
        hide() {
            this.$refs.dialog.hide();
        },
        onDialogHide() {
           
        },
        onOKClick() {
            this.hide()
        },
        onCancelClick() {
            this.hide();
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
