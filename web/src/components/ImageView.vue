<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
       <q-card class="q-ma-sm">
                        <div class="q-ma-sm"></div>
                        <div class="q-ma-sm row">
                        <q-img
                          :src="url"
                          :style="imgSize">
                        </q-img>
                        </div>

                        <q-card-actions align="center">
                            <q-btn color="secondary" label="Close" @click="onOKClick" />
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
    },
    imgName: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      url: '',
      confirm: false,
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
            this.$emit("hide");

        },
        onOKClick() {
            this.hide()
        },
        onCancelClick() {
            this.hide();
        }
    },
    mounted () {
      this.url = `http://localhost:8080/${this.imgName}`
    },
    beforeDestroy () {
    }
}
</script>

<style>

</style>
