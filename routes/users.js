const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const User = require('../models/user');

//Register
router.post('/register', (req, res, next)=>{
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user)=>{
        if(err){
            res.json({success:false, msg:"Failed to Register User"});
        
        }else{
            res.json({success:true, msg:"Registered User"});
            
        }

    });

});

//Authenticate
router.post('/authenticate', (req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err,user)=>{
        if(err) throw err;
        
        if(!user){
            return res.json({"success": false, "msg":"User not Found!"});
        }

        if(username == undefined || password == undefined){
            return res.json({"success": false, "msg":"Missing Credentials!"});
        }

        User.comparePassword(password, user.password,(err, isMatch)=>{
            if(err) throw err;
            if(!isMatch){
                return res.json({"success": false, "msg":"Incorrect Password!"});
            }
            const token = jwt.sign(user, config.secret, {
                expiresIn: 604800 // 1 week
            });
             res.json({
                "success": true, 
                "msg":"Successfully Logged in!", 
                token: 'JWT ' + token,
                user : {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                }
                
            });
            return res.json;
        });
    });

});

//Profile - Protected by Auhentication
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    const username = req.query.user;
 //If User is not specified
  if(username === undefined){
     return res.json({user:req.user, success: true});
    
  }
  //User is Specified
  User.getUserByUsername(username, (err, user)=>{
    if (err) throw err;
    if(!user){
       res.json({
                "success":false, 
                "msg":"User Not Found!", 
                user : {}
            });
        return res.json;
  }
  else{
      console.log(user);
     return res.json({user:user, success: true});

  }

  });
  
});

module.exports = router;