const Joi = require("joi");
const mongoose = require("mongoose");

const Lab = mongoose.model(
  "Lab",
  new mongoose.Schema({
    id: { type: String, default: "0" },
    bloodgas: { type: String, default: "" },
    cbc: { type: String, default: "" },
    electrolytes: { type: String, default: "" },
    other: { type: String, default: "" },
  })
);

function validateLab(lab) {
  const schema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
    bloodgas: Joi.string().min(3).max(255).required(),
    cbc: Joi.string().min(3).max(255).required(),
    electrolytes: Joi.string().min(3).max(255).required(),
    other: Joi.string().min(3).max(255).required(),
  });

  return schema.validate(lab);
}

exports.Lab = Lab;
exports.validate = validateLab;
