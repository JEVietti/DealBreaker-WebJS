const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');
const User = require('../models/user');
const UserController = require('../controllers/user');

//Validate and Create the User, by checking against the DB
//If a username is taken -> false
//else if an email is taken -> false
//otherwise attempt to create User , catch errors
//return the messages with request
function validateCreate(req, res){
    
    const uname = req.body.username;
    const email = req.body.email;

    let newUser = new User({
        name: req.body.name,
        email: email,
        username: uname,
        password: req.body.password
    });

     //Username already exists
    User.checkUsername(uname,(err, result)=>{
         if(err) throw err;
         if(result != null){
            return res.json({success:false, msg:"Username Already exists!"});                    
         }
         else{ //Check for email
             User.checkEmail(email, (err, result)=>{
                if(err) throw err;
                 //console.log(res);
                 if(result != null){
                    return res.json({success:false, msg:"Email already tied to an account!"});                            
                 }
                 else{ //Try to add the user 
                    User.addUser(newUser, (err, user)=>{
                        if(err){
                            return res.json({success:false, msg:"Failed to Register User"});
                            
                        }else{
                            return res.json({success:true, msg:"Registered User"});    
                        }

                        });

                 }
                
            });

        }
        
        
    });
}

//Register
router.post('/register', (req, res, next)=>{
   
    UserController.create(req, res);

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