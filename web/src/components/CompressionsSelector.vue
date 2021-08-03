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
    }
  },
  data() {
    return {
      url: "",
      confirm: false,
      selectedRhythm: "no compressions",
      rhythmList: ["none", "continuous", "3:1", "15:2", "30:2"]
    };
  },
  methods: {
    selectionChanged(e) {
      this.$store.commit("dataPool/compressionsFrequency", e);
      if (e === "none") {
        this.$root.$emit("compressionsdisabled");
      } else {
        this.$root.$emit("compressionsenabled");
      }
      this.onOKClick();
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {},
    onOKClick() {
      this.hide();
    },
    onCancelClick() {
      this.hide();
    }
  },
  mounted() {
    this.selectedRhythm = this.$store.state.dataPool.compressionsFrequency;
  },
  beforeDestroy() {}
};
</script>

<style></style>
