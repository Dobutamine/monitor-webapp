const mongoose = require("mongoose");

const Monitor = mongoose.model(
  "Monitor",
  new mongoose.Schema({
    id: { type: String, default: "0" },
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
    imageName: { type: String, default: "" },
    compressionsFrequency: { type: String, default: "none" },
    alarmOverride: { type: Boolean, default: false },
  })
);

exports.Monitor = Monitor;
