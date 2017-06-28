// const config = require('../config/db')
const Profile = require('../models/profile')
// var ObjectID = require('mongodb').ObjectID

var get = function getProfile (req, res) {
  console.log('Reached Profile GET!')
  var username = req.query.profile
  const url = req.url

  if (username == undefined) {
    username = url.replace('/', '')
  }
  if (username === 'profile/' || username === 'profile') {
    username = undefined
  }
  console.log('Username: ' + username)
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
          'success': false,
          profile: profile,
          msg: 'Unknown Error'
        }
      } else if (profile) {
        var newProfile = {
          fname: profile.fname,
          lname: profile.lname,
          sex: profile.sex,
          bio: profile.bio,
          sexualOrientation: profile.sexualOrientation,
          birthdate: profile.birthdate,
          dealbreakers: profile.dealbreakers,
          badQualities: profile.badQ,
          goodQualities: profile.goodQ,
          location: profile.location,
          images: profile.images.gallery
        }
        console.log('Profile!')
        response = {
          'success': true,
          profile: newProfile
        }
      } else {
        console.log('Reached Unfound!')
        response = {
          'success': false,
          profile: { }
        }
      }
      return res.json(response)
    })
  } else {
    username = username.toLowerCase()
    console.log('By Username')
        // User is Specified
    Profile.getProfileByUsername(username, (err, profile) => {
      if (err) throw err

      if (!profile) {
        res.json({
          'success': false,
          'msg': 'User Not Found!',
          profile: {}
        })
        return res.json
      } else {
        var newProfile = {
          fname: profile.fname,
          lname: profile.lname,
          sex: profile.sex,
          bio: profile.bio,
          sexualOrientation: profile.sexualOrientation,
          birthdate: profile.birthdate,
          dealbreakers: profile.dealbreakers,
          badQualities: profile.badQ,
          goodQualities: profile.goodQ,
          location: profile.location,
          images: profile.images.gallery
        }

        return res.json({profile: newProfile, success: true})
      }
    })
  }
}
// Declaring the Functions available when including the Module or File
module.exports.get = get
