// Routing Requests for Models: Rejected
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const RejectedController = require('../controllers/rejected')

/** HTTP POST:
 * Create a rejected entry of a user
 */
router.post('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  RejectedController.create(req, res)
})

/** HTTP PUT:
 * Remove a rejected user
 */
router.put('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  RejectedController.update(req, res)
})

/** HTTP GET:
 * Get the Rejection List for a user
 */
router.get('/rejected', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  // Call to Rejected Controller
  // console.log('Rejected ID')
  RejectedController.getRejectedById(req, res)
})

/** HTTP GET:
 * Get the Rejection List for a user
 */
router.get('/rejecting', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  // Call to Rejected Controller
  // console.log('Rejected ID')
  RejectedController.getRejectorById(req, res)
})

/** HTTP GET:
 * Rejection List from specified username
 */
router.get('/:user', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  // Call to Rejected Controller
  // console.log('Rejected :Rejected')
  RejectedController.getByUsername(req, res)
})

/** HTTP DELETE:
 *protected by auth id-key inside jwt, not body but the req.HTTP-AUTH
 */
router.delete('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log('Delete Rejected')
  RejectedController.delete(req, res)
})

module.exports = router
