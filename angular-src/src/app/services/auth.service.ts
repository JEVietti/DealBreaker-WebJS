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

const ROOT_URL = 'http://localhost:8000';

@Injectable()
export class AuthService {
  //Class Varaibles
  authToken: any; //JWT auth token
  profile: any; //profile data - *** To be Moved to Profile service ***
  public name: String;
  isDev: boolean;
  //Inject the HTTP Module
  constructor(private http:Http) { this.isDev = true; }

//Register User Requests to API EndPoint
  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/users/')
    return this.http.post(ep, user, {headers: headers})
      .map(res=> res.json());
  }

//Login Request with Username and Password Data in user object passed in
  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/users/auth')    
    return this.http.post(ep, user, {headers: headers})
      .map(res=> res.json());
  }

//Delete the User thats id is encoded and encrypted in the JWT auth token 
  deleteUser(){
     let headers = new Headers();
     this.loadToken();
     headers.append('Authorization', this.authToken);
    const ep = this.prepEndpoint('/api/users/')     
     return this.http.delete(ep, {headers: headers})
      .map(res=> res.json());
  }

  updatePassword(update){
     let headers = new Headers();
     this.loadToken();
     headers.append('Authorization', this.authToken);
    const ep = this.prepEndpoint('/api/users/')     
     return this.http.put(ep, update ,{headers: headers})
      .map(res=> res.json());
  }
  

  forgotUsername(req){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');    
    const ep = this.prepEndpoint('/api/users/forgot/username')     
    return this.http.post(ep, req ,{headers: headers})
    .map(res=> res.json());
  }


  forgotPassword(req){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');    
    const ep = this.prepEndpoint('/api/users/forgot/password')     
    return this.http.post(ep, req ,{headers: headers})
    .map(res=> res.json());
  }


  resetPassword(update){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');    
    const token = update.token
    const ep = this.prepEndpoint('/api/users/reset/')     
    return this.http.post(ep + token, update ,{headers: headers})
    .map(res=> res.json());
  }


  updateEmail(update){
    let headers = new Headers();
     this.loadToken();
    headers.append('Content-Type', 'application/json');     
     headers.append('Authorization', this.authToken);
    const ep = this.prepEndpoint('/api/users/')     
     return this.http.put(ep, update ,{headers: headers})
      .map(res=> res.json());
  }

//Store the User Data into local storage
  storeUserData(token, user){
    localStorage.setItem('id_token', token); //JWT Auth Token
    localStorage.setItem('user', JSON.stringify(user)); //User Data Object - name
    //bind data to class for quick use after set if needed
    this.authToken = token;
    window.location.reload() //a bit of a hack to reload the navigation bar for dropdown to work
  }

//Load both tokens: JWT Auth and User data object
  loadToken(){
    this.authToken = localStorage.getItem('id_token'); 
  }

  loadAuthToken(){
    this.authToken = localStorage.getItem('id_token'); 
  }

  getName(){
   var user = JSON.parse(localStorage.getItem('user'))
   
   return user.fname 
  }

//Check if the Users that logged in by checking if Auth Token is still valid
  loggedIn(){
    this.loadAuthToken();
    return tokenNotExpired('id_token');
  }

//Log out helper, clear the local storage including Auth and User Object
  logout(){
    this.authToken = null;
    localStorage.clear();
  }

  
 prepEndpoint(ep){
    if(this.isDev){
      return ROOT_URL+ep;
    } else {
      return ep;
    }
  }

}
