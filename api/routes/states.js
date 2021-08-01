const { State } = require('../models/state')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // try to determine if a configuration for this id is found
    let state = await State.findOne( { id: req.query.id })

    // if not found then there's no configuration for this id
    if (!state) res.status(400).send('no states found for this id')

    // return all users
    res.send(state)

  } catch (error) {
  }
})

router.post('/new', async (req, res) => {
  try {
    // try to determine if a configuration for this id is found
    let state = new State()

    state.id = req.body.id

    state.name = req.body.name

    state.configuration = req.body.configuration

    state.save() 

    // return all users
    res.send('processed new state')

  } catch (error) {
  }  
})


module.exports = router