/* Register Component - Send User Information for Auth, Account Creation
 * Binds the Form Input Elements to Class Variables
 * Which are then validated by validate.service and used to create the profile
 * Sending API request by auth.service
 * 
 * 
*/

import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {RegisterService} from '../../services/register.service';
import {Router} from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";


declare const Materialize: any;
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
  terms: boolean = false;

  registerSub: Subscription;
  regEmailSub: Subscription;
  regUsernameSub: Subscription;

//Inject the modules for use in Class - Component
  constructor(
      private validateService: ValidateService, 
      private registerService: RegisterService,
      private router: Router
  ) { 

    this.monthPairs = [{value:1,label: "January"},{value:2,label: "February"},{value:3,label: "March"},{value:4,label: "April"},{value:5,label: "May"},{value:6,label: "June"},{value:7,label: "July"}, {value:8,label: "August"}, {value:9,label: "September"}, {value:10,label: "October"},{value:11,label: "November"}, {value:12,label: "December"} ];   

    var currentYear = new Date().getFullYear();
    for(var i=currentYear; i >= currentYear-100; i--){
      this.yearList.push(i);
    }  

    this.dayList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    
  }

  

  ngOnInit() {
  
 
  }


  ngAfterContentInit(){
    this.checkName("fname") 
    this.checkName("lname") 
    this.checkEmail()
    this.checkUsername()
    this.checkPassword()
  }

  checkName(id) {
    const name = $('#' + id)
    name.on('change', () => {
    Materialize.updateTextFields();      
      if(this.validateService.validateName(name.val())){
        // console.log(name.val())
        name.attr( "class", "valid" );
        $("label[for=" + id + "]").attr( "class", "active" );
      } else if(!this.validateService.validateName(name.val())) {
        name.attr( "class", "invalid" );
        $("label[for=" + id + "]").attr( "class", "active" );
      } else if(name.val().trim() == null || name.val().trim() == "" ){
        name.attr( "class", "invalid" );
        $("label[for=" + id + "]").attr( "class", "active" );
      }   
    })

  }

  // Password Checking for Strength and Password Confirmation
  checkPassword() {
    const password = $('#password')
    const cpassword = $('#cpassword')
    
    const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
    password.on('change', () => {
      if(password.val() == null || password.val().length == 0) {
        password.attr( "class", "invalid" );
        $("label[for='password']").attr( "class", "active" );
        $("label[for='password']").attr( "data-error", "Password cannot be empty" ); 
      }
      else if (reg.test(password.val())) {
        password.attr( "class", "valid" );
        $("label[for='password']").attr( "class", "active" );
        $("label[for='password']").attr( "data-success", "Password Valid" ); 
      } 
      else {
        password.attr( "class", "invalid" );
        $("label[for='password']").attr( "class", "active" );
        $("label[for='password']").attr( "data-error", "Passwords be at least 8 characters long, must have at least one digit, one lowercase, and one uppercase" );   

      }
    })

    cpassword.on('change', () => {
       if(cpassword.val() == null || cpassword.val().length == 0) {
          cpassword.attr( "class", "invalid" );
          $("label[for='cpassword']").attr( "class", "active" );
          $("label[for='cpassword']").attr( "data-error", "Password cannot be empty" ); 
        } else if(password.val() === cpassword.val()){
          cpassword.attr( "class", "valid" );
          $("label[for='cpassword']").attr( "class", "active" );
          $("label[for='cpassword']").attr( "data-success", "Passwords Match" ); 
        } else {
          cpassword.attr( "class", "invalid" );
          $("label[for='cpassword']").attr( "class", "active" );
          $("label[for='cpassword']").attr( "data-error", "Passwords do not match!" ); 
        }
    })
    

  }


  //Ajax call, in service, to check if username is taken
  //then update the view to inform the user
  checkUsername() {
    const username = $('#username')
    username.on('change', () => {
      Materialize.updateTextFields();
      
      if(this.validateService.validateUserName(username.val())){
        // console.log(username.val())
        username.attr( "class", "valid" );
        $("label[for='username']").attr( "class", "active" );
        $("label[for='username']").attr( "data-success", "Username Valid" );            
        this.regUsernameSub = this.registerService.authUsername(username.val()).subscribe( data => {
          // Username not taken
          if(data.success) {
            console.log('Valid Username, Not Taken')            
            username.attr( "class", "valid" );
            $("label[for='username']").attr( "class", "active" );
            $("label[for='username']").attr( "data-success", "Username Available and Valid" );            
          // Username taken
          } else {
            console.log('Invalid Username, Taken')
            username.attr( "class", "invalid" );
            $("label[for='username']").attr( "class", "active" );
            $("label[for='username']").attr( "data-error", "Username taken" );
            
          }
        })

      } else if(username.val().trim() == null || username.val().trim() == "" ){
        username.attr( "class", "invalid" );
        $("label[for='username']").attr( "class", "active" );
        $("label[for='username']").attr( "data-error", "Username cannot be empty" ); 

      } else if(!this.validateService.validateUserName(username.val())){
        username.attr( "class", "invalid" );
        $("label[for='username']").attr( "class", "active" );
        $("label[for='username']").attr( "data-error", "Username Invalid" );
        
          
      }
      
    })

  }


  //Ajax call, in service, to check if email is taken
  //then update the view to inform the user
  checkEmail() {
    const email = $('#email')
    email.on('change', () => {
    Materialize.updateTextFields();
      
      if(this.validateService.validateEmail(email.val())){
        // console.log(email.val())
        email.attr( "class", "valid" );
        $("label[for='email']").attr( "class", "active" );
        this.regEmailSub = this.registerService.authEmail(email.val()).subscribe( data => {
          // Email not taken
          if(data.success) {
            console.log('Valid Email, Not Taken')            
            email.attr( "class", "valid" );
            $("label[for='email']").attr( "class", "active" );
            $("label[for='email']").attr( "data-success", "Email Available and Valid" );            
          // Email taken
          } else {
            console.log('Invalid Email, Taken')
            email.attr( "class", "invalid" );
            $("label[for='email']").attr( "class", "active" );
            $("label[for='email']").attr( "data-error", "Email taken" );
            
          }
        })
     } else if(email.val().trim() == null || email.val().trim() == "" ){
        email.attr( "class", "invalid" );
        $("label[for='email']").attr( "class", "active" );
        $("label[for='email']").attr( "data-error", "Email cannot be empty" ); 

      } else if(!this.validateService.validateUserName(email.val())){
        email.attr( "class", "invalid" );
        $("label[for='email']").attr( "class", "active" );
        $("label[for='email']").attr( "data-error", "Email Invalid" );
           
      }
      
    })
  }

  

