import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  //Registration Validation
  validateRegister(user){
    return !(user.name == undefined || user.email == undefined || user.username == undefined || user.password == undefined);
    
  }

  validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }

  validatePassword(password, cpassword){
    return password === cpassword;
  }

  //Login Validation
  validateLogin(user){
    return !(user.username == undefined || user.password == undefined);
  }


  //Profile Validation


  //

}

