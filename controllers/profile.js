// const config = require('../config/db')
const Profile = require('../models/profile')
const ObjectID = require('mongodb').ObjectID

function getProfileById (req, res) {
  // console.log('Reached Profile GET!')
  var username = req.query.profile
  const url = req.url

  if (username === undefined) {
    username = url.replace('/', '')
  }
 // If User is not specified - empty url or / url
  if (username === undefined || username === '') {
    var response = {'success': false}
    const uid = req.user._id
    console.log('By ID')
    Profile.getProfileById(uid, (err, profile) => {
      // console.log(profile)

      if (err) {
        console.log('Reached Error!')
        response = {
          success: false,
          profile: profile,
          msg: 'Unknown Error'
        }
      } else if (profile != null) {
        // Remove the id values of mongodb before sending response
        profile._id = undefined
        if (profile.images != null) { // if images exist for the user
          profile.images._id = undefined
        }
        console.log('Profile!')
        response = {
          success: true,
          profile: profile
        }
      } else {
        console.log('Reached Unfound!')
        response = {
          success: false,
          profile: { }
        }
      }
      return res.json(response)
    })
  }
}

function getProfileByUsername (req, res) {
  // console.log(req)
  // console.log('Reached Profile GET!')
  var username = req.params.profile
  username = username.toLowerCase()
  // console.log('By Username')
        // User is Specified
  Profile.getProfileByUsername(username, (err, profile) => {
    if (err) throw err
    // console.log(profile)
    if (profile == null) {
      res.json({
        'success': false,
        'msg': 'User Not Found!',
        profile: {}
      })
      return res.json
    } else {
        // Remove the id values of mongodb before sending response
      profile._id = undefined
      if (profile.images != null) { // if images exist for the user
        profile.images._id = undefined
      }
      return res.json({success: true, profile: profile})
    }
  })
}

function createProfile (req, res) {
  const uid = new ObjectID(req.user._id)

  let newProfile = new Profile({
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
    goodQualities: req.body.goodQualities,
    badQualities: req.body.badQualities,
    images: uid
  })

  Profile.create(newProfile, (err) => {
    if (err) {
      res.json({success: false, msg: 'Failed to Create Profile'})
    } else {
      res.json({success: true, msg: 'Created Profile'})
    }
  })
}

function updateProfile (req, res) {
  const uid = new ObjectID(req.user._id)

  let newProfile = new Profile({
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
    goodQualities: req.body.goodQualities,
    badQualities: req.body.badQualities
  })

  Profile.update(newProfile, (err) => {
    if (err) {
      res.json({success: false, msg: 'Failed to Update Profile'})
    } else {
      res.json({success: true, msg: 'Updated Profile'})
    }
  })
}

function deleteProfile (req, res) {
  const id = new ObjectID(req.user._id)
  Profile.delete(id, (err) => {
    if (err) {
      res.json({success: false, msg: 'Failed to Delete Profile'})
    } else {
      res.json({success: true, msg: 'Profile Deleted!'})
    }
  })
}

// Declaring the Functions available when including the Module
// module.exports.get = getProfile
module.exports.getById = getProfileById
module.exports.getByUsername = getProfileByUsername
module.exports.create = createProfile
module.exports.update = updateProfile
module.exports.delete = deleteProfile
