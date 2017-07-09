const mongoose = require('mongoose')
require('../config/db')

const Schema = mongoose.Schema

const ImagesSchema = mongoose.Schema({

  _id: Schema.Types.ObjectId,
  username: {type: String, upsert: true},
  gallery: [
    {
      _id: {type: Number, upsert: true, require: [true, 'id required']},
      url: {
        type: String,
        upsert: true
      }
    }
  ]

})

const Images = module.exports = mongoose.model('Images', ImagesSchema)

// Functions get Images by User/Profile Id
function getImagesById (id, callback) {
  Images.findById(id, callback).lean()
}

// Get Images Aray by Username
function getImagesByUsername (username, callback) {
  const query = {username: username}
  Images.find(query).lean().exec(callback)
}

// Update the Images docuemnt for the user
function updateImages (newImages, callback){
  Images.findByIdAndUpdate(newImages._id, newImages, {upsert: true}).exec(callback)
}

// Create Images if the Document does not exists
function createImages (newImages, callback) {
  // newImages.save(callback)
  Images.findByIdAndUpdate(newImages._id, {$pushAll:{gallery: newImages.gallery}}, {upsert: true}).exec(callback)
  
}

function deleteImage (id, image, callback) {
  //console.log(id)
  const query = { _id: id}
  console.log(image.url)
  Images.findByIdAndUpdate(id, {$pull: { gallery: {
			url : image.url
		}}}, { multi: true }).exec(callback)
}

module.exports.create = createImages
module.exports.getById = getImagesById
module.exports.getByUsername = getImagesByUsername
module.exports.update = updateImages
module.exports.delete = deleteImage
