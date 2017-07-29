/**
 * 
 */
import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';

import 'rxjs/add/operator/map'; //map the data 

const ROOT_URL = 'http://localhost:8000';

@Injectable()
export class RegisterService {
  // 
  isDev: boolean;
  
  /** Constructor
   * @param http 
   */
  constructor(private http:Http) { 
   this.isDev = true 
  }

  /**
   * 
   * @param username 
   */
  authUsername(username){
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const ep = this.prepEndpoint('/api/users/auth/username/')
    return this.http.get(ep + username, {headers: headers})
    .map(res => res.json())
  }
  
  /**
   * 
   * @param email 
   */
  authEmail(email){
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const ep = this.prepEndpoint('/api/users/auth/email/')
    return this.http.get(ep + email, {headers: headers})
    .map(res => res.json())
  }

  /** Register User Requests to API EndPoint
   * 
   * @param user 
   */
  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/users/')
    return this.http.post(ep, user, {headers: headers})
      .map(res=> res.json());
  }

  /**
   * 
   * @param ep 
   */
   prepEndpoint(ep){
    if(this.isDev){
      return ROOT_URL+ep;
    } else {
      return ep;
    }
  }


}
