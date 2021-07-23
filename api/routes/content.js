const Joi = require('joi')
const { Monitor } = require('../models/monitor')
const _ = require('lodash')
const express = require('express')
const router = express.Router()


router.get('/', async (req, res) => {
  // validate request
  let monitor = await Monitor.findOne( { id: req.body.id })
  // return all content
  res.send(monitor)
})

router.get('/:id', (req, res) => {
  // validate request
  // find id
  
  // return content
})

router.post('/:id', (req, res) => {
  // validate request
  // make new content and put it into the server public directory
  // return the user
})

module.exports = router
