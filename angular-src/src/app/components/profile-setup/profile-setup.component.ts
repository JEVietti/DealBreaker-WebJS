import { Component, OnInit } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

declare const $: any;
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
  biography: String;
  sexualOrientation: String;
  dealBreakers : Array <String>;
  goodQualities: Array <String>;
  badQualities: Array <String>; 
  location: String; // Format: City, State, Country || City, Country 
  
  constructor() { 
    this.biography = undefined;
    this.goodQualities = [];
    this.badQualities = [];
    this.dealBreakers = [];
  }


  getImages(){

     $("#profileImage").change(function(e) {
      for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
        var file = e.originalEvent.srcElement.files[i];
        
        var img = document.createElement("img");
   
       
        var reader = new FileReader();
        reader.onloadend = function() {
             img.src = reader.result;
        }
        reader.readAsDataURL(file);
        $("input").after(img);
 }
      });

      $("#bannerImage").change(function(e) {
        for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
            var file = e.originalEvent.srcElement.files[i];
            
            var img = document.createElement("img");
          
          
            var reader = new FileReader();
            reader.onloadend = function() {
                $('#previewBanner').src = reader.result;
            }
            reader.readAsDataURL(file);
            $("input").after(img);
        }
      });
  }

  onProfileSubmit(){
      this.biography = (document.getElementById("biography") as HTMLInputElement).value;
      if(this.biography.length == 0){
        console.log("empty string");
      }
      console.log(this.biography);
        
      //this.getImages();
      this.getQualities();
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


  ngOnInit() {
  
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


    

}
