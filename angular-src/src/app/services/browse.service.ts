import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map'; //map the data 

const ROOT_URL = 'http://localhost:8000';

@Injectable()
export class BrowseService {
  private authToken: any; //JWT auth token
  private isDev: boolean;
  private profiles = new Subject<any>();
  constructor(private http: Http) { this.isDev = true }
  

 loadAuthToken(){
    this.authToken = localStorage.getItem('id_token'); 
  }


  fetchProfiles(profiles) {
    console.log('Fetch ' + profiles )
    this.profiles.next(profiles)
  }

  listenProfiles():Observable<any> {
    console.log('Listen')
    console.log(this.profiles.asObservable())
    return this.profiles.asObservable()
  }

  //Get the Profile of the user that is already logged in
  getProfiles(queryMap: Map<String, any>){
    let headers = new Headers();
    let params = new URLSearchParams()
    queryMap.forEach((value, key, element) => {
      params.set(key.toString(), value.toString())
    });
    this.loadAuthToken(); //load the Auth Token
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/browse/profiles')    
    return this.http.get(ep, {headers: headers, params: params})
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
