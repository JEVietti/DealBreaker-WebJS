import { Injectable } from '@angular/core';
import {Http, Headers, URLSearchParams, QueryEncoder} from '@angular/http';
import {tokenNotExpired} from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/map'; // map the data

const ROOT_URL = 'http://localhost:8000';

@Injectable()
export class RelationshipService {
  private isDev: Boolean;
  private authToken: any;

  private profiles = new Subject<any>();
  private profilesReject = new Subject<any>();
  private profilesRemoveReject = new Subject<any>();
  private profilesRemoveRequest = new Subject<any>();
  private profilesAdd = new Subject<any>();
  private profilesConfirm = new Subject<any>();
  private profilesRejectConfirm = new Subject<any>();
  constructor(private http: Http) { this.isDev = true }


// Register Profile Requests to API EndPoint
  sendPendingRequest(profile) {
    this.loadAuthToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    const ep = this.prepEndpoint('/api/pending/')
    return this.http.post(ep, profile, {headers: headers})
      .map(res => res.json());
  }

  // Register Profile Requests to API EndPoint
  removePendingRequest(profile) {
    this.loadAuthToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    const ep = this.prepEndpoint('/api/pending/')
    return this.http.put(ep, profile, {headers: headers})
      .map(res => res.json());
  }

  // Send the confirmation request
  confirmRequest(profile) {
    this.loadAuthToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    const ep = this.prepEndpoint('/api/pending/accept')
    return this.http.put(ep, profile, {headers: headers})
      .map(res => res.json());
  }

  // Send the confirmation request
  rejectConfirmRequest(profile) {
    this.loadAuthToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    const ep = this.prepEndpoint('/api/confirm/reject')
    return this.http.put(ep, profile, { headers: headers })
      .map(res => res.json());
  }

  // Send a rejection request in which no relationship has been established
  sendReject(profile) {
    this.loadAuthToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    const ep = this.prepEndpoint('/api/pending/reject')
    return this.http.put(ep, profile, {headers: headers})
      .map(res => res.json());
  }


  // Send a rejection request of a particular profile that has been requested
  rejectRequest(profile){
    this.loadAuthToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    const ep = this.prepEndpoint('/api/reject/')
    return this.http.post(ep, profile, {headers: headers})
      .map(res => res.json());
  }

  // Remove a Rejection request of a particular profile that has been previously rejected
  // Must be the rejector not the rejectee
  removeRejectRequest(profile){
    this.loadAuthToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    const ep = this.prepEndpoint('/api/reject/')
    return this.http.put(ep, profile, {headers: headers})
      .map(res => res.json());
  }

  getTokenData(tokenId){
    return JSON.parse(localStorage.getItem(tokenId))
  }

// Load both tokens: JWT Auth and User data object
  loadAuthToken(){
    this.authToken = localStorage.getItem('id_token');
  }


  fetchProfiles(profiles) {
    // console.log('Fetch ' + profiles )
    this.profiles.next(profiles)
  }

  listenProfiles():Observable<any> {
    // console.log('Listen')
    console.log(this.profiles.asObservable())
    return this.profiles.asObservable()
  }

  profileToReject(p, i) {
  const profile = {
      profile: p,
      index: i
    }
    this.profilesReject.next(profile)
  }

  listenProfileToReject(): Observable<any>{
    return this.profilesReject.asObservable()
  }

  profileToRejectConfirm(p, i) {
    const profile = {
      profile: p,
      index: i
    }
    this.profilesRejectConfirm.next(profile)
  }

  listenProfileToRejectConfirm(): Observable<any> {
    return this.profilesRejectConfirm.asObservable()
  }

  profileToAdd(p, i) {
    const profile = {
        profile: p,
        index: i
    }
    this.profilesAdd.next(profile)
  }

  listenProfileToAdd(): Observable<any>{
    return this.profilesAdd.asObservable()

  }

  profileToRemoveRequest(p, i) {
  const profile = {
      profile: p,
      index: i
    }
    this.profilesRemoveRequest.next(profile)
  }

  profileToRemoveReject(p, i) {
  const profile = {
      profile: p,
      index: i
    }
    this.profilesRemoveReject.next(profile)
  }

  listenProfileToRemoveRequest(): Observable<any>{
    return this.profilesRemoveRequest.asObservable()
  }

  listenProfileToRemoveReject(): Observable<any>{
    return this.profilesRemoveReject.asObservable()
  }


  profileToConfirm(p, i) {
    const profile = {
      profile: p,
      index: i
    }
    this.profilesConfirm.next(profile)
  }

  listenProfileToConfirm(): Observable<any>{
    return this.profilesConfirm.asObservable()

  }
  // Get the Profile of the user that is already logged in
  getProfiles(queryMap: Map<String, any>){
    const headers = new Headers();
    const params = new URLSearchParams()
    queryMap.forEach((value, key, element) => {
      if (Array.isArray(value)) {
        console.log('Array')
        value.forEach(arrElement => {
          params.append(key.toString(), arrElement.toString())
        });
      } else {
        params.append(key.toString(), value.toString())
      }
    });
    console.log(params)
    this.loadAuthToken(); // load the Auth Token
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/browse/pref')
    return this.http.get(ep, {headers: headers, params: params})
    .map(res => res.json());
  }

  getConfirmed() {
    const headers = new Headers();
    const params = new URLSearchParams()
    this.loadAuthToken(); // load the Auth Token
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/confirm')
    return this.http.get(ep, {headers: headers})
    .map(res => res.json())
  }

  getRejectorList() {
    const headers = new Headers();
    const params = new URLSearchParams()
    this.loadAuthToken(); // load the Auth Token
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/reject/rejecting')
    return this.http.get(ep, { headers: headers })
      .map(res => res.json())
  }

  getRejecteeList() {
    const headers = new Headers();
    const params = new URLSearchParams()
    this.loadAuthToken(); // load the Auth Token
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/reject/rejected')
    return this.http.get(ep, { headers: headers })
      .map(res => res.json())
  }

  getRequestedList() {
    const headers = new Headers();
    const params = new URLSearchParams()
    this.loadAuthToken(); // load the Auth Token
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/pending/requested')
    return this.http.get(ep, { headers: headers })
      .map(res => res.json())
  }

  getRequestsList() {
    const headers = new Headers();
    const params = new URLSearchParams()
    this.loadAuthToken(); // load the Auth Token
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('/api/pending/requests')
    return this.http.get(ep, { headers: headers })
      .map(res => res.json())
  }

   prepEndpoint(ep){
    if (this.isDev){
      ep =  ROOT_URL + ep;
    }
      return ep;
  }
}
