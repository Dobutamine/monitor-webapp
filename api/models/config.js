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
      curveLabel: "III",
      sourceCurve: 'ecg_signal',
      source1: "heartrate",
      source2: "",
      connected: true,
      color: "#5EEA32",
      alarmEnabled: true,
      lowerAlarm: 80,
      upperAlarm: 180,
      timeframe: 6,
      performance: 1,
      zoom: 0.6,
      grid: false,
      autoscale: true,
      minY: -10,
      maxY: 10,
      limiterMax: "",
      limiterMin: "",
      squeezeFactor: 0,
      mmhg: true
    }},
    curve2: { type: Object, default: { 
      label: "SAT(1)",
      curveLabel: "SAT(1)",
      sourceCurve: 'abp_signal',
      connected: true,
      source1: "satPre",
      source2: "",
      color: "#DF32EA",
      alarmEnabled: true,
      lowerAlarm: 88,
      upperAlarm: 100,
      timeframe: 6,
      performance: 1,
      zoom: 0.6,
      grid: true,
      autoscale: false,
      minY: 20,
      maxY: 50,
      limiterMax: "",
      limiterMin: "",
      squeezeFactor: 0,
      mmhg: true
    }},
    curve3: { type: Object, default: { 
      label: "SAT(2)",
      curveLabel: "SAT(2)",
      sourceCurve: 'sat_signal',
      connected: true,
      source1: "satPost",
      source2: "",
      color: "#DF32EA",
      alarmEnabled: true,
      lowerAlarm: 88,
      upperAlarm: 100,
      timeframe: 6,
      performance: 1,
      zoom: 0.6,
      grid: true,
      autoscale: false,
      minY: 20,
      maxY: 50,
      limiterMax: "",
      limiterMin: "",
      squeezeFactor: 0,
      mmhg: true
    }},
    curve4: { type: Object, default: { 
      label: "ABP",
      curveLabel: "ABP",
      sourceCurve: 'abp_signal',
      connected: true,
      source1: "abpSyst",
      source2: "abpDiast",
      color: "#FB0808",
      alarmEnabled: true,
      lowerAlarm: 35,
      upperAlarm: 75,
      timeframe: 6,
      performance: 1,
      zoom: 0.6,
      grid: true,
      autoscale: false,
      minY: 20,
      maxY: 50,
      limiterMax: "",
      limiterMin: "",
      squeezeFactor: 0,
      mmhg: true
    }},
    curve5: { type: Object, default: { 
      label: "RF",
      curveLabel: "RF",
      sourceCurve: 'resp_signal',
      connected: true,
      source1: "respRate",
      source2: "",
      color: "#FFFFFF",
      alarmEnabled: true,
      lowerAlarm: 20,
      upperAlarm: 100,
      timeframe: 20,
      performance: 1,
      zoom: 0.6,
      grid: true,
      autoscale: true,
      minY: -10,
      maxY: 10,
      limiterMax: "",
      limiterMin: "",
      squeezeFactor: 0,
      mmhg: true
    }},
    curve6: { type: Object, default: { 
      label: "etCO2",
      curveLabel: "etco2",
      sourceCurve: 'etco2_signal',
      connected: true,
      source1: "etco2",
      source2: "",
      color: "#FBE908",
      alarmEnabled: true,
      lowerAlarm: 30,
      upperAlarm: 75,
      timeframe: 20,
      performance: 1,
      zoom: 0.6,
      grid: true,
      autoscale: true,
      minY: -10,
      maxY: 10,
      limiterMax: "",
      limiterMin: "",
      squeezeFactor: 0,
      mmhg: true
    }},
    param1: { type: Object, default: { 
      label: "",
      connected: true,
      source1: "empty",
      source2: "",
      color: "#000000",
      alarmEnabled: false,
      lowerAlarm: 80,
      upperAlarm: 180,
      mmhg: true
    }},
    param2: { type: Object, default: { 
      label: "Pols",
      connected: true,
      source1: "heartrate",
      source2: "",
      color: "#DF32EA",
      alarmEnabled: false,
      lowerAlarm: 80,
      upperAlarm: 180,
      mmhg: true
    }},
    param3: { type: Object, default: { 
      label: "",
      connected: true,
      source1: "empty",
      source2: "",
      color: "#000000",
      alarmEnabled: false,
      lowerAlarm: 80,
      upperAlarm: 180,
      mmhg: true
    }},
    param4: { type: Object, default: { 
      label: "",
      connected: true,
      source1: "empty",
      source2: "",
      color: "#000000",
      alarmEnabled: false,
      lowerAlarm: 80,
      upperAlarm: 180,
      mmhg: true
    }},
    param5: { type: Object, default: { 
      label: "NIBD",
      connected: true,
      source1: "abpSyst",
      source2: "abpDiast",
      color: "#FB0808",
      alarmEnabled: true,
      lowerAlarm: 35,
      upperAlarm: 75,
      mmhg: true
    }},
    param6: { type: Object, default: { 
      label: "Temp",
      connected: true,
      source1: "temp",
      source2: "",
      color: "#5EEA32",
      alarmEnabled: true,
      lowerAlarm: 36.5,
      upperAlarm: 37.5,
      mmhg: true
    }}
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
