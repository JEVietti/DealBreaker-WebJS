import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ValidateService} from '../../services/validate.service';
import {ProfileService} from '../../services/profile.service';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";


import {Router} from '@angular/router';

declare const $: any;
declare var google: any;
declare const Materialize: any;

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.css']
})
export class ProfileSetupComponent implements OnInit {
  //Class Variables
  fname: String;
  lname: String;
  dob: Date; //date of birth
  sex: String;
  monthPairs : any[];
  yearList: number[] = [];
  dayList: number[] = [];
  sexualities: string[] = [];
  dobMonth: number;
  dobDay: number;
  dobYear: number;
  birthdate: String;
  biography: String;
  sexualOrientation: String;
  dealBreakers : Array <String>;
  seeking: Array <String>;
  interests: Array <String>; 
  city: String;
  state: String;
  country: String;
  coord: Array<Int32Array>;
 
  place: any;
  location: String; // Format: City, State, Country || City, Country
  locationData: Object 
  profile: Object;

  profileSub : Subscription;
  updateSub : Subscription;


  constructor(
    private validate: ValidateService,
    private profileService: ProfileService,
    private router: Router,
    private ref: ChangeDetectorRef

  ) { 
    this.biography = undefined;
    this.seeking = [];
    this.interests = [];
    this.dealBreakers = [];
    this.coord = [];
  }


  ngOnInit() {
    this.initMaterialize()
    this.monthPairs = [{value:1,label: "January"},{value:2,label: "February"},{value:3,label: "March"},{value:4,label: "April"},{value:5,label: "May"},{value:6,label: "June"},{value:7,label: "July"}, {value:8,label: "August"}, {value:9,label: "September"}, {value:10,label: "October"},{value:11,label: "November"}, {value:12,label: "December"} ];

    let currentYear = new Date().getFullYear();
    for(let i=currentYear; i >= currentYear-100; i--){
      this.yearList.push(i);
    }  
    this.dayList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    this.sexualities = ["Asexual", "Bisexual", "Homosexual", "Heterosexual"]
    

    this.loadProfile()
    this.loadGoogle();
  }


  getUserLocation(){
     if(navigator.geolocation){
      const options = {
	      enableHighAccuracy: false, //only needs to be accurate to the city
	      timeout: 30000,  // milliseconds (30 seconds)
	      maximumAge: 600000 // milliseconds (10 minutes)
      }  
       navigator.geolocation.getCurrentPosition(this.positionSuccess.bind(this), this.positionError.bind(this), options)
     }
  }
  
  positionSuccess(position){
    // console.log('Position Found')
    // console.log(position)
    Materialize.toast('Fetching Location ...', 2000, 'rounded center toast-danger')    
    let loc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({location: loc}, (result, status) => {
     // console.log(result[0])
    if(status === 'OK') {
      this.getLocation(result[0])
       if(this.state == undefined || this.city == undefined || this.country == undefined){
        Materialize.toast("Try a different location or re-select Location Field", 3000, 'rounded toast-danger');                      
      }
      Materialize.toast('Location Fetched', 2000, 'rounded center toast-success')    
      const formattedLoc = this.city + ", " + this.state + ", " + this.country
      // console.log(position)
      this.coord[1] = position.coords.latitude
      this.coord[0] = position.coords.longitude
      this.location = formattedLoc
      this.ref.detectChanges()
      // console.log(this.location)
     }
   })
  }

  positionError(err){
    //// console.log('Position Not Found')
    switch (err.code)
	  {
  		case err.PERMISSION_DENIED:
  			// User denied access to location. Perhaps redirect to alternate content?
        Materialize.toast('Permission was denied!', 5000,'rounded toast-danger');
         Materialize.toast('Use search or change permissions!', 5000,'rounded toast-danger');
  			break;
  		case err.POSITION_UNAVAILABLE:
  			Materialize.toast('Position is currently unavailable.', 2000,'rounded toast-danger')
  			break;
  		case err.PERMISSION_DENIED_TIMEOUT:
  			Materialize.toast('User took to long to grant/deny permission.', 2000, 'rounded toast-danger');
  			break;
  		case err.UNKNOWN_ERROR:
        Materialize.toast('Unknown error', 2000, 'rounded toast-danger')
  			break;
	  }
  }

  getLocation(place: any){
    // console.log(place)
    let components = place.address_components
    for(let i=0; i< components.length; i++){
      if(components[i].types[0] == "locality"){
        this.city = components[i].long_name
      }
      else if(components[i].types[0] == "administrative_area_level_2" || components[i].types[0] == "administrative_area_level_1" ){
        this.state = components[i].long_name
      }
      else if(components[i].types[0] == "country"){
        this.country = components[i].long_name
      }
    }
  }

