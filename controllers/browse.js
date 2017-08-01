/** Browse Controller
 * using Browse Model which is a specific aggregate of Profile Model
 * retrieve profiles based on queries, with limiting, and aggregation
 * processing to remove profiles that are connected to a user, such as
 * pending, confirmed, rejected, and themselves all should be removed.
 */
const Browse = require('../models/browse')

/** Get All Profiles up to 10 at a time
 * Limiting found in model function, no filtering
 * Getting more profiles will be done through pagination
 * with a parameter being a multiplier
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 *
 */
function getProfiles (req, res) {
  const setNumber = 0 || req.params.set
  Browse.getAll(setNumber)
  .then((result) => {
    if (result != null) {
      return res.json({success: true, profiles: result})
    } else {
      return res.json({success: false, profiles: null})
    }
  })
  .catch(err => {
    if (err) {
      return res.json({success: false, profiles: null})
    }
  })
}

/**
 * Get the Profiles that by their profile attributes we would suspect they would desire
 * Get Specific results by filtering results by user selection
 * Limiting found in model function,
 * Getting more profiles will be done through pagination
 * with a parameter being a multiplier
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 * 
 */
function getProfilesByQuery (req, res) {
  console.log(req.params)
  // console.log(req.query)
  if (Object.keys(req.query).length === 0) {
    return res.status(200).json({success: false, msg: 'Malformed Request!'})
  }
  const query = {
    baseLocation: (req.query.baseLocation),
    locationRange: Number(req.query.location),
    orientation: req.query.orientation,
    sex: req.query.sex,
    ageRange: Number(req.query.age)
  }

  for (const val of Object.values(query)) {
    if (val === undefined || val === null) {
      return res.status(200).json({success: false, msg: 'Malformed Request!'})
    }
  }

  if (query.baseLocation !== undefined) {
    query.baseLocation = query.baseLocation.split(',').map(Number)
  }

  console.log(query)
  Browse.getMatching(query)
    .then((result) => {
      if (result) {
        return res.status(200).json({success: true, profiles: result})
      } else {
        return res.json({success: false, profiles: null})
      }
    })
    .catch(err => {
      if (err) {
        return res.status(200).json({success: false, msg: 'Unknown Error!'})
      }
    })
}

/** Exporting Functions defined above
 *  Format: module.export.exportName = functionName
*/
module.exports.getAll = getProfiles
module.exports.getSpecific = getProfilesByQuery
