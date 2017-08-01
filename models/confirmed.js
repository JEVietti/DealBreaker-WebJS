/** Confirmed Model
 *
 */
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
require('../config/db')
const Schema = mongoose.Schema

/**
 *
 */
const ConfirmedSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,

  confirm: [{
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    }
    // createdAt: {type: Date}
  }]
})
const Confirmed = module.exports = mongoose.model('Confirmed', ConfirmedSchema)

/** Get the List of Users/Profiles you have been Confirmed with
 *
 * @param {ObjectId(String) || String} id
 */
function getConfirmList (id) {
  return Confirmed.findById(id).select('confirm').limit(10).sort({createdAt: -1}).populate({path: 'confirm.profile', model: 'Profile'}).exec()
}

/** Create Confirmation
 * Push profile id on to confirm array
 * @param {ObjectId(String) || String} id
 * @param {ObjectId(String) || String} partnerId
 */
function createConfirm (id, partnerId) {
  return Confirmed.findByIdAndUpdate(id, {$addToSet: {confirm: {_id: partnerId, profile: partnerId} } }, {upsert: true, safe: true, new: true, setDefaultsOnInsert: true}).exec()
}

/** Delete From Confirmation List
 * Delete/Pull Profile from confirmed list
 * @param {ObjectId(String) || String} id
 * @param {ObjectId(String) || String} partnerId
 */
function deleteConfirm (id, partnerId) {
  // console.log(user)
  return Confirmed.findByIdAndUpdate(id, {$pull: {confirm: {
    id: partnerId
  } } }, {multi: true}).exec()
}

/** Exporting Functions defined above
 *  Format: module.export.exportName = functionName
*/
module.exports.getConfirmed = getConfirmList
module.exports.createConfirm = createConfirm
module.exports.deleteConfirm = deleteConfirm
