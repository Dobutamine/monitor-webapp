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
        <q-btn :class="shockColor" label="administer shock" size="sm" @click="administerShock" />
      </q-card-actions>

      <q-card-actions align="center">
        <q-btn color="secondary" label="Ok" size="sm" @click="onOKClick" />
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
      shockColor: 'bg-red-10',
      rhythmParameter: 125,
      rhythmParameterText: "rate /min",
      rhythmList: [
        "sinus",
        "ventricular tachycardia",
        "ventricular fibrillation",
        "supraventricular tachycardia",
        "AV block type I",
        "AV block type IIa",
        "AV block type IIb",
        "complete heart block",
        "long qt syndrome"
      ]
    };
  },
  methods: {
    administerShock() {
      this.$root.$emit('shock', { post_rhythm: this.rhythmType, post_parameter: this.rhythmParameter})
    },
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
        case "ventricular fibrillation":
          this.rhythmType = 7;
          this.rhythmParameter = 0;
          this.rhythmParameterText = "not applicable";
          break;
        case "supraventricular tachycardia":
          this.rhythmType = 8;
          this.rhythmParameter = 260;
          this.rhythmParameterText = "rate (/min)";
          break;
        case "AV block type I":
          this.rhythmType = 1;
          this.rhythmParameter = 3;
          this.rhythmParameterText = "not applicable";
          break
        case "AV block type IIa":
          this.rhythmType = 2;
          this.rhythmParameter = 3;
          this.rhythmParameterText = "beats until block";
          break
        case "AV block type IIb":
          this.rhythmType = 3;
          this.rhythmParameter = 3;
          this.rhythmParameterText = "beats until block";
          break
        
        case "long qt syndrome":
          this.rhythmType = 5;
          this.rhythmParameter = 1;
          this.rhythmParameterText = "qt time multiplier";
          break
        
        
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
      case 1:
        this.selectedRhythm = "AV block type I";
        this.rhythmParameterText = "not applicable";
        break;
      case 2:
        this.selectedRhythm = "AV block type IIa";
        this.rhythmParameterText = "beats until block";
        break;
      case 3:
        this.selectedRhythm = "AV block type IIb";
        this.rhythmParameterText = "beats until block";
        break;
      case 4:
        this.selectedRhythm = "complete heart block";
        this.rhythmParameterText = "ventricular rate (/min)";
        break;
      case 5:
        this.selectedRhythm = "long qt syndrome"
        this.rhythmParameterText = "qt time multiplier";
      case 6:
        this.selectedRhythm = "ventricular tachycardia";
        this.rhythmParameterText = "ventricular rate (/min)";
        break;
      case 7:
        this.selectedRhythm = "ventricular fibrillation";
        this.rhythmParameterText = "not applicable";
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
