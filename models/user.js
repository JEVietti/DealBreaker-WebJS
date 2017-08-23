/** User Model
 * User Schema for Authentication and ID which allows easy population across collections
 */
let mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const bcrypt = require('bcryptjs')
require('../config/db')
var ObjectID = require('mongodb').ObjectID

/**
 * User Schema hold the email, name, birthdate, and password always
 * Contingently holds the reset password token and time window
 */
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

UserSchema.index({ "usename": {unique: true} })


// Export the model  and its functions for controllers
const User = module.exports = mongoose.model('User', UserSchema)


/** Get User Information by ObjectID
 * Used in passport authentication for JWT tokens
 * @param {ObjectID(String) || String} id
 */
function getUserById (id) {
  return User.findById(id).exec()
}

function getIdByUsername(username) {
  return User.findOne({username: username}, {_id: 1}).exec()
}

/**
 * Used in basic authentication with user entered username
 * @param {String} username
 */
function getUserByUsername (username) {
  const query = {username: username}
  return User.findOne(query).exec()
}

/**
 * Get user from email for sending support emails and forgotten email and password
 * @param {String} email
 */
function getUserByEmail (email) {
  const query = {email: email}
  return User.findOne(query).exec()
}

/**
 * Registering a user to the collection
 * @param {User.Model Object} newUser
 */
function addUser (newUser) {
  return newUser.save()
}

/**
 * Callback bcrypt function fo authentication - moved to controller for promises
 * @param {String} password
 * @param {String} hash
 * @param {Callback (err, result)} callback
 */
function comparePassword (password, hash, callback) {
  bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) throw err
    callback(null, isMatch)
  })
}

/**
 * Check if username already exists in the collection
 * @param {* username to use in query} userName
 */
function checkUsername (userName) {
  const query = {username: userName}
  return User.findOne(query).exec()
}

/**
 * Check if the email already exists in the collection
 * @param {String} email
 */
function checkEmail (email) {
  const query = {email: email}
  return User.findOne(query).exec()
}

/**
 * Update a user useful for overriding the user
 * @param {*user Object Matches Model Above} user
 */
function updateUser (user) {
  return user.save()
}

/**
 *
 * @param {ObjectID(String) || String} id
 * @param {String = HashedString} password
 */
function updatePassword (id, password) {
  return User.findByIdAndUpdate(id, {password: password}).exec()
}

/**
 * Update the email of a user
 * @param {ObjectID(String) || String} id
 * @param {String} email
 * Returns Promise
 */
function updateEmail (id, email) {
  return User.findByIdAndUpdate(id, {email: email}).exec()
}

/**
 * Delete a user by ID
 * @param {ObjectID(String) || String} userID - id of user
 */
function deleteUser (userID) {
  userID = new ObjectID(userID)
  return User.findByIdAndRemove(userID).exec()
}

/** Exporting Functions defined above
 * Format: module.export.exportName = functionName
*/
module.exports.getUserById = getUserById
module.exports.getUserByUsername = getUserByUsername
module.exports.getIdByUsername = getIdByUsername
module.exports.checkUsername = checkUsername
module.exports.checkEmail = checkEmail
module.exports.deleteUser = deleteUser
module.exports.updateEmail = updateEmail
module.exports.updatePassword = updatePassword
module.exports.updateUser = updateUser
module.exports.comparePassword = comparePassword
module.exports.addUser = addUser
module.exports.getUserByEmail = getUserByEmail
