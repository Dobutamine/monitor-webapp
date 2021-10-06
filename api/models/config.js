const Joi = require("joi");
const mongoose = require("mongoose");

const Config = mongoose.model(
  "Config",
  new mongoose.Schema({
    id: { type: String, default: "0" },
    configuration: {
      type: String,
      default:
        '[{"label":"HR","source1":"heartrate","source2":"","channelNo":1,"color":"#5EEA32","alarmEnabled":true,"lowerAlarm":80,"upperAlarm":180,"visible": true},{"label":"SAT(1)","source1":"satPre","source2":"","channelNo":2,"color":"#DF32EA","alarmEnabled":true,"lowerAlarm":88,"upperAlarm":100,"visible": true},{"label":"SAT(2)","source1":"satPost","source2":"","channelNo":3,"color":"#DF32EA","alarmEnabled":true,"lowerAlarm":88,"upperAlarm":100,"visible": true},{"label":"ABP","source1":"abpSyst","source2":"abpDiast","channelNo":4,"color":"#FB0808","alarmEnabled":true,"lowerAlarm":35,"upperAlarm":75,"visible": true},{"label":"NIBD","source1":"abpSyst","source2":"abpDiast","channelNo":11,"color":"#FB0808","alarmEnabled":true,"lowerAlarm":35,"upperAlarm":75,"visible": true},{"label":"Temp","source1":"temp","source2":"","channelNo":12,"color":"#5EEA32","alarmEnabled":false,"lowerAlarm":35,"upperAlarm":75,"visible": true},{"label":"Pols","source1":"heartrate","source2":"","channelNo":8,"color":"#DF32EA","alarmEnabled":false,"lowerAlarm":35,"upperAlarm":75,"visible": true},{"label":"PFI","source1":"pfi","source2":"","channelNo":9,"color":"#DF32EA","alarmEnabled":false,"lowerAlarm":35,"upperAlarm":75,"visible": true},{"label":"RF","source1":"respRate","source2":"","channelNo":5,"color":"#FFFFFF","alarmEnabled":true,"lowerAlarm":20,"upperAlarm":100,"visible": true},{"label":"etCO2","source1":"etco2","source2":"","channelNo":6,"color":"#FBE908","alarmEnabled":true,"lowerAlarm":30,"upperAlarm":75,"visible": true}]'
    },
  })
);

function validateConfig(config) {
  const schema = Joi.object({
    id: Joi.string().min(3).max(50).required(),
    configuration: Joi.string().required(),
  });

  return schema.validate(config);
}

exports.Config = Config;
exports.validate = validateConfig;
