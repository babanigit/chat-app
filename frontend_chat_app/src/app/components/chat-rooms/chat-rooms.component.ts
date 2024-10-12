import { Component, OnInit } from '@angular/core';
import { ChatApiService } from '../../services/chat-api.service';

@Component({
  selector: 'app-chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrl: './chat-rooms.component.css'
})
export class ChatRoomsComponent implements OnInit {
  chatRooms: any[] = [];
  newRoomName: string = '';

  constructor(private chatService: ChatApiService) {}

  ngOnInit() {
    this.loadChatRooms();
  }

  loadChatRooms() {
    this.chatService.getChatRooms().subscribe(
      rooms => this.chatRooms = rooms,
      error => console.error('Failed to load chat rooms:', error)
    );
  }

  createRoom() {
    this.chatService.createChatRoom(this.newRoomName).subscribe(
      () => {
        this.newRoomName = '';
        this.loadChatRooms();
      },
      error => console.error('Failed to create chat room:', error)
    );
  }
}
