<template>
  <q-page padding class="bg-black">
    <div class="row justify-center q-ma-es">
      <div class="q-ma-sm col">
        <SingleSlider
          label="HEARTRATE"
          value_name="heartrate"
          :monitorValues="monitorValues"
          :monitorConfiguration="monitorConfiguration"
          :min="0"
          :max="240"
          :step="1"
        ></SingleSlider>
      </div>
      <div class="q-ma-sm col">
        <SingleSlider
          label="SAT PRE"
          value_name="satPre"
          :monitorValues="monitorValues"
          :monitorConfiguration="monitorConfiguration"
          :min="0"
          :max="100"
          :step="1"
        ></SingleSlider>
      </div>
      <div class="q-ma-sm col">
        <SingleSlider
          label="SAT POST"
          value_name="satPost"
          :monitorValues="monitorValues"
          :monitorConfiguration="monitorConfiguration"
          :min="0"
          :max="100"
          :step="1"
        ></SingleSlider>
      </div>
      <div class="q-ma-sm col-2">
        <DoubleSlider
          label="ABP"
          value_name1="abpSyst"
          value_name2="abpDiast"
          :monitorValues="monitorValues"
          :monitorConfiguration="monitorConfiguration"
          :min="0"
          :max="200"
          :step="1"
        ></DoubleSlider>
      </div>
      <div class="q-ma-sm col">
        <SingleSlider
          label="RESP RATE"
          value_name="respRate"
          :monitorValues="monitorValues"
          :monitorConfiguration="monitorConfiguration"
          :min="0"
          :max="100"
          :step="1"
        ></SingleSlider>
      </div>
      <div class="q-ma-sm col">
        <SingleSlider
          label="ETCO2"
          value_name="etco2"
          :monitorValues="monitorValues"
          :monitorConfiguration="monitorConfiguration"
          :min="0"
          :max="100"
          :step="1"
        ></SingleSlider>
      </div>
      <div class="q-ma-sm col">
        <SingleSlider
          label="TEMPERATURE"
          value_name="temp"
          :monitorValues="monitorValues"
          :monitorConfiguration="monitorConfiguration"
          :min="28"
          :max="43"
          :step="0.1"
        ></SingleSlider>
      </div>
     </div>

    
    
    <div class="row justify-center q-ma-es">
      <q-card class="bg-dark">
        <div class="q-gutter-xs">
          <q-btn
            @click="toggleMasterAlarms"
            :class="alarmButtonColor"
            style="height: 60px; width: 120px"
            >{{ alarmButtonText }}</q-btn
          >
          <q-btn
            class="bg-blue-grey-10"
            @click="openMonitorConfiguration"
            style="height: 60px; width: 120px"
            >MONITOR CONFIG</q-btn
          >
          <q-btn
            class="bg-blue-grey-10"
            @click="openImageSelector"
            style="height: 60px; width: 120px"
            >SELECT IMAGE</q-btn
          >
          <q-btn
            class="bg-blue-grey-10"
            @click="openLabSelector"
            style="height: 60px; width: 120px"
            >SELECT LAB RESULTS</q-btn
          >
          <q-btn
            :class="rhythmButtonColor"
            @click="openRhythmSelector"
            style="height: 60px; width: 120px"
            >CARDIAC RHYTHM</q-btn
          >
          <q-btn
            :class="chestCompressionsColor"
            @click="openCompressionsSelector"
            style="height: 60px; width: 120px"
            >CHEST COMPRESSIONS</q-btn
          >
          <!-- <q-btn
            :class="chestCompressionsColor"
            @click="openCompressionsSelector"
            style="height: 60px; width: 120px"
            >SHOCK</q-btn
          > -->
          <q-btn
            @click="toggleIntubation"
            :class="intubatedButtonColor"
            style="height: 60px; width: 120px"
            >{{ intubatedButtonText }}</q-btn
          >
        </div>
      </q-card>
    </div>
    <div class="row justify-center q-ma-md">
      <q-badge rounded >
        Active image : {{ selectedImage }}
      </q-badge>
    
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
import SingleSlider from "components/SingleSlider";
import DoubleSlider from "components/DoubleSlider";
import monitorConfigurationPopup from "components/monitorConfiguration";
import ImageSelector from "components/ImageSelector";
import RhythmSelector from "components/RhythmSelector";
import CompressionsSelector from "components/CompressionsSelector";
import LabSelector from "components/LabSelector";

import axios from "axios";

