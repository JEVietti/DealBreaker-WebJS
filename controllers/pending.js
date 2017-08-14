/**
 * 
 */
// const config = require('../config/db')
const Pending = require('../models/pending')
const Confirmed = require('../models/confirmed')
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
function getRequestorById (req, res) {
  const id = req.user._id
  Pending.getRequestor(id)
  .then((result) => {
    return res.status(200).json({success: true, profiles: result})
  })
  .catch(err => {
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
function getRequestedById (req, res) {
  const id = req.user._id
  Pending.getRequestee(id)
  .then((result) => {
    return res.status(200).json({success: true, profiles: result})
  })
  .catch(err => {
    if (err) {
      console.log(err)
      return res.status(200).json({status: false, msg: 'Unable to fetch'})
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
function createPending (req, res) {
  let id = req.body._id
  if (id === undefined || id === null) {
    return res.status(400).json({success: false, msg: 'Malformed Request'})
  }
  const requestor = {
    _id: new ObjectID(req.user._id),
    partnerId: id
  }

  const requestee = {
    _id: new ObjectID(id),
    partnerId: req.user._id
  }

  Pending.createRequestor(requestor._id, requestor.partnerId)
  .then((result) => {
    return Pending.createRequestee(requestee._id, requestee.partnerId)
  })
  .then((result) => {
    if (result) {
      return res.status(201).json({status: true, msg: 'Requestor'})
    }
     return res
       .status(200)
       .json({ status: false, msg: "Unable to request", res: result });
  })
  .catch((err, result) => {
    if (err) {
      console.log(err)
      Pending.remove(result.requestor)
      Pending.remove(result.requestee)
      return res.status(200).json({status: false, msg: 'Unable to request', res: result})
    }
    // return res.status(200).json({status: false, msg: 'Unable to request', res: result})
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
function updatePending (req, res) {
  let id = req.body._id
  const requestor = {
    _id: new ObjectID(req.user._id),
    partnerId: new ObjectID(id)
  }

  Pending.deleteRequestor(requestor._id, requestor.partnerId)
  .then((result) => {
    if (result) {
      return Pending.deleteRequestee(requestor._id, requestor.partnerId)
    }
  })
  .then((result) => {
    if (result) {
      return res.status(200).json({status: true, msg: 'Removed request'})
    } else {
      return res.status(200).json({status: false, msg: 'Unable to Remove Request', res: result})
    }
  })
  .catch((err, result) => {
    if (err) {
      console.log(err)
      return res.status(200).json({status: false, msg: 'Unable to Remove Requestor', res: result})
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
function confirmPending (req, res) {
  let id = req.body._id
  console.log(req.body)
  const requestor = {
    _id: new ObjectID(req.user._id),
    partnerId: new ObjectID(id)
  }
  const requestee = {
    _id: new ObjectID(id),
    partnerId: new ObjectID(req.user._id)
  }

  Confirmed.createConfirm(requestor._id, requestor.partnerId)
  .then((result) => {
    if (result) {
      return Confirmed.createConfirm(requestee._id, requestee.partnerId)
    }
  })
  .then((result) => {
    return Pending.deleteRequestor(requestor.partnerId, requestor._id)
  })
  .then((result) => {
    return Pending.deleteRequestee(requestor.partnerId, requestor._id)
  })
  .then((result) => {
    return res.status(201).json({status: true, msg: 'Confirmed Relationship'})
  })
  .catch((err, result) => {
    if (err) {
      console.log(err)
      return res.status(200).json({status: false, msg: 'Unable to Confirm try again', res: result})
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
function rejectPending (req, res) {
  let id = req.body._id
  const requestor = {
    _id: new ObjectID(req.user._id),
    partnerId: new ObjectID(id)
  }
  const requestee = {
    _id: new ObjectID(id),
    partnerId: new ObjectID(req.user._id)
  }

  Rejected.createRejector(requestor._id, requestor.partnerId).then((result) => {
    if (result) {
      return Rejected.createRejectee(requestee._id, requestee.partnerId)
    }
  })
  .then((result) => {
    if (result) {
      return Pending.deleteRequestor(requestor.partnerId, requestor._id)
    }
  })
  .then((result) => {
      return Pending.deleteRequestee(requestor.partnerId, requestor._id)
  })
  .then((result) => {
      return res.status(201).json({status: true, msg: 'Rejected Relationship'})
  })
  .catch((err, result) => {
    if (err) {
      console.log(err)
      return res.status(200).json({status: false, msg: 'Unable to Reject try again', res: result})
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
function deletePending (req, res) {

}

/** Exporting Functions defined above
 *  Format: module.export.exportName = functionName
*/
// module.exports.get = getPending
module.exports.getRequests = getRequestedById
module.exports.getRequested = getRequestorById
module.exports.create = createPending
module.exports.update = updatePending
module.exports.confirm = confirmPending
module.exports.reject = rejectPending
module.exports.delete = deletePending
