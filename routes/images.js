// Routing Requests for Models: Profile
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const ImageController = require('../controllers/images')

// HTTP GET Request: Getting Images of the Same User, Read
router.get('/:profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.getByUsername(req, res)
})

// HTTP GET Request: Getting Images of the Same User, Read
router.get('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.get(req, res)
})

// HTTP POST Request: Initial Image Creation
router.post('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.create(req, res)
})

router.put('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.update(req, res)
})

router.delete('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  ImageController.delete(req, res)
})

module.exports = router
