const Joi = require('joi')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  // return all users
  res.send('API is running!!!!')
})


module.exports = router

