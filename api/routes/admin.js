const { User } = require ('../models/user')
const { Monitor } = require ('../models/monitor')
const { Lab } = require ('../models/lab')
const { Config } = require ('../models/config')

const jwt = require ('jsonwebtoken')
const Joi = require('joi')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const express = require('express')
const router = express.Router()

router.delete('/user', async(req, res) => {

  // first get the id of this user name
  let user = await User.findOne( { name: req.query.name.toUpperCase() })

  // if we don't have the user return an error message
  if (!user) res.status(400).send('user name not found!')

  // now erase all patient id entries
  let config = await Config.findOneAndDelete({ id: user.id })
  let monitor = await Monitor.findOneAndDelete({ id: user.id })
  let lab = await Lab.findOneAndDelete({ id: user.id })

  const id = user.id
  user = await User.findOneAndDelete( { name: req.query.name.toUpperCase() })

  res.send('user deleted')
})

router.get('/users', async(req, res) => {

  // first get the id of this user name
  let users = await User.find()

  // if we don't have the user return an error message
  if (!users) res.status(400).send('no users found!')

  res.send({ users })
})

router.get('/monitors', async(req, res) => {

  // first get the id of this user name
  let monitors = await Monitor.find()

  // if we don't have the user return an error message
  if (!monitors) res.status(400).send('no monitors found!')

  res.send({ monitors })
})

router.get('/labs', async(req, res) => {

  // first get the id of this user name
  let labs = await Lab.find()

  // if we don't have the user return an error message
  if (!labs) res.status(400).send('no monitors found!')

  res.send({ labs })
})

router.get('/configs', async(req, res) => {

  // first get the id of this user name
  let configs = await Config.find()

  // if we don't have the user return an error message
  if (!configs) res.status(400).send('no monitors found!')

  res.send({ configs })
})





router.get('/config', async(req, res) => {

  req.query.name = req.query.name.toUpperCase()

  // first get the id of this user name
  let user = await User.findOne( { name: req.query.name })

  // if we don't have the user return an error message
  if (!user) res.status(400).send('user name not found!')

  let configuration = await Config.findOne({ id: user.id });

  res.send({ name: user.name, id: user.id, configuration: configuration })
})

router.get('/user', async(req, res) => {

  // first get the id of this user name
  let user = await User.findOne( { name: req.query.name.toUpperCase() })

  // if we don't have the user return an error message
  if (!user) res.status(400).send('user name not found!')

  res.send({ name: user.name, id: user.id, user: user })
})

router.get('/monitor', async(req, res) => {

  // first get the id of this user name
  let user = await User.findOne( { name: req.query.name.toUpperCase() })

  // if we don't have the user return an error message
  if (!user) res.status(400).send('user name not found!')

  let monitor = await Monitor.findOne({ id: user.id });

  res.send({ name: user.name, id: user.id, monitor: monitor })
})

router.get('/lab', async(req, res) => {

  // first get the id of this user name
  let user = await User.findOne( { name: req.query.name.toUpperCase() })

  // if we don't have the user return an error message
  if (!user) res.status(400).send('user name not found!')

  let lab = await Lab.findOne({ id: user.id });

  res.send({ name: user.name, id: user.id, lab: lab })
})


router.post('/', async (req, res) => {
  
  
})

module.exports = router