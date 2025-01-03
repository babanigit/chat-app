// src/app/components/chat-room/chat-room.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatRoom, Message } from '../../models/chat.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-room',

  template: `
    <div class="chat-container">
      <!-- Room List -->
      <div class="room-list">
        <h3>Available Rooms</h3>
        <div
          *ngFor="let room of rooms"
          (click)="selectRoom(room)"
          [class.active]="selectedRoom?.id === room.id"
        >
          {{ room.name }}
        </div>
      </div>

      <!-- Chat Area -->
      <div class="chat-area" *ngIf="selectedRoom">
        <div class="messages">
          <div
            *ngFor="let message of messages"
            [class.own-message]="message.user_username === currentUser"
          >
            <strong>{{ message.user_username }}:</strong> {{ message.content }}
          </div>
        </div>

        <!-- Message Input -->
        <div class="message-input">
          <input
            [(ngModel)]="newMessage"
            (keyup.enter)="sendMessage()"
            placeholder="Type a message..."
          />
          <button (click)="sendMessage()">Send</button>
        </div>
      </div>
    </div>
  `,

  styles: [
    `
      .chat-container {
        display: flex;
        height: 100%;
      }
      .room-list {
        width: 200px;
        border-right: 1px solid #ccc;
        padding: 10px;
      }
      .chat-area {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .messages {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
      }
      .message-input {
        padding: 10px;
        display: flex;
        gap: 10px;
      }
      .message-input input {
        flex: 1;
      }
      .own-message {
        text-align: right;
        background-color: #e3f2fd;
      }
    `,
  ],
})
export class ChatRoomComponent implements OnInit {
  rooms: ChatRoom[] = [];
  selectedRoom?: ChatRoom;
  messages: Message[] = [];
  newMessage = '';
  currentUser = '';

  constructor(private chatService: ChatService) {
    if (typeof window !== 'undefined') {
      this.currentUser = localStorage.getItem('username') || '';
    }
  }

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.chatService.getAvailableRooms().subscribe((rooms) => {
      this.rooms = rooms;
    });
  }

  selectRoom(room: ChatRoom) {
    this.selectedRoom = room;
    this.chatService.joinRoom(room.id).subscribe(() => {
      this.loadMessages();
    });
  }

  loadMessages() {
    if (this.selectedRoom) {
      this.chatService
        .getMessages(this.selectedRoom.id)
        .subscribe((messages) => {
          this.messages = messages;
        });
    }
  }

  sendMessage() {
    if (this.selectedRoom && this.newMessage.trim()) {
      this.chatService
        .sendMessage(this.selectedRoom.id, this.newMessage)
        .subscribe((message) => {
          this.messages.push(message);
          this.newMessage = '';
        });
    }
  }
}
