const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('../config/db')
var ObjectID = require('mongodb').ObjectID

const UserSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true
  },

  lname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    upsert: true
  },

  username: {
    type: String,
    required: true,
    upsert: true
  },

  birthdate: {
    type: String
  },

  password: {
    type: String,
    required: true,
    upsert: true
  },

  resetPasswordToken: {
    type: String
  },

  resetPasswordExpires: {
    type: Date
  }
})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback)
}

module.exports.getUserByUsername = function (username, callback) {
  const query = {username: username}
  User.findOne(query, callback)
}

module.exports.getUserByEmail = function (email, callback) {
  const query = {email: email}
  User.findOne(query, callback)
}

module.exports.addUser = function (newUser, callback) {
    // hashpassword usng bcrypt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err
    bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
      if (err) throw err
      newUser.password = hashedPassword
      newUser.save(callback)
    })
  })
}

module.exports.comparePassword = function (password, hash, callback) {
  bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) throw err
    callback(null, isMatch)
  })
}

module.exports.checkUsername = function (uname, callback) {
  const query = {username: uname}
  User.findOne(query, callback)
}

module.exports.checkEmail = function (email, callback) {
  const query = {email: email}
  User.findOne(query, callback)
}

module.exports.updateUser = function (user, callback) {
   // hashpassword usng bcrypt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err
    bcrypt.hash(user.password, salt, (err, hashedPassword) => {
      if (err) throw err
      user.password = hashedPassword
      user.save(callback)
    })
  })
}

module.exports.updatePassword = function (update, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err
    bcrypt.hash(update.password, salt, (err, hashedPassword) => {
      if (err) throw err
      update.password = hashedPassword
      User.findByIdAndUpdate(update._id, {password: update.password}, callback)
    })
  })
}

module.exports.updateEmail = function (update, callback) {
  User.findByIdAndUpdate(update._id, {email: update.email}, callback)
  console.log('Update Email')
}

module.exports.deleteUser = function (userID, callback) {
  userID = new ObjectID(userID)
  const userObj = {
    _id: userID
  }
  console.log(userID)
  User.remove(userObj, callback)
}
