/** User Controller - for User creation, authorization, and management
 * Using bcrypt for password hashing
 * Using crypto for token creation in support requests
 * NodeMan for emailing users on requests
 */
const User = require('../models/user')
const config = require('../config/db')
const jwt = require('jsonwebtoken')
const nodeMail = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

/** Validate and Create the User, by checking against the Collection
 * If a username is taken -> false
 * else if an email is taken -> false
 * otherwise attempt to create User , catch errors
 * return the messages with request
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 */
function validateCreate (req, res) {

  if (Object.keys(req.body).length !== 7) {
    return res.status(400).json({success: false, msg: 'No registration date'})
  }


  var uname = req.body.username
  var email = req.body.email
  var firstName = req.body.fname
  var lastName = req.body.lname
  var birthdate = req.body.birthdate
  var password = req.body.password

  
  uname = uname.toLowerCase()
  if (firstName !== null) {
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
  }
  if (lastName !== null) {
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1)
  }
  // console.log(lastName)

  let newUser = new User({
    fname: firstName,
    lname: lastName,
    email: email,
    birthdate: birthdate,
    username: uname,
    password: password
  })

  // Username already exists
  User.checkUsername(uname)
  .then((result) => {
    if (result != null) {
      return res.status(400).json({success: false, msg: 'Username Already exists!'})
    }
    return User.checkEmail(email).then((result) => {
      // console.log(result)
      if (result != null) {
        return res.status(200).json({success: false, msg: 'Email already tied to an account!'})
      }
      bcrypt.genSalt(10)
      .then((salt) => {
        return bcrypt.hash(newUser.password, salt)
      })
      .then((hashedPassword) => {
        newUser.password = hashedPassword
        return User.addUser(newUser).then((result) => {
          if (result) {
            return res.status(201).json({success: true, msg: 'Registered User'})
          }
        })
      })
    })
  })
  .catch(err => {
    if (err) {
      console.log(err)
      return res.status(400).json({success: false, msg: 'Failed to Register User'})
    }
  })
}

/** Checking if requested username, by character uniqueness, exists or not in the User Collection
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 */
function usernameAuth (req, res) {
  let username = req.params.username
  if (username) {
    username = username.toLowerCase()
  } else {
    return res.status(400).json({success: false, msg: 'Malformed!'})
  }
  User.checkUsername(username)
    .then((result) => {
      console.log(result)
      if (result != null) {
        return res.status(200).json({success: false, msg: 'Username Already exists!'})
      } else {
        res.status(200).json({success: true, msg: 'Username Available!'})
      }
    })
    .catch(err => {
      if (err) {
        console.log(err)
        res.status(401).json({})
      }
    })
}

/** Checking if requested email exists or not in the User Collection
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res 
 */
function emailAuth (req, res) {
  if (req.params.email) {
    var email = req.params.email
    email = email.toLowerCase()
    User.checkEmail(email)
    .then((result) => {
      console.log(result)
      if (result != null) {
        return res.status(200).json({success: false, msg: 'Email Already exists!'})
      }
      return res.status(200).json({success: true, msg: 'Email Available'})
    }).catch(err => {
      if (err) {
        console.log(err)
        res.status(401).json({})
      }
    })
  }
}

/** Get Account - for getting the Account for Authentication Token
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 */
function getAccount (req, res) {
  const username = req.query.user
 // If User is not specified
  if (username === undefined) {
    return res.json({user: req.user, success: true})
  }
  // User is Specified
  User.getUserByUsername(username)
  .then((result) => {
    return res.status(200).json({success: true, user: result})
  })
  .catch(err => {
    if (err) {
      console.log(err)
      return res.status(400).json({success: false})
    }
  })
}

/** Logging in User from Form
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 */
function authUser (req, res) {
  let username = req.body.username
  const password = req.body.password

  if (username === undefined || password === undefined) {
    return res.json({success: false, msg: 'Missing Credentials!'})
  }

  username = username.toLowerCase()

  User.getUserByUsername(username)
  .then((user) => {
    if (!user) {
      return res.json({success: false, msg: 'User not Found!'})
    }
    bcrypt.compare(password, user.password)
    .then((isMatch) => {
      // console.log(isMatch)
      if (!isMatch) {
        return res.json({success: false, msg: 'Incorrect Password!'})
      }
      const token = jwt.sign(user, config.secret, {
        expiresIn: 604800 // 1 week
      })
      return res.status(202).json({
        success: true,
        msg: 'Successfully Logged in!',
        token: 'JWT ' + token,
        user: {
          fname: user.fname,
          lname: user.lname,
          username: user.username,
          email: user.email,
          birthdate: user.birthdate
        }
      })
    })
    .catch((err) => {
      if (err) {
        console.log(err)
        return res.json({'success': false, 'msg': 'Unknown Error try again.'})
      }
    })
  })
  .catch(err => {
    if (err) {
      console.log(err)
      return res.json({'success': false, 'msg': 'Unknown Error try again.'})
    }
  })
}

/** Delete a user from a collection
 * by ID from the login token
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 *
 */
