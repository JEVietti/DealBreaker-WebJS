//Routing Requests for Models: Profile
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const Profile = require('../models/profile');

//Profile Creation
router.post('/create', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    let newProfile = new Profile({
        username: req.body.username,
        birthdate: req.body.birthdate,
        fname: req.body.fname,
        lname: req.body.lname,
        height: req.body.height,
        sex: req.body.sex,
        sexualOrientation: req.body.sexualOrientation,
        location: req.body.location
    });

    Profile.addProfile(newProfile, (err, user)=>{
        if(err){
            res.json({success:false, msg:"Failed to Create Profile"});
        
        }else{
            res.json({success:true, msg:"Created Profile"});
            
        }

    });

});

router.put('/update', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    let newProfile = new Profile({
        username: req.body.username,
        fname: req.body.fname,
        lname: req.body.lname,
        height: req.body.height,
        weight: req.body.weight,
        sex: req.body.sex,
        sexualOrientation: req.body.sexualOrientation,
        profileImage: req.body.profileImage,
        bannerImage: req.body.bannerImage,
        location: req.body.location
    });

    Profile.updateProfile(newProfile, (err, profile)=>{
        if(err){
            res.json({success:false, msg:"Failed to Update Profile"});
        
        }else{
            res.json({success:true, msg:"Updated Profile"});
            
        }

    });

});


//Profile - Protected by Auhentication
router.get('', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    const username = req.query.user;
 //If User is not specified
  if(username === undefined){
     return res.json({user:req.user, success: true});
    
  }
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
      console.log(user);
     return res.json({profile:profile, success: true});
  }

  });
  
});

module.exports = router;