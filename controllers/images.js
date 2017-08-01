/** Images Controller - using AWS SDK
 * 
 */
const Images = require('../models/images')
const ObjectID = require('mongodb').ObjectID
const AWS = require('aws-sdk')
AWS.config.loadFromPath('./config/s3Config.json')
const dbConfig = require('../config/db')// config file

/** AWS Helper Function
 * 
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 * 
 * @return {HTTP Response}
 *
 */
function getSignedUpload (req, res) {
  const s3 = new AWS.S3()
  const fileName = req.query.fileName
  const fileType = req.query.fileType

  // console.log(fileName)
  // console.log(fileType)
  const bucket = dbConfig.S3_Bucket
  const folderName = req.user.username
  const s3Params = {
    Bucket: bucket,
    Key: folderName + '/' + fileName,
    Expires: 3600,
    ContentType: fileType,
    ACL: 'public-read'
  }
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
       console.log(err)
      return res.end()
    }
    // console.log(data)
    const returnData = {
      signedRequest: data,
      url: `https://s3-us-west-1.amazonaws.com/${bucket}/${folderName}/${fileName}`
    }
    return res.json(returnData)
  })
}

/** Creating Images using url
 * 
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 */
function createImages (req, res) {
  const newImage = new Images({
    _id: new ObjectID(req.user._id),
    username: req.user.username,
    gallery: req.body.gallery
  })

  Images.create(newImage._id, newImage)
  .then(() => {
    return res.json({success: true, msg: 'Images Added/Updated'})   
  })
  .catch(err => {
    if (err) {
      return res.json({success: false, msg: 'Failed to Add/Update Images'})
    }
  })
}

/** Getting Images URL from gallery
 * 
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 * 
 * @return {HTTP Response}
 * 
 */
function getImages (req, res) {
  const id = new ObjectID(req.user._id)
  Images.getById(id)
  .then((images) => {
    if (images != null) {
      images._id = undefined
      return res.json({success: true, gallery: images.gallery})
    } else {
      return res.json({success: false, gallery: null})
    }
  })
  .catch(err => {
    if (err) {
      return res.json({success: false, gallery: null})
    }
  })
}

/** Updating Images Data
 *
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 *
 * @return {HTTP Response}
 *
 */
function updateImages (req, res) {
  const newImage = new Images({
    _id: new ObjectID(req.user._id),
    username: req.user.username,
    gallery: req.body.gallery
  })

  Images.update(newImage._id, newImage)
  .then((result) => {
    return res.json({success: true, msg: 'Images Added/Updated'})
  })
  .catch(err => {
    if (err) {
      return res.json({ success: false, msg: 'Failed to Add/Update Images' })
    }
  })
}

/** Delete Images from User's Gallery
 *
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 * 
 * @return {HTTP Response}
 *
 */
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
      return res.json({success: false, msg: 'Image not deleted'})
    } else if (data){
      const file = req.body.url
      Images.delete(id, file).then((result) => {
        return res.json({success: true, data: data, msg: 'Image Deleted'})            
      })
      .catch(err => {
        if (err) {
          console.log(err)
          return res.json({success: false, msg: 'Image not deleted'})
        }
      })
    } else {

    }
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
}

/** Exporting Functions defined above
 *  Format: module.export.exportName = functionName
*/
module.exports.get = getImages
// module.exports.getByUsername = getImagesByUsername
module.exports.getURL = getSignedUpload
module.exports.create = createImages
module.exports.update = updateImages
module.exports.delete = deleteImages
