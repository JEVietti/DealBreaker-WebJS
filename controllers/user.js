const express = require('express');
const User = require('../models/user');

//Validate and Create the User, by checking against the DB
//If a username is taken -> false
//else if an email is taken -> false
//otherwise attempt to create User , catch errors
//return the messages with request
var create = function validateCreate(req, res){
    
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

exports.create = create;