const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = '../config/db';

const UserSchema = mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    //hashpassword usng bcrypt
    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hashedPassword)=>{
            if(err) throw err;
            newUser.password = hashedPassword;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(password, hash, callback){
    bcrypt.compare(password, hash, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.checkUsername = function(uname, callback){
    const query = {username: uname};
    User.findOne(query, callback);
}

module.exports.checkEmail = function(email, callback){
    const query = {email: email};
    User.findOne(query, callback);
}




