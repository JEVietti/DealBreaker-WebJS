const config = require('../config/db');
const Profile = require('../models/profile');
var ObjectID = require('mongodb').ObjectID;

var get = function getProfile(req, res){

    console.log("Reached Profile GET!");
    var username = req.query.user;
    const url = req.url;

    if(username == undefined){
        username = url.replace("/", "");
    }
    if(url === "/"){
        username = undefined;
    }
     console.log(username);
 //If User is not specified - empty url or / url
  if(username === undefined){
      var response = {"success": false};
    const uid = req.user._id;
    Profile.getProfileById(uid, (err, profile)=>{
        console.log(profile);
        if(err){
            console.log("Reached Error!");
             response = {
                 "success": false,
                 profile:profile,
                 msg: "Unknown Error"
            };
        }

        else if(profile){
            console.log("Profile!");            
             response = {
                 "success": true,
                 profile:profile
            };
        }
        else {
            console.log("Reached Unfound!");            
            response = {
                 "success": false,
                 profile: { }
            };
        }
    return res.json(response); 
    });
  }
  else{
       username = username.toLowerCase();
        console.log("By Username")
        //User is Specified
        Profile.getProfileByUsername(username, (err, profile)=>{
            if (err) throw err;
            
            if(!profile){
                res.json({
                            "success":false, 
                            "msg":"User Not Found!", 
                            profile : {}
                        });
                    return res.json;
                }
            
            else{
                return res.json({profile: profile, success: true});
            }

        });
    }
}
//Declaring the Functions available when including the Module or File
module.exports.get = get;