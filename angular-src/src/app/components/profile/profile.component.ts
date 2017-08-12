/* Profile Component- Displays a User's profile data
 * The Profile Displays Images of the User
 * Name of user, age, location, orientation, sex
 * 
 * Routing of the User is by the username as an id
 * in which the API is requested on AfterContentInit
 * the request is called async by the Profile Service
*/

import { Component, OnInit, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProfileService } from '../../services/profile.service'
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/map';

declare const $: any;
declare const Materialize: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  profile:any;
  myProfile: boolean;
  // sub: any;
  image: { _id: Number, url: String };
  gallery: any[] = [];
  age: Number;
  location: String;

  private sub: Subscription;
  private profileSub: Subscription;
  private profileIDSub: Subscription;

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
     $(document).ready(() => {
        $(document).on('click', '.materialboxed', function (e) {
          // console.log('this is the click');
          e.preventDefault();
        });
        this.initMaterialize()
    })
  }

  ngAfterViewInit() {

  }

  initMaterialize() {
    $(document).ready(function(){
      $('ul.tabs').tabs();
      $('.carousel').carousel();
      $('#profileAttributes').find('.indicator').remove()
      $('.tabs-vertical').find('.indicator').remove()
    });
  }


initProfile(){
  // Subscribe to the route by an id: username
   this.sub = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      // console.log(this.id);
    });
    // If the route doesn't have a /id
    if(this.id === undefined){
      this.myProfile = true
      // Request the Profile, Same as User tha has been logged in
      this.profileSub = this.profileService.getProfile().subscribe(profile => {
        if (profile !== undefined) {
          // Profile Exists
          if (profile.success) {
            // console.log(profile);
            this.profile = profile.profile;
            this.location = this.profile.location.city + ', ' + this.profile.location.state + ', ' + this.profile.location.country 
            // console.log(this.profile.birthdate)
            this.age = this.profileService.calculateAge(this.profile.birthdate);
            this.fetchImages()
            // Profile Does not exist - reroute to the setup page: components/profile-setup
          } else {
            // console.log(profile.profile);
            this.router.navigate(['profile/setup']);
          }
        }
        this.initMaterialize()
      },
    (err) => {
      // console.log(err);
      this.router.navigate(['profile/setup']);
    });
  // route to a specific /id: username
    return
    }
      this.myProfile = false
      // Request API async to endpoint /profile/id
      this.profileIDSub = this.profileService.getProfileById(this.id).subscribe(profile => {
        // console.log(profile.success);
        // if profile found display its contents
        if (profile.success) {
          this.fetchImages()
          // console.log(profile);
          this.profile = profile.profile;
          this.location = this.profile.location.city + ', ' + this.profile.location.state + ', ' + this.profile.location.country
          // console.log(this.profile.birthdate)
          this.age = this.profileService.calculateAge(this.profile.birthdate);
        } else {
        // otherwise set to null, which in teh callback will display User Not Found!
          this.profile = null;
        }
        this.initMaterialize()
      },
      err => {
        this.profile = null;
      });
  }

  fetchImages() {
    if(this.profile !== undefined) {
      if (this.profile.images != null) {
        const images = (this.profile.images.gallery);
        for (let i = 0; i < images.length; i++) {
          this.gallery.push(images[i].url);
        }
        $(document).ready(function () {
          $('.carousel').carousel();
        });
      }
    } else {
      this.gallery = null;
    }
  }

// If path changes - destroy the object and the subscribe rx/js
 ngOnDestroy() {
   //// console.log('Destroy');
        if (this.sub != null) {
            this.sub.unsubscribe();
        }
        if (this.profileIDSub != null) {
          this.profileIDSub.unsubscribe()
        }
        if (this.profileSub != null) {
          this.profileSub.unsubscribe()
        }
    }



}
