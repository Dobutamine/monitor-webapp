<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
    <q-card class="q-ma-sm" style="width: 450px">
      <q-card-section>
        <div>
          <q-select
            v-model="selectedLabTest"
            :options="labTestList"
            stack-label
            label="laboratory category"
          />
        </div>
      </q-card-section>

      <q-card-section class="text-grey-6">
        <div class="row">
          <div class="col text-left">
            sodium
          </div>
          <div class="col text-center text-grey-11">
            {{ sodium }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
          <div class="col text-left">
            pH
          </div>
          <div class="col text-center text-grey-11">
            {{ ph }}
          </div>
          <div class="col ext-left">
            -
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            potassium
          </div>
          <div class="col text-center text-grey-11">
            {{ potassium }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
          <div class="col text-left">
            paO2
          </div>
          <div class="col text-center text-grey-11">
            {{ po2 }}
          </div>
          <div class="col text-left">
            mmHg
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            chloride
          </div>
          <div class="col text-center text-grey-11">
            {{ chloride }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
          <div class="col text-left">
            paCO2
          </div>
          <div class="col text-center text-grey-11">
            {{ pco2 }}
          </div>
          <div class="col text-left">
            mmHg
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            glucose
          </div>
          <div class="col text-center text-grey-11">
            {{ glucose }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
          <div class="col text-left">
            HCO3-
          </div>
          <div class="col text-center text-grey-11">
            {{ bic }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            lactate
          </div>
          <div class="col text-center text-grey-11">
            {{ lactate }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
          <div class="col text-left">
            be
          </div>
          <div class="col text-center text-grey-11">
            {{ be }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn color="red-10" label="Close" size="sm" @click="onOKClick" />
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
      ph: 7.4,
      pco2: 35,
      po2: 100,
      bic: 25,
      be: -0.5,
      glucose: 3.5,
      lactate: 1.0,
      sodium: 140,
      potassium: 3.8,
      chloride: 100,
      confirm: false,
      selectedLabTest: "bloodgas",
      labTestList: ["bloodgas"]
    };
  },
  methods: {
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
    },
    getLabSettingsFromServer() {
      axios
        .get(`http://localhost:8080/api/labs?id=${this.id}`)
        .then(res => {
          const parsedBloodgas = JSON.parse(res.data.bloodgas);
          this.sodium = parsedBloodgas.na;
          this.potassium = parsedBloodgas.k;
          this.chloride = parsedBloodgas.cl;
          this.glucose = parsedBloodgas.glucose;
          this.lactate = parsedBloodgas.lactate;
          this.ph = parsedBloodgas.ph;
          this.pco2 = parsedBloodgas.pco2;
          this.po2 = parsedBloodgas.po2;
          this.be = parsedBloodgas.be;
          this.bic = parsedBloodgas.bic;
        })
        .catch(error => {
          console.log(error);
        });
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
