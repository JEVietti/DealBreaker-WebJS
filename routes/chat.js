// Routing Requests for Models: Profile
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const ChatController = require('../controllers/chat')



router.get('/conversation/:profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  console.log('Username')
  ChatController.getConversationByUsername(req, res)
})

/** HTTP GET:
 */
router.get('/conversation', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.getConversation(req, res)
})

/** HTTP GET Request: 
 */
router.get('/sent/:profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.getSentMessages(req, res)
})

/** HTTP GET Request: 
 */
router.get('/sent', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.getAllSentMessages(req, res)
})



router.get('/received', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.getAllReceivedMessages(req, res)
})

router.get('/received/:profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.getReceivedMessages(req, res)
})

/** HTTP GET Request: G
 */
router.get('*', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.getAll(req, res)
})

/** HTTP POST Request: 
 */
router.post('/send', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.createSendMessage(req, res)
})

/** HTTP POST Request: 
 */
router.post('/send/:profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.createSendMessage(req, res)
})

/** HTTP POST Request: 
 */
router.post('*', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.create(req, res)
})


/** HTTP PUT 
 */
router.put('*', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.update(req, res)
})

/** HTTP DELETE Request
 *
 */
router.delete('*', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  ChatController.delete(req, res)
})

module.exports = router
