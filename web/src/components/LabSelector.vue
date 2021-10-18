/* eslint-disable */
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

          <div v-if="bloodgasVisible" class="col">
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
                  :step="1"
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
                <q-slider
                  v-model="potassium"
                  :min="1"
                  :max="10"
                  :step="0.1"
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
                  Chloride: {{ chloride }}
                </q-btn>
              </div>
              <div class="col  q-ml-sm">
                <q-slider
                  v-model="chloride"
                  :min="75"
                  :max="150"
                  :step="1"
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
                  Glucose: {{ glucose }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="glucose"
                  :min="0"
                  :max="20"
                  :step="0.1"
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
                  Lactate: {{ lactate }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="lactate"
                  :min="0"
                  :max="20"
                  :step="0.1"
                ></q-slider>
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
                <q-slider
                  v-model="ph"
                  :min="6.75"
                  :max="7.75"
                  :step="0.01"
                ></q-slider>
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
                <q-slider
                  v-model="pco2"
                  :min="10"
                  :max="100"
                  :step="1"
                ></q-slider>
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
                <q-slider
                  v-model="po2"
                  :min="10"
                  :max="300"
                  :step="1"
                ></q-slider>
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
                <q-slider
                  v-model="bic"
                  :min="5"
                  :max="45"
                  :step="0.1"
                ></q-slider>
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
                <q-slider
                  v-model="be"
                  :min="-40"
                  :max="20"
                  :step="0.1"
                ></q-slider>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <q-btn
            class="q-mt-md"
            @click="onClickAvailableBloodgas"
            :color="btnAvailableBloodgasColor"
            size="sm"
            style="margin-left: auto; margin-right: auto"
            >{{ btnAvailableBloodgasText }}</q-btn
          >
        </div>
      </q-card-section>

      <q-card-section v-if="cbcVisible">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  hemoglobin: {{ hemoglobin }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="hemoglobin"
                  :value="hemoglobin"
                  :min="1"
                  :max="15"
                  :step="0.1"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  Ht: {{ hematocrit }}
                </q-btn>
              </div>
              <div class="col  q-ml-sm">
                <q-slider
                  v-model="hematocrit"
                  :min="0.05"
                  :max="0.75"
                  :step="0.01"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  leucocytes: {{ leucocytes }}
                </q-btn>
              </div>
              <div class="col  q-ml-sm">
                <q-slider
                  v-model="leucocytes"
                  :min="1"
                  :max="40"
                  :step="0.1"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  trombocytes: {{ trombocytes }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="trombocytes"
                  :min="0"
                  :max="400"
                  :step="1"
                ></q-slider>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <q-btn
            class="q-mt-md"
            @click="onClickAvailableCBC"
            :color="btnAvailableCBCColor"
            size="sm"
            style="margin-left: auto; margin-right: auto"
            >{{ btnAvailableCBCText }}</q-btn
          >
        </div>
      </q-card-section>

      <q-card-section v-if="otherVisible">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  CRP: {{ CRP }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="CRP"
                  :value="CRP"
                  :min="0"
                  :max="150"
                  :step="1"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  Urea (BUN): {{ urea }}
                </q-btn>
              </div>
              <div class="col  q-ml-sm">
                <q-slider
                  v-model="urea"
                  :min="5"
                  :max="100"
                  :step="1"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  creatinine: {{ kreatinine }}
                </q-btn>
              </div>
              <div class="col  q-ml-sm">
                <q-slider
                  v-model="kreatinine"
                  :min="1"
                  :max="300"
                  :step="1"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  calcium: {{ calcium }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="calcium"
                  :min="0.5"
                  :max="5"
                  :step="0.01"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  magnesium: {{ magnesium }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="magnesium"
                  :min="0.1"
                  :max="2"
                  :step="0.01"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  phosphate: {{ phosphate }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="phosphate"
                  :min="0.5"
                  :max="5"
                  :step="0.01"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  ammonia: {{ ammonia }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="ammonia"
                  :min="10"
                  :max="500"
                  :step="1"
                ></q-slider>
              </div>
            </div>

            <div class="row">
              <div class="col q-pt-sm">
                <q-btn
                  class="q-pa-es"
                  :color="bloodgasColor"
                  size="sm"
                  style="width: 200px"
                  @click="toggleBloodgas"
                >
                  albumin: {{ albumin }}
                </q-btn>
              </div>
              <div class="col q-ml-sm">
                <q-slider
                  v-model="albumin"
                  :min="5"
                  :max="40"
                  :step="1"
                ></q-slider>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <q-btn
            class="q-mt-md"
            @click="onClickAvailableOther"
            :color="btnAvailableOtherColor"
            size="sm"
            style="margin-left: auto; margin-right: auto"
            >{{ btnAvailableOtherText }}</q-btn
          >
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
    },
    monitorValues: {
      required: true,
      type: Object
    },
  },
  data() {
    return {
      id: "",
      name:"",
      apiUrl: "",
      url: "",
      stepSmall: 0.01,
      electrolytesAvailable: false,
      cbcAvailable: false,
      btnAvailableCBCColor: "red-10",
      btnAvailableCBCText: "NOT AVAILABLE ON MONITOR",
      otherAvailable: false,
      btnAvailableOtherColor: "red-10",
      btnAvailableOtherText: "NOT AVAILABLE ON MONITOR",
      bloodgasAvailable: false,
      btnAvailableBloodgasColor: "red-10",
      btnAvailableBloodgasText: "NOT AVAILABLE ON MONITOR",
      bloodgasEnabled: true,
      bloodgasColor: "blue-grey-8",
      bloodgas: {
        ph: 7.4,
        po2: 100,
        pco2: 35,
        bic: 25,
        be: -0.5,
        na: 140,
        k: 3.8,
        cl: 100,
        glucose: 3.5,
        lactate: 1.0
      },
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
      urea: 5,
      kreatinine: 40,
      albumin: 35,
      ammonia: 20,
      calcium: 2.02,
      phosphate: 1.8,
      magnesium: 1.0,
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
      labTestList: ["bloodgas", "complete blood count", "other"]
    };
  },
  methods: {
    onClickAvailableBloodgas() {
      this.bloodgasAvailable = !this.bloodgasAvailable;
      if (this.bloodgasAvailable) {
        this.btnAvailableBloodgasColor = "teal-10";
        this.btnAvailableBloodgasText = "AVAILABLE ON MONITOR";
      } else {
        this.btnAvailableBloodgasColor = "red-10";
        this.btnAvailableBloodgasText = "NOT AVAILABLE ON MONITOR";
      }
    },
    onClickAvailableCBC() {
      this.cbcAvailable = !this.cbcAvailable;
      if (this.cbcAvailable) {
        this.btnAvailableCBCColor = "teal-10";
        this.btnAvailableCBCText = "AVAILABLE ON MONITOR";
      } else {
        this.btnAvailableCBCColor = "red-10";
        this.btnAvailableCBCText = "NOT AVAILABLE ON MONITOR";
      }
    },
    onClickAvailableOther() {
      this.otherAvailable = !this.otherAvailable;
      if (this.otherAvailable) {
        this.btnAvailableOtherColor = "teal-10";
        this.btnAvailableOtherText = "AVAILABLE ON MONITOR";
      } else {
        this.btnAvailableTherColor = "red-10";
        this.btnAvailableOtherText = "NOT AVAILABLE ON MONITOR";
      }
    },
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
      // this.bloodgasEnabled = !this.bloodgasEnabled;
      // if (this.bloodgasEnabled) {
      //   this.bloodgasColor = this.green;
      // } else {
      //   this.bloodgasColor = this.red;
      // }
    },
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
    saveLabs() {
      const url = `${this.apiUrl}/api/labs/new`;
      axios
        .post(url, { 
          id: this.id,
          name: this.name,
          bloodgas: {
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
          },
          bloodgasAvailable: this.bloodgasAvailable,
          cbc: {
            hb: this.hemoglobin,
            ht: this.hematocrit,
            leucocytes: this.leucocytes,
            trombocytes: this.trombocytes
          }, 
          cbcAvailable: this.cbcAvailable,
          other: {
            CRP: this.CRP,
            urea: this.urea,
            kreatinine: this.kreatinine,
            albumin: this.albumin,
            ammonia: this.ammonia,
            calcium: this.calcium,
            phosphate: this.phosphate,
            magnesium: this.magnesium,
          },
          otherAvailable: this.otherAvailable
        })
        .then(res => {
          console.log('laboratory settings updated by instructor')
          // increase the update counter
          this.monitorValues.labUpdateCounter += 1
          // signal the instructor component that the monitor values are changed
          this.$root.$emit('updatemonitorvitals')
        })
        .catch(error => {});
    },
    getLabSettingsFromServer() {
      
      const url = `${this.apiUrl}/api/labs?id=${this.id}`;
      axios
        .get(url)
        .then(res => {
          this.name = res.data.name
          this.bloodgasAvailable = res.data.bloodgasAvailable;
          if (this.bloodgasAvailable) {
            this.btnAvailableBloodgasColor = "teal-10";
            this.btnAvailableBloodgasText = "AVAILABLE ON MONITOR";
          } else {
            this.btnAvailableBloodgasColor = "red-10";
            this.btnAvailableBloodgasText = "NOT AVAILABLE ON MONITOR";
          }
          this.ph = res.data.bloodgas.ph
          this.po2 = res.data.bloodgas.po2
          this.pco2pco2 = res.data.bloodgas.pco2
          this.bic = res.data.bloodgas.bic
          this.be = res.data.bloodgas.be
          this.sodium = res.data.bloodgas.na
          this.potassium = res.data.bloodgas.k
          this.chloride = res.data.bloodgas.cl
          this.glucose = res.data.bloodgas.glucose
          this.lactate = res.data.bloodgas.lactate


          this.cbcAvailable = res.data.cbcAvailable;
          if (this.cbcAvailable) {
            this.btnAvailableCBCColor = "teal-10";
            this.btnAvailableCBCText = "AVAILABLE ON MONITOR";
          } else {
            this.btnAvailableCBCColor = "red-10";
            this.btnAvailableCBCText = "NOT AVAILABLE ON MONITOR";
          }

          this.hemoglobin = res.data.cbc.hb
          this.hematocrit = res.data.cbc.ht
          this.leucocytes = res.data.cbc.leucocytes
          this.trombocytes = res.data.cbc.trombocytes

          this.otherAvailable = res.data.otherAvailable;
          if (this.otherAvailable) {
            this.btnAvailableOtherColor = "teal-10";
            this.btnAvailableOtherText = "AVAILABLE ON MONITOR";
          } else {
            this.btnAvailableTherColor = "red-10";
            this.btnAvailableOtherText = "NOT AVAILABLE ON MONITOR";
          }

          this.CRP = res.data.other.CRP
          this.urea = res.data.other.urea
          this.kreatinine = res.data.other.kreatinine
          this.albumin = res.data.other.albumin
          this.ammonia = res.data.other.ammonia
          this.calcium = res.data.other.calcium
          this.phosphate = res.data.other.phosphate
          this.magnesium = res.data.other.magnesium
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
    this.apiUrl = this.$store.state.dataPool.apiUrl;

    this.getLabSettingsFromServer();
  },
  beforeDestroy() {}
};
</script>

<style></style>
