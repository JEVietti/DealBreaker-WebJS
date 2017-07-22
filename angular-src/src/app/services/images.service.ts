import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';
import {AuthService} from '../services/auth.service'
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map'; //map the data 

const ROOT_URL = 'http://localhost:8000';

@Injectable()
export class ImagesService {
  isDev: boolean;
  newImage = new Subject<any>();

  constructor(private http:Http, private auth: AuthService) { this.isDev = true }

  getSignedURL(file){
    let headers = new Headers();
    this.auth.loadAuthToken(); //load the Auth Token
    headers.append('Authorization', this.auth.authToken);    
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint(`/api/sign-s3?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`)
    return this.http.get(ep, {headers: headers})
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
    const ep = this.prepEndpoint('/api/images')
   return  this.http.post(ep, {gallery:{url: url} }, {headers: headers})
    .map(res => res.json())
  }

  setNewImage(image) {
    this.newImage.next(image)
    console.log('new Image')
  }

  listenImages() : Observable<any> {
    console.log("image observed")
    console.log(this.newImage.asObservable())
    return this.newImage.asObservable()
  }

  getImages(){
    let headers = new Headers();
    this.auth.loadAuthToken()
    headers.append('Authorization', this.auth.authToken)
    headers.append('Content-Type', 'application/json')
    const ep = this.prepEndpoint('/api/images')
    return this.http.get(ep, {headers: headers})
    .map(res => res.json())
  }

  deleteImages(images){
    let headers = new Headers();
    this.auth.loadAuthToken
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', this.auth.authToken)
    const ep = this.prepEndpoint('/api/images')
    return this.http.delete(ep, {headers: headers, body: images})
    .map(res => res.json())
  }

  private prepEndpoint(ep){
    if(this.isDev){
      return ROOT_URL + ep;
    } else {
      return ep;
    }
  }

}
