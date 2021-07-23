const { User, validate } = require ('../models/user')
const { Monitor } = require('../models/monitor')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) res.status(400).send(error.details[0].message)

  // try to determine whether this user is already registered
  let user = await User.findOne( { email: req.body.email })

  if (user) res.status(400).send('User already registered!')

  // create the user
  user = new User(_.pick(req.body, ['name', 'email', 'password']))

  // hash the password using a salt 
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  // save it
  await user.save()

  // create a default monitor entry
  monitor = new Monitor()

  // attach the user id to the monitor id object
  monitor.id = user._id

  // save it
  await monitor.save()

  // use lodash to modify the response
  // res.send(_.pick(user, ['_id', 'name', 'email', 'password']))

  // use lodash to return a the monitor object
  res.send(monitor)
})

module.exports = router

