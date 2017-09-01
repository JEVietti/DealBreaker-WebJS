/**
 *
 */

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const passport = require('passport')
const mongoose = require('mongoose')
const socketIO= require('socket.io')

/*
  const fs = require('fs');
  const expressValidator = require('express-validator');
*/
const dbConfig = require('./config/db')// config file
const testDBConfig = require('./test/config-debug.spec.js')// test db config file

// Database - Mongoose Setup
if (process.env.NODE_ENV !== 'test') {
  console.log('Not testing')
  mongoose.set('debug', true);

  mongoose.connect(dbConfig.database, {useMongoClient: true})

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
  mongoose.set('debug', true);  

  mongoose.connect(testDBConfig.database, {useMongoClient: true}) // config file
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
const rejected = require('./routes/rejected')
const pending = require('./routes/pending')
const confirmed = require('./routes/confirmed')
const images = require('./routes/images')
const browse = require('./routes/browse')
const chat = require('./routes/chat')



// CORS MiddleWare
app.use(cors())

// Set Static Angular Folder Framework
app.use(express.static(path.join(__dirname, 'public')))

// BodyParser Middleware
app.use(bodyParser.json())

// Passport MiddleWare - passport-jwt
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

// Requests to domain/users => users file
app.use('/api/users', users)
app.use('/api/profile', profiles)
app.use('/api/reject', rejected)
app.use('/api/pending', pending)
app.use('/api/confirm', confirmed)
// app.use('/', profiles);
app.use('/api/images', images)
app.use('/api/browse', browse)
app.use('/api/chat', chat)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

const server = require('http').createServer(app)
const io = socketIO.listen(server)

// server on port:
server.listen(port, () => {
  console.log('Server started on port ' + port)
})

const jwt = require('jsonwebtoken');

io.on('connection', (socket) => {
  socket.on('join',(data)=> {
   // console.log(data)
    jwt.verify(data.token, dbConfig.secret, (err, result) => {

    if(result) {
      socket.join(result._doc.username)
      console.log(result._doc.username + ' has joined')
    }
    })
  })
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('save-message', (data)=>{
    console.log('message')
    io.sockets.to(data.to).emit('new-message', {message: data.message})
  })
  socket.on('leave', (data) => {
    socket.leave(data.username)
    console.log('Left ' + data.username)
  })
});



module.exports = app
