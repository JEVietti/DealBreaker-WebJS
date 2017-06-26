/* Profile Component- Displays a User's profile data
 * The Profile Displays Images of the User
 * Name of user, age, location, orientation, sex
 * 
 * Routing of the User is by the username as an id
 * in which the API is requested on AfterContentInit
 * the request is called async by the AuthService in services/auth
*/

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
  sub: any;
   //private sub: Subscription;
   private id: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {}
  
  ngAfterContentInit() {
    //Subscribe to the route by an id: username
   this.sub = this.route.params.subscribe((params: Params)=>{
      this.id = params['id'];
      console.log(this.id);
    });
    //If the route doesnt have a /id
    if(this.id === undefined){
      //Request the Profile, Same as User tha has been logged in
       this.authService.getProfile().subscribe(profile => {
         //Profile Exists
        if(profile.profile.get != undefined){
          this.profile = profile.profile;
          console.log(this.profile);
        //Profile Does not exist - reroute to the setup page: components/profile-setup
        } else{
          console.log(profile.profile);
          this.router.navigate(['profile/setup']);
        }      
    },
    err=>{
      console.log(err);
    });  
  }
  //route to a specific /id: username
  else { 
      //Request API async to endpoint /profile/id
       this.authService.getProfileById(this.id).subscribe(profile => {
         //console.log(profile.success);
         //if profile found display its contents
        if(profile.success){
          console.log("Success!");
            this.profile = profile.profile;
            console.log(this.profile);
        }
        //otherwise set to null, which in teh callback will display User Not Found!
        else {
          this.profile = null;
        }   
    },
    err=>{
      console.log(err);
    });  
  }
     
}

//If path changes - destroy the object and the subscribe rx/js
 ngOnDestroy() {
   //console.log('Destroy');
        if (this.sub != null) {
            this.sub.unsubscribe();
        }
    }



}
