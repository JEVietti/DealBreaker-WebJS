/**
 *
 */
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../config/db')
const UserController = require('../controllers/user')

/** HTTP POST: Authentication
 *  Login User - username || email, password
 */
router.post('/auth', (req, res, next) => {
  UserController.auth(req, res)
})

/** HTTP POST:
 *
 */
router.post('/forgot/password', (req, res, next) => {
  UserController.forgotPassword(req, res)
})

/** HTTP POST:
 *
 */
router.post('/forgot/username', (req, res, next) => {
  UserController.forgotUsername(req, res)
})


// Register - this works due to auth coming first if this is moved above
// reroute to ex. /register or /create
/**
 *
 */
router.post('*', (req, res, next) => {
  UserController.create(req, res)
})

/** HTTP POST:
 *
 */
router.post('/reset/:token', (req, res, next) => {
  console.log('Reset')
  UserController.resetPassword(req, res)
})

/** HTTP PUT:
 *
 */
router.put('/password', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log('Put')
  UserController.update(req, res)
})

/** HTTP PUT:
 *
 */
router.put('/email', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log('Put')
  UserController.update(req, res)
})

/** HTTP PUT:
 *
 */
router.put('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log('Put')
  UserController.update(req, res)
})

/** HTTP GET:
 *
 */
router.get('/auth/email/:email', (req, res, next) => {
  console.log('Check Email')
  UserController.authEmail(req, res)
})

/** HTTP GET:
 *
 */
router.get('/auth/email/*', (req, res, next) => {
  console.log('Check Email')
  UserController.authEmail(req, res)
})

/** HTTP GET:
 *
 */
router.get('/auth/username/:username', (req, res, next) => {
  console.log('Check Username')
  UserController.authUser(req, res)
})

/** HTTP GET:
 *
 */
router.get('/auth/username/*', (req, res, next) => {
  console.log('Check Username')
  UserController.authUser(req, res)
})

/** HTTP GET:
 *
 */
router.get('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  UserController.get(req, res)
})

/** HTTP Delete:
 *  Deleting Accounts, user accounts, this should delete from all tables, objects throughout the database
 * Done through a different controller to remove overhead of always getting all models for all types of users requests
 */
router.delete('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  UserController.delete(req, res)
})

module.exports = router
