// Routing Requests for Models: Profile
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('jsonwebtoken')
require('../config/db')
const Images = require('../models/profile')
var ObjectID = require('mongodb').ObjectID
const ImageController = require('../controllers/images')

// Initial Image Creation
router.post('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const uid = new ObjectID(req.user._id)

  let newImage = new Images({
    _id: uid,
    url: req.image.url
  })

  Images.create(newImage, (err, user) => {
    if (err) {
      res.json({success: false, msg: 'Failed to Add Image'})
    } else {
      res.json({success: true, msg: 'Image Added'})
    }
  })
})

router.put('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const uid = new ObjectID(req.user._id)  
  Images.update(newImage)

})

module.exports = router
