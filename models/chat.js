/** Images Model and Functions
 * Uses Mongoose as Connect to MongoDB Database with images collection
 * Uses Promises - promise library bluebird
 */
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const ObjectID = require('mongodb').ObjectID
require('../config/db')
const Schema = mongoose.Schema

/**
 *
 */
const ChatSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  conversations: [{
    _id: {type: Schema.Types.ObjectId},
    messages: [{
      msg : {type: String,
      upsert: true},
      format: { type: String },      
      createdAt: {type: Date, require: true}
    }],
  }]
})



const Chat = module.exports = mongoose.model('Chat', ChatSchema)

/**
 * 
 * @param {*} senderID 
 * @param {*} receiverID 
 * @param {*} message 
 * @param {*} time 
 */
function createSendMessage(senderID, receiverID, message, time) {
  return Chat.findByIdAndUpdate(senderID, { $push: { conversations: 
    {
      _id: receiverID,
      messages: {
        _id: new ObjectID(),
        msg: message,
        format: 'sent',
        createdAt: time
      }
  } }}, { upsert: true, new: true, setDefaultsOnInsert: true }).exec()

}

/**
 * 
 * @param {*} senderID 
 * @param {*} receiverID 
 * @param {*} message 
 * @param {*} time 
 */
function sendMessage(senderID, receiverID, message, time) {
  return Chat.update({ _id: senderID, "conversations._id": receiverID }, {
    $push: {
      'conversations.$.messages': {
        _id: new ObjectID(),
        msg: message,
        format: 'sent',        
        createdAt: time
      }
    }
  }, { upsert: true }).exec()

}



/**
 * 
 * @param {*} senderID 
 * @param {*} receiverID 
 * @param {*} message 
 * @param {*} time 
 */
function createReceiveMessage(senderID, receiverID, message, time) {
  return Chat.findByIdAndUpdate(receiverID, {
    $push: {
      conversations:
      {
        _id: senderID,
        messages: {
          _id: new ObjectID(),
          msg: message,
          format: 'received',          
          createdAt: time
        }
      }
    }
  }, { upsert: true, new: true, setDefaultsOnInsert: true }).exec()

}


/**
 * 
 * @param {*} senderID 
 * @param {*} receiverID 
 * @param {*} message 
 * @param {*} time 
 */
function receiveMessage(senderID, receiverID, message, time) {
  return Chat.update({ _id: receiverID, "conversations._id": senderID }, {
    $push: {
      'conversations.$.messages': {
        _id: new ObjectID(),
        msg: message,
        format: 'received',        
        createdAt: time
      }
    }
  }, { upsert: true }).exec()

}

/**
 * 
 * @param {*} id 
 * @param {*} conversationID 
 */
function getConversation (id, conversationID) {
  return Chat.findOne({_id: id, "conversations._id": conversationID },
    { _id: id, conversations: { $elemMatch: { _id: conversationID } } }).exec()
}

function getSentMessages(id, conversationID) {

}

function getReceivedMessages(id, conversationID) {

}

module.exports.sendMessage = sendMessage
module.exports.receiveMessage = receiveMessage
module.exports.createSendMessage = createSendMessage
module.exports.createReceiveMessage = createReceiveMessage
module.exports.getConversation = getConversation
module.exports.getSentMessages = getSentMessages
module.exports.getReceivedMessages = getReceivedMessages
