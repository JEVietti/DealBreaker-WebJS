// Routing Requests for Models: Profile
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const ProfileController = require('../controllers/profile')

/** HTTP POST:
 * Create Profile, body data
 */
router.post('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ProfileController.create(req, res)
})

/** HTTP PUT:
 * Update Profile Data
 */
router.put('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ProfileController.update(req, res)
})

/** HTTP GET:
 * Get Profile by Username
 * :profile = username parameter
 */
router.get('/:profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    // Call to Profile Controller
  // console.log('Profile :profile')
  ProfileController.getByUsername(req, res)
})

/** HTTP GET:
 * Get the requester's profile
 */
router.get('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  // Call to Profile Controller
  // console.log('Profile ID')
  ProfileController.getById(req, res)
})

// Profile - Delete Profile: protected by auth id-key inside jwt, not body but the req.HTTP-AUTH
/** HTTP DELETE:
 * Delete Profile, requester's profile
 */
router.delete('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log('Delete Profile')
  ProfileController.delete(req, res)
})

module.exports = router
