import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms'
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service'
import {ValidateService} from '../../services/validate.service'

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.css']
})
export class UpdateEmailComponent implements OnInit {
  email: String;
  confirmEmail: String;

  constructor(
    private flashMessage: FlashMessagesService, 
    private auth: AuthService,
    private validate: ValidateService
    ) { }

  ngOnInit() {
  }

  updateEmail(){
    console.log()
     
    const updateEmail = {
      email: this.email,
      confirmEmail: this.confirmEmail
    }

    if(this.validateForm(updateEmail)){
      this.auth.updateEmail(updateEmail).subscribe(res => {
        if(res.success){
          this.flashMessage.show( res.msg || "Email updated!", {cssClass: 'alert-success', timeout: 3000})          
        } else {
          this.flashMessage.show( res.msg ||"Something went wrong, try agian later!", {cssClass: 'alert-danger', timeout: 3000})
        }
      })
    }

  }

  validateForm(updateEmail){

    if(updateEmail.email == undefined || updateEmail.confirmEmail == undefined){
      this.flashMessage.show("Fill in all fields.", {cssClass: 'alert-danger', timeout: 3000})
      return false
    }

    else if(updateEmail.email != updateEmail.confirmEmail){
      this.flashMessage.show("Emails do not match.", {cssClass: 'alert-danger', timeout: 5000})      
      return false
    }
    
    else if(!this.validate.validateEmail(updateEmail.email)){
      this.flashMessage.show("Email is invalid.", {cssClass: 'alert-danger', timeout: 5000})      
      return false    
    }
    return true
  }

}
