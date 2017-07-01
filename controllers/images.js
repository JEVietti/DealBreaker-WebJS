const Images = require('../models/images')
const ObjectID = require('mongodb').ObjectID

function createImages (req, res) {
  const newImage = new Images({
    _id: new ObjectID(req.user._id),
    username: req.user.username,
    gallery: req.body.gallery
  })
  
  Images.create(newImage, (err) => {
    if (err) {
      throw err
      res.json({success: false, msg: 'Failed to Add/Update Images'})
    } else {
      res.json({success: true, msg: 'Images Added/Updated'})
    }
  })
}

function getImages (req, res) {
  const id = new ObjectID(req.user._id)
  Images.getById(id, (err, images) => {
    if (err) {
      res.json({success: false, gallery: null})
    } else {
      images._id = undefined
      res.json({success: true, gallery: images})
    }
  })
}

function updateImages (req, res) {
  const newImage = new Images({
    _id: new ObjectID(req.user._id),
    username: req.user.username,
    gallery: req.body.gallery
  })

  Images.update(newImage, (err) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to Add/Update Images' })
    } else {
      res.json({success: true, msg: 'Images Added/Updated'})
    }
  })
}

module.exports.get = getImages
module.exports.create = createImages
module.exports.update = updateImages
