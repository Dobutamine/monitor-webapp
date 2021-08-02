<template>
  <q-dialog v-model="confirm" ref="dialog" persistent buttons>
    <q-card class="q-ma-sm q-mb-md" style="width: 500px">
      <div class="q-ma-sm"></div>
      <q-card-section align="center">
        <div class="row">
          <div class="col">
            <q-select
              v-model="selectedLabTest"
              :options="labTestList"
              @input="selectionChanged"
              stack-label
              label="laboratory category"
            />
          </div>

          <div class="col">
            <q-select
              v-model="selectedPreset"
              :options="bloodgasPresets"
              stack-label
              @input="selectBloodgasPreset"
              label="presets"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="bloodgasVisible">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 110px"
                  @click="toggleBloodgas"
                >
                  Sodium: {{ sodium }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="sodium"
                  :value="sodium"
                  :min="115"
                  :max="155"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 110px"
                  @click="toggleBloodgas"
                >
                  Potassium: {{ potassium }}
                </q-btn>
              </div>
              <div class="col  q-ml-sm">
                <q-slider v-model="potassium" :min="1" :max="10"></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 110px"
                  @click="toggleBloodgas"
                >
                  Chloride: {{ chloride }}
                </q-btn>
              </div>
              <div class="col  q-ml-sm">
                <q-slider v-model="chloride" :min="75" :max="150"></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 110px"
                  @click="toggleBloodgas"
                >
                  Glucose: {{ glucose }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider v-model="glucose" :min="0" :max="20"></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 110px"
                  @click="toggleBloodgas"
                >
                  Lactate: {{ lactate }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider v-model="lactate" :min="0" :max="20"></q-slider>
              </div>
            </div>
          </div>

          <div class="col q-ml-md">
            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 110px"
                  @click="toggleBloodgas"
                >
                  pH: {{ ph }}
                </q-btn>
              </div>
              <div class="col">
                <q-slider v-model="ph" :min="6.75" :max="7.75"></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  :color="bloodgasColor"
                  size="sm"
                  @click="toggleBloodgas"
                  style="width: 110px"
                >
                  paCO2: {{ pco2 }}
                </q-btn>
              </div>
              <div class="col">
                <q-slider v-model="pco2" :min="10" :max="100"></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  :color="bloodgasColor"
                  size="sm"
                  @click="toggleBloodgas"
                  style="width: 110px"
                >
                  paO2: {{ po2 }}
                </q-btn>
              </div>
              <div class="col">
                <q-slider v-model="po2" :min="10" :max="300"></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  :color="bloodgasColor"
                  size="sm"
                  @click="toggleBloodgas"
                  style="width: 110px"
                >
                  HCO3-: {{ bic }}
                </q-btn>
              </div>
              <div class="col">
                <q-slider v-model="bic" :min="5" :max="45"></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  :color="bloodgasColor"
                  size="sm"
                  @click="toggleBloodgas"
                  style="width: 110px"
                >
                  BE: {{ be }}
                </q-btn>
              </div>
              <div class="col">
                <q-slider v-model="be" :min="-40" :max="20"></q-slider>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn color="teal-10" label="Admit" size="sm" @click="onOKClick" />
        <q-btn color="red-10" label="Cancel" size="sm" @click="onCancelClick" />
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
      bloodgasEnabled: true,
      bloodgasColor: "teal-10",
      red: "red-10",
      green: "teal-10",
      bloodgasVisible: true,
      cbcVisible: false,
      electrolytesVisible: false,
      otherVisible: false,
      hemoglobin: 9,
      hematocrit: 0.45,
      leucocytes: 10,
      trombocytes: 245,
      CRP: 2,

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
      bloodgasPresets: [
        "",
        "normal",
        "respiratory acidosis",
        "lactate acidosis",
        "metabolic acidosis",
        "hyperchloremic acidosis",
        "combined acidosis",
        "respiratory alkalosis",
        "metabolic alkalosis",
        "hypochloremic alkalosis"
      ],
      selectedPreset: "",
      selectedLabTest: "bloodgas",
      labTestList: ["bloodgas"]
    };
  },
  methods: {
    selectBloodgasPreset(e) {
      switch (e) {
        case "normal":
          this.pco2 = 38;
          this.po2 = 85;
          this.ph = 7.4;
          this.be = -1;
          this.bic = 25;
          this.sodium = 140;
          this.potassium = 3.8;
          this.chloride = 100;
          this.glucose = 4.5;
          this.lactate = 1.1;
          break;
        case "respiratory acidosis":
          this.pco2 = 65;
          this.po2 = 75;
          this.ph = 7.15;
          this.be = -8.5;
          this.bic = 21;
          this.lactate = 2.1;
          break;
        case "metabolic acidosis":
          this.pco2 = 35;
          this.po2 = 80;
          this.ph = 7.15;
          this.be = -12;
          this.bic = 16.3;
          this.lactate = 2.4;
          this.chloride = 97;
          break;
        case "lactate acidosis":
          this.pco2 = 45;
          this.po2 = 80;
          this.ph = 7.12;
          this.be = -14;
          this.bic = 14.5;
          this.lactate = 7.5;
          this.chloride = 97;
          break;
        case "hyperchloremic acidosis":
          this.pco2 = 35;
          this.po2 = 80;
          this.ph = 7.15;
          this.be = -12;
          this.bic = 16.3;
          this.lactate = 2.4;
          this.chloride = 125;
          break;
        case "combined acidosis":
          this.pco2 = 65;
          this.po2 = 75;
          this.ph = 7.1;
          this.be = -10;
          this.bic = 17;
          this.lactate = 2.1;
          this.chloride = 100;
          break;
        case "respiratory alkalosis":
          this.pco2 = 30;
          this.po2 = 90;
          this.ph = 7.54;
          this.be = 5;
          this.bic = 23;
          this.lactate = 2.1;
          this.chloride = 98;
          break;
        case "metabolic alkalosis":
          this.pco2 = 45;
          this.po2 = 90;
          this.ph = 7.54;
          this.be = 10;
          this.bic = 38;
          this.lactate = 2.1;
          this.chloride = 92;
          break;
        case "hypochloremic alkalosis":
          this.pco2 = 40;
          this.po2 = 90;
          this.ph = 7.55;
          this.be = 10;
          this.bic = 34;
          this.lactate = 2.1;
          this.chloride = 82;
          break;
      }
    },
    toggleBloodgas() {
      this.bloodgasEnabled = !this.bloodgasEnabled;
      if (this.bloodgasEnabled) {
        this.bloodgasColor = this.green;
      } else {
        this.bloodgasColor = this.red;
      }
    },
    selectionChanged(e) {
      this.bloodgasVisible = false;
      this.cbcVisible = false;
      this.electrolytesVisible = false;
      this.otherVisible = false;
      switch (e) {
        case "bloodgas":
          this.bloodgasVisible = true;
          break;
        case "complete blood count":
          this.cbcVisible = true;
          break;
      }
    },
    saveLabs() {
      const newConfig = {
        na: this.sodium,
        k: this.potassium,
        cl: this.chloride,
        ph: this.ph,
        po2: this.po2,
        pco2: this.pco2,
        bic: this.bic,
        be: this.be,
        glucose: this.glucose,
        lactate: this.lactate
      };
      axios
        .post("http://localhost:8080/api/labs/new", {
          id: this.id,
          bloodgas: JSON.stringify(newConfig),
          cbc: "empty",
          electrolytes: "empty",
          other: "empty"
        })
        .then(res => {})
        .catch(error => {});
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
    },
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onDialogHide() {},
    onOKClick() {
      this.saveLabs();
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
