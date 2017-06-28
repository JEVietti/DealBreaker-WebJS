const mongoose = require('mongoose')
// require('../config/db')

const Schema = mongoose.Schema

const BrowseSchema = mongoose.Schema({
  location: {
    type: String,

    sex: {
      type: String,

      sexualOrientation: {
        type: String,

        profiles: [{
          type: Schema.Types.ObjectId,
          ref: 'Profile'
        }]
      }
    }
  }

})

const Browse = module.exports = mongoose.model('Browse', BrowseSchema)

// Export Model Functions
