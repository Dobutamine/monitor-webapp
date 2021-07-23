const { User } = require ('../models/user')
const jwt = require ('jsonwebtoken')
const Joi = require('joi')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  // validate the request
  const { error } = validate(req.body)

  // if the request is not validated then return 400 (bad request) and error mesage
  if (error) res.status(400).send(error.details[0].message)

  // find the user by looking at the email
  let user = await User.findOne( { email: req.body.email })

  // if we don't have the user return an error message
  if (!user) res.status(400).send('Invalid email or password!')

  // validate the password
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) res.status(400).send('Invalid email or password!')

  // return a JSON web token
  const token = jwt.sign({ _id : user._id }, 'jwtPrivateKey')

  // return the token
  res.send(token)
})

// validate function the validate the request
function validate(req) {
  const schema = Joi.object ({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  })
  return schema.validate(req)
}

module.exports = router