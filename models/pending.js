/** Pending Model **/

// Imports & Initialization
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
require('../config/db')

const Schema = mongoose.Schema

const PendingSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,

  // List of profiles/users that the user is requesting.
  requestor: [{
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    }
    // createdAt: {type: Date}
  }],
  // List of profiles/users that the user is being requested by.
  requestee: [{
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    }
    // createdAt: {type: Date}
  }]

})
const Pending = module.exports = mongoose.model('Pending', PendingSchema)

/**
 *
 * @param {*} id
 */
function getRequestorList (id) {
  return Pending.findById(id).select('requestor').limit(10).sort({ createdAt: -1 }).populate({ path: 'requestor.profile', model: 'Profile', populate: { path: 'images', model: 'Images' }}).exec()
}

/**
 *
 * @param {*} id
 */
function getRequesteeList (id) {
  return Pending.findById(id).select('requestee').limit(10).sort({ createdAt: -1 }).populate({ path: 'requestee.profile', model: 'Profile', populate: { path: 'images', model: 'Images' }}).exec()
}

/**
 *
 * @param {*} id
 * @param {*} partnerId
 */
function createRequestor (id, partnerId) {
  return Pending.findByIdAndUpdate(id, {$addToSet: {requestor: {_id: partnerId, profile: partnerId}}}, {upsert: true, safe: true, new: true, setDefaultsOnInsert: true}).exec()
}

/**
 *
 * @param {*} id
 * @param {*} partnerId
 */
function createRequestee (id, partnerId) {
  return Pending.findByIdAndUpdate(id, {$addToSet: {requestee: {_id: partnerId, profile: partnerId}}}, {upsert: true, safe: true, new: true, setDefaultsOnInsert: true}).exec()
}

/**
 *
 * @param {*} id
 * @param {*} partnerId
 */
function deleteRequestor (id, partnerId) {
  // console.log(_id)
  return Pending.findByIdAndUpdate(id, {$pull: { requestor: {
    _id: partnerId
  }}}, {multi: true}).exec()
}

/**
 *
 * @param {*} id
 * @param {*} partnerId
 */
function deleteRequestee (id, partnerId) {
  // console.log(_id)
  return Pending.findByIdAndUpdate(partnerId, {$pull: { requestee: {
    _id: id
  }}}, { multi: true }).exec()
}

/** Exporting Functions defined above
 *  Format: module.export.exportName = functionName
*/
module.exports.getRequestor = getRequestorList
module.exports.getRequestee = getRequesteeList
module.exports.createRequestor = createRequestor
module.exports.createRequestee = createRequestee
module.exports.deleteRequestor = deleteRequestor
module.exports.deleteRequestee = deleteRequestee
