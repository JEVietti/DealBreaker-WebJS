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

// Database - Mongoose Setup
mongoose.connect(dbConfig.database) // config file
// Testing Connection
mongoose.connection.on('connected', () => {
  console.log('DB connection successful ' + dbConfig.database)
})
// Error checking on DB
mongoose.connection.on('error', (err) => {
  console.log('DB Error: ' + err)
})

const app = express()
const port = process.env.PORT || 3000
const users = require('./routes/users')
const profiles = require('./routes/profiles')
const images = require('./routes/images')
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
app.use('/users', users)
app.use('/profile', profiles)
// app.use('/', profiles);
app.use('/images', images)

app.get('/sign-s3', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const s3 = new AWS.S3()

  const fileName = req.query.fileName
  const fileType = req.query.fileType

  console.log(fileName)
  console.log(fileType)  

  const folderName = req.user.username
  const s3Params = {
    Bucket: 'dealbreakerjs',
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
    console.log(data)
    const returnData = {
      signedRequest: data,
      url: `https://s3-us-west-1.amazonaws.com/dealbreakerjs/${folderName}/${fileName}`
    }
    res.json(returnData)
    res.end()
  })
})

// routing server paths
app.get('*', (req, res) => {
  res.send('Invalid Endpoint')
})

// server on port:
app.listen(port, () => {
  console.log('Server started on port ' + port)
})
