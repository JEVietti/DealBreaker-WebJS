import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
//import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile:Object;
   //private sub: Subscription;
   private id: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {}
  
  ngAfterContentInit() {
    this.route.params.subscribe((params: Params)=>{
      this.id = params['id'];
      console.log(this.id);
    });
    //If the route doesnt have a /id
    if(this.id === undefined){
       this.authService.getProfile().subscribe(profile => {
        this.profile = profile.profile;
        console.log(this.profile);
    },
    err=>{
      console.log(err);
    });  
  }
  //route to a specific /id
  else { 
       this.authService.getProfileById(this.id).subscribe(profile => {
         //console.log(profile.success);
        if(profile.success){
          console.log("Success!");
            this.profile = profile.profile;
            console.log(this.profile);
        }
        else {
          this.profile = null;
        }
      
        
    },
    err=>{
      console.log(err);
    });  
  }
     
}



}
