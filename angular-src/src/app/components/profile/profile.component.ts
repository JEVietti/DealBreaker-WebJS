/* Profile Component- Displays a User's profile data
 * The Profile Displays Images of the User
 * Name of user, age, location, orientation, sex
 * 
 * Routing of the User is by the username as an id
 * in which the API is requested on AfterContentInit
 * the request is called async by the Profile Service
*/

import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ProfileService } from '../../services/profile.service'
//import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
declare const $: any;
var slider =  $('.slider');
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile:any;
  sub: any;
  image:{_id:Number,url:String};
  gallery: any[] = [];
  age: Number;
  location: String;
   //private sub: Subscription;
   private id: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { 
      this.initProfile();      
      
   }

  ngOnInit() {
  }

  ngAfterContentInit() {
    
  }

  ngAfterViewInit(){
      $(document).ready(function(){

        if($('.carousel.carousel-slider').hasClass('initialized')){
           slider.removeClass('initialized');
        }
        $('.carousel').carousel();
        $('.materialboxed').materialbox();
         //$('.carousel.carousel-slider').carousel(); 
         
            
      });
  }

  ngOnChange(){
    
  }

initProfile(){
  //Subscribe to the route by an id: username
   this.sub = this.route.params.subscribe((params: Params)=>{
      this.id = params['id'];
      console.log(this.id);
    });
    //If the route doesnt have a /id
    if(this.id === undefined){
      //Request the Profile, Same as User tha has been logged in
       this.profileService.getProfile().subscribe(profile => {
         if(profile != undefined){
             //Profile Exists
            if(profile.success){
              //console.log(profile);
              this.profile = profile.profile;
              
              this.location = this.profile.location[0].city + ", " + this.profile.location[0].state + ", " + this.profile.location[0].country 
                console.log(this.profile.birthdate)
              this.age = this.profileService.calculateAge(this.profile.birthdate);                              
              if(this.profile.images != null){
                var images = (this.profile.images.gallery);
                for(var i=0; i<images.length; i++){
                  this.gallery.push(images[i].url);
                }
                $(document).ready(function(){
                  $('.carousel').carousel();
                   $('.materialboxed').materialbox();
                  // $('.carousel.carousel-slider').carousel();      
                  
                });
              }
              console.log(this.gallery);
              console.log(this.profile);
            //Profile Does not exist - reroute to the setup page: components/profile-setup
            } else {
              console.log(profile.profile);
              this.router.navigate(['profile/setup']);
            }     
         } 
    },
    err=>{
      console.log(err);
    });  
  }
  //route to a specific /id: username
  else { 
      //Request API async to endpoint /profile/id
       this.profileService.getProfileById(this.id).subscribe(profile => {
         //console.log(profile.success);
         //if profile found display its contents
        if(profile.success){
           console.log(profile);
              this.profile = profile.profile;
               this.location = this.profile.location[0].city + ", " + this.profile.location[0].state + ", " + this.profile.location[0].country 
               console.log(this.profile.birthdate)
              this.age = this.profileService.calculateAge(this.profile.birthdate); 
              if(this.profile.images != null){
               
              var images = (this.profile.images.gallery);
              for(var i=0; i<images.length; i++){
                this.gallery.push(images[i].url);
              }
                $(document).ready(function(){
                  $('.carousel').carousel();
                   $('.materialboxed').materialbox();
                  // $('.carousel.carousel-slider').carousel();      
                  
                });
              }
              console.log(this.gallery);
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
