// const express = require('express')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/db')

// Validate and Create the User, by checking against the DB
// If a username is taken -> false
// else if an email is taken -> false
// otherwise attempt to create User , catch errors
// return the messages with request
var create = function validateCreate (req, res) {
  let uname = req.body.username
  const email = req.body.email
  uname = uname.toLowerCase()

  let newUser = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: email,
    username: uname,
    password: req.body.password
  })

  // Username already exists
  User.checkUsername(uname.toLowerCase(), (err, result) => {
    if (err) throw err
    if (result != null) {
      return res.json({success: false, msg: 'Username Already exists!'})
    } else { // Check for email
      User.checkEmail(email, (err, result) => {
        if (err) throw err
                 // console.log(res);
        if (result != null) {
          return res.json({success: false, msg: 'Email already tied to an account!'})
        } else { // Try to add the user
          User.addUser(newUser, (err, user) => {
            if (err) {
              return res.json({success: false, msg: 'Failed to Register User'})
            } else {
              return res.json({success: true, msg: 'Registered User'})
            }
          })
        }
      })
    }
  })
}

// Get Account - for getting the Account for Authentication Token
var get = function getAccount (req, res) {
  const username = req.query.user
 // If User is not specified
  if (username === undefined) {
    return res.json({user: req.user, success: true})
  }
  // User is Specified
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err
    if (!user) {
      res.json({
        'success': false,
        'msg': 'User Not Found!',
        user: {}
      })
      return res.json
    } else {
      // console.log(user);
      return res.json({user: user, success: true})
    }
  })
}

// Logging in User from Form
var auth = function authUser (req, res) {
  let username = req.body.username
  const password = req.body.password
  username = username.toLowerCase()

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err

    if (!user) {
      return res.json({'success': false, 'msg': 'User not Found - Auth!'})
    }

    if (username == undefined || password == undefined) {
      return res.json({'success': false, 'msg': 'Missing Credentials!'})
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err
      if (!isMatch) {
        return res.json({'success': false, 'msg': 'Incorrect Password!'})
      }
      const token = jwt.sign(user, config.secret, {
        expiresIn: 604800 // 1 week
      })
      res.json({
        'success': true,
        'msg': 'Successfully Logged in!',
        token: 'JWT ' + token,
        user: {
          id: user._id,
          fname: user.fname,
          lname: user.lname,
          username: user.username,
          email: user.email
        }

      })
      return res.json
    })
  })
}

// This function should eventually go across all collections removing it within relationships romaing list etc.
var remove = function deleteUser (req, res) {
  const uid = req.user._id
  console.log('User ID ' + uid)
  User.deleteUser(uid, (err) => {
    if (err) {
      res.json({
        status: false,
        msg: 'Failed to Delete Account!'
      })
    } else {
      res.json({
        status: true,
        msg: 'Account Deleted!'
      })
    }
  })
}

// Export the functions
exports.create = create
exports.get = get
exports.auth = auth
exports.delete = remove
