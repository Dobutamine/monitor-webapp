const mongoose = require('mongoose')

const labSchema = mongoose.Schema( {
  id: { type: String, default: '0' },
  bloodgas: { type: String, default: ''},
  cbc: { type: String, default: ''},
  electrolytes: { type: String, default: '' },
  other: { type: String, default: '' }
})

const Lab = mongoose.model('Lab', labSchema)

exports.Lab = Lab

