const Chat = require('../models/chat')
const User = require('../models/user')
const ObjectID = require('mongodb').ObjectID

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function sendMessage(req, res) {
  console.log(req.body)
  const id = req.user._id
  let receiverId = req.body.receiver
  const msg = req.body.msg
  const time = Date.now()
  User.getIdByUsername(receiverId).then(result => {
    console.log(result)
    receiverId = result._id
    return Chat.getConversation(id, receiverId)
  })
  .then(result => {
    // console.log(receiverId)
    // console.log(result.length)
    if(result) {
      Chat.sendMessage(id, receiverId, msg, time)
        .then(result => {
          if (result) {
            return Chat.receiveMessage(id, receiverId, msg, time)
          }
          return res.status(200).json({ success: false, msg: 'Message Failed to Send' })
        })
        .then(result => {
          if (result) {
            return res.status(201).json({ success: true, msg: 'Message Sent' })
          }
          return res.status(200).json({ success: false, msg: 'Message Failed to be received' })
        })
        .catch(err => {
          if (err) {
            console.log(err)
            return res.status(200).json({ success: false, msg: 'Error' })
          }
        })
    } else {
      Chat.createSendMessage(id, receiverId, msg, time)
        .then(result => {
          if (result) {
            return Chat.createReceiveMessage(id, receiverId, msg, time)
          }
          return res.status(200).json({ success: false, msg: 'Message Failed to Send' })
        })
        .then(result => {
          if (result) {
            return res.status(201).json({ success: true, msg: 'Message Sent' })
          }
          return res.status(200).json({ success: false, msg: 'Message Failed to be received' })
        })
        .catch(err => {
          if (err) {
            console.log(err)
            return res.status(200).json({ success: false, msg: 'Error' })
          }
        })
    }
  })
  
}

function getConversationById(req, res) {
  const id = req.user._id
  const conversationID = String(req.query.cid)
  console.log(conversationID)
  Chat.getConversation(id, conversationID)
  .then(result => {
    if(result) {
      return res.json({success: true, messages: result.conversations[0].messages})
    }
    return res.json({success: false, messages: null})
  })
  .catch(err => {
    console.log(err)
    return res.json({success: false, msg: 'Error'})
  })
}


function getConversationByUsername(req, res) {
  const id = req.user._id
  const username = String(req.params.profile)
  User.getIdByUsername(username)
  .then(result => {
    // console.log(result._id)
    return Chat.getConversation(id, result._id)
  })
  .then(result => {
    if (result) {
      console.log(result)
      return res.json({ success: true, messages: result.conversations[0].messages})
    }
      return res.json({ success: false, messages: null })
    })
    .catch(err => {
      console.log(err)
      return res.json({ success: false, msg: 'Error' })
    })
    
}


module.exports.createSendMessage = sendMessage
module.exports.getConversation = getConversationById
module.exports.getConversationByUsername = getConversationByUsername