// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRoom, Message } from '../models/chat.models';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAvailableRooms(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(
      `${this.apiUrl}/chatrooms/available_rooms/`
    );
  }

  joinRoom(roomId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/chatrooms/${roomId}/join_room/`, {});
  }

  leaveRoom(roomId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/chatrooms/${roomId}/leave_room/`, {});
  }

  getMessages(roomId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages/?room=${roomId}`);
  }

  sendMessage(roomId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages/`, {
      room: roomId,
      content,
    });
  }
}
