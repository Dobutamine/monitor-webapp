/* eslint-disable */
export class ModelInterface {

  // json model file which is used on startup. File must be in the explain_e
  default_model_definition = 'monitor_emulator'

  // declare a model engine object containing the new model
  definition = {}
  engine = {}
  data = []
  properties = {}

  constructor () {

    this.loadedModelName = this.default_model_definition

    // initialize the model engine
    this.engine = new Worker("./explain_engine/engine.js");

    // load the model definition file into the modelengine
    this.loadModelDefinition(this.default_model_definition)

  }

  loadNewModelDefinition = (model_definition) => {

    // remove event handler
    this.engine.removeEventListener("message", (message) => {
      this._receiveMessageFromModel(message.data)
    });

    // terminate previous worker
    this.engine.terminate()

    // initialize the model engine
    this.engine = new Worker("./explain_engine/engine.js");

    this.definition = model_definition

    this.engine.postMessage({
      type: "cmd",
      target: null,
      action: "load",
      data: this.definition,
      return_tag: null
    });

    // attach an event handler to receive messages from the model engine 
    this.engine.addEventListener("message", (message) => {
      this._receiveMessageFromModel(message.data)
    });


  }

  loadModelDefinition = (filename) => {
    filename = './explain_engine/definitions/' + filename + '.json'
    // now load the model definition file from the server
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", filename, true);
    xobj.onreadystatechange = () => {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        // load the model
        this.definition = JSON.parse(xobj.responseText)
        if (this.engine) {
            this.engine.postMessage({
            type: "cmd",
            target: null,
            action: "load",
            data: this.definition,
            return_tag: null
          });
        }
      }
    };
    xobj.send(null);

  }

  getCurrentLoadedModelName = () => {
    return this.loadedModelName
  }
  
  setDataloggerInterval = (update_interval) => {    
    this.engine.postMessage({
      type: "set",
      target: "datalogger",
      action: "setUpdateInterval",
      data: update_interval,
      return_tag: null
    });
  }

  setDataloggerWatchedModels = (models_to_watch) => {
    this.engine.postMessage({
      type: "set",
      target: "datalogger",
      action: "setWatchedModels",
      data: models_to_watch,
      return_tag: null
    });
  }

  setDataloggerWatchedModelsRT = (models_to_watch) => {
    this.engine.postMessage({
      type: "set",
      target: "datalogger",
      action: "setWatchedModelsRT",
      data: models_to_watch,
      return_tag: null
    });
  }

  setModelState = (snapshot) => {
    this.engine.postMessage({
      type: "set",
      target: "datalogger",
      action: "setModelState",
      data: snapshot,
      return_tag: null
    });
  }

  setEmulatorData = (data) => {
    this.engine.postMessage({
      type: "set",
      target: "emulator",
      action: "",
      data: data,
      return_tag: null
    });
  }

  setPropertyDirect = (model, property, new_value) => {
    this.engine.postMessage({
      type: "set_direct",
      target: model,
      action: property,
      data: new_value
    })
  }

  setPropertyByFunction = (model, func, new_value) => {
    this.engine.postMessage({
      type: "set",
      target: model,
      action: func,
      data: new_value
    })
  }

  setProperty = (model, property, new_value, in_time = 0, at_time = 0, mode = "abs") => {
    this.engine.postMessage({
      type: "set",
      target: "interventions",
      action: "addPropertyChange",
      data: {
        model: model,
        property: property,
        target: new_value,
        in_time: in_time,
        at_time: at_time,
        mode: mode,
        label: model + property + " change",
      },
      return_tag: null
    });
  }

  getModelJSON = () => {
    this.engine.postMessage({
      type:"get",
      target:"datalogger",
      action:"getModelJSON",
      data: null,
      return_tag: "json"
    })
  }

  getModelState = () => {
    // if model is not specified this gets all the properties of the model engine
    this.engine.postMessage({
      type: "get",
      target: "datalogger",
      action: "getModelStateFull",
      data: null,
      return_tag: "state"
    });
  }

  getModelDefinition = (model) => {
    this.engine.postMessage({
      type: "get",
      target: "model_definition",
      action: "null",
      data: null,
      return_tag: "model_definition"
    });
  }

  getProperties = (model) => {
      // if model is not specified this gets all the properties of the model engine
      this.engine.postMessage({
        type: "get",
        target: "datalogger",
        action: "getModelProps",
        data: model,
        return_tag: "props"
      });
  }

  startModel = () => {
    // clear the current data object
    this.clearData();

    // start the realtime model
    this.engine.postMessage({
      type: "cmd",
      target: null,
      action: "start",
      data: null,
      return_tag: null
    });
  }

  stopModel = () => {

    // stop the realtime model
    this.engine.postMessage({
      type: "cmd",
      target: null,
      action: "stop",
      data: null,
      return_tag: null
    });

  }
  
  fastForwardModel = (time_to_calculate) => {
    // calculate the model 
    this.engine.postMessage({
      type: "cmd",
      target: null,
      action: "goto",
      data: time_to_calculate,
      return_tag: null
    });
  }

  calculateModel = (time_to_calculate) => {
    // clear the current data object
    this.clearData()
    
    // calculate the model 
    this.engine.postMessage({
      type: "cmd",
      target: null,
      action: "calculate",
      data: time_to_calculate,
      return_tag: null
    });

  }

  clearData = () => {
    // clear the data object
    // console.log(`%cMODEL: reset all model output data`, "color:red;")
    this.data = []
  }

}


