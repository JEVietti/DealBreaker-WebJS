import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'
import {ValidateService} from '../../services/validate.service'
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";


declare const Materialize: any;

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.css']
})
export class UpdateEmailComponent implements OnInit {
  email: String;
  confirmEmail: String;
  loadData: any;

  updateSub: Subscription;

  constructor( 
    private auth: AuthService,
    private validate: ValidateService
    ) { }

  ngOnInit() {
    this.loadData = this.auth.getTokenData('user') 
    if(this.loadData != null){ 
     console.log(this.loadData)
     this.email = this.loadData.email
    }
  }

  updateEmail(){
    console.log()
     
    const updateEmail = {
      email: this.email,
      confirmEmail: this.confirmEmail
    }

    if(this.validateForm(updateEmail)){
      this.updateSub = this.auth.updateEmail(updateEmail).subscribe(res => {
        if(res.success){
          Materialize.toast( res.msg || "Email updated!", 3000, 'rounded toast-success')          
        } else {
          Materialize.toast( res.msg ||"Something went wrong, try agian later!", 3000, 'rounded toast-danger')
        }
      })
    }

  }

  validateForm(updateEmail){

    if(updateEmail.email == undefined || updateEmail.confirmEmail == undefined){
      Materialize.toast("Fill in all fields.", 3000, 'rounded toast-danger')
      return false
    }

    else if(updateEmail.email != updateEmail.confirmEmail){
      Materialize.toast("Emails do not match.", 3000, 'rounded toast-danger')      
      return false
    }
    
    else if(!this.validate.validateEmail(updateEmail.email)){
      Materialize.toast("Email is invalid.", 3000, 'rounded toast-danger')      
      return false    
    }
    return true
  }

  ngOnDestroy(){
    if(this.updateSub != null) {
      this.updateSub.unsubscribe()
    }
  }
}
