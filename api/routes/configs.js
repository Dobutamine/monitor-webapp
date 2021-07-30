const { Config } = require('../models/config')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    // try to determine if a configuration for this id is found
    let configuration = await Config.findOne( { id: req.body.id })

    // if not found then there's no configuration for this id
    if (!configuration) res.status(400).send('no configuration found for this id')

    // return all users
    res.send(configuration)
  } catch (error) {
  }
})

router.post('/new', async (req, res) => {
  try {
    // try to determine if a configuration for this id is found
    let configuration = await Config.findOne( { id: req.body.id })

    // if not found then there's no configuration for this id
    if (!configuration) res.status(400).send('no configuration found for this id')

    configuration.configuration = req.body.configuration

    configuration.save() 

    // return all users
    res.send('processed new configuration')

  } catch (error) {
  }  
})


module.exports = router