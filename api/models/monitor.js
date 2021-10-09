const { boolean } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

const Monitor = mongoose.model("Monitor", new mongoose.Schema({
    mes_type: { type: String, default: "mon_values" },
    id: { type: String, default: "" },
    name: Joi.string().min(3).max(50).required(),
    heartrate: { type: Number, default: 125 },
    heartrateConnected: { type: Boolean, default: true },
    satPre: { type: Number, default: 97 },
    satPreConnected: { type: Boolean, default: true },
    satPost: { type: Number, default: 95 },
    satPostConnected: { type: Boolean, default: true },
    satVen: { type: Number, default: 78 },
    satVenConnected: { type: Boolean, default: true },
    respRate: { type: Number, default: 45 },
    respRateConnected: { type: Boolean, default: true },
    etco2: { type: Number, default: 35 },
    etco2Connected: { type: Boolean, default: true },
    abpSyst: { type: Number, default: 70 },
    abpDiast: { type: Number, default: 50 },
    abpConnected: { type: Boolean, default: true },
    pfi: { type: Number, default: 1 },
    temp: { type: Number, default: 37 },
    tempConnected: { type: Boolean, default: true },
    cvp: { type: Number, default: 4 },
    cvpConnected: { type: Boolean, default: true },
    papSyst: { type: Number, default: 40 },
    papDiast: { type: Number, default: 20 },
    papConnected: { type: Boolean, default: true },
    rhythmType: { type: Number, default: 0 },
    rhythmParameter: { type: Number, default: 0 },
    intubated: { type: Boolean, default: false },
    compressionsFrequency: { type: String, default: "none" },
    alarmOverride: { type: Boolean, default: false },
    imageUpdateCounter: { type: Number, default: 0 },
    imageName: { type: String, default: "" },
    labUpdateCounter: { type: Number, default: 0 },
    configurationUpdateCounter: { type: Number, default: 0 }
  })
);

function validateMonitor(monitor) {
  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    heartrate: Joi.number().required(),
    heartrateConnected: Joi.boolean().required(),
    satPre: Joi.number().required(),
    satPreConnected: Joi.boolean().required(),
    satPost: Joi.number().required(),
    satPostConnected: Joi.boolean().required(),
    pfi: Joi.number().required(),
    satVen: Joi.number().required(),
    satVenConnected: Joi.boolean().required(),
    respRate: Joi.number().required(),
    respRateConnected: Joi.boolean().required(),
    etco2: Joi.number().required(),
    etco2Connected: Joi.boolean().required(),
    abpSyst: Joi.number().required(),
    abpDiast: Joi.number().required(),
    abpConnected: Joi.boolean().required(),
    temp: Joi.number().required(),
    tempConnected: Joi.boolean().required(),
    cvp: Joi.number().required(),
    cvpConnected: Joi.boolean().required(),
    papSyst: Joi.number().required(),
    papDiast: Joi.number().required(),
    papConnected: Joi.boolean().required(),
    rhythmType: Joi.number().required(),
    rhythmParameter: Joi.number().required(),
    intubated: Joi.boolean().required(),
    compressionsFrequency: Joi.string().required(),
    alarmOverride: Joi.boolean().required(),
    imageName: Joi.string().required(),
    imageUpdateCounter: Joi.number().required(),
    labUpdateCounter: Joi.number().required(),
    configurationUpdateCounter: Joi.number().required()
  });

  return schema.validate(monitor);
}

exports.validate = validateMonitor;
exports.Monitor = Monitor;