export default {
  name: "PageInstructor",
  components: {
    SingleSlider,
    DoubleSlider,
    monitorConfigurationPopup,
    ImageSelector,
    RhythmSelector,
    CompressionsSelector,
    LabSelector
  },
  data() {
    return {
      apiUrl: "",
      webSocketUrl: "",
      id: "",
      height: 0,
      max_width: 0,
      websocket: null,
      monitorConfiguration: {},
      monitorValues: {},
      intubationButtonColor: "bg-blue-grey-10",
      intubationButtonText: "MECHANICAL VENTILATION",
      chestCompressionsColor: "bg-blue-grey-10",
      compressionButtonColor: "bg-blue-grey-10",
      rhythmButtonColor: "bg-blue-grey-10",
      bluegrey: "bg-blue-grey-10",
      red: "bg-red-10",
      serverUpdateTimer: null,
      configUpdateTimer: null,
      alarmButtonColor: 'bg-blue-grey-10',
      alarmButtonText: 'ALARMS ENABLED',
      intubatedButtonColor: 'bg-blue-grey-10',
      intubatedButtonText: 'NOT INTUBATED',

      selectedImage: ''

    };
  },
  methods: {
    toggleIntubation() {
      if (this.monitorValues['intubated']) {
        this.monitorValues['intubated'] = false
        this.intubatedButtonColor = 'bg-blue-grey-10'
        this.intubatedButtonText = 'NOT INTUBATED'
      } else {
        this.monitorValues['intubated'] = true
        this.intubatedButtonColor = 'bg-red-10'
        this.intubatedButtonText = 'INTUBATED'
      }
      this.$root.$emit('updatemonitorvitals')
    },
    toggleMasterAlarms() {
      if (this.monitorValues['alarmOverride']) {
        this.monitorValues['alarmOverride'] = false
        this.alarmButtonColor = 'bg-blue-grey-10'
        this.alarmButtonText = 'ALARMS ENABLED'
      } else {
        this.monitorValues['alarmOverride'] = true
        this.alarmButtonColor = 'bg-red-10'
        this.alarmButtonText = 'ALARMS DISABLED'
      }
      this.$root.$emit('updatemonitorvitals')
    },
    openCompressionsSelector() {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q.screen.height / 2}px`;
      this.$q.dialog({
        component: CompressionsSelector,
        parent: this,
        imgSize: styleImg,
        monitorValues: this.monitorValues
      });
    },
    openRhythmSelector() {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q.screen.height / 2}px`;
      this.$q.dialog({
        component: RhythmSelector,
        parent: this,
        imgSize: styleImg,
        monitorValues: this.monitorValues
      });
    },
    openLabSelector() {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${ this.$q.screen.height }px`;
      this.$q.dialog({
        component: LabSelector,
        parent: this,
        imgSize: styleImg,
        monitorValues: this.monitorValues
      });
    },
    openImageSelector() {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q.screen.height / 2}px`;
      this.$q.dialog({
        component: ImageSelector,
        parent: this,
        image_no: 2,
        imgSize: styleImg,
        monitorValues: this.monitorValues
      });
    },
    openMonitorConfiguration () {
      this.$q.dialog({
        component: monitorConfigurationPopup,
        parent: this,
        monitorConfiguration: this.monitorConfiguration,
        monitorValues: this.monitorValues
      });
    },
    updateInterfaceWithMonitorValues() {
      // update all instructor interface components with the current monitor values
      if (this.monitorValues) {

      }

    },
    updateInterfaceWithMonitorConfiguration() {
      // update all instructor interface components with the current monitor configuration
      if (this.monitorConfiguration) {
      }
    },
    getMonitorConfigurationFromServer () {
      // build api url
      const url = `${this.apiUrl}/api/configs?id=${this.id}`;
      // get the monitor configuration
      axios.get(url)
        .then(res => {
          console.log('instructor interface got monitor configuration from server')
          this.monitorConfiguration = res.data;
          this.updateInterfaceWithMonitorConfiguration()
        })
        .catch(error => {
          console.log(error);
        });
    },
    setMonitorConfigurationOnServer () {
      const url = `${this.apiUrl}/api/configs/new`;
      axios.post(url, {
          id: this.id,
          name: this.monitorConfiguration.name,
          curve1: this.monitorConfiguration.curve1,
          curve2: this.monitorConfiguration.curve2,
          curve3: this.monitorConfiguration.curve3,
          curve4: this.monitorConfiguration.curve4,
          curve5: this.monitorConfiguration.curve5,
          curve6: this.monitorConfiguration.curve6,
          param1: this.monitorConfiguration.param1,
          param2: this.monitorConfiguration.param2,
          param3: this.monitorConfiguration.param3,
          param4: this.monitorConfiguration.param4,
          param5: this.monitorConfiguration.param5,
          param6: this.monitorConfiguration.param6,
        })
        .then(res => {
          console.log('instructor interface updated the monitor configuration')
          clearTimeout(this.configUpdateTimer)
          this.configUpdateTimer = null
        })
        .catch(error => {}
      );
    },
    setMonitorValuesOnServer() {
      // get whether compressions are going
      if (this.monitorValues.compressionsFrequency != 'none') {
        this.chestCompressionsColor = this.red
      } else {
        this.chestCompressionsColor = this.bluegrey
      }
      if (this.monitorValues.rhythmType != 0) {
        this.rhythmButtonColor = this.red
      } else {
        this.rhythmButtonColor = this.bluegrey
      }


      // get whether rhythm is different

      // get the name of the selected image
      this.selectedImage = this.monitorValues.imageName

      // first check wether the websocket connection is open
      if (this.websocket.readyState === WebSocket.OPEN) {
        // now get the monitor values by constructing a message object
        const message = {
          "command": "set",
          "payload": this.monitorValues
        }
        this.websocket.send(JSON.stringify(message));
        console.log('instructor interface updated the monitor values')
        clearTimeout(this.serverUpdateTimer)
        this.serverUpdateTimer = null
      }
    },
    getMonitorValuesFromServer() {
      // first check wether the websocket connection is open
      if (this.websocket.readyState === WebSocket.OPEN) {
        // now get the monitor values by constructing a message object
        const message = {
          "command": "get",
          "payload": {
            "id": this.id
          }
        }
        this.websocket.send(JSON.stringify(message));
        console.log('instructor interface websocket requested the monitor values.')
      }
    },
    connectToWebsocketApi() {
      // try to establish a websocket connection
      this.websocket = new WebSocket(this.webSocketUrl);

      // attach a message handler to handle recieved messages
      this.websocket.onmessage = (message) => {
        // check whether the received object is a monitor values object
        let mes = JSON.parse(message.data)
        if (mes.mes_type === "mon_values") {
          // update the monitor valeus object
          this.monitorValues = mes
          // update the monitor values in the instructor interface
          this.updateInterfaceWithMonitorValues()
          console.log('instructor interface received monitor values from api.')
        }
      };

      // handle websocket opening
      this.websocket.onopen = () => {
        console.log('instructor interface websocket connection with api opened.')
        // get the current monitor values from the api (websocket)
        this.getMonitorValuesFromServer()
      }

      // handle websocket closing
      this.websocket.onclose = () => {
        console.log('instructor interface websocket connection with api closed.')
        // clean up
        this.$router.push("/")
      }

      // handle websocket errors
      this.websocket.onerror = (err) => {
        console.log('instructor interface websocket connection error: ', err)
      }
    }
  },
  mounted() {
    // get the user id retrieved during the login process from the store
    this.id = this.$store.state.dataPool.id;

    // if the id is empty then return to the login screen
    if (this.id === '') {
      this.$router.push("/")
      return
    }

    // if the id is not empty then build the instructor page
    // first get the api and websocket api url from the store
    this.apiUrl = this.$store.state.dataPool.apiUrl;
    this.webSocketUrl = this.$store.state.dataPool.apiWebSocketUrl;
    
    // set the color scheme
    this.$q.dark.set(true);

    // define a event handler to update the vitals
    this.$root.$on("updatemonitorvitals", () => {
      if (!this.serverUpdateTimer) {
        this.serverUpdateTimer = setTimeout(() => {
        this.setMonitorValuesOnServer()
      }, 1000);
      }
    })

    this.$root.$on("updatemonitorconfig", () => {
      this.setMonitorConfigurationOnServer()
    })

    // get the current monitor configuration from the api
    this.getMonitorConfigurationFromServer()

    // connect to the server api websockets
    this.connectToWebsocketApi()

  },
  beforeDestroy() {
    // remove event handlers
    this.$root.$off("updatemonitorvitals")
    this.$root.$off("updatemonitorconfig")

    // close the websocket connection with the api
    if (this.websocket) {
      this.websocket.close()
    }
  }
};
</script>
