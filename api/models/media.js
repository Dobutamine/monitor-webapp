const mongoose = require('mongoose')

const mediaSchema = mongoose.Schema( {
  description: { type: String, default: '' },
  filename: { type: String, default: '' },
  mediaType: { type: String, default: 'jpg'},
  uploader: { type: String, default: 'stock'}
})

const Media = mongoose.model('Media', mediaSchema)

exports.Media = Media