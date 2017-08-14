// Routing Requests for Models: Confirmed

const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const ConfirmedController = require('../controllers/confirmed')

/** HTTP POST: Create a Confirmed Relationship
 * Protected by Authentication
 * For user requesting with other user in request
 */
router.post('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ConfirmedController.create(req, res)
})

/** HTTP PUT: Reject a Confirmed Relationship:
 * Protected by Authentication
 *
 */
router.put('*/reject', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ConfirmedController.reject(req, res)
})

/** HTTP PUT:
 * Confirmed Update Confirmed:
 * Protected by Authentication
 *
 */
router.put('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ConfirmedController.update(req, res)
})

/** HTTP GET: 
 * Get Confirmed List of a User specified by username
 * Protected by Authentication
 *
 */
router.get('/:confirmed', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    // Call to Confirmed Controller
  // console.log('Confirmed :Confirmed')
  ConfirmedController.getByUsername(req, res)
})

/** HTTP GET: 
 * Confirmed of User Requesting
 *  Protected by Authentication
 *
 */
router.get('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  // Call to Confirmed Controller
  // console.log('Confirmed ID')
  ConfirmedController.getConfirmed(req, res)
})

/** HTTP DELETE" 
 * Confirmed - Delete Confirmed:
 * protected by auth id-key inside jwt, not body but the req.HTTP-AUTH
 *
 */
router.delete('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log('Delete Confirmed')
  ConfirmedController.delete(req, res)
})

module.exports = router
