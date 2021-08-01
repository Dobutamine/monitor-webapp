<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
    <q-card class="q-ma-sm" style="width: 250px">
      <div class="q-ma-sm"></div>
      <q-card-section align="center">
        <q-select
          v-model="selectedLabTest"
          :options="labTestList"
          style="max-width: 300px"
          stack-label
          label="chest compressions pattern"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn color="secondary" label="Admit" size="sm" @click="onOKClick" />
        <q-btn color="secondary" label="Cancel" size="sm" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
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
      id: "",
      url: "",
      confirm: false,
      selectedLabTest: "bloodgas",
      labTestList: [
        "bloodgas",
        "electrolytes",
        "complete blood count",
        "inflammation markers",
        "metabolic"
      ]
    };
  },
  methods: {
    getLabSettingsFromServer() {
      axios
        .get(`http://localhost:8080/api/labs?id=${this.id}`)
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
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
    // get the current id from the store
    this.id = this.$store.state.dataPool.id;

    this.getLabSettingsFromServer();
  },
  beforeDestroy() {}
};
</script>

<style></style>
