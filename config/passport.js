// Strategy for Passport
// Passsport jwt -web tokens, fetched from auth header

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')
const config = require('../config/db')

module.exports = function (passport) {
  let opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader()
  opts.secretOrKey = config.secret
  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
        // console.log(jwtPayload);
    User.getUserById(jwtPayload._doc._id)
    .then((user) => {
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)        
      }
    })
    .catch((err) => {
      if (err) {
        return done(err, false)
      }
    })
  }))
}
