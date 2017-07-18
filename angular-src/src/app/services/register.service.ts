import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';

import 'rxjs/add/operator/map'; //map the data 

const ROOT_URL = 'http://localhost:8000';

@Injectable()
export class RegisterService {
   isDev: boolean;
  constructor(private http:Http) { 
   this.isDev = true 
  }

  
  authUsername(username){
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const ep = this.prepEndpoint('/api/users/auth/username/')
    return this.http.get(ep + username, {headers: headers})
    .map(res => res.json())
  }

  authEmail(email){
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const ep = this.prepEndpoint('/api/users/auth/email/')
    return this.http.get(ep + email, {headers: headers})
    .map(res => res.json())
  }


   prepEndpoint(ep){
    if(this.isDev){
      return ROOT_URL+ep;
    } else {
      return ep;
    }
  }


}
