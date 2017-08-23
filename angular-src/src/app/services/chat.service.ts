import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import {AuthService} from './auth.service'
const ROOT_URL = 'http://localhost:8000';

@Injectable()
export class ChatService {
  private socket;
  private isDev: boolean;
  private authToken: string;
  constructor(private http: Http, private auth: AuthService) {
    this.isDev = true;
    this.authToken = this.auth.loadAuthToken()
   }

  getChat(username) {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', this.authToken)
    const ep = this.prepEndpoint('/api/chat/conversation/' + username)
    return this.http.get(ep, {headers: headers})
    .map(res => res.json());
  }

  sendMessage(to, message, from) {
     
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', this.authToken)
    const ep = this.prepEndpoint('/api/chat/send')
    return this.http.post(ep, {
      receiver: to,
      sender: from,
      msg: message,
      createdAt: Date.now()
    } , { headers: headers })
    .map(res => res.json())
  }

   prepEndpoint(ep) {
     if (this.isDev) {
       ep = ROOT_URL + ep;
     }
     return ep;
   }
}
