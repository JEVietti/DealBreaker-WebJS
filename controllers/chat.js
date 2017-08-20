const Chat = require('../models/chat')
const ObjectID = require('mongodb').ObjectID

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function sendMessage(req, res) {
  const id = req.user._id
  const receiverId = req.body.receiver || new ObjectID()
  const msg = req.body.msg
  const time = Date.now()
  Chat.sendMessage(id, receiverId, msg, time)
  .then(result => {
    if(result) {
      return Chat.receiveMessage(id, receiverId, msg, time)
    }
    return res.status(200).json({ success: false, msg: 'Message Failed to Send' })        
  })
  .then(result => {
    if(result) {
      return res.status(201).json({success: true, msg: 'Message Sent'})
    }
    return res.status(200).json({ success: false, msg: 'Message Failed to be received' })    
  })
  .catch(err => {
    if(err) {
      console.log(err)
      return res.status(200).json({ success: false, msg: 'Error' })    
    }
  })
}

function getConversationById(req, res) {
  const id = req.user._id
  const conversationID = String(req.query.cid)
  console.log(conversationID)
  Chat.getConversation(id, ObjectID(conversationID))
  .then(result => {
    if(result) {
      return res.json({success: true, messages: result})
    }
    return res.json({success: false, messages: null})
  })
  .catch(err => {
    console.log(err)
    return res.json({success: false, msg: 'Error'})
  })
}


module.exports.createSendMessage = sendMessage
module.exports.getConversation = getConversationById