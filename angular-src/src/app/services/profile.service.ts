import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';

import 'rxjs/add/operator/map'; //map the data 

const ROOT_URL = 'http://localhost:3000';

@Injectable()
export class ProfileService {
  // Class Varaibles
  authToken: any; //JWT auth token

  constructor(private http: Http) { }

 loadAuthToken(){
    this.authToken = localStorage.getItem('id_token'); 
  }

 
//Register Profile Requests to API EndPoint
  saveProfile(profile){
    this.loadAuthToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);

    return this.http.post(ROOT_URL + '/profile/', profile, {headers: headers})
      .map(res=> res.json());
  } 

//Calculate Age for Display
  calculateAge(birthdate){  
    let ageMS = Date.parse(Date()) - Date.parse(birthdate);
    let age = new Date();
    age.setTime(ageMS);
    let ageYear = age.getFullYear() - 1970;
    console.log(ageYear); 
    return ageYear

  }

  /*** To be Moved to Profile service ***/
//Get the Profile of the user that is already logged in
  getProfile(){
     let headers = new Headers();
     this.loadAuthToken(); //load the Auth Token
     headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(ROOT_URL + '/profile', {headers: headers})
      .map(res=> res.json());
  }

/*** To be Moved to Profile service ***/
//Get the profile of the user by the username entered by url: GET ID request 
  getProfileById(id){
      let headers = new Headers();
      let params: URLSearchParams = new URLSearchParams(); //add the user name to the query params for easier api flow
      params.set('profile', id);

     this.loadAuthToken();//load the Auth Token
     headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(ROOT_URL + '/profile/' + id,{search: params, headers: headers} ) //Request with Auth and ID-username
      .map(res=> res.json()); //map response to call back
  }



}
