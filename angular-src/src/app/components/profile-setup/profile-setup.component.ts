import { Component, OnInit } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ValidateService} from '../../services/validate.service'
import {ProfileService} from '../../services/profile.service'
import {NgForm} from '@angular/forms'
import {FlashMessagesService} from 'angular2-flash-messages';
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
 
  place: any;
  location: String; // Format: City, State, Country || City, Country
  locationData: Object 
  profile: Object;

  constructor(
    private validate: ValidateService,
    private profileService: ProfileService,
    private flashMessage: FlashMessagesService,
    private router: Router

  ) { 
    this.biography = undefined;
    this.seeking = [];
    this.interests = [];
    this.dealBreakers = [];
  }


  ngOnInit() {
    this.initMaterialize()    
    this.loadProfile()
    this.monthPairs = [{value:1,label: "January"},{value:2,label: "Feburary"},{value:3,label: "March"},{value:4,label: "April"},{value:5,label: "May"},{value:6,label: "June"},{value:7,label: "July"}, {value:8,label: "August"}, {value:9,label: "September"}, {value:10,label: "October"},{value:11,label: "November"}, {value:12,label: "December"} ];

    var currentYear = new Date().getFullYear();
    for(var i=currentYear; i >= currentYear-100; i--){
      this.yearList.push(i);
    }  

    this.dayList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  
    this.sexualities = ["Asexual", "Bisexual", "Homosexual", "Heterosexual"]
    this.loadGoogle();
    
     
  }

  getLocation(place: any){
    var components = place.address_components
    for(var i=0; i< components.length; i++){
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
    this.profileService.getProfile().subscribe(res => {
      console.log(res.success)
      if(res.success){
        this.profile = res.profile;
        console.log(res.profile)
        this.fname = res.profile.fname
        this.lname = res.profile.lname
        this.sex = res.profile.sex
        this.sexualOrientation = res.profile.sexualOrientation
        
        var birth = res.profile.birthdate
        var birthdate = birth.split("-")
        this.dobMonth = parseInt(birthdate[1])
        this.dobDay = parseInt(birthdate[2])
        this.dobYear = parseInt(birthdate[0]) 
        
        var loc = res.profile.location[0]
        this.location = loc.city + ", " + loc.state + ", " + loc.country 
        this.locationData = loc
        this.state = loc.state
        this.city = loc.city
        this.country = loc.country

        this.biography = res.profile.biography
        this.seeking = res.profile.seeking
        this.interests = res.profile.interests
        this.dealBreakers = res.profile.dealbreakers
        

        var chipData: Array<Object> = [];
        if (this.dealBreakers != null) {
          console.log("dealBreakers")
           chipData = []
          this.dealBreakers.forEach(element => {
            chipData.push({tag:element})            
          });
           $('#dealbreakers').material_chip({
             data: chipData,
          });        
           
        } 
        if (this.seeking != null) {
          console.log("seeking")
          
           chipData = []
          this.seeking.forEach(element => {
            chipData.push({tag:element})            
          });
          $('#seeking').material_chip({
            data: chipData,
          });        
        } 
        if (this.interests != null) {
          console.log("interests")          
          chipData = []
          this.interests.forEach(element => {
            chipData.push({tag:element})            
          });
          $('#interests').material_chip({
            data: chipData,
          });        
                
        }


      } else {
        this.profile = null
      }
    })
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
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      let address = place.formatted_address;

      this.place = place
      console.log(place)
    })
  }

  public getQualities(){
    var temp;
    temp = $('#seeking').material_chip('data');
    //console.log(temp);
   for(var i=0; i<temp.length; i++){
     this.seeking[i] = temp[i].tag;
   }

   temp = $('#interests').material_chip('data');
   for(var i=0; i<temp.length; i++){
     this.interests[i] = temp[i].tag;
   }

   temp = $('#dealbreakers').material_chip('data');
   for(var i=0; i<temp.length; i++){
     this.dealBreakers[i] = temp[i].tag;
   }

   console.log(this.dealBreakers);
   console.log(this.interests);
   console.log(this.seeking);   
   

  }

  ngAfterContentInit(){
      
  }

  initMaterialize(){
    $(document).ready(()=> {
       
        $('select').material_select();    
        $('#seeking').material_chip();
        $('#interests').material_chip();
        $('#dealbreakers').material_chip();
            $('.chips-placeholder').material_chip({
              placeholder: 'Enter an Attribute',
              secondaryPlaceholder: '+quality',
        });   
    });

        

  

  }

  ngAfterViewInit(){
    $(document).ready(()=> {

     $('#dealbreakers').on('chip.add', (e, chip) =>{
              console.log("You Have added chip" + chip.tag);
              this.addChipData(this.dealBreakers, chip.tag)
       });
      $('#dealbreakers').on('chip.delete', (e, chip) =>{
              console.log("You Have deleted chip" + chip.tag);
              this.deleteChipData(this.dealBreakers, chip.tag)
      });

      $('#interests').on('chip.add', (e, chip) =>{
              console.log("You Have added chip" + chip.tag);
              this.addChipData(this.interests, chip.tag)
       });
      $('#interests').on('chip.delete', (e, chip) =>{
              console.log("You Have deleted chip" + chip.tag);
              this.deleteChipData(this.interests, chip.tag)
      });

      $('#seeking').on('chip.add', (e, chip) =>{
              console.log("You Have added chip" + chip.tag);
              this.addChipData(this.seeking, chip.tag)
       });
      $('#seeking').on('chip.delete', (e, chip) =>{
              console.log("You Have deleted chip" + chip.tag);
              this.deleteChipData(this.seeking, chip.tag)
      });
    });
  }

  addChipData(array: Array<String>, chipValue){
    array.push(chipValue)
    console.log(array)
  }

  deleteChipData(array: Array<String>, chipValue: String){
    //console.log('Delete' + array)
    const index = array.indexOf(chipValue)
    array.splice(index, 1)
    console.log(array)
    
  }

  

  onSetupSubmit(form){
    console.log(form)
    this.birthdate = this.dobYear + "-" + this.dobMonth + "-" + this.dobDay;

    this.biography = (document.getElementById("biography") as HTMLInputElement).value;
    this.getQualities();
    
    if(this.place != undefined){
      this.getLocation(this.place)
    }

    if(this.state == undefined || this.city == undefined || this.country == undefined){
      Materialize.toast("Try a different location or Reselect Location Field", 3000, 'rounded toast-danger');                      
      return;
    }

    this.locationData = {city: this.city, state: this.state, country: this.country}
    const formattedLoc = this.city + ", " + this.state + ", " + this.country
    console.log(formattedLoc)

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
      console.log(newProfile)
    if(this.profile == null){ 
      this.profileService.saveProfile(newProfile).subscribe(res =>{
        if(res.success){
          Materialize.toast("Profile Created Successfully!", 3000, 'rounded toast-success');
          this.router.navigate(['/profile'])
        } else {
          Materialize.toast(res.msg || "Something went wrong, try again later!", 5000, 'rounded toast-danger');
        }
      });
    }
   else {
    console.log("Attempt update")
      this.profileService.updateProfile(newProfile).subscribe(res =>{
        if(res.success){
          Materialize.toast("Profile Updated Successfully!", 3000, 'rounded toast-success');
          this.router.navigate(['/profile'])
        } else {
          Materialize.toast(res.msg || "Something went wrong, try again later!", 5000, 'rounded toast-danger');
        }
      });
    }
  }
  }

  validateSetup(profile){
    console.log(profile)
      if( profile.fname == undefined || profile.lname == undefined || profile.sex == undefined || profile.sexualOrientation == undefined || profile.birthdate == undefined || profile.seeking.length == 0 || profile.interests.length == 0 || profile.dealbreakers.length == 0 || profile.location == undefined){
        Materialize.toast("Please fill in all fields!", 5000, 'rounded toast-danger');        
        return false;  
      }
    
    else if(this.place == null && this.locationData == null){
      Materialize.toast("Check Location Field", 5000, 'rounded toast-danger');              
      return false;
    } else if(this.validate.validateDOB(this.birthdate)){
      Materialize.toast("You must be 18 years or older.", 5000, 'rounded toast-danger');              
      return false;
    } else if (this.biography.length > 400) {
      Materialize.toast("Biography Must be 400 characters or less!", 5000, 'rounded toast-danger');                    
    }
    return true;
  }


    

}
