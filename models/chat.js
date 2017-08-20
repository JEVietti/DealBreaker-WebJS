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
    sent: [{
      msg : {type: String,
      upsert: true},
      createdAt: {type: Date, require: true}
    }],
    received: [{
      msg: {
        type: String,
        upsert: true
      },
      createdAt: { type: Date, require: true }
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
function sendMessage(senderID, receiverID, message, time) {
  return Chat.findByIdAndUpdate(senderID, { $push: { conversations: 
    {
      _id: receiverID,
      sent: {
        _id: new ObjectID(),
        msg: message,
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
function receiveMessage(senderID, receiverID, message, time) {
  return Chat.findByIdAndUpdate(receiverID, {
    $push: {
      conversations:
      {
        _id: senderID,
        received: {
          _id: new ObjectID(),
          msg: message,
          createdAt: time
        }
      }
    }
  }, { upsert: true, new: true, setDefaultsOnInsert: true }).exec()

}

/**
 * 
 * @param {*} id 
 * @param {*} conversationID 
 */
function getConversation (id, conversationID) {
  return Chat.find({_id: id, "conversations._id": conversationID },
    { _id: id, conversations: { $elemMatch: { _id: conversationID } } }).exec()
}

function getSentMessages(id, conversationID) {

}

function getReceivedMessages(id, conversationID) {

}

module.exports.sendMessage = sendMessage
module.exports.receiveMessage = receiveMessage
module.exports.getConversation = getConversation
module.exports.getSentMessages = getSentMessages
module.exports.getReceivedMessages = getReceivedMessages
