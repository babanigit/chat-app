import { Component, OnInit } from '@angular/core';
import { ChatApiService } from '../../services/chat-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  roomId: number = 0;
  messages: any[] = [];
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.roomId = +params['id'];
      this.loadMessages();
    });
  }

  loadMessages() {
    this.chatService.getMessages(this.roomId).subscribe(
      messages => this.messages = messages,
      error => console.error('Failed to load messages:', error)
    );
  }

  sendMessage() {
    this.chatService.sendMessage(this.roomId, this.newMessage).subscribe(
      () => {
        this.newMessage = '';
        this.loadMessages();
      },
      error => console.error('Failed to send message:', error)
    );
  }
}
