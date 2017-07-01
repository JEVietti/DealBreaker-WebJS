import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';
import {AuthService} from '../services/auth.service'
import 'rxjs/add/operator/map'; //map the data 

const ROOT_URL = 'http://localhost:3000';

@Injectable()
export class ImagesService {

  constructor(private http:Http, private auth: AuthService) { }


  getSignedURL(file){
    let headers = new Headers();
     headers.append('Authorization', this.auth.authToken);    
    this.auth.loadAuthToken(); //load the Auth Token
    headers.append('Content-Type', 'application/json');
    return this.http.get(ROOT_URL+`/sign-s3?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`, {headers: headers})
    .map(res => res.json());
  }

  uploadFile(file, signedRequest, url){
    console.log(signedRequest)
     let headers = new Headers();
    
    headers.append('Content-Type', file.type);
    return this.http.put(signedRequest, file , {headers: headers})
   
  }

  saveImage(url){
    let headers = new Headers();
    this.auth.loadAuthToken(); //load the Auth Token
     headers.append('Authorization', this.auth.authToken);
    headers.append('Content-Type', 'application/json');
   return  this.http.post(ROOT_URL + '/images', {gallery:{url: url} }, {headers: headers})
    .map(res => res.json())
  }

}
