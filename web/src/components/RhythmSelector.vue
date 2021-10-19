<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
    <q-card class="q-ma-sm" style="width: 250px">
      <div class="q-ma-sm"></div>
      <q-card-section align="center">
        <q-select
          v-model="selectedRhythm"
          :options="rhythmList"
          style="max-width: 300px"
          @input="selectionChanged"
          stack-label
          label="select cardiac rhythm"
        />
        <q-input
          v-model="rhythmParameter"
          style="max-width: 300px"
          type="number"
          stack-label
          :label="rhythmParameterText"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn color="secondary" label="Start" size="sm" @click="onOKClick" />
        <q-btn
          color="secondary"
          label="Cancel"
          size="sm"
          @click="onCancelClick"
        />
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
      confirm: false,
      selectedRhythm: "sinus",
      rhythmType: 0,
      rhythmParameter: 125,
      rhythmParameterText: "rate /min",
      rhythmList: [
        "sinus",
        "ventricular tachycardia",
        "supraventricular tachycardia",
        "complete heart block"
      ]
    };
  },
  methods: {
    selectionChanged(e) {
      switch (e) {
        case "sinus":
          this.rhythmType = 0;
          this.rhythmParameter = 125;
          this.rhythmParameterText = "rate (/min)";
          break;
        case "ventricular tachycardia":
          this.rhythmType = 6;
          this.rhythmParameter = 160;
          this.rhythmParameterText = "ventricular rate (/min)";
          break;
        case "supraventricular tachycardia":
          this.rhythmType = 8;
          this.rhythmParameter = 260;
          this.rhythmParameterText = "rate (/min)";
          break;
        case "complete heart block":
          this.rhythmType = 4;
          this.rhythmParameter = 60;
          this.rhythmParameterText = "ventricular rate (/min)";
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
      this.monitorValues.rhythmType = this.rhythmType
      this.monitorValues.rhythmParameter = this.rhythmParameter
      switch (this.rhythmType) {
        case 0: //sinus
          this.monitorValues.heartrate = this.rhythmParameter
          break
        case 4: //sinus
          break
        case 8: //sinus
          this.monitorValues.heartrate = this.rhythmParameter
          break
      }

      this.$root.$emit('updatemonitorvitals')


      this.hide();
    },
    onCancelClick() {
      this.hide();
    }
  },
  mounted() {
    this.rhythmType = this.monitorValues.rhythmType
    this.rhythmParameter = this.monitorValues.rhythmParameter;

    switch (this.rhythmType) {
      case 0:
        this.selectedRhythm = "sinus";
        this.rhythmParameterText = "rate (/min)";
        break;
      case 4:
        this.selectedRhythm = "complete heart block";
        this.rhythmParameterText = "ventricular rate (/min)";
        break;
      case 6:
        this.selectedRhythm = "ventricular tachycardia";
        this.rhythmParameterText = "ventricular rate (/min)";
        break;
      case 8:
        this.selectedRhythm = "supraventricular tachycardia";
        this.rhythmParameterText = "rate (/min)";
        break;
    }
  },
  beforeDestroy() {}
};
</script>

<style></style>
