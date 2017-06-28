const mongoose = require('mongoose')
require('../config/db')

const Schema = mongoose.Schema

const ImagesSchema = mongoose.Schema({

  _id: Schema.Types.ObjectId,
  username: String,
  gallery: [
    {
      _id: Number,
      url: {
        type: String,
        upsert: true
      }
    }
  ]

})

const Images = module.exports = mongoose.model('Images', ImagesSchema)

// Functions
module.exports.getImagesById = function (id, callback) {
  Images.findById(id, callback)
}
