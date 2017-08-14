/** Images Model and Functions
 * Uses Mongoose as Connect to MongoDB Database with images collection
 * Uses Promises - promise library bluebird
 */
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
require('../config/db')
const Schema = mongoose.Schema

/**
 *
 */
const ImagesSchema = mongoose.Schema({

  _id: Schema.Types.ObjectId,
  username: {type: String, upsert: true},
  gallery: [{
    _id: {type: Number, upsert: true, require: [true, 'id required']},
    url: {
      type: String,
      upsert: true
    }
  }]
})
const Images = module.exports = mongoose.model('Images', ImagesSchema)

/**
 *
 * @param {ObjectId(String) || String} id
 */
function getImagesById (id) {
  return Images.findById(id).lean().exec()
}

/**
 *
 * @param {String} username
 */
function getImagesByUsername (username) {
  const query = {username: username}
  return Images.find(query).lean().exec()
}

/**
 *
 * @param {ObjectId(String) || String} id
 * @param {Object} newImages
 */
function updateImages (id, newImages) {
  return Images.findByIdAndUpdate(id, newImages, {upsert: true, safe: true, new: true, setDefaultsOnInsert: true}).exec()
}

/**
 *
 * @param {ObjectId(String) || String} id
 * @param {Object} newImages Can hold multiple Images or a Single Image made up of a url
 */
function createImages (id, newImages) {
  // newImages.save()
  return Images.findByIdAndUpdate(id, {$pushAll: {gallery: newImages.gallery}}, {upsert: true, new: true, setDefaultsOnInsert: true}).exec()
}

/**
 *
 * @param {ObjectId(String) || String} id
 * @param {String} url
 */
function deleteImage (id, url) {
  // console.log(id)
  // console.log(url)
  return Images.findByIdAndUpdate(id, {$pull: { gallery: {
    url: url
  }}}, { multi: true }).exec()
}

/** Exporting Functions defined above
 *  Format: module.export.exportName = functionName
*/
module.exports.create = createImages
module.exports.getById = getImagesById
module.exports.getByUsername = getImagesByUsername
module.exports.update = updateImages
module.exports.delete = deleteImage
