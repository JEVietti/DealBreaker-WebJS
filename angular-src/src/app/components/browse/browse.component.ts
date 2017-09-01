import { Component, OnInit, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { RelationshipService } from '../../services/relationship.service'
import { ProfileService } from '../../services/profile.service'
import { Subscription } from 'rxjs/Subscription';
import {Router, ActivatedRoute, Params} from '@angular/router';

declare const $: any;
declare const Materialize: any;

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})

export class BrowseComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  private preferences: Map<String, any>;
  private profile: any;
  private profileSet: Array<any>;
  private ageRange;
  private sex;
  private sexualOrientation;
  private locationRange;
  private page;

  // Option Mapping Label and values
  private sexualities;
  private sexList;
  private locationList;
  private ageList;


  // Subscriptions
  private browseSub: Subscription;
  private profileAddSub: Subscription;
  private profileRejectSub: Subscription;
  private profileRemoveAddSub: Subscription;
  private profileRemoveRejectSub: Subscription;
  private profileConfirmSub: Subscription;

  constructor( private profileService: ProfileService, private relationshipService: RelationshipService) {
    this.preferences = new Map()
    this.sexualities = [
      "Any",
      "Asexual", 
      "Bisexual", 
      "Heterosexual", 
      'Homosexual'
    ]
    this.ageList = [
      { value: 18, label: "18-20" },
      { value: 21, label: "21-30" },
      { value: 30, label: "30-45" },
      { value: 45, label: "45-60" },
      { value: 60, label: "60-80" },
      { value: 80, label: "80+" }
    ];
    this.sexList = [{ value: 'Any', label: 'Any' }, { value: 'Male', label: 'M' }, { value: 'Female', label: 'F' }]
    this.locationList = [
      { value: 40075020, label: 'Anywhere' },
      { value: 80468, label: '50/80 mi/km' }, 
      { value: 402336, label: '250/400 mi/km' },
      { value: 804672, label: '500/805 mi/km' }
    ]

    this.loadPreferences()
  }

  ngOnInit() {
    this.profileSet = new Array()
    this.page = 1;
    this.sexualOrientation ="";
    this.ageRange = 0;
    this.sex="";
    this.locationRange="";
  }

  ngAfterContentInit() {
      $(document).ready(function() {
        $('select').material_select();
      });
      this.getProfileRequests()
  }

  ngAfterViewInit() {
    this.changePreferences()
  }

  search(data) {
    let query = data.search
    query = query.trim()
    const name = query.split(" ")
    console.log(name)
    if(query !== ""){
      if (name.length == 1) {
        this.preferences.set('fname', name[0])
        // this.preferences.set('lname', name[1])
      } else if (name.length >= 2) {
        this.preferences.set('fname', name[0])
        this.preferences.set('lname', name[1])
      }
    }
    this.browse(this.preferences)
    this.preferences.delete('fname')
    this.preferences.delete('lname')
  }

  ngOnDestroy() {
    if (this.browseSub) {
      this.browseSub.unsubscribe()
    }
    if (this.profileAddSub) {
      this.profileAddSub.unsubscribe()
    }
    if (this.profileRemoveAddSub) {
      this.profileRemoveAddSub.unsubscribe()
    }
    if (this.profileRejectSub) {
      this.profileRejectSub.unsubscribe()
    }
    if (this.profileRemoveRejectSub) {
      this.profileRemoveRejectSub.unsubscribe()
    }
    if (this.profileConfirmSub) {
      this.profileConfirmSub.unsubscribe()
    }
  }



  loadPreferences() {

    this.profileService.getProfile().subscribe(attributes => {
      if (attributes) {
        const profile = attributes.profile
        profile.age = this.profileService.calculateAge(profile.birthdate)
        if(profile.age <= 20) {
          this.ageRange = 18
          this.setAgePref(18, 20)
        } else if(profile.age <= 30) {
          this.ageRange = 21
          this.setAgePref(21, 30)
        } else if(profile.age <= 45) {
          this.ageRange = 30
          this.setAgePref(30, 45)
        } else if(profile.age <= 60) {
          this.ageRange = 45
          this.setAgePref(45, 60)
        } else if(profile.age <= 80) {
            this.ageRange = 60
            this.setAgePref(60, 80)
        } else {
          this.ageRange = 80
          this.setAgePref(80, 120)
        }
        console.log(profile)
        if(profile.sex === 'Male') {
          if(profile.sexualOrientation === 'Heterosexual') {
            this.sex = 'Female'
            this.setSexPref('Female')
          } else if (profile.sexualOrientation === 'Homosexual') {
            this.setSexPref('Male')
          } else if (profile.sexualOrientation === 'Heterosexual') {
            this.setSexPref(['Female'])
          } else {
            this.setSexPref('Any')
          }
        } else if (profile.sex === 'Female') {
          if (profile.sexualOrientation === 'Heterosexual') {
            this.setSexPref('Male')
          } else if (profile.sexualOrientation === 'Homosexual') {
            this.setSexPref('Female')
          } else {
            this.setSexPref('Any')
          }
        }
        this.sexualOrientation = profile.sexualOrientation
        this.setOrientationPref(this.sexualOrientation)

        this.locationRange = 80468
        this.setLocationRangePref(80468)
        this.setLocationBase(profile.location.coordinates)
        this.setPage(this.page)
        $(document).ready(function () {
          $('select').material_select();
        })

        this.browse(this.preferences)
      } else {
        // Inform user to create a profile first
      }
    })

  }

  changePreferences() {
    $('#ageRange').on('change', () => {
        if (this.ageRange === 18) {
          this.setAgePref(18, 20)
        } else if (this.ageRange === 21) {
          this.setAgePref(21, 30)
        } else if (this.ageRange === 30) {
          this.setAgePref(31, 45)
        } else if (this.ageRange === 45) {
          this.setAgePref(46, 60)
        } else if (this.ageRange === 60) {
          this.setAgePref(60, 80)
        } else if (this.ageRange === 80) {
          this.setAgePref(80, 120)
        } else {
          // Inform user error
          return;
        }
        this.profileSet = [];     
        this.page = 1   
        this.setPage(this.page)        
        this.browse(this.preferences)
      })

      $('#sex').on('change', () => {
        this.setSexPref(this.sex)
        this.profileSet = [];        
        this.page = 1
        this.setPage(this.page)        
        this.browse(this.preferences)
      })

      $('#sexualOrientation').on('change', (e) => {
        this.profileSet = [];        
        this.page = 1
        this.setPage(this.page)        
        this.setOrientationPref(this.sexualOrientation)
        this.browse(this.preferences)
      })

      $('#locationRange').on('change', () => {
        this.profileSet = [];    
        this.page = 1    
        this.setPage(this.page)
        this.setLocationRangePref(this.locationRange)
        this.browse(this.preferences)
      })
  }

  browse(preferences) {
    console.log(this.preferences)
    $('#loader').fadeIn(300).delay(200)
    this.browseSub = this.relationshipService.getProfiles(preferences).subscribe(res => {
       if (res.profiles) {
         $('#loader').fadeOut(300).delay(200)
         console.log(res.profiles)
        res.profiles.forEach(element => {
          element.status = undefined
          this.profileSet.push(element)
        });
        if (res.profiles.length > 0) {
          this.scrollForMore()
        }
      }
      // this.relationshipService.fetchProfiles(res.profiles)
    })
  }

  getProfileRequests() {
    this.getProfileAdd()
    this.getProfileRemoveRequest()
    this.getProfileRemoveReject()
    this.getProfileReject()
    // this.getProfileConfirm()
  }

  getProfileAdd() {
    this.profileAddSub = this.relationshipService.listenProfileToAdd().subscribe(res => {
      console.log(res.profile._id)
      this.relationshipService.sendPendingRequest({_id: res.profile._id}).subscribe(request => {
        console.log(request)
      })
    })
  }

  getProfileRemoveRequest() {
    this.profileRemoveAddSub = this.relationshipService.listenProfileToRemoveRequest().subscribe(res => {
      console.log(res)
      this.relationshipService.removePendingRequest({_id: res.profile._id}).subscribe(remove => {
        console.log(remove)
      })
    })
  }

  getProfileReject() {
    this.profileRejectSub = this.relationshipService.listenProfileToReject().subscribe(res => {
      console.log(res)
      this.relationshipService.rejectRequest({_id: res.profile._id}).subscribe(reject => {
        console.log(reject)
      })
    })
  }

  getProfileRemoveReject() {
    this.profileRemoveRejectSub = this.relationshipService.listenProfileToRemoveReject().subscribe(res => {
      console.log(res)
      this.relationshipService.removeRejectRequest({_id: res.profile._id}).subscribe(remove => {
        console.log(remove)
      })
    })
  }

  getProfileConfirm() {
    this.profileConfirmSub = this.relationshipService.listenProfileToConfirm().subscribe(res => {
      console.log(res)
      this.relationshipService.confirmRequest({_id: res.profile._id}).subscribe(confirm => {
        console.log(confirm)
      })
    })
  }

  scrollForMore() {
    const options = [
      {
        selector: '#profiles', offset: 200, callback: () => {
          this.loadMore()
        }
      },
    ]
    Materialize.scrollFire(options)
  }

  loadMore() {
    console.log('Load')
    this.page += 1;
    console.log(this.page)
    this.setPage(this.page)
    this.browse(this.preferences)
  }

  /**
   *
   * @param sex
   */
  setSexPref(sex) {
    this.sex = sex   
    if(sex === 'Any') {
      this.preferences.set('sex', ['Male', 'Female'])
      return
    }
    this.preferences.set('sex', sex)
  }

  /**
   *
   * @param orientation
   */
  setOrientationPref(orientation) {
    this.sexualOrientation = orientation
    if(orientation === 'Any') {
      this.preferences.set('orientation', ['Asexual', 'Heterosexual', 'Bisexual', 'Homosexual'])
      return
    }
    this.preferences.set('orientation', orientation)
  }

  /**
   *
   * @param min
   * @param max
   */
  setAgePref(min, max) {
    this.preferences.set('minAge', min)
    this.preferences.set('maxAge', max)
  }

  /**
   *
   * @param range
   */
  setLocationRangePref(range) {
    this.preferences.set('location', range)
  }

  setLocationBase(loc) {
    this.preferences.set('baseLocation', loc)
  }

  setPage(page) {
    this.preferences.set('page', page)
  }
}
