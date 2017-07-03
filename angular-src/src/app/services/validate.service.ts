/* Helper Functions that allow for validate of forms and input data
 * seperating the form input with gorm checking returning statuses
 * based on a user input back into the caller to accept or reject
 * the user's input and provide feedback.
 * 
 * User Registration:
 *    validateRegister - All Fields Filled
 *    validateEmail - Email in correct Format
 *    validatePassword - password and confirm password ===
 * 
 * Profile Registration
*/

import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  //Registration Validation - fields not empty |
  //Result: true: return false - invalid || false: return true - valid 
  validateRegister(user){
    return !(user.fname == undefined || user.lname == undefined || user.email == undefined || user.username == undefined || user.password == undefined);
    
  }

  //Validates the email formatting by regular expression
  //If it passes the test on the re then return true = valid, otherwise false = invalid
  validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
  //Passwords entered are the same string
  //Results: true - valid, false - invalid
  validatePassword(password, cpassword){
    return password === cpassword;
  }

  //Login Validation - all fields not empty
  //True Validation of password username combination is done server side
  //in which a success status and message are received in the pay load inside login module
  validateLogin(user){
    return !(user.username == undefined || user.password == undefined);
  }
  
  //Validate date format as to being a valid date
  validateDate(birthdate){
    var d = new Date(birthdate);
    if ( Object.prototype.toString.call(d) === "[object Date]" ) { // it is a date
        if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
          // date is not valid
          //console.log("Not a real date!");
          return false;
        }
        else {
          // date is valid
          //console.log("date is valid and real");
          return true;
        }
    } else {
        // not a date
        //console.log("Date is invalid format!");
        return false;
    }

  }

  //Validate the DOB of being at least 18 yearsold 
  validateDOB(birthdate){
    let ageMS = Date.parse(Date()) - Date.parse(birthdate);
    let age = new Date();
    age.setTime(ageMS);
    let ageYear = age.getFullYear() - 1970;
    //console.log(ageYear);
    
    return ageYear < 18;
  }

  //Profile Validation- Profile Creation

}

