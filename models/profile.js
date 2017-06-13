const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = '../config/db';

const ProfileSchema = mongoose.Schema({

                username: {
                    id: "/properties/user_info/properties/userName",
                    type: String
                },
                birthdate: {
                    id: "/properties/user_info/properties/birthDate",
                    type: String
                },
                fname: {
                    id: "/properties/user_info/properties/firstName",
                    type: String
                },
                height: {
                    id: "/properties/user_info/properties/height",
                    type: Number
                },
                lname: {
                    id: "/properties/user_info/properties/lastName",
                    type: String
                },
                location: {
                    id: "/properties/user_info/properties/location",
                    type: String
                },
                sex: {
                    id: "/properties/user_info/properties/sex",
                    type: String
                },
                sexualOrientation: {
                    id: "/properties/user_info/properties/sexualOrientation",
                    type: String
                }
      

});


const Profile = module.exports = mongoose.model('Profile', ProfileSchema);

module.exports.getProfileById = function(id, callback){
    Profile.findById(id, callback);
}

module.exports.getProfileByUsername = function(username, callback){
    const query = {username: username};
    Profile.findOne(query, callback);
}

module.exports.addProfile = function(newProfile, callback){

    newProfile.save(callback);
}