  loadProfile(){
    this.profileSub = this.profileService.getProfile().subscribe(res => {
      // console.log(res.success)
      if(res.success){
        this.profile = res.profile;
        // console.log(res.profile)
        this.fname = res.profile.fname
        this.lname = res.profile.lname
        this.sex = res.profile.sex
        this.sexualOrientation = res.profile.sexualOrientation

        let birth = res.profile.birthdate
        let birthdate = birth.split("-")
        this.dobMonth = parseInt(birthdate[1])
        this.dobDay = parseInt(birthdate[2])
        this.dobYear = parseInt(birthdate[0])

        let loc = res.profile.location
        this.location = loc.city + ", " + loc.state + ", " + loc.country 
        this.locationData = loc
        this.state = loc.state
        this.city = loc.city
        this.country = loc.country
        if(loc.coordinates != undefined){
          this.coord = loc.coordinates
        }
        this.biography = res.profile.biography
        $('#biography').trigger('autoresize');

        this.seeking = res.profile.seeking
        this.interests = res.profile.interests
        this.dealBreakers = res.profile.dealbreakers
        $('.chips').material_chip();
        let chipData: Array<Object> = [];
        if (this.dealBreakers != null) {
          // console.log("dealBreakers")
           chipData = []
          this.dealBreakers.forEach(element => {
            chipData.push({tag:element})            
          });
           $('#dealBreakers').material_chip({
             data: chipData,
             placeholder: '+dealbreaker'
          });

        } 
        if (this.seeking != null) {
          // console.log("seeking")

           chipData = []
          this.seeking.forEach(element => {
            chipData.push({tag:element})
          });
          $('#seeking').material_chip({
            data: chipData,
            placeholder: '+seeking'
          });        
        } 
        if (this.interests != null) {
          // console.log("interests")          
          chipData = []
          this.interests.forEach(element => {
            chipData.push({tag:element})            
          });
          $('#interests').material_chip({
            data: chipData,
            placeholder: '+interests'
          });
        }


      } else {
        this.profile = null
        $(document).ready(()=> {
          $('select').material_select();
          $('#seeking').material_chip();
          $('#interests').material_chip();
          $('#dealBreakers').material_chip();
          $('.chips').material_chip();
          $('.chips-placeholder').material_chip({
                placeholder: 'Enter an Attribute',
                secondaryPlaceholder: '+quality',
          });
        });
      }
    },
    err => {
      console.log(err)
      $(document).ready(() => {
        $('select').material_select();
        $('#seeking').material_chip();
        $('#interests').material_chip();
        $('#dealBreakers').material_chip();
        $('.chips').material_chip();
        $('.chips-placeholder').material_chip({
          placeholder: 'Enter an Attribute',
          secondaryPlaceholder: '+quality',
        });
      });
    });
  }

  loadGoogle(){
    const search = document.getElementById('locationSearch')
    const options = {
      types: [
        // return only geocoding results, rather than business results.
        '(cities)'
      ],
      componentRestrictions: { country: [], locality:[] }
    }
    const autocomplete = new google.maps.places.Autocomplete(search, options)

    autocomplete.addListener('place_changed', ()=>{
      let place = autocomplete.getPlace();
      if(place.geometry != undefined){
        this.coord[1] = place.geometry.location.lat();
        this.coord[0] = place.geometry.location.lng();
        let address = place.formatted_address;
        this.place = place
        // console.log(place)
      } else {
        Materialize.toast('Invalid Location', 3000, 'rounded toast-danger')
      }
    })
  }

  public getQualities(){
    let temp;
    temp = $('#seeking').material_chip('data');
    //// console.log(temp);
   if(temp){    
   for(let i=0; i<temp.length; i++){
     this.seeking[i] = temp[i].tag;
   }
   }

   temp = $('#interests').material_chip('data');
   if(temp){
     for(let i=0; i<temp.length; i++){
       this.interests[i] = temp[i].tag;
     }
   }
   temp = $('#dealBreakers').material_chip('data');
   if(temp){
     for(let i=0; i<temp.length; i++){
       this.dealBreakers[i] = temp[i].tag;
     }
   }
  

   // console.log(this.dealBreakers);
   // console.log(this.interests);
   // console.log(this.seeking);   
   

  }

  ngAfterContentInit(){
   this.checkName('fname')   
   this.checkName('lname')   
   this.checkBio()
   this.checkAttributes('dealBreakers')
   this.checkAttributes('seeking')
   this.checkAttributes('interests')
  }

