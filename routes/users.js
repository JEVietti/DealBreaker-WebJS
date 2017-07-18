const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../config/db')
const UserController = require('../controllers/user')

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  return next()
})

// Authenticate using a identifier in order to route post requests not intended for creation but for logging in
// as the login requests should not be get requests as it is more unsecure than post or put requests
router.post('/auth', (req, res, next) => {
  UserController.auth(req, res)
})

router.post('/forgot/password', (req, res, next) => {
  UserController.forgotPassword(req, res)
})

router.post('/forgot/username', (req, res, next) => {
  UserController.forgotUsername(req, res)
})

router.post('/reset/:token', (req, res, next) => {
  console.log('Reset')
  UserController.resetPassword(req, res)
})

// Register - this works due to auth coming first if this is moved above
// reroute to ex. /register or /create
router.post('*', (req, res, next) => {
  UserController.create(req, res)
})

// Update Account Information
router.put('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log('Put')
  UserController.update(req, res)
})

router.get('/auth/email/:email', (req, res, next) => {
  console.log('Check Email')
  UserController.authEmail(req, res)
})

router.get('/auth/email/*', (req, res, next) => {
  console.log('Check Email')
  UserController.authEmail(req, res)
})

router.get('/auth/username/:username', (req, res, next) => {
  console.log('Check Username')
  UserController.authUser(req, res)
})

router.get('/auth/username/*', (req, res, next) => {
  console.log('Check Username')
  UserController.authUser(req, res)
})


// User - Protected by Auhentication
router.get('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  UserController.get(req, res)
})

// Deleting Accounts, user accounts, this should delete from all tables, objects throughout the database
// Done through a different controller to remove overhead of always getting all models for all types of users requests
router.delete('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  UserController.delete(req, res)
})

module.exports = router
