/* Main Auth User State Functions - Functions for 
 * Manipulating the State of the User this service is for 
 * Account Maniplutlation - CRUD requests, and State validation
 * 
 * The basic User Account Data such as first and last name is stored as well as the JSON Web Token
 * Token is sent with HTTP AUTH Header for User Validation and helping data retrieval
 * 
 * Example: Account Creation, Validation, tokens - JWT: json web token
 * 
*/

import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';

import 'rxjs/add/operator/map'; //map the data 

const ROOT_URL = 'http://localhost:3000';

@Injectable()
export class AuthService {
  //Class Varaibles
  authToken: any; //JWT auth token
  public user: any; //basic user data
  profile: any; //profile data - *** To be Moved to Profile service ***

  
  //Inject the HTTP Module
  constructor(private http:Http) { }

//Register User Requests to API EndPoint
  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(ROOT_URL + '/users/', user, {headers: headers})
      .map(res=> res.json());
  }

//Login Request with Username and Password Data in user object passed in
  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(ROOT_URL + '/users/auth', user, {headers: headers})
      .map(res=> res.json());
  }

//Delete the User thats id is encoded and encrypted in the JWT auth token 
  deleteUser(){
     let headers = new Headers();
     this.loadToken();
     headers.append('Authorization', this.authToken);
     return this.http.delete(ROOT_URL + '/users/', {headers: headers})
      .map(res=> res.json());
  }

//Store the User Data into local storage
  storeUserData(token, user){
    localStorage.setItem('id_token', token); //JWT Auth Token
    localStorage.setItem('user', JSON.stringify(user)); //User Data Object - name
    //bind data to class for quick use after set if needed
    this.authToken = token;
    this.user = user;
  }

//Load both tokens: JWT Auth and User data object
  loadToken(){
    this.authToken = localStorage.getItem('id_token'); 
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  loadAuthToken(){
    this.authToken = localStorage.getItem('id_token'); 
  }

//Load specifically the User Data Object from storage
  loadUser(){
    this.profile = localStorage.getItem('user');
  }

//Check if the Users that logged in by checking if Auth Token is still valid
  loggedIn(){
    this.loadAuthToken();
    return tokenNotExpired('id_token');
  }

//Log out helper, clear the local storage including Auth and User Object
  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
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
    return this.http.get(ROOT_URL + '/profile',{search: params, headers: headers} ) //Request with Auth and ID-username
      .map(res=> res.json()); //map response to call back
  }

  //On Delete Clean Up the Class Data so it doesnt waste resources
  ngOnDestroy() {
   //console.log('Destroy');
     this.authToken = null;
     this.user = null;
     this.profile = null;
    }
}