   checkName(id) {
    const name = $('#' + id)
    name.on('change', () => {
    Materialize.updateTextFields();   
  
    if(name.val().trim() == null || name.val().trim() == "" ){
        name.attr( "class", "invalid" );
        $("label[for=" + id + "]").attr( "class", "active" );
        $("label[for=" + id + "]").attr( "data-error", "Field cannot be empty" );
    }     
      else if(this.validate.validateName(name.val())){
        // console.log(name.val())
        name.attr( "class", "valid" );
        $("label[for=" + id + "]").attr( "class", "active" );
        $("label[for=" + id + "]").attr( "data-success", "Name Valid" );             
      } else if(!this.validate.validateName(name.val())) {
        name.attr( "class", "invalid" );
        $("label[for=" + id + "]").attr( "class", "active" );
        $("label[for=" + id + "]").attr( "data-error", "Name Invalid" );     
      }  else {
         name.attr( "class", "invalid" );
        $("label[for=" + id + "]").attr( "class", "active" );
        $("label[for=" + id + "]").attr( "data-error", "Name Invalid" );    
      }
    })

  }

  checkLocation() {
  
  }


  //Form Feedback on Attributes such as Dealbreakers Seeking and Interests
  checkAttributes(id) {
    const attr = $('#' + id)
    attr.on('focusout', () => {
       console.log(id + 'change')
       if(id === 'dealBreakers'){
         if(this.dealBreakers.length === 0){
          console.log('Invalid')          
          const feedback = $('<span />', {
           class: 'formError',
            text: "Fill in Field",
          })
          attr.next().remove()
          attr.after(feedback )     
         } else { 
           console.log('Valid')
            const feedback = $('<span />', {
              class: 'formSuccess',
              text: "Valid",
            })
           // attr.children().remove()
          attr.next().remove()                     
          attr.after(feedback)
         }
       }
         else if(id === 'seeking'){
         if(this.seeking.length === 0){
          console.log('Invalid')          
          const feedback = $('<span />', {
           class: 'formError',
            text: "Fill in Field",
          })
          attr.next().remove()
          attr.after(feedback )     
         } else { 
           console.log('Valid')
            const feedback = $('<span />', {
              class: 'formSuccess',
              text: "Valid",
            })
           // attr.children().remove()
          attr.next().remove()                     
          attr.after(feedback)
         }
       }
         else if(id === 'interests'){
         if(this.interests.length === 0){
          console.log('Invalid')          
          const feedback = $('<span />', {
           class: 'formError',
            text: "Fill in Field",
          })
          attr.next().remove()
          attr.after(feedback )     
         } else { 
           console.log('Valid')
            const feedback = $('<span />', {
              "class": 'formSuccess',
              text: "Valid",
            })
           // attr.children().remove()
          attr.next().remove()                     
          attr.after(feedback)
         }
       }
       
    })
  }

  checkBio() {
    const bio = $('#biography')

    bio.on('focusout', () => {

      console.log('Bio change')
      if(bio.val() == null || bio.val().length == 0) {
        console.log('Null')
        const feedback = $('<span />', {
             class: 'formError',
              text: "Let people know who you are.",
        })
        bio.next().remove()
        bio.after(feedback)
      }
      else if (bio.val().length >= 400) {
        console.log('Null')        
         const feedback = $('<span />', {
             class: 'formError',
              text: "Biography must be 400 characters or less.",
        })
        bio.next().remove()
       $('input#input_text, textarea#biography').characterCounter();        
        bio.after(feedback)    
      } 
      else {
        console.log('Valid')        
          const feedback = $('<span />', {
              class: 'formSuccess',
              text: "Nice biography.",
        })
        bio.next().remove()
       $('input#input_text, textarea#biography').characterCounter();
        
        bio.after(feedback) 
      }
      
    })
  }

  initMaterialize(){
    $(document).ready(()=> {
       $('input#input_text, textarea#biography').characterCounter();
      $('#biography').trigger('autoresize'); 
       $('.tooltipped').tooltip({delay: 10});
    });
  }

