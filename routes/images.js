// Routing Requests for Models: Profile
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const ImageController = require('../controllers/images')

/** HTTP GET: S3 endpoint get Signed URL
 * For Image upload to s3 bucket
 * Upload happens in user browser this returns a pre-signed url for upload
 */
router.get('/s3', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.getURL(req, res)
})

/** HTTP GET Request: Getting Images of the User
 * User specified by url parameter - username
 */
router.get('/:profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.getByUsername(req, res)
})

/** HTTP GET Request: Getting Images of the Same User
 * User specified by the passport, get user from JWT Auth token
 */
router.get('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.get(req, res)
})

/** HTTP POST Request: Initial Image Creation
 * Image Creation - s3 URL inserted
 */
router.post('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.create(req, res)
})

/** HTTP PUT Update Image of User
 * User specified by id using JWT Token
 * URL or Order Number of an entry
 */
router.put('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.update(req, res)
})

/** HTTP DELETE Request
 *
 */
router.delete('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.delete(req, res)
})

module.exports = router
