/** Browse Module
 *
 */
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
// require('../config/db')
const Profile = require('../models/profile')

// Export Model Functions
/**
 * Get All Profiles in a set
 * @param {Number} setNumber - Pagination, Set Limitation in which a set of profiles are sent at a time
 *
 */
function getAll (setNumber) {
  return Profile.find().skip(10 * setNumber).limit(10).populate('images').lean().exec()
}
/** Find Profiles matching specified preferences
 *
 * @param {Number} ageRange - +/- for the user's current age
 * @param {String} sex Desired sex of the user
 * @param {String} sexualOrientation Desired sexual orientation
 * @param {Array<Number>} locationRange Latitude and Longitude to search for within the user's coordinates
 * @param {Number} setNumber - Pagination, Set Limitation in which a set of profiles are sent at a time
 */
function getMatching (ageRange, sex, sexualOrientation, locationRange, setNumber) {
  return Profile.find().populate('images').lean().exec()
}

/**
 * Export Module Functions
 */
module.exports.getAll = getAll
module.exports.getMatching = getMatching
