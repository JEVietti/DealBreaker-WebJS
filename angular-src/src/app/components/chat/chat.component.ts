import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChatService } from '../../services/chat.service'
import { ProfileService } from '../../services/profile.service'
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  chat: Array<Object>;
  joined: boolean;
  message: Object;
  chatterData: Object;
  socket: any;
  chatID: String;
  token: String;
  username: String;
  constructor(private chatService: ChatService, private router: Router, private profile: ProfileService,
    private route: ActivatedRoute,) {
   }

  ngOnInit() {
    this.socket = io('http://localhost:8000');    
    const user = JSON.parse(localStorage.getItem('user'))
    this.username = user.username
    this.getChatRoom()
    this.loadChat()
  }

  initMessenger() {
    this.receiveMessages()
    this.loadProfile()
    this.chat = []
    // this.profile = null;
  }

  loadChat() {
    this.route.params.subscribe((params: Params) => {
      this.chatID = params['id'];
      console.log(this.chatID);
      if (this.chatID) {
        this.initMessenger()
        this.chatService.getChat(this.chatID).subscribe(conv => {
          if(conv.success) {
            console.log(conv)
            this.chat = conv.messages
            this.scrollSmoothToBottom("chat")
          }
        })
      }
    });
  }

  loadProfile() {
    if(this.chatID) {
      this.profile.getProfileById(this.chatID).subscribe(result => {
        this.chatterData = result.profile
      })
    }
  }

  scrollSmoothToBottom(id) {
    const div = document.getElementById(id);
    $('#' + id).animate({
      scrollTop: div.scrollHeight
    }, 500);
}

  getChatRoom() {
    this.token = localStorage.getItem('id_token')
    this.token = this.token.slice(4, this.token.length)
    this.socket.emit('join', { 'token': this.token })
  }

  receiveMessages() {
    this.socket.on('new-message', (data) => {
      this.chat.push({msg: data.message, format: 'received', time: new Date().toString()})
      this.scrollSmoothToBottom('chat')
    })
  }

  sendMessage(messageForm: NgForm) {
    let message = (messageForm.controls['message'].value)
    if(message) {
      message = message.toString()
      message = message.trim()
      if( message.length > 0) {
        this.chat.push({ msg: message, format: 'sent', time: new Date().toString() })
        this.chatService.sendMessage(this.chatID, message, this.username).subscribe(res => {
          this.socket.emit('save-message', { message: message, createdAt: new Date().toString(), to: this.chatID })
          console.log(res)
        })
        console.log(this.chat)
        this.scrollSmoothToBottom('chat')
      }
    }
    messageForm.resetForm()
  }

  ngOnDestroy() {
    this.socket.emit('leave', { username: this.username })
    console.log(this.username + ' left')
  }
}
