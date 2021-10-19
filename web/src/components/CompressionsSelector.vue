<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
    <q-card class="q-ma-sm" style="width: 250px">
      <q-card-section align="center">
        <q-select
          v-model="selectedRhythm"
          :options="rhythmList"
          @input="selectionChanged"
          style="max-width: 300px"
          stack-label
          label="chest compressions pattern"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn color="secondary" label="Close" size="sm" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
/* eslint-disable */
export default {
  name: "ChannelSettings",
  props: {
    imgSize: {
      required: true,
      type: String
    },
    monitorValues: {
      required: true,
      type: Object
    }
  },

  data() {
    return {
      url: "",
      buttonColor: 'secondary',
      confirm: false,
      selectedRhythm: "no compressions",
      rhythmList: ["none", "continuous", "3:1", "15:2", "30:2"]
    };
  },
  methods: {
    selectionChanged(e) {
      if (e === "none") {
        this.buttonColor='secondary'
      } else {
        this.buttonColor='danger'
      }
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {},
    onOKClick() {
      this.monitorValues.compressionsFrequency = this.selectedRhythm
      this.$root.$emit('updatemonitorvitals')
      this.hide();
    },
    onCancelClick() {
      this.hide();
    }
  },
  mounted() {
    this.selectedRhythm = this.monitorValues.compressionsFrequency;
  },
  beforeDestroy() {}
};
</script>

<style></style>
