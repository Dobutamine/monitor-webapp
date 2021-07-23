/* eslint-disable */

// This is a dedicated web worker instance for the physiological model engine
// Web workers run in a separate thread for performance reasons and have no access to the DOM nor the window object
// The scope is defined by self and communication with the main thread by a message channel
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#web_workers_api

// Communication with the script which spawned the web worker takes place through a com channel 
// Messages are received in the onmessage event and are sent by the SendMessage function

// Explain message object :
/* {
  type:       <string> stating the type of message (set/get/cmd)
  target:     <string> stating the component of the model for which the message is intended (p.e. 'datalogger'/'interventions')
  action:     <string> stating the action name
  data:       <object> containing data to pass to the action
  return_tag: <string> if data is returned from the above action it is tagged with this string.
}
*/

// import the helper classes
importScripts("./helpers/MonitorEmulator.js")

// define an object which is going to hold available possible component types
let componentTypes = {}

// define an object which is going to hold available possible monitor types
let monitorTypes = {}

// define an object which is going to hold the entire model state and properties
let current_model = {};

// define an object which is going to hold the model definition as defined by a json definition file
let model_definition = {};

// model data is logged by the datalogger, its's placeholder is defined here
let datalogger = {};

let monitor_emulator = {}

// define the main timer for the real-time modeling modes and set the realtime reporting interval
let main_timer;
let realtime_step = 0.03

// the onmessage function is an event handler handling messages posted to the model engine worker thread.
// e is a MessageEvent object wich contains a data field containing the message
onmessage = function (e) {
  
  switch (e.data.type) {
    // getting data from the model.
    case "get":
      break;
    
    case "set_direct":
      // set a model property directly (dangerous!)
      if (typeof current_model.components[e.data.target][e.data.action] === 'number') {
        current_model.components[e.data.target][e.data.action] = parseFloat(e.data.data)
      } else {
        current_model.components[e.data.target][e.data.action] = e.data.data
      }
      // send message that the property is set
      sendMessage("mes", null, null, [`${e.data.target}.${e.data.action} = ${e.data.data}`]);
      break;

    case "set": 
      if (e.data.target === "Ventilator") {
        // setters data handled by the interventions engine
        current_model.components['Ventilator'][e.data.action](e.data.data)
      }

      if (e.data.target === "emulator") {
        // setters data handled by the interventions engine
        monitor_emulator.setNewData(e.data.data)
      }

      if (e.data.action === "change_property") {
        // directly set a parameter on the model
        current_model.components[e.data.target] = e.data.data
      }
      break; 

    case "cmd":
      // execute commands in the engine
      switch (e.data.action) {
        case "load":
          loadModel(e.data.data);
          break;
        case "start":
          startModel();
          break;
        case "stop":
          stopModel();
          break;
      }
      break;
    
    default:
      // if the incoming message is nog recognized it is displayed on the console 
      this.console.log(
        "model received unknown command ",
        e.data.type,
        e.data.subtype,
        e.data.target,
        e.data.data
      );
      break;
  }
};

// routine to send messages to the main thread
const sendMessage = function (type, target, action, data, return_tag) {
  postMessage({
    type,
    target,
    action,
    data,
    return_tag
  });
};

// initialize the model from the JSON model_definition file
const initModel = function (model_definition) {

  if (model_definition) {
    // set the general properties as weight and name from the definition file
    current_model["name"] = model_definition["name"];
    current_model["description"] = model_definition["description"];

    // set the modeling stepsize of the model in seconds
    current_model["modeling_stepsize"] = model_definition["modeling_stepsize"];

    // define the dictionary holding all model components in the current model instance
    current_model["components"] = {};

    // initialize all the components by first finding out what components are configures in the JSON file
    initializeComponents(model_definition)

    // import and initialize the monitor emulator
    monitor_emulator = new MonitorEmulator(current_model)

  }
};


// initialize the  model components from the model_definition file
const initializeComponents = function (model_definition) {

  // initialize all the components by first finding out what components are configures in the JSON file
  let componentTypes = []
  model_definition["components"].forEach(component => {
    if (component.subtype !== ""){
      componentTypes.push(component.subtype)
    }
  })

  // remove duplicates
  const componentList = [...new Set(componentTypes)]

  // build a dictionary with all component types ready to be dynamically instantiated
  componentList.forEach(compType => {
    // construct the component file name
    const compFileName = "./components/" + compType + ".js"
    try {
      // import the component code
      importScripts(compFileName);
      // store the component type in a dictionary
      componentTypes[compType] = eval(compType);
    } catch(err) {
      console.log('error: ' , compFileName, err.message)
    }
  })

  // now we're going to read the JSON file and instatiate the desired type and populate the properties
  model_definition["components"].forEach(component => {
    if (component.subtype !== ""){
      // instantiate the component type and add a reference to the current model!
      let newComponent = new componentTypes[component.subtype](current_model)
      // add the properties
      Object.keys(component).forEach(function (prop) {
        newComponent[prop] = component[prop];
      });
      // add the new component to the currentmodel
      current_model.components[component.name] = newComponent
    }
  })
}

// load and initialize a new model from a json model definition object
const loadModel = function (json_model_definition) {
  current_model = {}
  model_definition = json_model_definition;

  // initialize the model with the just loaded model definition
  initModel(model_definition);
};

// dispose of the current model
const disposeModel = function () {
  // stop the main timer
  if (main_timer) {
    clearInterval(main_timer);
    clearTimeout(main_timer)
  }
  main_timer = null

  // erase the current model object
  current_model = {};
};

// start the realtime model
const startModel = function () {
  if (model_definition) {
    // first switch on datalogger realtime mode
     datalogger.realtime = true;

    // reset the main timer if it's already running
    if (main_timer) {
      clearInterval(main_timer)
      clearTimeout(main_timer)
    }

    // set the main timer to the modeling interval which is stored in the JSON model definition
    main_timer = setInterval(modelStepRealtime, realtime_step * 1000);
  } 
};

// stop the realtime model
const stopModel = function () {

  if (model_definition) {
    // stop the main timer
    if (main_timer) {
      clearInterval(main_timer);
      clearTimeout(main_timer)
    }
    main_timer = null
  } 
};

const setEmulatorData = function (data) {
  monitor_emulator.setNewData(data)
}

// realtime model cycle is called every x ms defined by the modeling stepsize in the model definition
const modelStepRealtime = function () {
  // this realtime model step has the purpose to calculate a model step in realtime, log the data and process interventions

   // number of loops
   let no_loops = parseInt(realtime_step / current_model.modeling_stepsize);

   for (let i=0; i<no_loops; i++) {
     
     // iterate over all components and do the modelstep. The actual modeling is done in this loop
      for (const key in current_model.components) {
        current_model.components[key].modelStep();
      }
    
      // update the monitor emulator
      monitor_emulator.modelStep()
   }

   return 0
}


