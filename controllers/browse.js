const Browse = require('../models/browse')

// Get All Profiles
function getProfiles (req, res) {
  Browse.getAll((err, profiles) => {
    if (err) {
      return res.json({success: false, profiles: null})
    } else if (profiles != null) {
      return res.json({success: true, profiles: profiles})
    }
    return res.json({success: false, profiles: null})
  })
}

// Get the Profiles that by their profile attributes we would suspect they would desire
// Get Specific results by filtering results by user selection
function getProfilesByQuery (req, res) {
  console.log(req.params)
  // console.log(req.query)
  if (Object.keys(req.query).length > 0) {
    const query = {
      baseLocation: (req.query.baseLocation),
      locationRange: Number(req.query.location),
      orientation: req.query.orientation,
      sex: req.query.sex,
      ageRange: Number(req.query.age)
    }

    for (const val of Object.values(query)) {
      if (val == undefined || val == null) {
        return res.status(200).json({success: false, msg: 'Malformed Request!'})
      }
    }

    if (query.baseLocation !== undefined) {
      query.baseLocation = query.baseLocation.split(',').map(Number)
    }

    console.log(query)
    Browse.getMatching(query, (err, result) => {
      if (err) {
        return res.status(200).json({success: false, msg: 'Unknown Error!'})
      } else if (result) {
        return res.status(200).json({success: true, profiles: result})
      }

      return res.json({success: false, profiles: null})
    })
  }
}

module.exports.getAll = getProfiles
module.exports.getSpecific = getProfilesByQuery
