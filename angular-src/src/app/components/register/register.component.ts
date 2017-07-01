/* Register Component - Send User Information for Auth, Account Creation
 * Binds the Form Input Elements to Class Variables
 * Which are then validated by validate.service and used to create the profile
 * Sendig API request by auth.service
 * 
 * 
*/

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
  //Class Variables - form Model for binding
  fname: String; //name
  lname: String;
  monthPairs : any[];
  yearList: number[] = [];
  dayList: number[] = [];
  dobMonth: number;
  dobDay: number;
  dobYear: number;
  birthdate: String;
  username: String; //unique username/id
  email: String; //unique email
  password: String; //password for auth
  cpassword: String;

//Inject the modules for use in Clas - Component
  constructor(
      private validateService: ValidateService, 
      private flashMessage: FlashMessagesService,
      private authService: AuthService,
      private router: Router,
     
  ) { }

  

  ngOnInit() {

    this.monthPairs = [{value:1,label: "January"},{value:2,label: "Feburary"},{value:3,label: "March"},{value:4,label: "April"},{value:5,label: "May"},{value:6,label: "June"},{value:7,label: "July"}, {value:8,label: "August"}, {value:9,label: "September"}, {value:10,label: "October"},{value:11,label: "November"}, {value:12,label: "December"} ];
    

    var currentYear = new Date().getFullYear();
    for(var i=currentYear; i >= currentYear-100; i--){
      this.yearList.push(i);
    }  

    this.dayList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
}


  ngAfterContentInit(){  
  }

//Form Submission
  onRegisterSubmit(){
    console.log("Registration Submitted!");
    //Initialize birthdate in dd-mm-yyyy format
    this.birthdate = this.dobYear + "-" + this.dobMonth + "-" + this.dobDay;
     console.log(this.birthdate);
    //User Object 
    const user = {
      fname: this.fname,
      lname: this.lname,      
      birthdate: this.birthdate,
      username: this.username,
      email: this.email,
      password: this.password,
      cpassword: this.cpassword
    };

  //The Validation Registration for form being filled 
    if(this.validateRegister(user)){
      console.log("Validated")
     
      //Register User - subscribe for API response
      this.authService.registerUser(user).subscribe(data => {
       //Register success, redirect for user to log in
        if(data.success){ 
          this.flashMessage.show("You are now registered and can log in", {cssClass: 'alert-success', timeout: 3000});
          this.router.navigate(['/login']);
            return true;
      //Otherwise Advise the User from server response msg or notfiy something is wrong and to try later.  
      } else{
          this.flashMessage.show(data.msg || "Something went wrong, try again later!", {cssClass: 'alert-danger', timeout: 3000});
          return false;
        }
      });
    }

  }

//Validate the Registration through a Series of Tests and Message responses accordingly - Form checks only
  private validateRegister(user){
    //All fields entered
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show("Fill in all fields", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    //Email formatted correctly
    else if(!this.validateService.validateEmail(user.email)){
       this.flashMessage.show("Invalid Email", {cssClass: 'alert-danger', timeout: 3000});
      //$('#email').addClass("invalid");
      return false;
    }
    //Password Mismatch
    else if(!this.validateService.validatePassword(user.password, user.cpassword)){
      this.flashMessage.show("Passwords do not match!", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    else if(!this.validateService.validateDate(user.birthdate)){
      this.flashMessage.show("Invalid Date, please use a real date!", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    else if(this.validateService.validateDOB(user.birthdate)){
      this.flashMessage.show("You must be 18 years or older!", {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
    
    return true; //All tests passed on form entry - clear to send
  }

}