function deleteUser (req, res) {
  const uid = req.user._id
  // console.log('User ID ' + uid)
  User.deleteUser(uid)
  .then(() => {
    return res.json({
      status: true,
      msg: 'Account Deleted!'
    })
  })
  .catch(err => {
    if (err) {
      return res.json({
        status: false,
        msg: 'Failed to Delete Account!'
      })
    }
  })
}

/** Update/Override a User
 * Used in reset Password and forgot password to save and remove tokens and dependencies
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 *
 */
function updateUser (req, res) {
  let email = req.body.email
  let password = req.body.password
  if (password !== undefined && email !== undefined) {
    let update = {
      _id: req.user._id,
      password: password,
      email: email
    }
    bcrypt.genSalt(10)
    .then((salt) => {
      return bcrypt.hash(password, salt)
    })
    .then((hashedPassword) => {
      update.password = hashedPassword
      return User.updatePassword(update._id, update.password)
    })
    .then((result) => {
      return User.updateEmail(update._id, update.email)
    })
    .then((result) => {
      return res.json({success: true, msg: 'Password and Email Update Successful'})
    })
    .catch(err => {
      if (err) {
        console.log(err)
        return res.json({success: false, msg: 'Failed to update password'})
      }
    })
  } else if (password !== undefined) {
    let update = {
      _id: req.user._id,
      password: password
    }
    bcrypt.genSalt(10)
    .then((salt) => {
      return bcrypt.hash(password, salt)
    })
    .then((hashedPassword) => {
      update.password = hashedPassword
      User.updatePassword(update)
        .then((result) => {
          return res.json({success: true, msg: 'Password Update Successful'})
        })
    })
    .catch(err => {
      if (err) {
        console.log(err)
        return res.json({success: false, msg: 'Failed to update password'})
      }
    })
  } else if (email !== undefined) {
    let update = {
      _id: req.user._id,
      email: email
    }
    console.log('Update email')
    User.updateEmail(update)
    .then((result) => {
      return res.json({success: true, msg: 'Email Update Successful'})
    })
    .catch(err => {
      if (err) {
        return res.json({success: false, msg: 'Failed to update email'})
      }
    })
  } else {
    return res.status(400).json({success: false, msg: 'Malformed Request'})
  }
}

/** Set resetPasswordTokens, Expiry Time, and temporary password
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 *
 */
function forgotPassword (req, res) {
  let token
  crypto.randomBytes(20, function (err, buf) {
    token = buf.toString('hex')
  })

  if (req.body.email) {
    const email = req.body.email
    console.log(email)
            // Account exists save token pass for email
    User.getUserByEmail(email)
        .then((user) => {
          user.resetPasswordToken = token
          user.resetPasswordExpires = Date.now() + 1800000 // 30 minutes
          bcrypt.genSalt(10)
            .then((salt) => {
              return bcrypt.hash(user.password, salt)
            })
            .then((hashedPassword) => {
              user.password = hashedPassword
              return User.updateUser(user)
            })
            .then((result) => {
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
              })
            })
        })

        .catch(err => {
          console.log(err)
          if (err) {
            return res.json({success: false, msg: 'Something went wrong, try again!'})
          }
        })
  } else {
    return res.json({success: false, msg: 'Something went wrong, try again!'})
  }
}

/** Change the password to new password after authenticating against token within a time period
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 *
 */
function resetPassword (req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
      .then((user) => {
        if (!user) {
          return res.json({success: false, msg: 'Request token invalid or expired, try again.'})
        }
        user.password = req.body.password
        bcrypt.genSalt(10)
          .then((salt) => {
            return bcrypt.hash(user.password, salt)
          })
        .then((hashedPassword) => {
          user.password = hashedPassword
          user.resetPasswordToken = undefined
          user.resetPasswordExpires = undefined
          return User.updateUser(user)
        })
        .then((user) => {
          console.log(user)
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
          })
        })
      })
      .catch(err => {
        if (err) {
          return res.json({success: false, msg: 'Something went wrong, try again.'})
        }
      })
}

/** Fetch and send username to email address based on email entered
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 *
 */
function forgotUsername (req, res) {
  const email = req.body.email

  User.findOne({email: email})
    .then((user) => {
      if (!user) {
        return res.json({success: false, msg: 'Email not tied to an account, try again.'})
      }
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
      transport.sendMail(mailOptions)
      .then(() => {
        return res.json({success: true, msg: user.fname + ', your username has been sent to your email.'})
      })
    })
      .catch(err => {
        if (err) {
          return res.json({success: false, msg: 'Something went wrong, try again.'})
        }
      })
}

/** Exporting Functions defined above
 *  Format: module.export.exportName = functionName
*/
exports.create = validateCreate
exports.get = getAccount
exports.authEmail = emailAuth
exports.authUser = usernameAuth
exports.auth = authUser
exports.delete = deleteUser
exports.update = updateUser
exports.forgotPassword = forgotPassword
exports.resetPassword = resetPassword
exports.forgotUsername = forgotUsername
