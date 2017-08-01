// Routing Requests for Models: Pending
/**
 *
 */
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const PendingController = require('../controllers/pending')

/** HTTP POST: Pending Creation
 *
 */
router.post('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  PendingController.create(req, res)
})

/** HTTP PUT: Pending Update Pending
 * Moves a pending request to reject
 */
router.put('/reject', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  PendingController.reject(req, res)
})

/** HTTP PUT: Pending Update Pending
 * Moves a pending request to confirm
 */
router.put('/accept', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  PendingController.confirm(req, res)
})

/** HTTP PUT: Pending Update Pending
 * Removes a pending request
 * Only a request you have sent, requestor
 */
router.put('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  PendingController.update(req, res)
})

/** HTTP GET: Get Lists of requests
  * Requests - Users requestor has been requested by
 */
router.get('/requests', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	// Call to Pending Controller
  console.log('Pending ID')
  PendingController.getRequests(req, res)
})

/** HTTP GET: Get Lists of requests
  * Requests - Users requestor has requested
 */
router.get('/requested', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  PendingController.getRequested(req, res)
})

/** HTTP Delete: Delete a request
 * Remove request lists
 */
router.delete('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  console.log('Delete Pending')
  PendingController.delete(req, res)
})

module.exports = router
