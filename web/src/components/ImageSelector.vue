<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
    <q-card class="q-ma-sm">
      <div class="q-ma-sm"></div>
      <div class="q-ma-sm row">
        <q-img :src="imgUrl" :style="imgSize"> </q-img>
      </div>

      <q-card-section align="center">
        <q-select
          v-model="selectedMediaFile"
          :options="mediaFilelist"
          @input="displayImage"
          style="max-width: 300px"
          stack-label
          label="select image"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          class="q-mb-md"
          color="secondary"
          label="Close"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
/* eslint-disable */
import axios from "axios";

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
      imgUrl: "",
      apiUrl: "",
      confirm: false,
      mediaFilelist: [],
      selectedMediaFile: ""
    };
  },
  methods: {
    getMediaFilelistFromServer() {
      const url = `${this.apiUrl}/api/media/list`;
      axios.get(url).then(res => {
        this.mediaFilelist = res.data.filter(file => file.endsWith("jpg"));
      });
    },
    displayImage(selectedFile) {
      this.selectedMediaFile = selectedFile;
      this.imgUrl = `${this.apiUrl}/${selectedFile}`;
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {
      this.$emit("hide");
    },
    onOKClick() {
      // store the image name in the monitor values object
      this.monitorValues.imageName = this.selectedMediaFile
      console.log('image settings updated by instructor')
      // increase the update counter
      this.monitorValues.imageUpdateCounter += 1
      // signal the instructor component that the monitor values are changed
      this.$root.$emit('updatemonitorvitals')
      // close the pop up
      this.hide();
    },
    onCancelClick() {
      this.hide();
    }
  },
  mounted() {
    this.apiUrl = this.$store.state.dataPool.apiUrl;
    this.getMediaFilelistFromServer();
  },
  beforeDestroy() {}
};
</script>

<style></style>
