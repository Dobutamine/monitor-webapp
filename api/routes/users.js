const { User, validate } = require ('../models/user')
const { Monitor } = require('../models/monitor')
const { Config } = require('../models/config')
const { Lab } = require('../models/lab')

const _ = require('lodash')
const bcrypt = require('bcryptjs')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
    const { error } = validate(req.body)

    if (error) res.status(400).send(error.details[0].message)

    try {
      // capitalize the user name
      req.body.name = req.body.name.toUpperCase()
      
      // try to determine whether this user is already registered
      let user = await User.findOne( { email: req.body.email })

      if (user) res.status(400).send('This email is already registered!')

      user = await User.findOne( { email: req.body.name })

      if (user) res.status(400).send('This user name is unavailable!')

      // create the user
      user = new User(_.pick(req.body, ['name', 'email', 'password']))

      // hash the password using a salt 
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)

      // save it
      user.id = user._id
      await user.save()

      // create a default monitor entry
      monitor = new Monitor()

      // attach the user id to the monitor id object
      monitor.name = user.name
      monitor.id = user._id

      // save it
      await monitor.save()

      // create a default configuration entry
      configuration = new Config()

      // attach the user id to the configuration object
      configuration.name = user.name
      configuration.id = user._id

      // save it
      await configuration.save()

      // create a default lab entry
      lab = new Lab()

      // attach the user id to the lab object
      lab.name = user.name
      lab.id = user._id

      // save it
      await lab.save()

      res.send(monitor)

    } catch (error) {
      if (error) res.status(400).send('oops!')
    }  
})

module.exports = router

