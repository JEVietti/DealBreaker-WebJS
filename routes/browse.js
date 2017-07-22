// Routing Requests for Browsing Users
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const BrowseController = require('../controllers/browse')

// Browsing - Protected by Authentication
router.get('/all', (req, res, next) => {
  BrowseController.getAll(req, res)
})

router.get('/*', (req, res, next) => {
  BrowseController.getSpecific(req, res)
})

router.get('*', (req, res, next) => {
  BrowseController.getAll(req, res)
})

module.exports = router
