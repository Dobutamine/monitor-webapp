<template>
  <q-page padding class="bg-black">
    <div class="row justify-center q-ma-es">
      <div class="q-ma-sm col">
        <!-- <SingleSlider
          :value="hr"
          :min="0"
          :max="240"
          :step="1"
          label="HEARTRATE"
          mon_label = "HR"
        ></SingleSlider>
      </div>
      <div class="q-ma-sm col">
        <SingleSlider
          :value="97"
          :min="0"
          :max="100"
          :step="1"
          label="SAT PRE"
          mon_label = "SAT(1)"
        ></SingleSlider>
      </div>
      <div class="q-ma-sm col">
        <SingleSlider
          :value="95"
          :min="0"
          :max="100"
          :step="1"
          label="SAT POST"
          mon_label = "SAT(2)"
        ></SingleSlider>
      </div>
      <div class="q-ma-sm col-2">
        <DoubleSlider
          :value="70"
          :value2="50"
          :min="0"
          :max="100"
          :step="1"
          label="ABP"
          mon_label = "ABP"
        ></DoubleSlider>
      </div>
      <div class="q-ma-sm col">
        <SingleSlider
          :value="50"
          :min="0"
          :max="100"
          :step="1"
          label="RESP RATE"
          mon_label = "RF"
        ></SingleSlider>
      </div>
      <div class="q-ma-sm col">
        <SingleSlider
          :value="45"
          :min="0"
          :max="100"
          :step="1"
          label="ETCO2"
          mon_label = "etCO2"
        ></SingleSlider>
      </div>
      <div class="q-ma-sm col">
        <SingleSlider
          :value="36.6"
          :min="28"
          :max="42"
          :step="0.1"
          label="TEMPERATURE"
          mon_label = "Temp"
        ></SingleSlider> -->
      </div>
      <!-- <div class="q-ma-sm col">
            <SingleSlider :value=0 :min=0 :max=5 :step=0.1 label="PFI"></SingleSlider>
        </div> -->
    </div>
    <div class="row justify-center q-ma-es">
      <!-- <ButtonsInstructor></ButtonsInstructor> -->
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
// import SingleSlider from "components/SingleSlider";
// import DoubleSlider from "components/DoubleSlider";
// import ButtonsInstructor from "components/ButtonsInstructor";
// import ImageSelector from "components/ImageSelector";
// import RhythmSelector from "components/RhythmSelector";
// import CompressionsSelector from "components/CompressionsSelector";
// import LabSelector from "components/LabSelector";

import axios from "axios";

export default {
  name: "PageInstructor",
  components: {
    // SingleSlider,
    // DoubleSlider,
    // ButtonsInstructor,
    // ImageSelector,
    // RhythmSelector,
    // CompressionsSelector,
    // LabSelector
  },
  data() {
    return {
      apiUrl: "",
      webSocketUrl: "",
      id: "",
      height: 0,
      max_width: 0,
      websocket: null,
      monitorConfiguration: null,
      monitorValues: null
    };
  },
  methods: {
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
          this.monitorConfiguration = JSON.parse(res.data.configuration);
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
          configuration: JSON.stringify(this.monitorConfiguration)
        })
        .then(res => {
          console.log('instructor interface updated the monitor configuration')
        })
        .catch(error => {}
      );
    },
    setMonitorValuesOnServer() {
      // first check wether the websocket connection is open
      if (this.websocket.readyState === WebSocket.OPEN) {
        // now get the monitor values by constructing a message object
        const message = {
          "command": "set",
          "payload": this.monitorValues
        }
        this.websocket.send(JSON.stringify(message));
        console.log('instructor interface updated the monitor values')
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

    // emit a message that the instructor page is mounted
    this.$root.$emit("instructor");

    // get the window size
    this.height = this.$q.screen.height - 50 + "px";
    this.max_width = this.$q.screen.width;

    // set the color scheme
    this.$q.dark.set(true);

    // listen for event 'imageselector' to show the appropriate dialog
    this.$root.$on("imageselector", name => {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q.screen.height / 2}px`;
      this.$q.dialog({
        component: ImageSelector,
        parent: this,
        image_no: 2,
        imgSize: styleImg
      });
    });

    // listen for event 'rhythmselector' to show the appropriate dialog
    this.$root.$on("rhythmselector", name => {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q.screen.height / 2}px`;
      this.$q.dialog({
        component: RhythmSelector,
        parent: this,
        imgSize: styleImg
      });
    });

    // listen for event 'compressionsselector' to show the appropriate dialog
    this.$root.$on("compressionsselector", name => {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${this.$q.screen.height / 2}px`;
      this.$q.dialog({
        component: CompressionsSelector,
        parent: this,
        imgSize: styleImg
      });
    });

    // listen for event 'labselector' to show the appropriate dialog
    this.$root.$on("labselector", name => {
      const styleImg = `height: ${this.$q.screen.height / 2}px; width: ${ this.$q.screen.height }px`;
      this.$q.dialog({
        component: LabSelector,
        parent: this,
        imgSize: styleImg
      });
    });

    // get the current monitor configuration from the api
    this.getMonitorConfigurationFromServer()

    // connect to the server api websockets
    this.connectToWebsocketApi()

  },
  beforeDestroy() {
    // close the websocket connection with the api
    this.websocket.close()
    // remove all event listeners before closing
    this.$root.$off("imageselector");
    this.$root.$off("rhythmselector");
    this.$root.$off("compressionsselector");
    this.$root.$off("labselector");
  }
};
</script>
