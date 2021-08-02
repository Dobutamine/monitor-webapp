const Joi = require("joi");
const mongoose = require("mongoose");

const Lab = mongoose.model(
  "Lab",
  new mongoose.Schema({
    id: { type: String, default: "0" },
    bloodgas: {
      type: String,
      default:
        '{"na":140,"k":3.8,"cl":100,"ph":7.4,"po2":100,"pco2":35,"bic":25,"be":-0.5,"glucose":3.5,"lactate":1}',
    },
    cbc: { type: String, default: "" },
    electrolytes: { type: String, default: "" },
    other: { type: String, default: "" },
  })
);

function validateLab(lab) {
  const schema = Joi.object({
    id: Joi.string().min(3).max(255).required(),
    bloodgas: Joi.string().max(255).required(),
    cbc: Joi.string().max(255).required(),
    electrolytes: Joi.string().max(255).required(),
    other: Joi.string().max(255).required(),
  });

  return schema.validate(lab);
}

exports.Lab = Lab;
exports.validate = validateLab;
