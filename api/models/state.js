const Joi = require("joi");
const mongoose = require("mongoose");

const State = mongoose.model(
  "State",
  new mongoose.Schema({
    id: { type: String, default: "0" },
    name: { type: String, minLength: 5, maxLength: 50, default: "default" },
    configuration: { type: String, default: " " },
  })
);

function validateState(state) {
  const schema = Joi.object({
    id: Joi.string().min(3).max(50).required(),
    name: Joi.string().min(3).max(255).required(),
    configuration: Joi.string().required(),
  });

  return schema.validate(state);
}

exports.State = State;
exports.validate = validateState;
