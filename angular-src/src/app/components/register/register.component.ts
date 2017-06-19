import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  fname: String;
  lname: String;
  username: String;
  email: String;
  password: String;
  cpassword: String;

  constructor(
      private validateService: ValidateService, 
      private flashMessage: FlashMessagesService,
      private authService: AuthService,
      private router: Router

  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    console.log("Registration Submitted!");
    
    //User Object 
    const user = {
      fname: this.fname,
      lname: this.lname,      
      username: this.username,
      email: this.email,
      password: this.password,
      cpassword: this.cpassword
    };

    if(this.validateRegister(user)){
      console.log("Validated")
      //Register User
      this.authService.registerUser(user).subscribe(data => {
        if(data.success){
          this.flashMessage.show("You are now registered and can log in", {cssClass: 'alert-success', timeout: 3000});
          this.router.navigate(['/login']);
            return true;
        }
        else{
          this.flashMessage.show(data.msg || "Something went wrong, try again later!", {cssClass: 'alert-danger', timeout: 3000});
          return false;
        }
      });
    }

  }

  private validateRegister(user){
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show("Fill in all fields", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    else if(!this.validateService.validateEmail(user.email)){
       this.flashMessage.show("Invalid Email", {cssClass: 'alert-danger', timeout: 3000});
      //$('#email').addClass("invalid");
      return false;
    }
    else if(!this.validateService.validatePassword(user.password, user.cpassword)){
      this.flashMessage.show("Passwords do not match!", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    
    return true;
  }

}
