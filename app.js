// Server Entry Point File: Front Controller

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const passport = require('passport')
const mongoose = require('mongoose')
/*
    const fs = require('fs');
    const expressValidator = require('express-validator');
*/
const dbConfig = require('./config/db')// config file
const testDBConfig = require('./test/config-debug')// test db config file

// Database - Mongoose Setup
if (process.env.NODE_ENV !== 'test') {
  console.log('Not testing')
  mongoose.connect(dbConfig.database) // config file
  // Testing Connection
  mongoose.connection.on('connected', () => {
    console.log('DB connection successful ' + dbConfig.database)
  })
  // Error checking on DB
  mongoose.connection.on('error', (err) => {
    console.log('DB Error: ' + err)
  })
} else if (process.env.NODE_ENV === 'test') {
  console.log('Testing')  

  mongoose.connect(testDBConfig.database) // config file
  // Testing Connection
  mongoose.connection.on('connected', () => {
    console.log('DB connection successful ' + testDBConfig.database)
  })
  // Error checking on DB
  mongoose.connection.on('error', (err) => {
    console.log('DB Error: ' + err)
  })
}

const app = express()
const port = 8000
const users = require('./routes/users')
const profiles = require('./routes/profiles')
const images = require('./routes/images')
const browse = require('./routes/browse')
const AWS = require('aws-sdk')
AWS.config.loadFromPath('./config/s3Config.json')

// CORS MiddleWare
app.use(cors())

// Set Static Angular Folder Framework
app.use(express.static(path.join(__dirname, 'public')))

// BodyParser Middleware
app.use(bodyParser.json())

// Passport MiddleWare - passportjwt
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

// Requests to domain/users => users file
app.use('/api/users', users)
app.use('/api/profile', profiles)
// app.use('/', profiles);
app.use('/api/images', images)
app.use('/api/browse', browse)

app.get('/api/sign-s3', passport.authenticate('jwt', {session: false}), (req, res, next) => {
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
})

app.delete('/api/sign-s3', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const s3 = new AWS.S3()
  const fileName = req.body.fileName

  const bucket = dbConfig.S3_Bucket
  const folderName = req.user.username
  const s3Params = {
    Bucket: bucket,
    Delete: {Objects: [{Key: folderName + '/' + fileName}]}
  }
  s3.deleteObjects(s3Params, (err, data) => {
    if (err) {
      console.log(err)
      return res.json(err)
    }
    return res.json({success: true, msg: 'Image Deleted'})
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
         
    })*/
   
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

// server on port:
app.listen(port, () => {
   console.log('Server started on port ' + port)
})

module.exports = app
