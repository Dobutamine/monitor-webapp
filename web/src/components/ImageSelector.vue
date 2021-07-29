<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
       <q-card class="q-ma-sm">
                        <div class="q-ma-sm"></div>
                        <div class="q-ma-sm row">
                        <q-img
                          :src="imgUrl"
                          :style="imgSize">
                        </q-img>
                        </div>

                        <q-card-section align="center">
                              <q-select v-model="selectedMediaFile" :options="mediaFilelist" @input="displayImage" style="max-width: 300px" stack-label label="select image" />
                        </q-card-section>

                        <q-card-actions align="center">
                          <q-btn class="q-mb-md" color="secondary" label="Close" @click="onOKClick" />
                        </q-card-actions>

                        
            </q-card>
         
    </q-dialog>
</template>

<script>
/* eslint-disable */
import axios from 'axios'

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
      imgUrl: '',
      confirm: false,
      mediaFilelist: [],
      selectedMediaFile: ''
    }
  },
  methods: {
      getMediaFilelistFromServer () {
            axios.get('http://localhost:8080/api/media/list')
                .then( res => {
                    this.mediaFilelist = res.data.filter(file => file.endsWith('jpg'));
                })
        },
      displayImage (selectedFile) {
            this.selectedMediaFile = selectedFile
            this.imgUrl = `http://localhost:8080/${selectedFile}`
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
            this.$store.commit('dataPool/imageName', this.selectedMediaFile)
            this.hide()
        },
        onCancelClick() {
            this.hide();
        }
    },
    mounted () {
      this.getMediaFilelistFromServer()
    },
    beforeDestroy () {
    }
}
</script>

<style>

</style>
