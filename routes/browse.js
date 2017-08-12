// Routing Requests for Browsing Users
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const BrowseController = require('../controllers/browse')

/** HTTP GET:
 * Browsing - Protected by Authentication
 * Get All Profiles with no preferences
 */
router.get('/all', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  BrowseController.getAll(req, res)
})

/** HTTP GET:
 * Get Profiles by Preferences
 * Preferences defined in the request parameters
 */
router.get('/*', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  BrowseController.getSpecific(req, res)
})

/** HTTP GET:
 * By Default get all of the profiles
 */
router.get('*', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  BrowseController.getAll(req, res)
})

module.exports = router
