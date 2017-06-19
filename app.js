//Server Entry Point File: Front Controller

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
/*  
    const fs = require('fs');
    const expressValidator = require('express-validator');
*/
const dbConfig = require('./config/db');//config file

//Database - Mongoose Setup
mongoose.connect(dbConfig.database); //config file
//Testing Connection
mongoose.connection.on('connected',()=>{
    console.log("DB connection successful " + dbConfig.database);

});
//Error checking on DB
mongoose.connection.on('error',(err)=>{
    console.log("DB Error: " + err);

});

const app = express();
const port = process.env.PORT || 3000;
const users = require('./routes/users');
const profiles = require('./routes/profiles');

//CORS MiddleWare
app.use(cors());

//Set Static Angular Folder Framework
app.use(express.static(path.join(__dirname, 'public')));

//BodyParser Middleware
app.use(bodyParser.json());

//Passport MiddleWare - passportjwt
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//Requests to domain/users => users file
app.use('/users', users);
app.use('/profile', profiles);
app.use('/', profiles);

//routing server paths
//Index Path
app.get('*', (req, res)=>{

    res.send('Invalid Endpoint');

});

//server on port:
app.listen(port, ()=>{
    console.log("Server started on port " + port);

});






