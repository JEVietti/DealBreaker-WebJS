// Routing Requests for Browsing Users
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const BrowseController = require('../controllers/browse')

// Browsing - Protected by Authentication
router.get('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    BrowseController.getAll(req, res)
})

module.exports = router
