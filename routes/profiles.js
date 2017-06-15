//Routing Requests for Models: Profile
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const Profile = require('../models/profile');
var ObjectID = require('mongodb').ObjectID;
const ProfileController = require('../controllers/profile');



//Profile Creation
router.post('/create', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    
    const uid = new ObjectID(req.user._id);

    let newProfile = new Profile({
        _id: uid,
        username: req.body.username,
        birthdate: req.body.birthdate,
        fname: req.body.fname,
        lname: req.body.lname,
        height: req.body.height,
        sex: req.body.sex,
        sexualOrientation: req.body.sexualOrientation,
        location: req.body.location
    });

    Profile.create(newProfile, (err, user)=>{
        if(err){
            res.json({success:false, msg:"Failed to Create Profile"});
        
        }else{
            res.json({success:true, msg:"Created Profile"});
            
        }

    });

});

router.put('/update', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    const uid = new ObjectID(req.user._id);

    let newProfile = new Profile({
        _id: uid,
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
router.get('*', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    //Call to Profile Controller
    ProfileController.get(req, res);
});

module.exports = router;