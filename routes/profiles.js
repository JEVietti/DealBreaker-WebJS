// Routing Requests for Models: Profile
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const ProfileController = require('../controllers/profile')

// Profile Creation:
router.post('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ProfileController.create(req, res)
})

// Profile Update Profile:
router.put('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ProfileController.update(req, res)
})

// Profile -  Protected by Auhentication
router.get('/:profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    // Call to Profile Controller
  console.log('Profile :profile')
  ProfileController.getByUsername(req, res)
})

// Profile - Protected by Auhentication
router.get('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  // Call to Profile Controller
  console.log('Profile ID')
  ProfileController.getById(req, res)
})

// Profile - Delete Profile: protected by auth id-key inside jwt, not body but the req.HTTP-AUTH
router.delete('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log('Delete Profile')
  ProfileController.delete(req, res)
})

module.exports = router
