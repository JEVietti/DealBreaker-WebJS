/** Browse Module
 *
 */
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
// require('../config/db')
const Profile = require('./profile')
const Confirmed = require('./confirmed')
const Pending = require('./pending')
const Rejected = require('./rejected')

// Export Model Functions
/**
 * Get All Profiles in a set
 * @param {Number} setNumber - Pagination, Set Limitation in which a set of profiles are sent at a time
 *
 */
function getAll (diffArr, setNumber) {
  // console.log(diffArr)
  const pCount = 9;
  const parameters = {
    _id: {$nin: diffArr}
  }
  return Profile.find(parameters).skip(setNumber * pCount).limit(pCount).populate({ path: 'images', model: 'Images' }).lean().exec()
}
/** Find Profiles matching specified preferences
 *
 * @param {Array<Number>} ageRange Max and Min Age- +/- for the user's current age
 * @param {String} sex Desired sex of the user
 * @param {String} sexualOrientation Desired sexual orientation
 * @param {Array<Number>} locationRange Latitude and Longitude to search for within the user's coordinates
 * @param {Number} setNumber - Pagination, Set Limitation in which a set of profiles are sent at a time
 */
function getMatching (diffArr, ageRange, sex, sexualOrientation, baseLocation, locationRange, setNumber) {
  const pCount = 9;  
  let maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - ageRange[1])
  console.log(maxDate)
  let minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - ageRange[0])
  console.log(minDate)  
  console.log(diffArr)
  const parameters = {
    _id: { $nin: diffArr },
    sex: {$in: sex},
    birthdate: {$lte: minDate, $gte: maxDate},
    sexualOrientation: {$in: sexualOrientation},
    "location.coordinates": {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: baseLocation
        },
        $maxDistance: locationRange
      }
    }

      
    
  }
  return Profile.find(parameters).skip(setNumber * pCount).limit(pCount).populate({ path: 'images', model: 'Images' }).lean().exec()
}

/** Find Profiles matching specified preferences
 *
 * @param {Array<Number>} ageRange Max and Min Age- +/- for the user's current age
 * @param {String} sex Desired sex of the user
 * @param {String} sexualOrientation Desired sexual orientation
 * @param {Array<Number>} locationRange Latitude and Longitude to search for within the user's coordinates
 * @param {Number} setNumber - Pagination, Set Limitation in which a set of profiles are sent at a time
 */
function getMatchingWithName(diffArr, fname, lname, ageRange, sex, sexualOrientation, baseLocation, locationRange, setNumber) {
  const pCount = 9;
  let maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - ageRange[1])
  console.log(maxDate)
  let minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - ageRange[0])
  console.log(minDate)
  console.log(diffArr)
  const parameters = {
    _id: { $nin: diffArr },
    fname: {in: fname},
    lname: {$in: lname},
    sex: { $eq: sex },
    birthdate: { $lte: minDate, $gte: maxDate },
    sexualOrientation: { $eq: sexualOrientation },
    "location.coordinates": {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: baseLocation
        },
        $maxDistance: locationRange
      }
    }
  }
  return Profile.find(parameters).skip(setNumber * pCount).limit(pCount).populate({ path: 'images', model: 'Images' }).lean().exec()
}

/**
 * Export Module Functions
 */
module.exports.getAll = getAll
module.exports.getMatching = getMatching
module.exports.getMatchingWithName = getMatchingWithName
