// const express = require('express')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/db')
const nodeMail = require('nodemailer')
const crypto = require('crypto')
const async = require('async')

// Validate and Create the User, by checking against the DB
// If a username is taken -> false
// else if an email is taken -> false
// otherwise attempt to create User , catch errors
// return the messages with request
var create = function validateCreate (req, res) {
  // console.log(req.body)
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
      return res.json({'success': false, 'msg': 'User not Found!'})
    }

    if (username === undefined || password === undefined) {
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
  // console.log('User ID ' + uid)
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

function updateUser (req, res) {
  let email = req.body.email
  let password = req.body.password
  if (password !== undefined && email !== undefined) {
    let update = {
      _id: req.user._id,
      password: password,
      email: email
    }
    User.updatePassword(update, (err) => {
      if (err) {
        res.json({success: false, msg: 'Failed to update password'})
      }
      User.updateEmail(update, (err) => {
        if (err) {
          return res.json({success: false, msg: 'Failed to update email'})
        } else {
          return res.json({success: true, msg: 'Password and Email Update Successful'})
        }
      })
    })
  } else if (password !== undefined) {
    let update = {
      _id: req.user._id,
      password: password
    }
    User.updatePassword(update, (err) => {
      if (err) {
        return res.json({success: false, msg: 'Failed to update password'})
      } else {
        return res.json({success: true, msg: 'Password Update Successful'})
      }
    })
  } else if (email !== undefined) {
    let update = {
      _id: req.user._id,
      email: email
    }
    console.log('Update email')
    User.updateEmail(update, (err) => {
      if (err) {
        return res.json({success: false, msg: 'Failed to update email'})
      } else {
        return res.json({success: true, msg: 'Email Update Successful'})
      }
    })
  }
}

function forgotPassword (req, res) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex')
        done(err, token)
      })
    },
    function (token, done) {
      if (req.body.email) {
        const email = req.body.email

            // Account exists save token pass for email
        User.getUserByEmail(email, (err, user) => {
          if (err) {
            return res.json({success: false, msg: 'Something went wrong, try again!'})
          } else if (!user) {
            return res.json({success: false, msg: 'Email not tied to an account!'})
          }
          user.resetPasswordToken = token
          user.resetPasswordExpires = Date.now() + 1800000 // 30 minutes
          User.updateUser(user, (err) => {
            if (err) {
              return res.json({success: false, msg: 'Something went wrong, try again!'})
            }
            done(err, token, user)
          })
        })
      } else {
        return res.json({success: false, msg: 'Resubmit request!'})
      }
    },
    function (token, user, done) {
      var transport = nodeMail.createTransport({
        service: 'gmail',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
          type: 'login',
          user: config.email,
          pass: config.emailPassword
        }
      })
      const mailOptions = {
        from: 'support@dbdating.com',
        to: user.email,
        subject: 'Dealbreaker Dating Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      transport.sendMail(mailOptions, function (err) {
        res.json({success: true, msg: 'An email has been sent to ' + user.email + ' with further instructions.'})
        done(err, 'done')
      })
    }
  ], function (err) {
    if (err) {
      throw err
      // return res.json({success: false, msg: 'Resubmit request!'})
    }
  })
}

function resetPassword (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (err) {
          return res.json({success: false, msg: 'Something went wrong, try again.'})
        } else if (!user) {
          return res.json({success: false, msg: 'Request token invalid or expired, try again.'})
        }
        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined

        User.updateUser(user, (err) => {
          if (err) {
            return res.json({success: false, msg: 'Failed to update, try again.'})
          }
          done(err, user)
        })
      })
    },
    function (user, done) {
      var transport = nodeMail.createTransport({
        service: 'gmail',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
          type: 'login',
          user: config.email,
          pass: config.emailPassword
        }
      })
      const mailOptions = {
        from: 'support@dbdating.com',
        to: user.email,
        subject: 'Password Reset Confirmation',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account at Dealbreaker Dating ' + user.username + ' has just been changed.\n' +
          'If you did not reset your password please send an email to dealbdating@gmail.com for support. \n'
      }
      transport.sendMail(mailOptions, function (err) {
        res.json({success: true, msg: user.fname + ', you have successfully updated your password'})
        done(err, 'done')
      })
    }
  ], function (err) {
    if (err) { console.log(err) }
  })
}

function forgotUsername (req, res) {
  async.waterfall([
    function (done) {
      const email = req.body.email
      User.findOne({email: email}, (err, user) => {
        if (err) {
          return res.json({success: false, msg: 'Something went wrong, try again.'})
        } else if (!user) {
          return res.json({success: false, msg: 'Email not tied to an account, try again.'})
        }
        done(err, user)
      })
    },
    function (user, done) {
      var transport = nodeMail.createTransport({
        service: 'gmail',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
          type: 'login',
          user: config.email,
          pass: config.emailPassword
        }
      })
      const mailOptions = {
        from: 'support@dbdating.com',
        to: user.email,
        subject: 'Forgot Username',
        text: 'Hello,\n\n' +
          'This is a response to request for username tied to ' + user.email + ' at Dealbreaker Dating.\n' +
          'Username: ' + user.username + '. \n\n\n' +
          'If you did not request this, send an email to dealbdating@gmail.com for support. \n'
      }
      transport.sendMail(mailOptions, function (err) {
        res.json({success: true, msg: user.fname + ', your username has been sent to your email.'})
        done(err, 'done')
      })
    }
  ], function (err) {
    if (err) { console.log(err) }
  })
}

// Export the functions
exports.create = create
exports.get = get
exports.auth = auth
exports.delete = remove
exports.update = updateUser
exports.forgotPassword = forgotPassword
exports.resetPassword = resetPassword
exports.forgotUsername = forgotUsername