  ngAfterViewInit(){
    $(document).ready(()=> {
      
     $('#dealBreakers').on('chip.add', (e, chip) =>{
              // console.log("You Have added chip" + chip.tag);
            this.addChipData(this.dealBreakers, chip.tag)
       });
      $('#dealBreakers').on('chip.delete', (e, chip) =>{
              // console.log("You Have deleted chip" + chip.tag);
              this.deleteChipData(this.dealBreakers, chip.tag)
      });

      $('#interests').on('chip.add', (e, chip) =>{
              // console.log("You Have added chip" + chip.tag);
              this.addChipData(this.interests, chip.tag)
       });
      $('#interests').on('chip.delete', (e, chip) =>{
              // console.log("You Have deleted chip" + chip.tag);
              this.deleteChipData(this.interests, chip.tag)
      });

      $('#seeking').on('chip.add', (e, chip) =>{
              // console.log("You Have added chip" + chip.tag);
              this.addChipData(this.seeking, chip.tag)
       });
      $('#seeking').on('chip.delete', (e, chip) =>{
              // console.log("You Have deleted chip" + chip.tag);
              this.deleteChipData(this.seeking, chip.tag)
      });
    });
  }

  addChipData(array: Array<String>, chipValue){
    console.log(chipValue.trim().length)
    if(chipValue.trim().length !== 0){
      array.push(chipValue)
    }
    // console.log(array)
  }

  deleteChipData(array: Array<String>, chipValue: String){
    //// console.log('Delete' + array)
    const index = array.indexOf(chipValue)
    array.splice(index, 1)
    // console.log(array)
    
  }

  

  onSetupSubmit(form) {
    console.log(form)
    this.birthdate = this.dobYear + "-" + this.dobMonth + "-" + this.dobDay;

    this.biography = (document.getElementById("biography") as HTMLInputElement).value;
    this.getQualities();
    
    if(this.place != undefined){
      this.getLocation(this.place)
    }

    if(this.state == undefined || this.city == undefined || this.country == undefined){
      Materialize.toast("Try a different location or re-select Location Field", 3000, 'rounded toast-danger');                      
      return;
    }

    this.locationData = {city: this.city, state: this.state, country: this.country, coordinates: this.coord}
    const formattedLoc = this.city + ", " + this.state + ", " + this.country
    // console.log(this.locationData)

    const newProfile = {
      fname : this.fname,
      lname : this.lname,
      sex : this.sex,
      sexualOrientation : this.sexualOrientation,
      location : this.locationData,
      birthdate : this.birthdate,      
      seeking : this.seeking,
      interests : this.interests,
      dealbreakers : this.dealBreakers,
      biography: this.biography
    }


      if(this.validateSetup(newProfile)){
          // console.log(newProfile)
        if(this.profile == null) { 
          this.updateSub = this.profileService.saveProfile(newProfile).subscribe(res =>{
            if(res.success){
              Materialize.toast("Profile Created Successfully!", 3000, 'rounded toast-success');
              this.router.navigate(['/profile'])
            } else {
              Materialize.toast(res.msg || "Something went wrong, try again later!", 5000, 'rounded toast-danger');
            }
          });
        } else {
        // console.log("Attempt update")
          this.updateSub = this.profileService.updateProfile(newProfile).subscribe(res =>{
            if(res.success){
              Materialize.toast("Profile Updated Successfully!", 3000, 'rounded toast-success');
              this.router.navigate(['/profile'])
            } else {
              Materialize.toast(res.msg || "Something went wrong, try again later!", 5000, 'rounded toast-danger');
            }
          });
        }
    } else {
      console.log('Validation failed')
    }
  }

  validateSetup(profile){
    Materialize.updateTextFields()
    // console.log(profile)
    if (profile.fname == undefined || profile.lname == undefined || profile.sex == undefined || profile.sexualOrientation == undefined || profile.birthdate == undefined || profile.seeking.length == 0 || profile.interests.length == 0 || profile.dealbreakers.length == 0 || profile.location == undefined){
      Materialize.toast("Please fill in all fields!", 5000, 'rounded toast-danger');        
      return false;  
    } else if(this.place == null && this.locationData == null || this.coord.length != 2 ){
      $('#location')
            .closest("form")
            .find("label[for='" + $('#location').attr("id") + "']")
            .attr('data-error','Check Location Field');
      Materialize.toast("Check Location Field", 5000, 'rounded toast-danger');              
      return false;
    } else if(!this.validate.validateDate(this.birthdate)){
       Materialize.toast("Date Invalid", 5000, 'rounded toast-danger');              
      return false;
    } else if(!this.validate.validateDOB(this.birthdate)){
      Materialize.toast("You must be 18 years or older.", 5000, 'rounded toast-danger');              
      return false;
    } else if (this.biography.length > 400) {
      Materialize.toast("Biography Must be 400 characters or less!", 5000, 'rounded toast-danger');                    
    }
    return true;
  }

  ngOnDestroy() {
    if(this.updateSub != null) {
      this.updateSub.unsubscribe()
    }
    if(this.profileSub != null) {
      this.profileSub.unsubscribe()
    }
  }
    

}
