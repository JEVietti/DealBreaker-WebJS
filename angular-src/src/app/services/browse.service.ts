import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';

import 'rxjs/add/operator/map'; //map the data 

const ROOT_URL = 'http://localhost:8000';

@Injectable()
export class BrowseService {
  private authToken: any; //JWT auth token
  private isDev: boolean;
  constructor(private http: Http) { this.isDev = true }
  

 loadAuthToken(){
    this.authToken = localStorage.getItem('id_token'); 
  }

  //Get the Profile of the user that is already logged in
  getProfiles(){
     let headers = new Headers();
     this.loadAuthToken(); //load the Auth Token
     headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/browse/')    
    return this.http.get(ep, {headers: headers})
      .map(res=> res.json());
  }


   prepEndpoint(ep){
    if(this.isDev){
      return ROOT_URL+ep;
    } else {
      return ep;      
    }
  }

}
