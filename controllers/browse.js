/** Browse Controller
 * using Browse Model which is a specific aggregate of Profile Model
 * retrieve profiles based on queries, with limiting, and aggregation
 * processing to remove profiles that are connected to a user, such as
 * pending, confirmed, rejected, and themselves all should be removed.
 */
const Browse = require('../models/browse')
const Rejected = require('../models/rejected')
const Pending = require('../models/pending')

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
  console.log('All')
  console.log(req.query)
  const id = req.user._id
  const setNumber = (req.query.page - 1) || (req.params.page - 1) || 0  
  let diffArr = []
  diffArr.push(id)

  Rejected.getRejectorIDList(id)
  .then(rejecting => {
    // console.log(rejecting)
    if(rejecting) {
      rejecting.rejector.forEach(function (element) {
        diffArr.push(element._id)
      }, this);
    }
    // console.log(diffArr)
    return Rejected.getRejecteeIDList(id)
  })  
  .then(rejected => {
    if(rejected) {
      rejected.rejectee.forEach(function (element) {
        diffArr.push(element._id)
      }, this);
    }
    return Pending.getRequestorIDList(id)
  })
  .then(requesting => {
    if(requesting) {
      requesting.requestor.forEach(function (element) {
        diffArr.push(element._id)
      }, this);
    }
    return Pending.getRequesteeIDList(id)
  })
  .then(requested => {
    if(requested) {
      requested.requestee.forEach(function (element) {
        diffArr.push(element._id)
      }, this);
    }     
    Browse.getAll(diffArr, setNumber)
      .then((result) => {
        if (result != null) {
          return res.json({ success: true, profiles: result })
        } else {
          return res.json({ success: false, profiles: null })
        }
      })
  })
  .catch(err => {
    if (err) {
      console.log(err)
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
  console.log('Matching')
  const id = req.user._id
  const setNumber = (req.query.page - 1) || (req.params.page - 1) || 0
  console.log(req.query)
  console.log(req.url)
  console.log(req.params)
  if (Object.keys(req.query).length === 0) {
    return res.status(200).json({success: false, msg: 'Malformed Request!'})
  }
  const query = {
    latitude: (req.query.lat),
    longitude: (req.query.long),
    locationRange: Number(req.query.location),
    orientation: req.query.orientation,
    sex: req.query.sex,
    ageRange: [
      Number(req.query.minAge),      
      Number(req.query.maxAge)
    ]
  }

  if (query.latitude !== undefined && query.longitude !== undefined) {
    query.baseLocation = [Number(query.longitude), Number(query.latitude)]
    console.log(query.baseLocation)
  }

  let diffArr = []
  diffArr.push(id)

  Rejected.getRejectorIDList(id)
    .then(rejecting => {
      if(rejecting) {
        console.log(rejecting)
        rejecting.rejector.forEach(function (element) {
          diffArr.push(element._id)
        }, this);
      }
      // console.log(diffArr)
      return Rejected.getRejecteeIDList(id)
    })
    .then(rejected => {
      if(rejected) {
        rejected.rejectee.forEach(function (element) {
          diffArr.push(element._id)
        }, this);
      }
      return Pending.getRequestorIDList(id)
    })
    .then(requesting => {
      if (requesting) {
        requesting.requestor.forEach(function (element) {
          diffArr.push(element._id)
        }, this);
      } 
      return Pending.getRequesteeIDList(id)
    })
    .then(requested => {
      if(requested) {
        requested.requestee.forEach(function (element) {
          diffArr.push(element._id)
        }, this);
      }
      Browse.getMatching(diffArr, query.ageRange, query.sex, query.orientation, query.baseLocation, query.locationRange, setNumber)
        .then((result) => {
          if (result) {
            console.log(result)
            return res.status(200).json({ success: true, profiles: result })
          }
          return res.status(200).json({ success: false, profiles: null })
        })
    })
    .catch(err => {
      if (err) {
        console.log(err)
        return res.json({ success: false, profiles: null })
      }
    })
}

/** Exporting Functions defined above
 *  Format: module.export.exportName = functionName
*/
module.exports.getAll = getProfiles
module.exports.getSpecific = getProfilesByQuery
