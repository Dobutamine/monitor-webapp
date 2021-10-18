const Joi = require("joi");
const mongoose = require("mongoose");

const Lab = mongoose.model(
  "Lab",
  new mongoose.Schema({
    mes_type: { type: String, default: "mon_lab" },
    id: { type: String, default: "" },
    name: Joi.string().min(3).max(50),
    bloodgas: { type: Object, default: {
      na: 140,
      k: 3.8,
      cl: 100,
      ph: 7.4,
      po2: 100,
      pco2: 35,
      bic: 25,
      be: -0.5,
      glucose: 3.5,
      lactate: 1
    }},
    bloodgasAvailable: { type: Boolean, default: false },
    cbc: { type: Object, default: {
      hb: 10,
      ht: 0.5,
      leucocytes: 6.7,
      trombocytes: 245
    } },
    cbcAvailable: { type: Boolean, default: false },
    other: { type: Object, default: {
      CRP: 2,
      urea: 5,
      kreatinine: 40,
      albumin: 35,
      ammonia: 20,
      calcium: 2.02,
      phosphate: 1.8,
      magnesium: 1.0,
    } },
    otherAvailable: { type: Boolean, default: false },
  })
);

function validateLab(lab) {
  const schema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
    name: Joi.string().min(3).max(50).required(),
    bloodgas: Joi.object().required(),
    bloodgasAvailable: Joi.boolean().required(),
    cbc: Joi.object().required(),
    cbcAvailable: Joi.boolean().required(),
    other: Joi.object().required(),
    otherAvailable: Joi.boolean().required(),
  });

  return schema.validate(lab);
}

exports.Lab = Lab;
exports.validate = validateLab;
