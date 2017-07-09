const Images = require('../models/images')
const ObjectID = require('mongodb').ObjectID
const AWS = require('aws-sdk')
AWS.config.loadFromPath('./config/s3Config.json')
const dbConfig = require('../config/db')// config file

function createImages (req, res) {
  const newImage = new Images({
    _id: new ObjectID(req.user._id),
    username: req.user.username,
    gallery: req.body.gallery
  })

  Images.create(newImage, (err) => {
    if (err) {
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
      res.json({success: true, gallery: images.gallery})
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

function deleteImages (req, res) {
  const s3 = new AWS.S3()
  const fileName = req.body.fileName

  const bucket = dbConfig.S3_Bucket
  const folderName = req.user.username
  const id = req.user._id
  const s3Params = {
    Bucket: bucket,
    Delete: {Objects: [{Key: folderName + '/' + fileName}]}
  }
  s3.deleteObjects(s3Params, (err, data) => {
    if (err) {
      console.log(err)
      return res.json(err)
    }
    const file = req.body.url
    Images.delete(id, {url: file}, (err, data) => {
      console.log('Remove DB entry')
      if (err) {
        console.log(err)
        return res.json({success: false, msg: 'Image not deleted'})
      }

      return res.json({success: true, data: data, msg: 'Image Deleted'})
    })
    /*
    var params = {
      Bucket: bucket,
      Prefix: folderName,
      MaxKeys: 5
    }
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.log(err)
        res.end(err)
      }

      res.Contents.forEach(function(element) {
        if(element.Key == folderName + '/' + fileName){
          return res.json
        }
      }, this);

    }) */
  })
}

module.exports.get = getImages
module.exports.create = createImages
module.exports.update = updateImages
module.exports.delete = deleteImages
