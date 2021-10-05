const mongoose = require("mongoose");

const Monitor = mongoose.model(
  "Monitor",
  new mongoose.Schema({
    id: { type: String, default: "0" },
    heartrate: { type: Number, default: 125 },
    heartrate_enabled: { type: Boolean, default: true},
    satPre: { type: Number, default: 97 },
    satPre_enabled: { type: Boolean, default: true},
    satPost: { type: Number, default: 95 },
    satPost_enabled: { type: Boolean, default: true},
    satVen: { type: Number, default: 78 },
    satVen_enabled: { type: Boolean, default: true},
    respRate: { type: Number, default: 45 },
    respRate_enabled: { type: Boolean, default: true},
    etco2: { type: Number, default: 35 },
    etco2_enabled: { type: Boolean, default: true},
    abpSyst: { type: Number, default: 70 },
    abpDiast: { type: Number, default: 50 },
    abp_enabled: { type: Boolean, default: true},
    pfi: { type: Number, default: 1 },
    temp: { type: Number, default: 37 },
    temp_enabled: { type: Boolean, default: true},
    cvp: { type: Number, default: 4 },
    cvp_enabled: { type: Boolean, default: true},
    papSyst: { type: Number, default: 40 },
    papDiast: { type: Number, default: 20 },
    pap_enabled: { type: Boolean, default: true},
    rhythmType: { type: Number, default: 0 },
    rhythmParameter: { type: Number, default: 0 },
    intubated: { type: Boolean, default: false },
    imageName: { type: String, default: "" },
    compressionsFrequency: { type: String, default: "none" },
    alarmOverride: { type: Boolean, default: false },
  })
);

exports.Monitor = Monitor;
