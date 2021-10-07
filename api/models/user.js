const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: { type: String, required: true, minLength: 5, maxLength: 50 },
    email: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 255,
      unique: true,
    },
    password: { type: String, required: true, minLength: 5, maxLength: 1024 },
    id: { type: String, default: "" },
  })
);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
