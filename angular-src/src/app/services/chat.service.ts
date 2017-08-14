import { Injectable } from '@angular/core';
import { io } from 'socket.io-client'

const ROOT_URL = 'http://localhost:8000';

@Injectable()
export class ChatService {
  private socket;
  private isDev: boolean;
  constructor() {
    this.isDev = true;
   }

   private connectToSocket(url) {
     this.socket = io.connect(url)
   }

   prepEndpoint(ep) {
     if (this.isDev) {
       ep = ROOT_URL + ep;
     }
     return ep;
   }
}
