const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
require('../config/db')

const Schema = mongoose.Schema
/** Collection Schema Definition
 * _id: users id, referenceing the User collection
 * rejector: array of users referencing their profile that the user has rejected
 * rejector: array of users referencing their profile that have rejected user */
const RejectedSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,

  rejector: [{
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    }
    // createdAt: {type: Date}
  }],
  rejectee: [{
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    }
    // createdAt: {type: Date}
  }]

})

// Define and Export Model
const Rejected = module.exports = mongoose.model('Rejected', RejectedSchema)

/** Get List of user you have rejected
 * 
 * @param {ObjectId(String) || String} id - id of user
 * 
 * @return {Array<Profiles>} rejector array
 */
function getRejectorList (id) {
  return Rejected.findById(id).select('rejector').limit(10).populate({path: 'rejector.profile', model: 'Profile'}).exec()
}

/** Get list of users that have rejected you
 * 
 * @param {ObjectId(String) || String} id - id of user
 * 
 * @return {Array<Profiles>} rejectee array
 */
function getRejecteeList (id) {
  return Rejected.findById(id).select('rejectee').limit(10).populate({path: 'rejectee.profile', model: 'Profile'}).exec()
}

/** Add entry of user you have rejected
 * Create if Document does not exist otherwise update
 * @param {ObjectId(String) || String} id - id of user
 * @param {ObjectId(String) || String} partnerId - id of selected user
 * 
 * @return {ObjectId(String)} - id referencing profile
 * 
 */
function createRejector (id, partnerId) {
  return Rejected.findByIdAndUpdate(id, {$addToSet: {rejector: {id: partnerId, profile: partnerId}}}, {upsert: true, safe: true, new: true, setDefaultsOnInsert: true}).exec()
}

/** Add entry of user to selected user has rejected
 * Create if Document doesn't exist otherwise update
 * @param {ObjectId(String) || String} id - id of user
 * @param {ObjectId(String) || String} partnerId - id of selected user
 * 
 * @return {ObjectId(String)} - id referencing profile
 * 
 */
function createRejectee (id, partnerId) {
  return Rejected.findByIdAndUpdate(id, {$addToSet: {rejectee: {id: partnerId, profile: partnerId}}}, {upsert: true, safe: true, new: true, setDefaultsOnInsert: true}).exec()
}

/** Delete a User you have previously rejected
 *
 * @param {ObjectId(String) || String} id - id of user
 * @param {ObjectId(String) || String} partnerId - id of selected user
 * 
 * @return {Array<ObjectId>} arrays of ids that are in the rejector list
 * 
 */
function deleteRejector (id, partnerId) {
  return Rejected.findByIdAndUpdate(id, {$pull: { rejector: {
    id: partnerId
  }}}, {multi: true}).exec()
}

/** Delete a a reject entry from user you have previously rejected
 *
 * @param {ObjectId(String) || String} id - id of user
 * @param {ObjectId(String) || String} partnerId - id of selected user
 * 
 * @return {Array<ObjectId>} arrays of ids that are in the rejectee list
 * 
 */
function deleteRejectee (id, partnerId) {
  return Rejected.findByIdAndUpdate(id, {$pull: { rejectee: {
    id: partnerId
  }}}, { multi: true }).exec()
}

/**
 * 
 */
module.exports.getRejector = getRejectorList
module.exports.getRejectee = getRejecteeList
module.exports.createRejector = createRejector
module.exports.createRejectee = createRejectee
module.exports.deleteRejector = deleteRejector
module.exports.deleteRejectee = deleteRejectee
