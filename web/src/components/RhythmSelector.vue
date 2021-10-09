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
          v-model="parameter"
          style="max-width: 300px"
          type="number"
          stack-label
          :label="parameterText"
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
      parameter: 125,
      parameterText: "rate /min",
      rhythmList: [
        "sinus",
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
          this.parameter = 125;
          this.parameterText = "rate (/min)";
          break;
        case "supraventricular tachycardia":
          this.rhythmType = 8;
          this.parameter = 260;
          this.parameterText = "rate (/min)";
          break;
        case "complete heart block":
          this.rhythmType = 4;
          this.parameter = 60;
          this.parameterText = "ventricular rate (/min)";
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
      switch (this.rhythmType) {
        case 0:
          this.$root.$emit("newheartrate", this.parameter);
          break;
        case 8:
          this.$root.$emit("newheartrate", this.parameter);
          break;
      }
      this.$store.commit("dataPool/rhythmParameter", this.parameter);
      this.$store.commit("dataPool/rhythmType", this.rhythmType);

      this.hide();
    },
    onCancelClick() {
      this.hide();
    }
  },
  mounted() {
    this.rhythmType = this.$store.state.dataPool.rhythmType;
    this.parameter = this.$store.state.dataPool.rhythmParameter;

    switch (this.rhythmType) {
      case 0:
        this.selectedRhythm = "sinus";
        break;
      case 4:
        this.selectedRhythm = "complete heart block";
        break;
      case 8:
        this.selectedRhythm = "supraventricular tachycardia";
        break;
    }
  },
  beforeDestroy() {}
};
</script>

<style></style>
