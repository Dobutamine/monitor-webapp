<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
    <q-card class="q-ma-sm" style="width: 450px">
      <q-card-section>
        <div v-if="bloodgasAvailable || cbcAvailable || otherAvailable">
          AVAILABLE LABORATORY RESULTS
        </div>
        <div v-if="!bloodgasAvailable && !cbcAvailable && !otherAvailable">
          NO AVAILABLE LABORATORY TESTS
        </div>

      </q-card-section>

      <q-card-section
        v-if="bloodgasAvailable"
        class="text-grey-6"
      >
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
            {{ unit }}
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
            {{ unit }}
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

      <q-card-section v-if="cbcAvailable" class="text-grey-6">
        <div class="row">
          <div class="col text-left">
            hemoglobin
          </div>
          <div class="col text-center text-grey-11">
            {{ hemoglobin }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            hematocrit
          </div>
          <div class="col text-center text-grey-11">
            {{ hematocrit }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            leucocytes
          </div>
          <div class="col text-center text-grey-11">
            {{ leucocytes }}
          </div>
          <div class="col text-left">
            10^9/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            trombocytes
          </div>
          <div class="col text-center text-grey-11">
            {{ trombocytes }}
          </div>
          <div class="col text-left">
            10^12/l
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="otherAvailable" class="text-grey-6">
        <div class="row">
          <div class="col text-left">
            CRP
          </div>
          <div class="col text-center text-grey-11">
            {{ CRP }}
          </div>
          <div class="col text-left">
            mg/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            urea (BUN)
          </div>
          <div class="col text-center text-grey-11">
            {{ urea }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            creatinine
          </div>
          <div class="col text-center text-grey-11">
            {{ kreatinine }}
          </div>
          <div class="col text-left">
            umol/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            albumin
          </div>
          <div class="col text-center text-grey-11">
            {{ albumin }}
          </div>
          <div class="col text-left">
            g/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            ammonia
          </div>
          <div class="col text-center text-grey-11">
            {{ ammonia }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            calcium
          </div>
          <div class="col text-center text-grey-11">
            {{ calcium }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            phosphate
          </div>
          <div class="col text-center text-grey-11">
            {{ phosphate }}
          </div>
          <div class="col text-left">
            mmol/l
          </div>
        </div>

        <div class="row">
          <div class="col text-left">
            magnesium
          </div>
          <div class="col text-center text-grey-11">
            {{ magnesium }}
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
      apiUrl: "",
      unit: "mmHg",
      factor: 1,
      decimals: 0,
      urea: 5,
      CRP: 1,
      kreatinine: 50,
      albumin: 35,
      ammonia: 10,
      calcium: 2.0,
      phosphate: 1.9,
      magnesium: 1.0,
      hemoglobin: 9,
      hematocrit: 0.45,
      leucocytes: 15,
      trombocytes: 250,
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
      bloodgasVisible: false,
      bloodgasAvailable: false,
      cbcVisible: false,
      cbcAvailable: false,
      otherVisible: false,
      otherAvailable: false,
      selectedLabTest: "none",
      labTestList: ["none", "bloodgas", "complete blood count", "other"]
    };
  },
  methods: {
    selectionChanged(e) {
      this.bloodgasVisible = false;
      this.cbcVisible = false;
      this.otherVisible = false;
      switch (e) {
        case "bloodgas":
          this.bloodgasVisible = true;
          break;
        case "complete blood count":
          this.cbcVisible = true;
          break;
        case "other":
          this.otherVisible = true;
          break;
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
      this.hide();
    },
    onCancelClick() {
      this.hide();
    },
    getLabSettingsFromServer() {
      const url = `${this.apiUrl}/api/labs?id=${this.id}`;
      axios
        .get(url)
        .then(res => {
          if (res.data.mmhg) {
            this.unit = "mmHg"
            this.factor = 1
            this.decmials = 0
          } else {
            this.unit = "kPa"
            this.factor = 0.13333
            this.decmials = 1
          }
          this.bloodgasAvailable = res.data.bloodgasAvailable;
          this.cbcAvailable = res.data.cbcAvailable;
          this.otherAvailable = res.data.otherAvailable;

          const parsedBloodgas = res.data.bloodgas
          this.sodium = parsedBloodgas.na;
          this.potassium = parsedBloodgas.k;
          this.chloride = parsedBloodgas.cl;
          this.glucose = parsedBloodgas.glucose;
          this.lactate = parsedBloodgas.lactate;
          this.ph = parsedBloodgas.ph;
          this.pco2 = (parsedBloodgas.pco2 * this.factor).toFixed(this.decmials);
          this.po2 = (parsedBloodgas.po2 * this.factor).toFixed(this.decimals);
          this.be = parsedBloodgas.be;
          this.bic = parsedBloodgas.bic;

          const parsedCBC = res.data.cbc
          this.hemoglobin = parsedCBC.hb;
          this.hematocrit = parsedCBC.ht;
          this.leucocytes = parsedCBC.leucocytes;
          this.trombocytes = parsedCBC.trombocytes;

          const parsedOther = res.data.other
          this.CRP = parsedOther.CRP;
          this.urea = parsedOther.urea;
          this.kreatinine = parsedOther.kreatinine;
          this.albumin = parsedOther.albumin;
          this.ammonia = parsedOther.ammonia;
          this.calcium = parsedOther.calcium;
          this.phosphate = parsedOther.phosphate;
          this.magnesium = parsedOther.magnesium;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    // get the current id from the store
    this.id = this.$store.state.dataPool.id;
    this.apiUrl = this.$store.state.dataPool.apiUrl;

    this.getLabSettingsFromServer();
  },
  beforeDestroy() {}
};
</script>

<style></style>
