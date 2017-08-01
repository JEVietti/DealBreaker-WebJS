// const config = require('../config/db')
const Profile = require('../models/profile')
const ObjectID = require('mongodb').ObjectID

/**
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 * 
 */
function getProfileById (req, res) {
  // console.log('Reached Profile GET!')
  var username = req.query.profile
  const url = req.url

  if (username === undefined) {
    username = url.replace('/', '')
  }
 // If User is not specified - empty url or / url
  if (username === undefined || username === '') {
    const uid = req.user._id
    // console.log('By ID')
    Profile.getProfileById(uid)
    .then((profile) => {
      if (profile) {
        // Remove the id values of mongodb before sending response
        profile._id = undefined
        if (profile.images !== null) { // if images exist for the user
          profile.images._id = undefined
        }
        // console.log('Profile!')
        return res.status(200).json({
          success: true,
          profile: profile})
      }
        // console.log('Reached Unfound!')
      return res.status(404).json({
        success: false,
        profile: {}
      })
    })
    .catch((err) => {
      if (err) {
        console.log('Reached Error!')
        return res.status(400).json({
          success: false,
          profile: {},
          msg: 'Unknown Error'
        })
      }
    })
  } else {
    return res.status(400).json({
      success: false,
      profile: {},
      msg: 'Unknown Error'
    })
  }
}

/**
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 * 
 */
function getProfileByUsername (req, res) {
  // console.log(req)
  // console.log('Reached Profile GET!')
  var username = req.params.profile
  username = username.toLowerCase()
  // console.log('By Username')
        // User is Specified
  Profile.getProfileByUsername(username)
  .then((profile) => {
    if (profile === null) {
      return res.status(404).json({
        'success': false,
        'msg': 'User Not Found!',
        profile: {}
      })
    }
      // Remove the id values of mongodb before sending response
    profile._id = undefined
    if (profile.images !== null) { // if images exist for the user
      profile.images._id = undefined
    }
    return res.status(200).json({success: true, profile: profile})
  })
  .catch((err) => {
    if (err) {
      console.log(err)
      return res.json({success: false, profile: null, msg: 'Unknown Error'})
    }
  })
}

/**
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 * 
 */
function createProfile (req, res) {
  const uid = new ObjectID(req.user._id)

  const newProfile = new Profile({
    _id: uid,
    username: req.user.username,
    fname: req.body.fname,
    lname: req.body.lname,
    birthdate: req.body.birthdate,
    biography: req.body.biography,
    sex: req.body.sex,
    sexualOrientation: req.body.sexualOrientation,
    location: req.body.location,
    dealbreakers: req.body.dealbreakers,
    seeking: req.body.seeking,
    interests: req.body.interests,
    images: uid
  })

  if (Object.keys(req.body).length !== 10) {
    return res.status(400).json({success: false, msg: 'Request Malformed'})
  }

  Profile.create(newProfile)
  .then((result) => {
    if (result) {
      return res.status(201).json({success: true, msg: 'Created Profile'})
    }
  })
  .catch((err) => {
    if (err) {
      console.log(err)
      return res.status(400).json({success: false, msg: 'Failed to Create Profile'})
    }
  })
}

/**
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 * 
 */
function updateProfile (req, res) {
  const uid = new ObjectID(req.user._id)
  console.log('Update Profile')
  const newProfile = new Profile({
    _id: uid,
    username: req.body.username,
    fname: req.body.fname,
    lname: req.body.lname,
    birthdate: req.body.birthdate,
    biography: req.body.biography,
    sex: req.body.sex,
    sexualOrientation: req.body.sexualOrientation,
    location: req.body.location,
    dealbreakers: req.body.dealbreakers,
    seeking: req.body.seeking,
    interests: req.body.interests,
    images: uid
  })

  Profile.update(newProfile._id, newProfile)
  .then((result) => {
    if (result) {
      return res.status(200).json({ success: true, msg: "Updated Profile" })
    }
  })
  .catch((err) => {
    if (err) {
      return res.status(400).json({success: false, msg: 'Failed to Update Profile'})
    }
  })
}

/**
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 * 
 */
function deleteProfile (req, res) {
  const id = new ObjectID(req.user._id)
  Profile.delete(id)
  .then(() => res.status(200).json({success: true, msg: 'Profile Deleted!'}))
  .catch((err) => {
    if (err) {
      return res.status(400).json({success: false, msg: 'Failed to Delete Profile'})
    }
  })
}

/**
 *
 */
// module.exports.get = getProfile
module.exports.getById = getProfileById
module.exports.getByUsername = getProfileByUsername
module.exports.create = createProfile
module.exports.update = updateProfile
module.exports.delete = deleteProfile
