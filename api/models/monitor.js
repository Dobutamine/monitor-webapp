const Joi = require("joi");
const mongoose = require("mongoose");

const Monitor = mongoose.model("Monitor", new mongoose.Schema({
    mes_type: { type: String, default: "mon_values" },
    id: { type: String, default: "" },
    name: Joi.string().min(3).max(50).required(),
    heartrate: { type: Number, default: 125 },
    satPre: { type: Number, default: 97 },
    satPost: { type: Number, default: 95 },
    satVen: { type: Number, default: 78 },
    respRate: { type: Number, default: 45 },
    etco2: { type: Number, default: 35 },
    abpSyst: { type: Number, default: 70 },
    abpDiast: { type: Number, default: 50 },
    pfi: { type: Number, default: 1 },
    temp: { type: Number, default: 37 },
    cvp: { type: Number, default: 4 },
    papSyst: { type: Number, default: 40 },
    papDiast: { type: Number, default: 20 },
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
    satPre: Joi.number().required(),
    satPost: Joi.number().required(),
    satVen: Joi.number().required(),
    respRate: Joi.number().required(),
    etco2: Joi.number().required(),
    abpSyst: Joi.number().required(),
    abpDiast: Joi.number().required(),
    pfi: Joi.number().required(),
    temp: Joi.number().required(),
    cvp: Joi.number().required(),
    papSyst: Joi.number().required(),
    papDiast: Joi.number().required(),
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
