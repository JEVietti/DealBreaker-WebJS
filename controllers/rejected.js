/** Rejected Controller
 *  
 * 
 */
// const config = require('../config/db')
const Rejected = require('../models/rejected')
const Profile = require('../models/profile')
const ObjectID = require('mongodb').ObjectID

/**
 * 
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 * 
 * @return {HTTP Response}
 * 
 */
function getRejectorById (req, res) {
  console.log('rejecting list')
  const id = req.user._id
  if (id === undefined) {
    return res.status(400).json({status: false, msg: 'Malformed Request'})
  }
  Rejected.getRejector(id)
  .then((result) => {
    if (result) {
      return res.status(200).json({success: true, profiles: result})
    }
    return res.status(200).json({ status: false, msg: 'Not rejecting', profiles: [] })          
  })
  .catch((err) => {
    if (err) {
      console.log(err)
      return res.status(400).json({ status: false, msg: 'Malformed Request' })            
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
function getRejectedById (req, res) {
  const id = req.user._id
  if (id === undefined) {
    return res.status(400).json({status: false, msg: 'Malformed Request'})
  }
  Rejected.getRejectee(id)
  .then((result) => {
    if (result) {
      return res.status(200).json({success: true, profiles: result})
    }
    return res.status(400).json({ status: false, msg: 'Malformed Request' })          
  })
  .catch((err) => {
    if (err) {
      console.log(err)
      return res.status(400).json({ status: false, msg: 'Malformed Request' })      
    }
  })
}

/**
 * 
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 * 
 * @return {HTTP Response}
 */
function getRejectedByUsername (req, res) {

}

/**
 * 
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 * 
 * @return {HTTP Response}
 * 
 * 
 */
function createRejected (req, res) {
  const id = req.body._id
  if (id === undefined) {
    return res.status(400).json({status: false, msg: 'Malformed Request'})
  }
  const reject = {
    _id: new ObjectID(req.user._id),
    partnerId: id,
    status: true
  }

  const rejectee = {
    _id: new ObjectID(id),
    partnerId: req.user._id
  }

  Rejected.createRejector(reject._id, reject.partnerId)
    .then((result) => {
      if (result) {
        return Rejected.createRejectee(rejectee._id, rejectee.partnerId)
      }
    })
    .then((result) => {
      if (result) {
        return res.status(201).json({status: true, msg: 'Rejected'})
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err)
        // Rejected.remove(result.rejector)
        // Rejected.remove(result.rejectee)
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
function updateRejected (req, res) {
  const id = req.body._id
  if (id === undefined) {
    return res.status(400).json({status: false, msg: 'Malformed Request'})
  }
  const reject = {
    _id: new ObjectID(req.user._id),
    partnerId: new ObjectID(id),
    status: true
  }

  const rejectee = {
    _id: new ObjectID(id),
    partnerId: new ObjectID(req.user._id)
  }

  Rejected.deleteRejector(reject._id, reject.partnerId)
  .then((result) => {
    if (result) {
      return Rejected.deleteRejectee(rejectee._id, rejectee.partnerId)
    }
  })
  .then((result) => {
    if (result) {
      return res.status(200).json({status: true, msg: 'Removed Rejection'})
    }
  })
  .catch((err) => {
    if (err) {
      // Rejected.remove(result.rejector)
      // Rejected.remove(result.rejectee)
      console.log(err)
      return res.status(200).json({status: false, msg: 'Unable to Remove Reject', res: result})
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
function deleteRejected (req, res) {

}

/**
 * Declaring the Functions available when including the Module
 */
// module.exports.get = getRejected
module.exports.getRejectedById = getRejectedById
module.exports.getRejectorById = getRejectorById
module.exports.getByUsername = getRejectedByUsername
module.exports.create = createRejected
module.exports.update = updateRejected
module.exports.delete = deleteRejected
