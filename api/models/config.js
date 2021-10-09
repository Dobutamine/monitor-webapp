const { object } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");


const Config = mongoose.model(
  "Config",
  new mongoose.Schema({
    mes_type: { type: String, default: "mon_config" },
    id: { type: String, default: "" },
    name: Joi.string().min(3).max(50).required(),
    curve1: { type: Object, default: { 
      label: "HR",
      connected: true,
      source1: "heartrate",
      source2: "",
      color: "#5EEA32",
      alarmEnabled: true,
      lowerAlarm: 80,
      upperAlarm: 180,
    }},
    curve2: { type: Object, default: { 
      label: "SAT(1)",
      connected: true,
      source1: "satPre",
      source2: "",
      color: "#DF32EA",
      alarmEnabled: true,
      lowerAlarm: 88,
      upperAlarm: 100,
    }},
    curve3: { type: Object, default: { 
      label: "SAT(2)",
      connected: true,
      source1: "satPre",
      source2: "",
      color: "#DF32EA",
      alarmEnabled: true,
      lowerAlarm: 88,
      upperAlarm: 100,
    }},
    curve4: { type: Object, default: { 
      label: "ABP",
      connected: true,
      source1: "abpSyst",
      source2: "abpDiast",
      color: "#FB0808",
      alarmEnabled: true,
      lowerAlarm: 35,
      upperAlarm: 75,
    }},
    curve5: { type: Object, default: { 
      label: "RF",
      connected: true,
      source1: "respRate",
      source2: "",
      color: "#FFFFFF",
      alarmEnabled: true,
      lowerAlarm: 20,
      upperAlarm: 100,
    }},
    curve6: { type: Object, default: { 
      label: "etCO2",
      connected: true,
      source1: "etco2",
      source2: "",
      color: "#FBE908",
      alarmEnabled: true,
      lowerAlarm: 30,
      upperAlarm: 75,
    }},
    param1: { type: Object, default: { 
      label: "NIBD",
      connected: true,
      source1: "abpSyst",
      source2: "abpDiast",
      color: "#FB0808",
      alarmEnabled: true,
      lowerAlarm: 35,
      upperAlarm: 75,
    }},
    param2: { type: Object, default: { 
      label: "Temp",
      connected: true,
      source1: "temp",
      source2: "",
      color: "#5EEA32",
      alarmEnabled: true,
      lowerAlarm: 36.5,
      upperAlarm: 37.5,
    }},
    param3: { type: Object, default: { 
      label: "Pols",
      connected: true,
      source1: "heartrate",
      source2: "",
      color: "#DF32EA",
      alarmEnabled: false,
      lowerAlarm: 80,
      upperAlarm: 180,
    }},
    param4: { type: Object, default: { 
      label: "PFI",
      connected: true,
      source1: "pfi",
      source2: "",
      color: "#DF32EA",
      alarmEnabled: false,
      lowerAlarm: 80,
      upperAlarm: 180,
    }},
    param5: { type: Object, default: { 
      label: "",
      connected: false,
      source1: "",
      source2: "",
      color: "#000000",
      alarmEnabled: false,
      lowerAlarm: 80,
      upperAlarm: 180,
    }},
    param6: { type: Object, default: { 
      label: "",
      connected: false,
      source1: "",
      source2: "",
      color: "#000000",
      alarmEnabled: false,
      lowerAlarm: 80,
      upperAlarm: 180,
    }},

  })
);

function validateConfig(config) {
  const schema = Joi.object({
    id: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(50).required(),
    curve1: Joi.object().required(),
    curve2: Joi.object().required(),
    curve3: Joi.object().required(),
    curve4: Joi.object().required(),
    curve5: Joi.object().required(),
    curve6: Joi.object().required(),
    param1: Joi.object().required(),
    param2: Joi.object().required(),
    param3: Joi.object().required(),
    param4: Joi.object().required(),
    param5: Joi.object().required(),
    param6: Joi.object().required(),
  });

  return schema.validate(config);
}

exports.Config = Config;
exports.validate = validateConfig;