//Form Submission
  onRegisterSubmit(){
    //console.log("Registration Submitted!");
    //Initialize birthdate in dd-mm-yyyy format
      if( $('#terms').is(':checked')){
       this.terms = true
    }
  

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
      //console.log("Validated")
     
      //Register User - subscribe for API response
      this.registerSub = this.registerService.registerUser(user).subscribe(data => {
       //Register success, redirect for user to log in
        if(data.success){ 
          Materialize.toast("You are now registered and can log in", 3000, 'rounded toast-success');
          this.router.navigate(['/profile/setup']);
            return true;
      //Otherwise Advise the User from server response msg or notify something is wrong and to try later.  
      } else{
          Materialize.toast(data.msg || "Something went wrong, try again later!",  5000, 'rounded toast-danger');
          //this.router.navigate(['/register']);
          return false;
        }
      });
    }

  }

//Validate the Registration through a Series of Tests and Message responses accordingly - Form checks only
  private validateRegister(user){
       Materialize.updateTextFields()

    //All fields entered
    if(!this.validateService.validateRegister(user)){
      Materialize.toast("Fill in all fields",  5000, 'rounded toast-danger');
      return false;
    }
    else if(this.validateService.validateName(this.fname)){
      $("#email").attr( "class", "invalid" );
      $("label[for='email']").attr( "class", "active" );
       Materialize.toast("Invalid Email",  5000, 'rounded toast-danger');
      //$('#email').addClass("invalid");
      return false;
    }
    else if(this.validateService.validateName(this.lname)){
     
      $("#email").attr( "class", "invalid" );
      $("label[for='email']").attr( "class", "active" );
       Materialize.toast("Invalid Email",  5000, 'rounded toast-danger');
      //$('#email').addClass("invalid");
      return false;
    }
    //Email formatted correctly
    else if(!this.validateService.validateEmail(user.email)){
      
      $("#email").attr( "class", "invalid" );
      $("label[for='email']").attr( "class", "active" );
       Materialize.toast("Invalid Email",  5000, 'rounded toast-danger');
      //$('#email').addClass("invalid");
      return false;
    }
    //Password Mismatch
    else if(!this.validateService.validatePassword(user.password, user.cpassword)){
      Materialize.toast("Passwords do not match!",  5000, 'rounded toast-danger');
      return false;
    }
    else if(!this.validateService.validateDate(user.birthdate)){
      Materialize.toast("Invalid Date, please use a real date!",  5000, 'rounded toast-danger');
      return false;
    }
    else if(!this.validateService.validateDOB(user.birthdate)){
      Materialize.toast("You must be 18 years or older!",  5000, 'rounded toast-danger');
      return false;
    }
    else if(!this.terms){
      Materialize.toast("You must accept the Terms of Service.",  5000, 'rounded toast-danger');
      return false;
    }
    return true; //All tests passed on form entry - clear to send
  }

  ngOnDestroy() {
    if(this.registerSub != null) {
      this.registerSub.unsubscribe()
    }
    if(this.regEmailSub != null) {
      this.regEmailSub.unsubscribe()
    }
    if(this.regUsernameSub != null) {
      this.regUsernameSub.unsubscribe()
    }
  }

}
