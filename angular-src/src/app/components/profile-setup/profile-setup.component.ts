import { Component, OnInit } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ValidateService} from '../../services/validate.service'
import {ProfileService} from '../../services/profile.service'
import {NgForm} from '@angular/forms'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

declare const $: any;
declare var google: any;

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
  goodQualities: Array <String>;
  badQualities: Array <String>; 
  
 
  place: any;
  location: String; // Format: City, State, Country || City, Country 
  
  constructor(
    private validate: ValidateService,
    private profileService: ProfileService,
    private flashMessage: FlashMessagesService,
    private router: Router

  ) { 
    this.biography = undefined;
    this.goodQualities = [];
    this.badQualities = [];
    this.dealBreakers = [];
  }


  ngOnInit() {

    this.monthPairs = [{value:1,label: "January"},{value:2,label: "Feburary"},{value:3,label: "March"},{value:4,label: "April"},{value:5,label: "May"},{value:6,label: "June"},{value:7,label: "July"}, {value:8,label: "August"}, {value:9,label: "September"}, {value:10,label: "October"},{value:11,label: "November"}, {value:12,label: "December"} ];
    
    var currentYear = new Date().getFullYear();
    for(var i=currentYear; i >= currentYear-100; i--){
      this.yearList.push(i);
    }  

    this.dayList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  
    this.sexualities = ["Asexual", "Bisexual", "Homosexual", "Heterosexual"]
    this.loadGoogle();
  }

  loadGoogle(){
    const search = document.getElementById('locationSearch')
    const options = {
      types: [
        // return only geocoding results, rather than business results.
        '(cities)'
      ],
      componentRestrictions: { country: [], city:[] }
    }
    const autocomplete = new google.maps.places.Autocomplete(search, options)

    autocomplete.addListener('place_changed', ()=>{
      let place = autocomplete.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      let address = place.formatted_address;

      this.place = place
    })
  }

  onProfileSubmit(){
      this.biography = (document.getElementById("biography") as HTMLInputElement).value;
      if(this.biography.length == 0){
        console.log("empty string");
      }
      console.log(this.biography);
        
      //this.getImages();
  }

  public addQualities(data){
    console.log(data);
  }

  public getQualities(){
    var temp;
    temp = $('#goodQualities').material_chip('data');
    //console.log(temp);
   for(var i=0; i<temp.length; i++){
     this.goodQualities[i] = temp[i].tag;
   }

   temp = $('#badQualities').material_chip('data');
   for(var i=0; i<temp.length; i++){
     this.badQualities[i] = temp[i].tag;
   }

   temp = $('#dealbreakers').material_chip('data');
   for(var i=0; i<temp.length; i++){
     this.dealBreakers[i] = temp[i].tag;
   }

   console.log(this.dealBreakers);
   console.log(this.badQualities);
   console.log(this.goodQualities);   
   

  }

  ngAfterContentInit(){
     $(document).ready(function() {
       
        $('select').material_select();    
        $('#goodQualities').material_chip();
        $('#badQualities').material_chip();
        $('#dealbreakers').material_chip();

        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 100 // Creates a dropdown of 15 years to control year
        });

        $('.chips-placeholder').material_chip({
              placeholder: 'Enter an Attribute',
              secondaryPlaceholder: '+quality',
        });   
        
    });

      //this.getQualities();
  }

  ngAfterViewInit(){
     $('#dealbreakers').on('chip.add', (e, chip) =>{
              console.log("You Have added chip" + chip.tag);
              this.addChipData(this.dealBreakers, chip.tag)
       });
      $('#dealbreakers').on('chip.delete', (e, chip) =>{
              console.log("You Have deleted chip" + chip.tag);
              this.deleteChipData(this.dealBreakers, chip.tag)
      });

      $('#badQualities').on('chip.add', (e, chip) =>{
              console.log("You Have added chip" + chip.tag);
              this.addChipData(this.badQualities, chip.tag)
       });
      $('#badQualities').on('chip.delete', (e, chip) =>{
              console.log("You Have deleted chip" + chip.tag);
              this.deleteChipData(this.badQualities, chip.tag)
      });

      $('#goodQualities').on('chip.add', (e, chip) =>{
              console.log("You Have added chip" + chip.tag);
              this.addChipData(this.goodQualities, chip.tag)
       });
      $('#goodQualities').on('chip.delete', (e, chip) =>{
              console.log("You Have deleted chip" + chip.tag);
              this.deleteChipData(this.goodQualities, chip.tag)
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
    
    let newProfile = {
      fname : this.fname,
      lname : this.lname,
      sex : this.sex,
      sexualOrientation : this.sexualOrientation,
      location : this.place.formatted_address,
      birthdate : this.birthdate,      
      goodQualities: this.goodQualities,
      badQualities : this.badQualities,
      dealbreakers : this.dealBreakers,
      biography: this.biography
    }


    if(this.validateSetup(newProfile)){
      console.log(newProfile)
      
      this.profileService.saveProfile(newProfile).subscribe(res =>{
        if(res.success){
          this.flashMessage.show("Profile Created Successfully!", {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['/profile/images'])
        } else {
          this.flashMessage.show(res.msg || "Something went wrong, try again later!", {cssClass: 'alert-danger', timeout: 3000});
        }
      });
    }
  }

  validateSetup(profile){
    for(var i=0; i<profile.length; i++){
      if(profile[1] == undefined || profile[1] == undefined){

      }
    }
    return true;

  }


    

}
