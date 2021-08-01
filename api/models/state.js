const mongoose = require('mongoose')

const stateSchema = mongoose.Schema( {
  id: { type: String, default: '0' },
  name: { type: String, default: 'default' },
  hr: { type: String, default: '[140, 0, 0]'},
  satPre: { type: String, default: '[100, 0, 0]'},
  satPost: { type: String, default: '[97, 0, 0]'},
  abpSyst: { type: String, default: '[70, 0, 0]'},
  abpDiast: { type: String, default: '[50, 0, 0]'},
  papSyst: { type: String, default: '[40, 0, 0]'},
  papDiast: { type: String, default: '[20, 0, 0]'},
  cvp: { type: String, default: '[4, 0, 0]'},
  respRate: { type: String, default: '[45, 0, 0]'},
  etco2: { type: String, default: '[40, 0, 0]'},
  temp: { type: String, default: '[37, 0, 0]'},
  imageName: { type: String, default: ''},
  rhythmType: { type: Number, default: 0},
  rhythmParameter: { type: Number, default: 0},
  intubated: { type: Boolean, default: false},
  resus: { type: Boolean, default: false},
  resusParameter: { type: String, default: 'continuous'}
})

const State = mongoose.model('State', stateSchema)

exports.State = State