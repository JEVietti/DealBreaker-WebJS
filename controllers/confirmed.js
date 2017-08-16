/**
 * 
 */
// const config = require('../config/db')
const Confirmed = require('../models/confirmed')
const Rejected = require('../models/rejected')
const Profile = require('../models/profile')
const ObjectID = require('mongodb').ObjectID

/**  Get the list of confirmed users for a user, by id from JWT token in Auth header of request
 *
 * @param {HTTP Request} req
 * @param {HTTP Response} res
 *
 * @return {HTTP Response}
 *
 */
function getConfirmedById (req, res) {
  const id = req.user._id
  if (id === undefined || id === null) {
    return res.status(400).json({status: false, msg: 'Malformed Request'})
  }
  Confirmed.getConfirmed(id)
  .then((result) => {
     return  res.status(200).json({success: true, profiles: result})
  })
  .catch((err) => {
    if (err) {
      console.log(err)
    }
  })
}

/**
 * 
 * @param {HTTP Request} req 
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 *  
 */
function createConfirmed (req, res) {
  const id = req.body._id
  if (id === undefined || id === null) {
    return res.status(400).json({status: false, msg: 'Malformed Request'})
  }
  const confirmer = {
    _id: new ObjectID(req.user._id),
    partnerId: id,
    status: true
  }

  const confirmee = {
    _id: new ObjectID(id),
    partnerId: req.user._id
  }

  Confirmed.createConfirm(confirmer._id, confirmer.partnerId)
  .then((result) => {
    if (result) {
      return Confirmed.createConfirm(confirmee._id, confirmee.partnerId)
    }
  })
  .then((result) => {
    if (result) {
      return res.status(201).json({status: true, msg: 'confirmer'})
    }
  })
  .catch((err, result) => {
    if (err) {
      console.log(err)
      Confirmed.remove(result.confirmer)
      Confirmed.remove(result.confirmee)
      return res.status(200).json({status: false, msg: 'Unable to Reject', res: result})
    }
  })
}

/**
 * 
 * @param {HTTP Request} req 
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 *  
 */
function updateConfirmed (req, res) {
  const id = req.body._id
  if (id === undefined) {
    return res.status(400).json({status: false, msg: 'Malformed Request'})
  }
  const confirmer = {
    _id: new ObjectID(req.user._id),
    partnerId: new ObjectID(id),
    status: true
  }
  const confirmee = {
    _id: new ObjectID(id),
    partnerId: new ObjectID(req.user._id)
  }

  Confirmed.deleteConfirm(confirmer._id, confirmer.partnerId)
  .then((result) => {
    return Confirmed.deleteConfirm(confirmee._id, confirmee.partnerId)
  })
  .then((result) => {
    if (result) {
      return res.status(200).json({status: true, msg: 'Removed confirmer'})
    } 
    return res.status(200).json({
      status: false,
      msg: "Unable to Remove Relationship, does not exist",
      res: result
    })
  })
  .catch((err) => {
    if (err) {
      // Confirmed.remove(result.confirmer)
      // Confirmed.remove(result.confirmee)
      console.log(err)
      return res.status(200).json({status: false, msg: 'Unable to Remove confirmer'})
    }
  })
}

/**
 * 
 * @param {HTTP Request} req 
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 *  
 */
function rejectConfirmed (req, res) {
  const id = req.body._id
  if (id === undefined) {
    return res.status(400).json({status: false, msg: 'Malformed Request'})
  }
  const confirmer = {
    _id: new ObjectID(req.user._id),
    partnerId: new ObjectID(id),
    status: true
  }

  const confirmee = {
    _id: new ObjectID(id),
    partnerId: new ObjectID(req.user._id)
  }

  Rejected.createRejector(confirmer._id, confirmer.partnerId)
  .then((result) => {
    return Rejected.createRejectee(confirmee._id, confirmee.partnerId)
  })
  .then((result) => {
    return Confirmed.deleteConfirm(confirmer._id, confirmer.partnerId)
  })
  .then((result) => {
    return Confirmed.deleteConfirm(confirmee._id, confirmee.partnerId)
  })
  .then((result) => {
    if (result) {
    return res
      .status(200)
      .json({ status: true, msg: "Relationship Removed, Rejected User." })
    }
      return res
        .status(200)
        .json({
          status: false,
          msg: "Unable to Remove reject relationship",
          res: result
        })
  })
  .catch((err) => {
    if (err) {
      console.log(err)
      return res.status(200).json({status: false, msg: 'Unable to Remove confirmed relationship'})
    }
  })
}

/**
 * 
 * @param {HTTP Request} req 
 * @param {HTTP Response} res
 * 
 * @return {HTTP Response}
 *  
 */
function deleteConfirmed (req, res) {

}

/** Exporting Functions defined above
 *  Format: module.export.exportName = functionName
*/
module.exports.getConfirmed = getConfirmedById
module.exports.create = createConfirmed
module.exports.update = updateConfirmed
module.exports.reject = rejectConfirmed
module.exports.delete = deleteConfirmed
