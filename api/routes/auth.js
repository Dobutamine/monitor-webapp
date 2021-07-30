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
  try {
    let user = await User.findOne( { name: req.body.name })

    // if we don't have the user return an error message
    if (!user) res.status(400).send('Invalid user name or password!')

    // validate the password
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) res.status(400).send('Invalid user name or password!')

    // return a JSON web token
    const token = jwt.sign({ _id : user._id }, 'jwtPrivateKey')

    // return the token
    res.send({ name: user.name, id: user.id })

  } catch (error) {
  }
  
})

// validate function the validate the request
function validate(req) {
  const schema = Joi.object ({
    name: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(5).max(1024).required(),
  })
  return schema.validate(req)
}

module.exports = router